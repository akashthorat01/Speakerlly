import api from './axiosConfig';

export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

export const updateCurrentUser = async (userData) => {
  const response = await api.put('/api/users/me', userData);
  return response.data;
};
