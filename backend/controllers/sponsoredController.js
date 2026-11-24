import pool from '../config/db.js';

export const getTop100Sponsored = async (req, res) => {
  try {
    const sql = `
      SELECT 
        sc.id AS sponsored_id,
        sc.display_order,
        sc.is_featured,
        sc.featured_order,
        sc.badge_text,
        sc.notes,
        c.id AS channel_id,
        c.name,
        c.telegram_url,
        c.description,
        c.keywords,
        c.language,
        c.logo_url,
        cat.name AS category_name,
        cat.slug AS category_slug
      FROM sponsored_channels sc
      JOIN channels c ON sc.channel_id = c.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'approved'
      ORDER BY sc.display_order ASC
      LIMIT 100
    `;
    const [rows] = await pool.query(sql);
    return res.json({
      success: true,
      count: rows.length,
      sponsored: rows
    });
  } catch (error) {
    console.error('Get top 100 sponsored error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sponsored directory.'
    });
  }
};

export const getTop10Featured = async (req, res) => {
  try {
    const sql = `
      SELECT 
        sc.id AS sponsored_id,
        sc.display_order,
        sc.is_featured,
        sc.featured_order,
        sc.badge_text,
        c.id AS channel_id,
        c.name,
        c.telegram_url,
        c.description,
        c.keywords,
        c.language,
        c.logo_url,
        cat.name AS category_name,
        cat.slug AS category_slug
      FROM sponsored_channels sc
      JOIN channels c ON sc.channel_id = c.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'approved' AND sc.is_featured = 1
      ORDER BY sc.featured_order ASC, sc.display_order ASC
      LIMIT 10
    `;
    const [rows] = await pool.query(sql);
    return res.json({
      success: true,
      count: rows.length,
      featured: rows
    });
  } catch (error) {
    console.error('Get top 10 featured error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured channels.'
    });
  }
};

