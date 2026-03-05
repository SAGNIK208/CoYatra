import api from './api';
import axios from 'axios';

export const fileService = {
  getTripFiles: async (tripId: string) => {
    const response = await api.get(`/media/trip/${tripId}`);
    return response.data;
  },

  getUploadUrl: async (tripId: string, fileName: string, contentType: string) => {
    const response = await api.post('/media/upload-url', {
      tripId,
      fileName,
      contentType,
    });
    return response.data;
  },

  confirmUpload: async (data: {
    tripId: string;
    fileName: string;
    fileKey: string;
    fileSize: number;
    mimeType: string;
    checklistItemId?: string;
  }) => {
    const response = await api.post('/media/confirm', data);
    return response.data;
  },

  deleteFile: async (id: string) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },

  uploadToS3: async (uploadUrl: string, file: File) => {
    // We use a clean axios instance for S3 to avoid including our API's Authorization header
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },
};

export default fileService;
