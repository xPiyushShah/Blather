import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL: "https://blather.onrender.com/api",
  withCredentials: true,
});

let abortControllers = {};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === 'post' && config.url) {
      const urlKey = config.url.split('?')[0];
      if (abortControllers[urlKey]) {
        abortControllers[urlKey].abort();
      }
      const controller = new AbortController();
      config.signal = controller.signal;
      abortControllers[urlKey] = controller;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
