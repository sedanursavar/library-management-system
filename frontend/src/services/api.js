import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Axios instance oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Her istekte token ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - 401 hatası gelirse logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

// Books API
export const booksAPI = {
    getAll: () => api.get('/books'),
    getOne: (id) => api.get(`/books/${id}`),
    search: (query) => api.get(`/books/search?q=${query}`),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
};

// Authors API
export const authorsAPI = {
    getAll: () => api.get('/authors'),
    getOne: (id) => api.get(`/authors/${id}`),
    create: (data) => api.post('/authors', data),
    update: (id, data) => api.put(`/authors/${id}`, data),
    delete: (id) => api.delete(`/authors/${id}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getOne: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
