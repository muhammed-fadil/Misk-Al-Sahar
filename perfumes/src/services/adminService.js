import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Admin
export const getAdmins = () => {
  return axios.get(`${API}/admins`);
};

// Products
export const getAdminProducts = () => {
  return axios.get(`${API}/products`);
};

export const addAdminProduct = (product) => {
  return axios.post(`${API}/products`, product);
};

export const updateAdminProduct = (id, product) => {
  return axios.patch(`${API}/products/${id}`, product);
};

export const deleteAdminProduct = (id) => {
  return axios.delete(`${API}/products/${id}`);
};

// Users
export const getAdminUsers = () => {
  return axios.get(`${API}/users`);
};

// NEW: Block or unblock a user
export const updateAdminUser = (id, updates) => {
  return axios.patch(`${API}/users/${id}`, updates);
};

// Orders
export const getAdminOrders = () => {
  return axios.get(`${API}/orders`);
};

export const updateAdminOrder = (id, status) => {
  return axios.patch(`${API}/orders/${id}`, {
    status,
  });
};