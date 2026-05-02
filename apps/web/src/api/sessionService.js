import api from './axiosConfig';

export const startSession = async (bookingId) => {
  const response = await api.post('/api/sessions/start', { bookingId });
  return response.data;
};

export const endSession = async (sessionId) => {
  const response = await api.post('/api/sessions/end', { sessionId });
  return response.data;
};

export const getSessionHistory = async () => {
  const response = await api.get('/api/sessions/history');
  return response.data;
};
