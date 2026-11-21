import pool from '../config/db.js';

export const getPublicSettings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('sponsorship_email', 'developer_email', 'site_name', 'hero_tagline')"
    );
    const settings = {
      sponsorship_email: 'silkroad2@gmail.com',
      developer_email: 'silkroad2.o@gmail.com',
      site_name: 'Telegram Channel Finder'
    };
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });
    return res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings.'
    });
  }
};

