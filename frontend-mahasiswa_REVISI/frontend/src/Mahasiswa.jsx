import { useEffect, useState } from 'react';
import api from './api';
 
const kosong = { nim:'', nama:'', jenis_kelamin:'L', tempat_lahir:'',
  tanggal_lahir:'', kelas:'', alamat:'', nama_ibu:'', no_hp_wali:'', keterangan:'' };
 
export default function Mahasiswa({ user }) {
  const isAdmin = user.role === 'admin';
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(null);   // null = loading, objek = meta
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);    // { _error } = pesan error backend
  const [editId, setEditId] = useState(null);
  const limit = 5;
 
  const load = async () => {
    setTotal(null);
    try {
      const { data } = await api.get('/mahasiswa', { params: { page, limit, search } });
      setRows(data.data || []);
      setTotal(data.meta || { page, limit, total: 0, total_pages: 1 });
      setForm(f => (f && f._error ? null : f));
    } catch (err) {
      setRows([]);
      setTotal({ page, limit, total: 0, total_pages: 1 });
      setForm({ _error: err.response?.data?.message || 'Gagal memuat data' });
    }
  };
  useEffect(() => { load(); }, [page, search]);
 
  const simpan = async e => {
    e.preventDefault();
    const payload = { ...form };
    delete payload._error;
    try {
      if (editId) await api.patch(`/mahasiswa/${editId}`, payload);
      else await api.post('/mahasiswa', payload);
      setForm(null); setEditId(null); load();
    } catch (err) {
      setForm(f => ({ ...f, _error: err.response?.data?.message || 'Gagal menyimpan' }));
    }
  };
 
  const edit = async r => {
    try {
      const { data } = await api.get(`/mahasiswa/${r.uuid}`);
      const m = data.data || {};
      setEditId(r.uuid);
      setForm({
        nim: m.nim ?? '',
        nama: m.nama ?? '',
        jenis_kelamin: m.jenis_kelamin || 'L',
        tempat_lahir: m.tempat_lahir ?? '',
        tanggal_lahir: m.tanggal_lahir ? m.tanggal_lahir.slice(0, 10) : '',
        kelas: m.kelas ?? '',
        alamat: m.alamat ?? '',
        nama_ibu: m.nama_ibu ?? '',
        no_hp_wali: m.no_hp_wali ?? '',
        keterangan: m.keterangan ?? '',
      });
    } catch (err) {
      setEditId(null);
      setForm({ _error: err.response?.data?.message || 'Gagal memuat detail' });
    }
  };
 
  const hapus = async r => {
    if (!window.confirm(`Hapus ${r.nama}?`)) return;
    try {
      await api.delete(`/mahasiswa/${r.uuid}`);
      load();
    } catch (err) {
      setForm({ _error: err.response?.data?.message || 'Gagal menghapus' });
    }
  };
 
  const ubah = e => setForm({ ...form, [e.target.name]: e.target.value });
 
  const meta = total && typeof total === 'object' ? total
    : { page, limit, total: 0, total_pages: 1 };
  const maxPage = meta.total_pages || 1;
  const loading = total === null;
  const errorMessage = form?._error || '';
  const showForm = !!form && Object.keys(form).some(k => k !== '_error');
 
  return (
    <div className="container">
      <div className="stats">
        <div className="card stat"><span>Total mahasiswa</span><b>{meta.total}</b></div>
        <div className="card stat"><span>Tampil di halaman ini</span><b>{rows.length}</b></div>
        <div className="card stat"><span>Halaman</span><b>{`${meta.page} / ${meta.total_pages || 1}`}</b></div>
      </div>
 
      <div className="page-head">
        <h2>Data Mahasiswa</h2>
        <form onSubmit={e => e.preventDefault()}>
          <input className="input" placeholder="Cari NIM / nama..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button type="submit" className="btn">Cari</button>
        </form>
        {isAdmin && <a href="#" className="btn btn-primary"
          onClick={e => { e.preventDefault(); setEditId(null); setForm(kosong); }}>
          + Tambah</a>}
      </div>
 
      {errorMessage && <p className="error-message">{errorMessage}</p>}
 
      {loading ? (
        <div className="card"><div className="empty">Memuat data...</div></div>
      ) : (
        <div className="card table-wrap">
          <table className="table">
            <thead><tr>
              <th>Mahasiswa</th><th>L/P</th><th>TTL</th><th>Kelas</th>
              <th>Alamat</th><th>Nama Ibu</th><th>HP Wali</th><th>Ket</th>
              {isAdmin && <th>Aksi</th>}
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.uuid}>
                  <td>
                    <div className="person">
                      <span className="avatar">{(r.nama || '').charAt(0).toUpperCase()}</span>
                      <div>{r.nama}<small>{r.nim}</small></div>
                    </div>
                  </td>
                  <td><span className={`badge ${r.jenis_kelamin === 'L' ? 'badge-l' : 'badge-p'}`}>{r.jenis_kelamin}</span></td>
                  <td>{r.tempat_lahir || ''}{r.tanggal_lahir ? ', ' : ''}
                    {r.tanggal_lahir && new Date(`${r.tanggal_lahir.slice(0, 10)}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td><span className="chip">{r.kelas}</span></td>
                  <td><div className="truncate" title={r.alamat || ''}>{r.alamat}</div></td>
                  <td>{r.nama_ibu}</td>
                  <td>{r.no_hp_wali}</td>
                  <td>{r.keterangan || '-'}</td>
                  {isAdmin && <td>
                    <div className="actions">
                      <a href="#" className="btn btn-sm" onClick={e => { e.preventDefault(); edit(r); }}>Edit</a>
                      <button className="btn btn-sm btn-danger" onClick={() => hapus(r)}>Hapus</button>
                    </div>
                  </td>}
                </tr>
              ))}
              {!rows.length && <tr><td colSpan="9" className="empty">Belum ada data mahasiswa</td></tr>}
            </tbody>
          </table>
        </div>
      )}
 
      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
        {' '}Halaman {meta.page} / {maxPage}{' '}
        <button className="btn" disabled={page >= maxPage} onClick={() => setPage(page + 1)}>Next</button>
      </div>
 
      {showForm && (
        <div className="card form-card">
          <h2>{editId ? 'Edit' : 'Tambah'} Mahasiswa</h2>
          <small>Isi data di bawah lalu klik Simpan.</small>
          <form className="form-grid" onSubmit={simpan}>
            <h3 className="full section">Data Mahasiswa</h3>
            <label className="field">NIM
              <input name="nim" placeholder="NIM" value={form.nim ?? ''}
                onChange={ubah} required />
            </label>
            <label className="field">Nama Lengkap
              <input name="nama" placeholder="Nama Lengkap" value={form.nama ?? ''}
                onChange={ubah} required />
            </label>
            <label className="field">Jenis Kelamin
              <select name="jenis_kelamin" value={form.jenis_kelamin ?? 'L'} onChange={ubah}>
                <option value="L">Laki-laki</option><option value="P">Perempuan</option>
              </select>
            </label>
            <label className="field">Tempat Lahir
              <input name="tempat_lahir" placeholder="Tempat Lahir"
                value={form.tempat_lahir ?? ''} onChange={ubah} />
            </label>
            <label className="field">Tanggal Lahir
              <input type="date" name="tanggal_lahir"
                value={form.tanggal_lahir ?? ''} onChange={ubah} />
            </label>
            <label className="field">Kelas / Rombel
              <input name="kelas" placeholder="Kelas / Rombel"
                value={form.kelas ?? ''} onChange={ubah} />
            </label>
            <label className="field full">Alamat
              <textarea name="alamat" placeholder="Alamat"
                value={form.alamat ?? ''} onChange={ubah} />
            </label>
            <h3 className="full section">Data Orang Tua / Wali</h3>
            <label className="field">Nama Ibu
              <input name="nama_ibu" placeholder="Nama Ibu"
                value={form.nama_ibu ?? ''} onChange={ubah} />
            </label>
            <label className="field">No HP / WA Wali
              <input name="no_hp_wali" placeholder="No HP / WA Wali"
                value={form.no_hp_wali ?? ''} onChange={ubah} />
            </label>
            <label className="field full">Keterangan
              <textarea name="keterangan" placeholder="Keterangan"
                value={form.keterangan ?? ''} onChange={ubah} />
            </label>
            <div className="full actions">
              <button className="btn btn-primary">Simpan</button>
              <button type="button" className="btn"
                onClick={() => { setForm(null); setEditId(null); }}>Batal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
