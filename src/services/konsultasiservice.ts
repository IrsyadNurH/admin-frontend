import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const KonsultasiService = {
  update: async (id: number, data: { content_type: string; content: string }) => {
    const response = await axios({
      method: 'put',
      url: `${API_URL}/api/konsultasi/${id}`,
      data,
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  }
};