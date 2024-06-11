import axios from 'axios';


const API_BASE_URL = 'http://192.168.1.2:8081';
export const getDevices = async (token, userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/device/client/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };