import api from './axiosConfig';

export const getDailyProgress = async () => {
  const response = await api.get('/api/progress/daily');
  return response.data;
};

export const getProgressSummary = async () => {
  const response = await api.get('/api/progress/summary');
  return response.data;
};
