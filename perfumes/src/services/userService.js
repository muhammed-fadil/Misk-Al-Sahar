import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const registerUser = (user) => {
  return axios.post(`${API}/users`, user);
};

export const getUsers = () => {
  return axios.get(`${API}/users`);
};