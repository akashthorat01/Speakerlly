import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            return false;
        }
    },

    register: async (name, email, password, role = 'user') => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
            localStorage.setItem('user', JSON.stringify(data));
            set({ user: data, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        set({ user: null });
    }
}));
