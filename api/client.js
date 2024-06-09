import axios from 'axios'; 
//import { API_BASE_URL } from '../config';

const API_BASE_URL = 'http://192.168.1.2:8081';
export const editUser = async (token, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/users/update`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  };


  export const getUser = async (token, id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  };