import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getProducts = () => {
  return axios.get(`${API}/products`);
};

export const getProductById = (id) => {
  return axios.get(`${API}/products/${id}`);
};