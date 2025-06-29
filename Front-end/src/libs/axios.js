import axios from "axios";
import { useNetworkStore } from "../store/useNetworkStore.js";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/api",
  baseURL: "https://blather.onrender.com/api",
  withCredentials: true,
});

// Track ongoing abort controllers by endpoint key
const abortControllers = {};

// Helper to normalize URL (remove ID, query params, etc.)
function getBaseUrlKey(url = "") {
  try {
    const cleanUrl = url.split("?")[0];        // remove query params
    const parts = cleanUrl.split("/").filter(Boolean);

    if (!parts.length) return cleanUrl;

    // Remove last segment if it's a likely dynamic ID (numeric or UUID-like)
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
    // Auth token
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Track data upload size
    if (config.data) {
      const size = JSON.stringify(config.data).length;
      useNetworkStore.getState().setAxiosSent(size);
    }

    // Only apply cancel logic to mutation requests (POST, PUT, PATCH, DELETE)
    const method = config.method?.toLowerCase();
    const cancelableMethods = ["post", "put", "patch", "delete"];

    if (cancelableMethods.includes(method) && config.url) {
      const urlKey = getBaseUrlKey(config.url);

      // Cancel previous request if one exists
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

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      const size = JSON.stringify(response.data).length;
      useNetworkStore.getState().setAxiosReceived(size);
    }
    return response;
  },
  (error) => {
    // Optional: Clean up controller if cancelled
    if (error.config && error.config.url) {
      const urlKey = getBaseUrlKey(error.config.url);
      delete abortControllers[urlKey];
    }

    return Promise.reject(error);
  }
);
