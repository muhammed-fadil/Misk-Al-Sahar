import axios from "axios";

const API = "http://localhost:3001";;

export const createOrder = (order) => {
  return axios.post(`${API}/orders`, order);
};

export const getOrders = (userId) => {
  return axios.get(`${API}/orders?userId=${userId}`);
};