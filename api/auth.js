import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });

  const token = response.data.token;
  await AsyncStorage.setItem('token', token);

  return token;
};

export const logout = async () => {
  try {
     await axios.get(`${API_BASE_URL}/logout`);
    
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export const getDemoData = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/demo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};



