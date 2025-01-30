import axios from 'axios';

const api = axios.create({
    baseURL: 'http://44.211.42.105:8082/api', // Substituímos pela URL do backend na AWS
});

export default api;
