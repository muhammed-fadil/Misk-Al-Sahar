import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getAdmins = () => {
  return axios.get(`${API}/admins`);
};

export const getAdminProducts = () => {
  return axios.get(`${API}/products`);
};

export const getAdminUsers = () => {
  return axios.get(`${API}/users`);
};

export const getAdminOrders = () => {
  return axios.get(`${API}/orders`);
};
export const updateAdminOrder = (id, status) => {
  return axios.patch(`${API}/orders/${id}`, {
    status,
  });
};

export const addAdminProduct = (product) => {
  return axios.post(`${API}/products`, product);
};

export const updateAdminProduct = (id, product) => {
  return axios.put(`${API}/products/${id}`, product);
};

export const deleteAdminProduct = (id) => {
  return axios.delete(`${API}/products/${id}`);
};