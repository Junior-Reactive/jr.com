import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 Making ${config.method.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.data);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('❌ Request timeout - backend may be down');
        } else if (error.response) {
            console.error('❌ Server responded with error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('❌ No response received - backend may be down or CORS issue');
            console.error('   Make sure backend is running on:', API_BASE_URL);
        } else {
            console.error('❌ Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;