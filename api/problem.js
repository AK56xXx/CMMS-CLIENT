import axios from 'axios';


const API_BASE_URL = 'http://192.168.1.2:8081';
export const getProblems = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/problem`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };