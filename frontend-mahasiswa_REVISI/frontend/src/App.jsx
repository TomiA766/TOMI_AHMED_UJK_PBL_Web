import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Siswa from './Siswa.jsx';
import FormSiswa from './FormSiswa.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Siswa />} />
        <Route path="/tambah" element={<FormSiswa />} />
        <Route path="/edit/:kode" element={<FormSiswa />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
