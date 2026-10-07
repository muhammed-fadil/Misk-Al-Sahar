import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getProducts = () => {
  return axios.get(`${API}/products`);
};

export const getProductById = (id) => {
  return axios.get(`${API}/products/${id}`);
};

export const updateProductStock = (id, stock) => {
  return axios.patch(`${API}/products/${id}`, {
    stock,
  });
};