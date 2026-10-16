import axios from "axios";

const normalizeBaseUrl = (value) => {
  if (!value) return "/api";
  return value.replace(/\/+$/, "");
};

const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
