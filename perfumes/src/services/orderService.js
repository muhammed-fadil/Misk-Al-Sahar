import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createOrder = (order) => {
  return axios.post(`${API}/orders`, order);
};

export const getOrders = (userId) => {
  return axios.get(`${API}/orders?userId=${userId}`);
};

export const cancelOrder = (orderId) => {
  return axios.patch(`${API}/orders/${orderId}`, {
    status: "Cancelled",
  });
};