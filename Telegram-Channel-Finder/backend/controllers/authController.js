import bcrypt from 'bcrypt';
import pool from '../config/db.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const [rows] = await pool.query(
      'SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1',
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Set secure session
    req.session.adminUser = {
      id: admin.id,
      username: admin.username
    };

    return res.json({
      success: true,
      message: 'Admin authenticated successfully.',
      user: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred during login.'
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out at this time.'
      });
    }
    res.clearCookie(process.env.SESSION_NAME || 'tcf_sid');
    return res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  });
};

export const me = (req, res) => {
  if (req.session && req.session.adminUser) {
    return res.json({
      authenticated: true,
      user: req.session.adminUser
    });
  }
  return res.json({
    authenticated: false,
    user: null
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.session.adminUser?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const [rows] = await pool.query(
      'SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1',
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE admin_users SET password_hash = ? WHERE id = ?',
      [hashedNew, adminId]
    );

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password.'
    });
  }
};

