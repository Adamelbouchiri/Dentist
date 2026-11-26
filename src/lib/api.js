import axios from "axios";

export const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

/** True when the API answered 404/405 — i.e. the endpoint isn't implemented yet. */
export const isMissingEndpoint = (error) => [404, 405].includes(error?.response?.status);

/** GET that resolves to `fallback` when the endpoint doesn't exist yet. */
export const getWithFallback = async (url, fallback, config) => {
  try {
    const { data } = await api.get(url, config);
    return data;
  } catch (error) {
    if (isMissingEndpoint(error)) return typeof fallback === "function" ? fallback() : fallback;
    throw error;
  }
};

export const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const clearStoredToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { Accept: "application/json" },
});

// Attach the bearer token on every request
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Extract a human readable message from an axios error. */
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return data?.message || fallback;
};

/** Resolve a user avatar (absolute URL from OAuth or stored file name). */
export const avatarUrl = (avatar) => {
  if (!avatar) return null;
  return avatar.startsWith("http") ? avatar : `${BASE_URL}/storage/images/${avatar}`;
};

/** Format a Date as YYYY-MM-DD in local time (avoids UTC day shifts). */
export const toLocalISODate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
