import api from '../lib/api';

export const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateMe: async (userData: any) => {
    const response = await api.put('/users/me', userData); // Matches backend PUT route
    return response.data;
  },
  syncClerk: async (userData: any) => {
    const response = await api.post('/users/sync', userData);
    return response.data;
  },
};

export default userService;
