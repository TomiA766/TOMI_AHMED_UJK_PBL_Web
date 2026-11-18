import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from './api';
 
export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (import.meta.env.VITE_SKIP_LOGIN === 'true') {
    return <Navigate to="/dashboard" replace />;
  }
 
  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login');
    }
  };
 
  return (
    <div className="login-wrap">
      <form onSubmit={submit} className="card login-card">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input className="input" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary">Masuk</button>
      </form>
    </div>
  );
}
