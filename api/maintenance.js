import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.2:8081';

export const getAutoNotification = async (token, userId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/maintenance/eos-notif/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };

  export const addAutoMaintenance = async (token, userId) => {
    const response = await axios.post(`${API_BASE_URL}/api/v1/maintenance/auto-add/${userId}`,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  };




