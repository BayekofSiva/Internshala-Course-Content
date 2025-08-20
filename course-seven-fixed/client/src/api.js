import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5656/api",  // 👈 backend port, NOT 5173
  withCredentials: true,
});

export default API;
