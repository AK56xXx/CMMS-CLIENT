import axios from 'axios'; 
import { API_BASE_URL } from '../config';

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


  export const uploadImage = async (image) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/images/upload`,
      image,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }