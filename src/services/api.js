import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8084/api', // Substitua pela URL do backend
});

export default api;
