import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

const JURUSAN = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Manajemen Informatika',
  'Teknik Elektro',
  'Akuntansi',
];

const LIMIT = 10;

export default function Siswa() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0, total_pages: 0 });
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [jurusan, setJurusan] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/siswa', {
        params: { q: search, jurusan, page, limit: LIMIT },
      });
      setRows(data.data || []);
      setMeta(data.meta || { page, limit: LIMIT, total: 0, total_pages: 0 });
    } catch (err) {
      setRows([]);
      setMeta({ page, limit: LIMIT, total: 0, total_pages: 0 });
      setError(err.response?.data?.message || 'Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  // Muat ulang setiap kali kata kunci, filter jurusan, atau halaman berubah
  useEffect(() => {
    load();
  }, [search, jurusan, page]);

  const cari = (e) => {
    e.preventDefault();
    setSearch(q);
    setPage(1);
  };

  const gantiJurusan = (e) => {
    setJurusan(e.target.value);
    setPage(1);
  };

  const hapus = async (siswa) => {
    if (!window.confirm(`Hapus ${siswa.nama_siswa}?`)) return;
    try {
      await api.delete(`/siswa/${encodeURIComponent(siswa.kode_siswa)}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus data siswa');
    }
  };

  const totalPages = meta.total_pages || 1;

  return (
    <div className="container">
      <div className="page-head">
        <h2>Data Siswa</h2>
        <form onSubmit={cari}>
          <input
            className="input"
            type="text"
            placeholder="Cari kode atau nama siswa..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn">Cari</button>
          <select className="input" value={jurusan} onChange={gantiJurusan}>
            <option value="">Semua Jurusan</option>
            {JURUSAN.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
          <Link to="/tambah" className="btn btn-primary">+ Tambah</Link>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="card"><div className="empty">Memuat data...</div></div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Jurusan</th>
                <th>Tanggal Lahir</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((siswa) => (
                <tr key={siswa.kode_siswa}>
                  <td>{siswa.kode_siswa}</td>
                  <td>{siswa.nama_siswa}</td>
                  <td>{siswa.jurusan}</td>
                  <td>
                    {siswa.tanggal_lahir
                      ? new Date(siswa.tanggal_lahir + 'T00:00:00').toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td>{siswa.alamat}</td>
                  <td>
                    <div className="actions">
                      <Link
                        to={`/edit/${encodeURIComponent(siswa.kode_siswa)}`}
                        className="btn btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => hapus(siswa)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="6" className="empty">Belum ada data siswa</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Halaman {meta.page} / {totalPages} (total {meta.total})</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
