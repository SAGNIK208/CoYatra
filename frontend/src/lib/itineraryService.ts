import api from '../lib/api';

export const itineraryService = {
  getByTripId: async (tripId: string) => {
    const response = await api.get(`/activities/trip/${tripId}`);
    return response.data;
  },
  create: async (activityData: any) => {
    const response = await api.post('/activities', activityData);
    return response.data;
  },
  update: async (id: string, activityData: any) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },
};

export default itineraryService;
