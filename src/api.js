import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.217.55.187:8082/api', // Novo endpoint da API com IP Elástico
});

export default api;
