import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect to login or dispatch logout action if using Redux/Context outside
            // For now, we'll just reject the promise
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default api;
