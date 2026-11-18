import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from './api';

const JURUSAN = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Manajemen Informatika',
  'Teknik Elektro',
  'Akuntansi',
];

const FORM_KOSONG = {
  kode_siswa: '',
  nama_siswa: '',
  jurusan: '',
  tanggal_lahir: '',
  alamat: '',
};

export default function FormSiswa() {
  const { kode } = useParams();
  const navigate = useNavigate();
  const modeEdit = Boolean(kode);

  const [form, setForm] = useState(FORM_KOSONG);
  const [loading, setLoading] = useState(modeEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Mode edit: ambil detail siswa berdasarkan kode di URL
  useEffect(() => {
    if (!kode) return;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/siswa/${encodeURIComponent(kode)}`);
        const siswa = data.data || {};
        setForm({
          kode_siswa: siswa.kode_siswa ?? '',
          nama_siswa: siswa.nama_siswa ?? '',
          jurusan: siswa.jurusan ?? '',
          tanggal_lahir: siswa.tanggal_lahir ? String(siswa.tanggal_lahir).slice(0, 10) : '',
          alamat: siswa.alamat ?? '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data siswa');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [kode]);

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const simpan = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (modeEdit) {
        await api.put(`/siswa/${encodeURIComponent(kode)}`, form);
      } else {
        await api.post('/siswa', form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data siswa');
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="card form-card">
        <h2>{modeEdit ? 'Edit Siswa' : 'Tambah Siswa'}</h2>
        <small>Isi data siswa di bawah ini lalu klik Simpan.</small>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="empty">Memuat data...</p>
        ) : (
          /* Input ditulis langsung sebagai JSX (tanpa komponen di dalam komponen)
             agar input tidak kehilangan fokus saat mengetik. */
          <form className="form-grid" onSubmit={simpan}>
            <label className="field">Kode Siswa
              <input
                type="text"
                name="kode_siswa"
                value={form.kode_siswa}
                onChange={ubah}
                maxLength={10}
                required
                readOnly={modeEdit}
                placeholder="Contoh: 2024001"
              />
            </label>

            <label className="field">Nama Siswa
              <input
                type="text"
                name="nama_siswa"
                value={form.nama_siswa}
                onChange={ubah}
                required
                placeholder="Nama lengkap siswa"
              />
            </label>

            <label className="field">Jurusan
              <select name="jurusan" value={form.jurusan} onChange={ubah} required>
                <option value="">Pilih jurusan</option>
                {JURUSAN.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </label>

            <label className="field">Tanggal Lahir
              <input
                type="date"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={ubah}
                required
              />
            </label>

            <label className="field full">Alamat
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={ubah}
                required
                placeholder="Alamat lengkap siswa"
              />
            </label>

            <div className="full actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link to="/" className="btn">Batal</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
