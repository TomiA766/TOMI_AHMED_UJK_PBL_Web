const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.auth = async (req, res, next) => {
  // Bypass login khusus development (tidak aktif di production)
  if (process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV !== 'production') {
    const { rows } = await pool.query(
      `SELECT uuid FROM users
       WHERE role ILIKE 'admin' AND deleted_at IS NULL
       ORDER BY created_at LIMIT 1`);
    if (!rows[0])
      return res.status(500).json({ message: 'SKIP_AUTH aktif tetapi belum ada akun admin' });
    req.admin = { uuid: rows[0].uuid }; // users.uuid, bukan id angka
    return next();
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.uuid) throw new Error('Token tanpa uuid');
    req.admin = { uuid: payload.uuid };
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid / belum login' });
  }
};

exports.adminOnly = async (req, res, next) => {
  const { rows } = await pool.query(
    `SELECT 1 FROM users
     WHERE uuid=$1 AND role ILIKE 'admin' AND deleted_at IS NULL`, [req.admin.uuid]);
  if (!rows[0]) return res.status(403).json({ message: 'Hanya admin yang boleh' });
  next();
};
