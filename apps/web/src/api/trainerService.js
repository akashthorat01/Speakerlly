import api from './axiosConfig';

export const getTrainers = async () => {
  const response = await api.get('/api/trainers');
  return response.data;
};

export const getTrainer = async (id) => {
  const response = await api.get(`/api/trainers/${id}`);
  return response.data;
};

export const getTrainerSlots = async (id) => {
  const response = await api.get(`/api/trainers/${id}/slots`);
  return response.data;
};

export const updateTrainerProfile = async (profileData) => {
  const response = await api.put('/api/trainers/profile', profileData);
  return response.data;
};

export const setTrainerAvailability = async (availabilities) => {
  const response = await api.post('/api/trainers/availability', availabilities);
  return response.data;
};
