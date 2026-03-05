import api from './api';

export const checklistService = {
  getByTripId: async (tripId: string, assigneeId?: string) => {
    const response = await api.get(`/checklists/trip/${tripId}`, {
      params: { assignedToUserId: assigneeId === "all" ? undefined : assigneeId }
    });
    return response.data;
  },
  create: async (data: { tripId: string; title: string; assigneeId?: string }) => {
    const response = await api.post('/checklists', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/checklists/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/checklists/${id}`);
    return response.data;
  }
};
