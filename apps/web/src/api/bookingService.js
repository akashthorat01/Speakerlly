import api from './axiosConfig';

export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings/create', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/api/bookings/my');
  return response.data;
};

export const getTrainerBookings = async () => {
  const response = await api.get('/api/bookings/trainer');
  return response.data;
};

export const acceptBooking = async (id) => {
  const response = await api.put(`/api/bookings/${id}/accept`);
  return response.data;
};

export const rejectBooking = async (id) => {
  const response = await api.put(`/api/bookings/${id}/reject`);
  return response.data;
};

export const rescheduleBooking = async (id) => {
  const response = await api.put(`/api/bookings/${id}/reschedule`);
  return response.data;
};
