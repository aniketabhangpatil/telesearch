import pool from '../config/db.js';

/**
 * Traditional non-AI MySQL search matching channel name, Telegram URL, and description.
 * 
 * Weighted scoring specifications:
 * - Exact name match: 100
 * - Name contains full query: 60
 * - Individual name keyword match: 15 per keyword
 * - Link contains full query: 30
 * - Description contains full query: 20
 * - Individual description keyword match: 5 per keyword
 * 
 * Only approved channels appear. All queries use prepared statements with placeholders.
 */
export const searchChannelsService = async ({
  query = '',
  categoryId = null,
  language = null,
  page = 1,
  limit = 12,
  sort = 'relevance'
}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const offset = (pageNum - 1) * pageLimit;
  const trimmedQuery = (query || '').trim();

  const whereConditions = ["c.status = 'approved'"];
  const whereParams = [];

  if (categoryId) {
    whereConditions.push('c.category_id = ?');
    whereParams.push(parseInt(categoryId, 10));
  }

  if (language && language !== 'all') {
    whereConditions.push('c.language = ?');
    whereParams.push(language);
  }

  // If query is empty, perform standard filtered listing
  if (!trimmedQuery) {
    const whereSql = whereConditions.join(' AND ');
    
    // Count query
    const countSql = `
      SELECT COUNT(*) AS total 
      FROM channels c 
      WHERE ${whereSql}
    `;
    const [countRows] = await pool.query(countSql, whereParams);
    const total = countRows[0]?.total || 0;

    // Order clause
    let orderBySql = 'ORDER BY c.created_at DESC, c.id DESC';
    if (sort === 'name_asc') orderBySql = 'ORDER BY c.name ASC';
    if (sort === 'name_desc') orderBySql = 'ORDER BY c.name DESC';

    // Data query
    const dataSql = `
      SELECT 
        c.id, c.name, c.telegram_url, c.description, c.category_id, 
        c.keywords, c.language, c.logo_url, c.created_at,
        cat.name AS category_name, cat.slug AS category_slug,
        0 AS relevance_score
      FROM channels c
      JOIN categories cat ON c.category_id = cat.id
      WHERE ${whereSql}
      ${orderBySql}
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...whereParams, pageLimit, offset];
    const [rows] = await pool.query(dataSql, dataParams);

    return {
      channels: rows,
      total,
      page: pageNum,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit) || 1,
      query: trimmedQuery
    };
  }

  // Tokenize query words
  const words = trimmedQuery
    .split(/\s+/)
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length > 1);
  
  // Deduplicate keywords
  const uniqueKeywords = Array.from(new Set(words));

  // Build scoring expression and query match clauses
  const scoreParts = [];
  const scoreParams = [];

  // 1. Exact name match: 100
  scoreParts.push('(CASE WHEN LOWER(c.name) = LOWER(?) THEN 100 ELSE 0 END)');
  scoreParams.push(trimmedQuery);

  // 2. Name contains query: 60
  scoreParts.push('(CASE WHEN LOWER(c.name) LIKE LOWER(?) THEN 60 ELSE 0 END)');
  scoreParams.push(`%${trimmedQuery}%`);

  // 3. Link contains query: 30
  scoreParts.push('(CASE WHEN LOWER(c.telegram_url) LIKE LOWER(?) THEN 30 ELSE 0 END)');
  scoreParams.push(`%${trimmedQuery}%`);

  // 4. Description contains query: 20
  scoreParts.push('(CASE WHEN LOWER(c.description) LIKE LOWER(?) THEN 20 ELSE 0 END)');
  scoreParams.push(`%${trimmedQuery}%`);

  // 5. Individual name keywords: 15 each
  uniqueKeywords.forEach(keyword => {
    scoreParts.push('(CASE WHEN LOWER(c.name) LIKE LOWER(?) THEN 15 ELSE 0 END)');
    scoreParams.push(`%${keyword}%`);
  });

  // 6. Individual description keywords: 5 each
  uniqueKeywords.forEach(keyword => {
    scoreParts.push('(CASE WHEN LOWER(c.description) LIKE LOWER(?) THEN 5 ELSE 0 END)');
    scoreParams.push(`%${keyword}%`);
  });

  const scoreSql = `(${scoreParts.join(' + ')})`;
  const baseWhereSql = whereConditions.join(' AND ');

  // Query to count matching rows where relevance_score > 0
  const countSql = `
    SELECT COUNT(*) AS total FROM (
      SELECT c.id, ${scoreSql} AS relevance_score
      FROM channels c
      WHERE ${baseWhereSql}
      HAVING relevance_score > 0
    ) AS scored_results
  `;
  const countParams = [...scoreParams, ...whereParams];
  const [countRows] = await pool.query(countSql, countParams);
  const total = countRows[0]?.total || 0;

  // Determine sort order
  let orderSql = 'ORDER BY relevance_score DESC, c.id DESC';
  if (sort === 'name_asc') orderSql = 'ORDER BY c.name ASC';
  if (sort === 'name_desc') orderSql = 'ORDER BY c.name DESC';
  if (sort === 'newest') orderSql = 'ORDER BY c.created_at DESC';

  // Final Data query
  const dataSql = `
    SELECT 
      c.id, c.name, c.telegram_url, c.description, c.category_id, 
      c.keywords, c.language, c.logo_url, c.created_at,
      cat.name AS category_name, cat.slug AS category_slug,
      ${scoreSql} AS relevance_score
    FROM channels c
    JOIN categories cat ON c.category_id = cat.id
    WHERE ${baseWhereSql}
    HAVING relevance_score > 0
    ${orderSql}
    LIMIT ? OFFSET ?
  `;
  const dataParams = [...scoreParams, ...whereParams, pageLimit, offset];
  const [rows] = await pool.query(dataSql, dataParams);

  return {
    channels: rows,
    total,
    page: pageNum,
    limit: pageLimit,
    totalPages: Math.ceil(total / pageLimit) || 1,
    query: trimmedQuery
  };
};

