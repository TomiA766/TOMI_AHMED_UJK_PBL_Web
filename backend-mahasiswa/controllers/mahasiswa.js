const pool = require('../config/db');

const FIELDS = ['nim', 'nama', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
  'kelas', 'alamat', 'nama_ibu', 'no_hp_wali', 'keterangan'];
const REQUIRED = ['nim', 'nama', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
  'kelas', 'nama_ibu', 'no_hp_wali'];
const COLUMNS = `uuid, ${FIELDS.join(', ')}`; // id_mhs tidak dikirim ke client

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const q = req.query.q || '';
  const kelas = req.query.kelas || null;
  const where = `deleted_at IS NULL
    AND ($1::text = '' OR nim ILIKE '%' || $1 || '%' OR nama ILIKE '%' || $1 || '%')
    AND ($2::text IS NULL OR kelas = $2)`;

  const data = await pool.query(
    `SELECT ${COLUMNS} FROM mahasiswa WHERE ${where}
     ORDER BY created_at DESC LIMIT $3 OFFSET $4`,
    [q, kelas, limit, (page - 1) * limit]);
  const totalResult = await pool.query(
    `SELECT COUNT(*) FROM mahasiswa WHERE ${where}`, [q, kelas]);
  const total = +totalResult.rows[0].count;

  res.json({
    data: data.rows,
    meta: { page, limit, total, total_pages: Math.ceil(total / limit) },
  });
};

exports.detail = async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM mahasiswa WHERE uuid=$1 AND deleted_at IS NULL`,
    [req.params.uuid]);
  if (!rows[0]) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const missing = REQUIRED.filter((f) => !req.body[f]);
  if (missing.length)
    return res.status(400).json({ message: `Wajib diisi: ${missing.join(', ')}` });
  if (!['L', 'P'].includes(req.body.jenis_kelamin))
    return res.status(400).json({ message: 'Jenis kelamin harus L atau P' });

  const dup = await pool.query(
    'SELECT 1 FROM mahasiswa WHERE nim=$1 AND deleted_at IS NULL', [req.body.nim]);
  if (dup.rowCount) return res.status(409).json({ message: 'NIM sudah terdaftar' });

  const values = FIELDS.map((f) => req.body[f] ?? null);
  try {
    const { rows } = await pool.query(
      `INSERT INTO mahasiswa (uuid, ${FIELDS.join(',')}, created_by, created_at, updated_at)
       VALUES (gen_random_uuid(), ${FIELDS.map((_, i) => `$${i + 1}`).join(',')},
               $${FIELDS.length + 1}, now(), now())
       RETURNING ${COLUMNS}`,
      [...values, req.admin.uuid]);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ message: 'NIM sudah terdaftar' });
    throw e;
  }
};

exports.update = async (req, res) => {
  const fields = FIELDS.filter((f) => Object.prototype.hasOwnProperty.call(req.body, f));
  if (!fields.length)
    return res.status(400).json({ message: 'Tidak ada field yang diubah' });
  if (fields.includes('jenis_kelamin') && !['L', 'P'].includes(req.body.jenis_kelamin))
    return res.status(400).json({ message: 'Jenis kelamin harus L atau P' });

  if (fields.includes('nim')) {
    const dup = await pool.query(
      'SELECT 1 FROM mahasiswa WHERE nim=$1 AND uuid<>$2 AND deleted_at IS NULL',
      [req.body.nim, req.params.uuid]);
    if (dup.rowCount) return res.status(409).json({ message: 'NIM sudah terdaftar' });
  }

  const sets = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
  const values = fields.map((f) => req.body[f] ?? null);
  values.push(req.admin.uuid, req.params.uuid);
  const { rows } = await pool.query(
    `UPDATE mahasiswa SET ${sets}, updated_at=now(), updated_by=$${fields.length + 1}
     WHERE uuid=$${fields.length + 2} AND deleted_at IS NULL RETURNING ${COLUMNS}`,
    values);
  if (!rows[0]) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json(rows[0]);
};

exports.remove = async (req, res) => {
  const { rowCount } = await pool.query(
    `UPDATE mahasiswa SET deleted_at=now(), deleted_by=$1
     WHERE uuid=$2 AND deleted_at IS NULL`, [req.admin.uuid, req.params.uuid]);
  if (!rowCount) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json({ message: 'Data dihapus (soft delete)' });
};

// Endpoint lama dipertahankan
exports.restore = async (req, res) => {
  const { rowCount } = await pool.query(
    `UPDATE mahasiswa SET deleted_at=NULL, deleted_by=NULL,
            updated_at=now(), updated_by=$1
     WHERE uuid=$2 AND deleted_at IS NOT NULL`, [req.admin.uuid, req.params.uuid]);
  if (!rowCount) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json({ message: 'Data dipulihkan' });
};
