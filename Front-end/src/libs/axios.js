import axios from "axios";
import { useNetworkStore } from "../store/useNetworkStore.js";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  // baseURL: "https://blather.onrender.com/api",
  withCredentials: true,
});

const abortControllers = {};

function getBaseUrlKey(url = "") {
  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/").filter(Boolean);

    if (!parts.length) return cleanUrl;

    const lastPart = parts[parts.length - 1];
    if (/^\d+$/.test(lastPart) || /^[a-f0-9-]{8,}$/.test(lastPart)) {
      parts.pop();
    }

    return "/" + parts.join("/");
  } catch (err) {
    return url;
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data) {
      const size = JSON.stringify(config.data).length;
      useNetworkStore.getState().setAxiosSent(size);
    }

    if (config.url) {
      const urlKey = getBaseUrlKey(config.url);

      if (abortControllers[urlKey]) {
        abortControllers[urlKey].abort();
      }

      const controller = new AbortController();
      config.signal = controller.signal;
      abortControllers[urlKey] = controller;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config && response.config.url) {
      const urlKey = getBaseUrlKey(response.config.url);
      delete abortControllers[urlKey];
    }

    if (response.data) {
      const size = JSON.stringify(response.data).length;
      useNetworkStore.getState().setAxiosReceived(size);
    }

    return response;
  },
  (error) => {
    if (error.config && error.config.url) {
      const urlKey = getBaseUrlKey(error.config.url);
      delete abortControllers[urlKey];
    }

    return Promise.reject(error);
  }
);
