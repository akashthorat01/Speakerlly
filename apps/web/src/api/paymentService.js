import api from './axiosConfig';

export const createOrder = async (planType) => {
  const response = await api.post('/api/payments/create-order', { planType });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/api/payments/verify', paymentData);
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get('/api/payments/history');
  return response.data;
};
