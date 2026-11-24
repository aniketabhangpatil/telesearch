import pool from '../config/db.js';

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [totalChannels] = await pool.query('SELECT COUNT(*) AS count FROM channels');
    const [pendingSubmissions] = await pool.query("SELECT COUNT(*) AS count FROM channels WHERE status = 'pending'");
    const [approvedChannels] = await pool.query("SELECT COUNT(*) AS count FROM channels WHERE status = 'approved'");
    const [rejectedChannels] = await pool.query("SELECT COUNT(*) AS count FROM channels WHERE status = 'rejected'");
    const [totalSponsored] = await pool.query('SELECT COUNT(*) AS count FROM sponsored_channels');
    const [totalFeatured] = await pool.query('SELECT COUNT(*) AS count FROM sponsored_channels WHERE is_featured = 1');
    const [totalCategories] = await pool.query('SELECT COUNT(*) AS count FROM categories');

    const [recentSubmissions] = await pool.query(`
      SELECT c.*, cat.name as category_name 
      FROM channels c
      JOIN categories cat ON c.category_id = cat.id
      ORDER BY c.created_at DESC 
      LIMIT 5
    `);

    return res.json({
      success: true,
      stats: {
        totalChannels: totalChannels[0]?.count || 0,
        pendingSubmissions: pendingSubmissions[0]?.count || 0,
        approvedChannels: approvedChannels[0]?.count || 0,
        rejectedChannels: rejectedChannels[0]?.count || 0,
        totalSponsored: totalSponsored[0]?.count || 0,
        totalFeatured: totalFeatured[0]?.count || 0,
        totalCategories: totalCategories[0]?.count || 0
      },
      recentSubmissions
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};

// Pending submissions management
export const getPendingSubmissions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.query("SELECT COUNT(*) AS total FROM channels WHERE status = 'pending'");
    const total = countRows[0]?.total || 0;

    const sql = `
      SELECT c.*, cat.name as category_name
      FROM channels c
      JOIN categories cat ON c.category_id = cat.id
      WHERE c.status = 'pending'
      ORDER BY c.created_at ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [limit, offset]);

    return res.json({
      success: true,
      submissions: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    console.error('Get pending submissions error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending submissions.' });
  }
};

export const approveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE channels SET status = 'approved', rejection_reason = NULL WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }

    return res.json({
      success: true,
      message: 'Channel approved successfully. It is now live in public search.'
    });
  } catch (error) {
    console.error('Approve error:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve channel.' });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const [result] = await pool.query(
      "UPDATE channels SET status = 'rejected', rejection_reason = ? WHERE id = ?",
      [reason || 'Did not meet listing guidelines', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }

    return res.json({
      success: true,
      message: 'Channel submission marked as rejected.'
    });
  } catch (error) {
    console.error('Reject error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reject channel.' });
  }
};

// Listed channels management
export const getAllChannels = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 15 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * pageLimit;

    const whereClauses = [];
    const params = [];

    if (status && status !== 'all') {
      whereClauses.push('c.status = ?');
      params.push(status);
    }

    if (category && category !== 'all') {
      whereClauses.push('c.category_id = ?');
      params.push(parseInt(category, 10));
    }

    if (search && search.trim()) {
      whereClauses.push('(LOWER(c.name) LIKE LOWER(?) OR LOWER(c.telegram_url) LIKE LOWER(?) OR LOWER(c.description) LIKE LOWER(?))');
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) AS total FROM channels c ${whereSql}`;
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    const dataSql = `
      SELECT 
        c.*, cat.name AS category_name,
        sc.id AS sponsored_id, sc.is_featured, sc.display_order AS sponsored_order
      FROM channels c
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN sponsored_channels sc ON c.id = sc.channel_id
      ${whereSql}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataSql, [...params, pageLimit, offset]);

    return res.json({
      success: true,
      channels: rows,
      total,
      page: pageNum,
      limit: pageLimit,
      totalPages: Math.ceil(total / pageLimit) || 1
    });
  } catch (error) {
    console.error('Get all channels error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch channels.' });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, telegram_url, description, category_id, keywords, language, logo_url, status } = req.body;

    const [existing] = await pool.query('SELECT id FROM channels WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }

    // Check duplicate telegram_url if modified
    if (telegram_url) {
      const [dup] = await pool.query(
        'SELECT id FROM channels WHERE telegram_url = ? AND id != ?',
        [telegram_url.trim(), id]
      );
      if (dup.length > 0) {
        return res.status(409).json({ success: false, message: 'Another channel with this Telegram URL already exists.' });
      }
    }

    let finalLogo = logo_url;
    if (req.file) {
      finalLogo = `/uploads/${req.file.filename}`;
    }

    const sql = `
      UPDATE channels SET
        name = COALESCE(?, name),
        telegram_url = COALESCE(?, telegram_url),
        description = COALESCE(?, description),
        category_id = COALESCE(?, category_id),
        keywords = COALESCE(?, keywords),
        language = COALESCE(?, language),
        logo_url = COALESCE(?, logo_url),
        status = COALESCE(?, status)
      WHERE id = ?
    `;
    await pool.query(sql, [
      name ? name.trim() : null,
      telegram_url ? telegram_url.trim() : null,
      description ? description.trim() : null,
      category_id ? parseInt(category_id, 10) : null,
      keywords !== undefined ? keywords : null,
      language !== undefined ? language : null,
      finalLogo !== undefined ? finalLogo : null,
      status || null,
      id
    ]);

    return res.json({ success: true, message: 'Channel updated successfully.' });
  } catch (error) {
    console.error('Update channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update channel.' });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM channels WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }
    return res.json({ success: true, message: 'Channel deleted successfully.' });
  } catch (error) {
    console.error('Delete channel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete channel.' });
  }
};

// Sponsored Channels Management (Enforce 100 max and 10 featured max transactionally)
export const getSponsoredList = async (req, res) => {
  try {
    const sql = `
      SELECT 
        sc.*,
        c.name, c.telegram_url, c.description, c.logo_url, c.status,
        cat.name AS category_name
      FROM sponsored_channels sc
      JOIN channels c ON sc.channel_id = c.id
      JOIN categories cat ON c.category_id = cat.id
      ORDER BY sc.display_order ASC
    `;
    const [rows] = await pool.query(sql);
    return res.json({ success: true, sponsored: rows });
  } catch (error) {
    console.error('Get sponsored list error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch sponsored channels.' });
  }
};

export const addSponsoredChannel = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { channel_id, badge_text, notes } = req.body;
    if (!channel_id) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Channel ID is required.' });
    }

    // Verify channel exists
    const [chanRows] = await connection.query('SELECT id, status FROM channels WHERE id = ?', [channel_id]);
    if (chanRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }

    // Check if already sponsored
    const [existRows] = await connection.query('SELECT id FROM sponsored_channels WHERE channel_id = ?', [channel_id]);
    if (existRows.length > 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'This channel is already in the sponsored directory.' });
    }

    // Enforce max 100 limit transactionally with FOR UPDATE lock
    const [countRows] = await connection.query('SELECT COUNT(*) AS total FROM sponsored_channels FOR UPDATE');
    const currentCount = countRows[0]?.total || 0;
    if (currentCount >= 100) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Top 100 sponsored limit reached. Cannot add more than 100 sponsored channels. Remove one first.'
      });
    }

    // Determine next display order
    const [maxOrder] = await connection.query('SELECT MAX(display_order) AS max_order FROM sponsored_channels');
    const nextOrder = (maxOrder[0]?.max_order || 0) + 1;

    await connection.query(
      'INSERT INTO sponsored_channels (channel_id, display_order, badge_text, notes) VALUES (?, ?, ?, ?)',
      [channel_id, nextOrder, badge_text || 'Sponsored Partner', notes || null]
    );

    await connection.commit();
    return res.status(201).json({ success: true, message: 'Channel added to Top 100 Sponsored directory.' });
  } catch (error) {
    await connection.rollback();
    console.error('Add sponsored error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add sponsored channel.' });
  } finally {
    connection.release();
  }
};

export const updateSponsoredChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order, badge_text, notes } = req.body;

    const [result] = await pool.query(
      'UPDATE sponsored_channels SET display_order = COALESCE(?, display_order), badge_text = COALESCE(?, badge_text), notes = COALESCE(?, notes) WHERE id = ?',
      [display_order, badge_text, notes, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sponsored record not found.' });
    }

    return res.json({ success: true, message: 'Sponsored channel updated.' });
  } catch (error) {
    console.error('Update sponsored error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update sponsored channel.' });
  }
};

export const removeSponsoredChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM sponsored_channels WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sponsored entry not found.' });
    }
    return res.json({ success: true, message: 'Channel removed from sponsored directory.' });
  } catch (error) {
    console.error('Remove sponsored error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove sponsored channel.' });
  }
};

export const reorderSponsoredChannels = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { orderedIds } = req.body; // Array of sponsored_channels ids in new order

    if (!Array.isArray(orderedIds)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'orderedIds must be an array.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      const id = orderedIds[index];
      await connection.query(
        'UPDATE sponsored_channels SET display_order = ? WHERE id = ?',
        [index + 1, id]
      );
    }

    await connection.commit();
    return res.json({ success: true, message: 'Sponsored order updated successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Reorder sponsored error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder sponsored channels.' });
  } finally {
    connection.release();
  }
};

// Featured Channels Management (Max 10 selected from Top 100)
export const getFeaturedList = async (req, res) => {
  try {
    const sql = `
      SELECT 
        sc.*,
        c.name, c.telegram_url, c.description, c.logo_url,
        cat.name AS category_name
      FROM sponsored_channels sc
      JOIN channels c ON sc.channel_id = c.id
      JOIN categories cat ON c.category_id = cat.id
      WHERE sc.is_featured = 1
      ORDER BY sc.featured_order ASC, sc.display_order ASC
    `;
    const [rows] = await pool.query(sql);
    return res.json({ success: true, featured: rows });
  } catch (error) {
    console.error('Get featured list error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch featured channels.' });
  }
};

export const setFeaturedChannel = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params; // sponsored_channels id

    // Check if sponsored entry exists
    const [scRows] = await connection.query('SELECT id, is_featured FROM sponsored_channels WHERE id = ?', [id]);
    if (scRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Sponsored channel record not found.' });
    }

    if (scRows[0].is_featured) {
      await connection.rollback();
      return res.json({ success: true, message: 'Channel is already marked as featured.' });
    }

    // Transactionally enforce 10 max featured limit with FOR UPDATE lock
    const [featuredCountRows] = await connection.query(
      'SELECT COUNT(*) AS total FROM sponsored_channels WHERE is_featured = 1 FOR UPDATE'
    );
    const count = featuredCountRows[0]?.total || 0;
    if (count >= 10) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Top 10 featured limit reached. Maximum 10 featured channels allowed in signature animation. Remove one first.'
      });
    }

    // Determine next featured order
    const [maxOrderRows] = await connection.query(
      'SELECT MAX(featured_order) AS max_order FROM sponsored_channels WHERE is_featured = 1'
    );
    const nextFeaturedOrder = (maxOrderRows[0]?.max_order || 0) + 1;

    await connection.query(
      'UPDATE sponsored_channels SET is_featured = 1, featured_order = ? WHERE id = ?',
      [nextFeaturedOrder, id]
    );

    await connection.commit();
    return res.json({ success: true, message: 'Channel successfully added to Top 10 Featured showcase.' });
  } catch (error) {
    await connection.rollback();
    console.error('Set featured error:', error);
    return res.status(500).json({ success: false, message: 'Failed to set featured channel.' });
  } finally {
    connection.release();
  }
};

export const removeFeaturedChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      'UPDATE sponsored_channels SET is_featured = 0, featured_order = NULL WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sponsored channel not found.' });
    }

    return res.json({ success: true, message: 'Channel removed from Top 10 Featured showcase.' });
  } catch (error) {
    console.error('Remove featured error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove featured channel.' });
  }
};

export const reorderFeaturedChannels = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { orderedIds } = req.body; // Array of sponsored_channels ids

    if (!Array.isArray(orderedIds)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'orderedIds must be an array.' });
    }

    if (orderedIds.length > 10) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Cannot feature more than 10 channels.' });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await connection.query(
        'UPDATE sponsored_channels SET is_featured = 1, featured_order = ? WHERE id = ?',
        [i + 1, orderedIds[i]]
      );
    }

    await connection.commit();
    return res.json({ success: true, message: 'Top 10 Featured channels reordered successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Reorder featured error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reorder featured channels.' });
  } finally {
    connection.release();
  }
};

// Site settings
export const getSettings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value, description FROM site_settings');
    const settingsMap = {};
    rows.forEach(r => {
      settingsMap[r.setting_key] = r.setting_value;
    });
    return res.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

export const updateSettings = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const settings = req.body; // Object with key-value pairs

    for (const [key, value] of Object.entries(settings)) {
      await connection.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
        [key, String(value)]
      );
    }

    await connection.commit();
    return res.json({ success: true, message: 'Site settings updated successfully.' });
  } catch (error) {
    await connection.rollback();
    console.error('Update settings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  } finally {
    connection.release();
  }
};

