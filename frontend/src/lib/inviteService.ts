import api from './api';

export const inviteService = {
  getDetails: async (token: string) => {
    const response = await api.get(`/invites/${token}`);
    return response.data;
  },
  generate: async (tripId: string, role: string, expiresAt?: string) => {
    const response = await api.post('/invites/generate', {
      tripId,
      role,
      expiresAt
    });
    return response.data;
  },
  join: async (token: string) => {
    const response = await api.post('/invites/join', { token });
    return response.data;
  }
};

export default inviteService;
