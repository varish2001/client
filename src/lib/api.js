import axios from "axios";

const DEFAULT_LOCAL_API_URL = "http://localhost:5000/api";
const DEFAULT_PROD_API_URL = "https://server-5yzz.onrender.com/api";

const getEnvVar = (key) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key] !== undefined) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return undefined;
};

export const isProductionEnv = () => {
  if (typeof import.meta !== "undefined" && import.meta.env?.PROD !== undefined) {
    return Boolean(import.meta.env.PROD);
  }
  if (typeof process !== "undefined" && process.env?.NODE_ENV !== undefined) {
    return process.env.NODE_ENV === "production";
  }
  return false;
};

export const normalizeApiBaseUrl = (value, isProd = isProductionEnv()) => {
  const configured = typeof value === "string" ? value.trim() : "";

  if (configured) {
    // If a relative path was accidentally configured in production, avoid self-routing on Vercel
    if (isProd && configured.startsWith("/")) {
      return DEFAULT_PROD_API_URL;
    }

    const withoutTrailingSlashes = configured.replace(/\/+$/, "");
    const withoutTrailingApi = withoutTrailingSlashes.replace(/\/api$/i, "");
    return `${withoutTrailingApi}/api`;
  }

  return isProd ? DEFAULT_PROD_API_URL : DEFAULT_LOCAL_API_URL;
};

export const API_BASE_URL = normalizeApiBaseUrl(getEnvVar("VITE_API_BASE_URL"));

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getApiErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;

  if (!error?.response) {
    return "Unable to reach the backend. Check the API base URL, backend deployment, and CORS settings.";
  }

  if (backendMessage) return `${backendMessage} (HTTP ${status})`;
  if (status === 400) return `The request was invalid. (HTTP ${status})`;
  if (status === 401 || status === 403) return `Please sign in and try again. (HTTP ${status})`;
  if (status === 404) return `The requested backend route was not found. (HTTP ${status})`;
  if (status === 405) return `Method not allowed on backend endpoint. (HTTP ${status})`;
  if (status >= 500) {
    return `${fallback} (HTTP ${status}). Please try again later.`;
  }
  if (status) return `${fallback} (HTTP ${status})`;
  return fallback;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
