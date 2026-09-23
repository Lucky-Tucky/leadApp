import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:3636/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;