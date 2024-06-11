import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { API_BASE_URL } from '../api/config.js';


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


  export const editMaintenance = async (token, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/maintenance/update`,
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


  export const getAvailableTechnician = async (token, date) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/maintenance/available-technicians/${date}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };

  export const getApprovedMaintenances = async (token, idUser) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/maintenance/approved/client/${idUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };


  export const createMaintenance = async (token, updateData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/maintenance/add`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    return response.data;
  };


  export const getMaintenanceById = async (token, id) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/maintenance/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };






