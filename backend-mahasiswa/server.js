require('dotenv').config();
if (process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV !== 'production')
  console.log('PERINGATAN: SKIP_AUTH aktif, login dilewati');

const express = require('express');
const cors = require('cors');

const app = express();
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',').map((origin) => origin.trim());
app.use(cors({ origin: origins }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/mahasiswa', require('./routes/mahasiswa'));

app.use((err, req, res, next) => {          // error handler global
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('API jalan di port', port));
