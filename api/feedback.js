import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.2:8081';
export const addFeedback = async (token, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/feedback/add`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    return response.data;
  };



  export const updateFeedback = async (token, feedbackData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/feedback/update`,
      feedbackData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    return response.data;
  };


  export const getFeedback = async (token, id) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/feedback/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  };


  export const getFeedbackByMaintenanceId = async (token, maintenanceId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/feedback/maintenance/${maintenanceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
