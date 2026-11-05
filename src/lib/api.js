import axios from "axios";

const normalizeBaseUrl = (value) => {
  const configured = value?.trim();
  if (!configured) return "/api";

  const baseUrl = configured.replace(/\/+$/, "");
  if (baseUrl.startsWith("/")) {
    return `${baseUrl.replace(/(?:\/api)+$/i, "")}/api`;
  }

  return `${baseUrl.replace(/\/api$/i, "")}/api`;
};

const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE
});

export const getApiErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (!error?.response) {
    return "Unable to reach the backend. Check your connection and try again.";
  }

  if (status >= 500) {
    return `${fallback} (HTTP ${status}). Please try again later.`;
  }

  if (backendMessage) return `${backendMessage} (HTTP ${status})`;
  if (status === 400) return `The request was invalid. (HTTP ${status})`;
  if (status === 401 || status === 403) return `Please sign in and try again. (HTTP ${status})`;
  if (status === 404) return `The requested backend route was not found. (HTTP ${status})`;
  if (status) return `${fallback} (HTTP ${status})`;
  return fallback;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
