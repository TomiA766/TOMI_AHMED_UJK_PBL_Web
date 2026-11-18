import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';
import Mahasiswa from './Mahasiswa';

const skipLogin = import.meta.env.VITE_SKIP_LOGIN === 'true';
const devUser = { email: 'dev@localhost', role: 'admin' };

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!skipLogin && !token) return <Navigate to="/login" replace />;
  return children;
}

function Dashboard({ user, logout }) {
  return (
    <>
      <div className="topbar">
        <span>{user.email}</span>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
      <Mahasiswa user={user} />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null'));
  const logout = () => { localStorage.clear(); setUser(null); };
  const currentUser = skipLogin ? (user ?? devUser) : user;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard user={currentUser} logout={logout} /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to={skipLogin ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
