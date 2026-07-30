import axios from 'axios';

const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BASE_URL = isDevelopment
  ? 'http://localhost:8082/api'
  : 'https://employee-container.neemindev.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;