require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: origins }));
app.use(express.json());

app.use('/api/siswa', require('./routes/siswa'));

// Penangan error global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

