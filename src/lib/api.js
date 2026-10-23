import axios from "axios";

const normalizeBaseUrl = (value) => {
  const fallback = import.meta.env.PROD
    ? "https://server-5yzz.onrender.com/api"
    : "http://localhost:5000/api";
  const baseUrl = (value?.trim() || fallback).replace(/\/+$/, "");
  const normalized = `${baseUrl.replace(/(?:\/api)+$/i, "")}/api`;

  try {
    const url = new URL(normalized);
    if (!["http:", "https:"].includes(url.protocol)) return fallback;
  } catch {
    return fallback;
  }

  return normalized;
};

const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE
});

export const getApiErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (!error?.response) {
    return "Unable to reach the backend. Check your connection and backend availability; if the browser reports a cross-origin error, verify the backend CORS settings.";
  }

  if (status >= 500) {
    return `${fallback} (HTTP ${status}). Please try again later.`;
  }

  if (backendMessage) return `${backendMessage} (HTTP ${status})`;
  if (status === 400) return `The request was invalid. (HTTP ${status})`;
  if (status === 401 || status === 403) return `Please check your access and try again. (HTTP ${status})`;
  if (status === 404) return `The requested backend route was not found. (HTTP ${status})`;
  if (status) return `${fallback} (HTTP ${status})`;
  return fallback;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
