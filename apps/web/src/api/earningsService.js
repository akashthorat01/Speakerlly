import api from './axiosConfig';

export const getEarningsHistory = async () => {
  const response = await api.get('/api/earnings/history');
  return response.data;
};
