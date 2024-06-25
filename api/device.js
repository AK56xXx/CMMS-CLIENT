import axios from 'axios';
import { API_BASE_URL } from '../config';


export const getDevices = async (token, userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/device/client/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };