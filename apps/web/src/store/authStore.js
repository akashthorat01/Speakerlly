import { create } from 'zustand';
import { login as apiLogin, register as apiRegister } from '../api/authService';

export const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiLogin(email, password);
            localStorage.setItem('speakerly_token', data.token);
            const userObj = { id: data.id, role: data.role, name: data.name };
            localStorage.setItem('user', JSON.stringify(userObj));
            set({ user: userObj, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            return false;
        }
    },

    register: async (name, email, password, role = 'user') => {
        set({ isLoading: true, error: null });
        try {
            await apiRegister(name, email, password, role);
            // After register, you must log in separately or we auto-login
            // For now, let's just return true to redirect to login
            set({ isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('speakerly_token');
        set({ user: null });
    }
}));
