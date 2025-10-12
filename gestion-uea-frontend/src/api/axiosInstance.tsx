import axios from "axios";

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // ton backend
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default axiosInstance;
