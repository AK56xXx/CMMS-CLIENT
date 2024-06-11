import axios from 'axios';


const API_BASE_URL = 'http://192.168.1.2:8081';

export const addTicket = async (token, ticketData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/ticket/add`,
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    return response.data;
  };

  export const updateTicket = async (token, ticketData) => {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/ticket/update`,
      ticketData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    return response.data;
  };

  // get all tickets by device
  export const getTickets = async (token, deviceId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/ticket/device/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };

  // get all tickets of the client
  export const getTicketsByClient = async (token, clientId) => {
    const response = await axios.get(`${API_BASE_URL}/api/v1/ticket/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };


  export const delTicket = async (token, id) => {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/ticket/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };


