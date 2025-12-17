import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Fragrance API
export const fragranceAPI = {
    // Get all fragrances with optional filters
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.concentration) params.append('concentration', filters.concentration);
        return api.get(`/fragrances?${params}`);
    },

    // Get single fragrance by ID
    getById: (id) => api.get(`/fragrances/${id}`),

    // Search fragrances
    search: (query) => api.get(`/fragrances/search?q=${encodeURIComponent(query)}`),

    // Visual Scent Search
    searchByScent: (scentFilters) => api.post('/fragrances/search/scent', scentFilters),

    // Note Recommendation Engine
    getRecommendations: (notes, threshold = 0.2) =>
        api.post('/fragrances/recommend', { notes, threshold }),

    // Get all brands
    getBrands: () => api.get('/fragrances/brands'),

    // Get all notes
    getAllNotes: () => api.get('/fragrances/notes'),

    // Get inventory status
    getInventory: (id) => api.get(`/fragrances/${id}/inventory`)
};

// Order API
export const orderAPI = {
    create: (orderData) => api.post('/orders', orderData),
    getById: (id) => api.get(`/orders/${id}`),
    getByUser: (userId) => api.get(`/orders/user/${userId}`)
};

// User API
export const userAPI = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getProfile: (id) => api.get(`/users/${id}`),
    addFavorite: (userId, fragranceId) => api.post(`/users/${userId}/favorites/${fragranceId}`),
    removeFavorite: (userId, fragranceId) => api.delete(`/users/${userId}/favorites/${fragranceId}`)
};

export default api;
