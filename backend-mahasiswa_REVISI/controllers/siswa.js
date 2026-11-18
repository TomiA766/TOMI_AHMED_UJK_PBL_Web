const pool = require('../config/db');

// Mengambil daftar siswa dengan pencarian, filter jurusan, dan pagination
async function list(req, res, next) {
  try {
    let { q = '', jurusan = '', page = '1', limit = '10' } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 1;
    if (limit > 100) limit = 100;

    const params = [];
    const conditions = [];

    if (q && String(q).trim() !== '') {
      params.push(`%${q}%`);
      const idx = params.length;
      conditions.push(`(kode_siswa ILIKE $${idx} OR nama_siswa ILIKE $${idx})`);
    }

    if (jurusan && String(jurusan).trim() !== '') {
      params.push(jurusan);
      conditions.push(`jurusan = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM siswa ${where}`,
      params
    );
    const total = countResult.rows[0].total;
    const total_pages = Math.ceil(total / limit) || 0;
    const offset = (page - 1) * limit;

    const dataParams = params.concat([limit, offset]);
    const dataResult = await pool.query(
      `SELECT kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat
       FROM siswa ${where}
       ORDER BY kode_siswa
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    res.json({
      data: dataResult.rows,
      meta: { page, limit, total, total_pages },
    });
  } catch (err) {
    next(err);
  }
}

// Mengambil detail satu siswa berdasarkan kode_siswa
async function detail(req, res, next) {
  try {
    const { kode } = req.params;
    const result = await pool.query(
      `SELECT kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat
       FROM siswa WHERE kode_siswa = $1`,
      [kode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Menambahkan data siswa baru
async function create(req, res, next) {
  try {
    const { kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat } = req.body;

    const wajib = ['kode_siswa', 'nama_siswa', 'jurusan', 'tanggal_lahir', 'alamat'];
    const kosong = wajib.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (kosong.length > 0) {
      return res.status(400).json({ message: `Wajib diisi: ${kosong.join(', ')}` });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal_lahir)) {
      return res.status(400).json({ message: 'Format tanggal_lahir harus YYYY-MM-DD' });
    }

    const cek = await pool.query(
      'SELECT 1 FROM siswa WHERE kode_siswa = $1',
      [kode_siswa]
    );
    if (cek.rows.length > 0) {
      return res.status(409).json({ message: 'Kode siswa sudah terdaftar' });
    }

    const result = await pool.query(
      `INSERT INTO siswa (kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat`,
      [kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat]
    );

    res.status(201).json({ message: 'Siswa ditambahkan', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Memperbarui data siswa berdasarkan kode_siswa (kode_siswa tidak diubah)
async function update(req, res, next) {
  try {
    const { kode } = req.params;
    const { nama_siswa, jurusan, tanggal_lahir, alamat } = req.body;

    const wajib = ['nama_siswa', 'jurusan', 'tanggal_lahir', 'alamat'];
    const kosong = wajib.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (kosong.length > 0) {
      return res.status(400).json({ message: `Wajib diisi: ${kosong.join(', ')}` });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal_lahir)) {
      return res.status(400).json({ message: 'Format tanggal_lahir harus YYYY-MM-DD' });
    }

    const result = await pool.query(
      `UPDATE siswa
       SET nama_siswa = $1, jurusan = $2, tanggal_lahir = $3, alamat = $4
       WHERE kode_siswa = $5
       RETURNING kode_siswa, nama_siswa, jurusan, tanggal_lahir, alamat`,
      [nama_siswa, jurusan, tanggal_lahir, alamat, kode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    res.json({ message: 'Data diperbarui', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Menghapus data siswa secara permanen berdasarkan kode_siswa
async function remove(req, res, next) {
  try {
    const { kode } = req.params;
    const result = await pool.query(
      'DELETE FROM siswa WHERE kode_siswa = $1',
      [kode]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }

    res.json({ message: 'Data dihapus' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, detail, create, update, remove };
