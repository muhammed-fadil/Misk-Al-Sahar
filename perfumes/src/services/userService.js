import axios from "axios";

const API = "http://localhost:3001";

export const registerUser = (user) => {
  return axios.post(`${API}/users`, user);
};

export const getUsers = () => {
  return axios.get(`${API}/users`);
};