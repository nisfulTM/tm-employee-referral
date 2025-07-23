import axios from "axios";
import { getAccessToken } from "@/utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://129.159.224.253/:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
