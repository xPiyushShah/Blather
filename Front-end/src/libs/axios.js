import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://blather.onrender.com/api",
  withCredentials: true, 
});
