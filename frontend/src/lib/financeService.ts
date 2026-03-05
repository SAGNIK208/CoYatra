import api from '../lib/api';

export const financeService = {
  getByTripId: async (tripId: string) => {
    const response = await api.get(`/finances/trip/${tripId}`);
    return response.data;
  },
  create: async (expenseData: any) => {
    const response = await api.post('/finances', expenseData);
    return response.data;
  },
  update: async (id: string, expenseData: any) => {
    const response = await api.put(`/finances/${id}`, expenseData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/finances/${id}`);
    return response.data;
  },
  updatePayeeStatus: async (expenseId: string, userId: string, isPaid: boolean) => {
    const response = await api.patch(`/finances/${expenseId}/payee`, { userId, isPaid });
    return response.data;
  }
};

export default financeService;
