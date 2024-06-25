import axios from 'axios';
import { API_BASE_URL } from '../config';

export const getAnnouncement = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/announcement`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };