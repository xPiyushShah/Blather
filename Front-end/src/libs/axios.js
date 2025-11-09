import axios from "axios";
import { useNetworkStore } from "../store/useNetworkStore.js";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL: "https://blather.onrender.com/api",
  withCredentials: true,
});

// Track ongoing abort controllers by endpoint key
const abortControllers = {};

// Normalize URL to base path (e.g., strip IDs, query params)
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

// ====== REQUEST INTERCEPTOR ======
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach auth token
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Track data upload size
    if (config.data) {
      const size = JSON.stringify(config.data).length;
      useNetworkStore.getState().setAxiosSent(size);
    }

    // Apply cancellation for all requests
    if (config.url) {
      const urlKey = getBaseUrlKey(config.url);

      // Cancel previous request to the same endpoint
      if (abortControllers[urlKey]) {
        abortControllers[urlKey].abort();
      }

      // Register new controller
      const controller = new AbortController();
      config.signal = controller.signal;
      abortControllers[urlKey] = controller;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ====== RESPONSE INTERCEPTOR ======
axiosInstance.interceptors.response.use(
  (response) => {
    // Cleanup controller after success
    if (response.config && response.config.url) {
      const urlKey = getBaseUrlKey(response.config.url);
      delete abortControllers[urlKey];
    }

    // Track received data size
    if (response.data) {
      const size = JSON.stringify(response.data).length;
      useNetworkStore.getState().setAxiosReceived(size);
    }

    return response;
  },
  (error) => {
    // Cleanup controller on error (including cancel)
    if (error.config && error.config.url) {
      const urlKey = getBaseUrlKey(error.config.url);
      delete abortControllers[urlKey];
    }

    return Promise.reject(error);
  }
);
