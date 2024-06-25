import axios from 'axios';
import { API_BASE_URL } from '../config';



export const getProblems = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problem`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };