const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ message: 'Email / password salah' });

  const { rows } = await pool.query(
    `SELECT uuid, email, password, role FROM users
     WHERE LOWER(email)=$1 AND deleted_at IS NULL`, [String(email).toLowerCase()]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Email / password salah' });

  const token = jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { uuid: user.uuid, email: user.email, role: user.role } });
});

router.get('/me', auth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT uuid,email,role,id_mhs FROM users WHERE uuid=$1', [req.admin.uuid]);
  res.json(rows[0]);
});

module.exports = router;
