import api from '../lib/api';

export const tripService = {
  getAll: async () => {
    const response = await api.get('/trips');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (tripData: any) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
  update: async (id: string, tripData: any) => {
    const response = await api.put(`/trips/${id}`, tripData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
  removeMember: async (tripId: string, userId: string) => {
    const response = await api.delete(`/trips/${tripId}/members/${userId}`);
    return response.data;
  },
};

export default tripService;
