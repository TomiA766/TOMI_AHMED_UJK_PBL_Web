import axios from 'axios';

// Backend berjalan di port 3000 (lihat PORT di ../../backend-mahasiswa/.env)
const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export default api;
