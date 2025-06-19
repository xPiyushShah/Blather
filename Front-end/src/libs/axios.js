import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL: "https://blather.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
