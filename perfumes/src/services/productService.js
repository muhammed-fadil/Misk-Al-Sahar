import axios from "axios";

const API = "http://localhost:3001";

export const getProducts = () => {
  return axios.get(`${API}/products`);
};

export const getProductById = (id) => {
  return axios.get(`${API}/products/${id}`);
};




