import pool from '../config/db.js';
import { searchChannelsService } from '../services/searchService.js';

// Normalize Telegram URL helper
const normalizeTelegramUrl = (input) => {
  if (!input) return null;
  let clean = input.trim();
  clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
  if (clean.startsWith('t.me/')) {
    clean = clean.replace(/^t\.me\//, '');
  } else if (clean.startsWith('@')) {
    clean = clean.substring(1);
  }
  // Remove trailing slashes and queries
  clean = clean.split('/')[0].split('?')[0];
  if (!clean || !/^[a-zA-Z0-9_]{4,32}$/.test(clean)) {
    return null;
  }
  return `https://t.me/${clean}`;
};

export const searchChannels = async (req, res) => {
  try {
    const { q, category, language, page, limit, sort } = req.query;
    const results = await searchChannelsService({
      query: q,
      categoryId: category,
      language,
      page,
      limit,
      sort
    });
    return res.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('Search channels error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search channels.'
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const sql = `
      SELECT 
        cat.id, cat.name, cat.slug, cat.description, cat.icon, cat.display_order,
        COUNT(c.id) AS approved_count
      FROM categories cat
      LEFT JOIN channels c ON cat.id = c.category_id AND c.status = 'approved'
      GROUP BY cat.id
      ORDER BY cat.display_order ASC, cat.name ASC
    `;
    const [rows] = await pool.query(sql);
    return res.json({
      success: true,
      categories: rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch categories.'
    });
  }
};

export const submitChannel = async (req, res) => {
  try {
    const { name, telegram_url, description, category_id, keywords, language, logo_url } = req.body;

    if (!name || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Channel name must be between 2 and 100 characters.'
      });
    }

    const normalizedUrl = normalizeTelegramUrl(telegram_url);
    if (!normalizedUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Telegram username or URL (e.g. @channel or https://t.me/channel).'
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a descriptive explanation of your channel (min 10 characters).'
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid category.'
      });
    }

    // Verify category exists
    const [catRows] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (catRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist.'
      });
    }

    // Check duplicate telegram_url
    const [dupRows] = await pool.query(
      'SELECT id, status FROM channels WHERE telegram_url = ? LIMIT 1',
      [normalizedUrl]
    );

    if (dupRows.length > 0) {
      const existing = dupRows[0];
      if (existing.status === 'approved') {
        return res.status(409).json({
          success: false,
          message: 'This Telegram channel is already listed in our directory.'
        });
      } else if (existing.status === 'pending') {
        return res.status(409).json({
          success: false,
          message: 'This Telegram channel has already been submitted and is currently pending admin review.'
        });
      }
    }

    // Determine final logo_url: either from multer file upload or provided URL
    let finalLogoUrl = null;
    if (req.file) {
      finalLogoUrl = `/uploads/${req.file.filename}`;
    } else if (logo_url && logo_url.trim().startsWith('http')) {
      finalLogoUrl = logo_url.trim();
    }

    const insertSql = `
      INSERT INTO channels (
        name, telegram_url, description, category_id, keywords, language, logo_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    const insertParams = [
      name.trim(),
      normalizedUrl,
      description.trim(),
      parseInt(category_id, 10),
      keywords ? keywords.trim().substring(0, 500) : null,
      language ? language.trim().substring(0, 50) : 'English',
      finalLogoUrl
    ];

    const [result] = await pool.query(insertSql, insertParams);

    return res.status(201).json({
      success: true,
      message: 'Channel submitted successfully! It will appear in search results once reviewed and approved by our team.',
      channelId: result.insertId
    });
  } catch (error) {
    console.error('Submit channel error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit channel due to a server error.'
    });
  }
};

