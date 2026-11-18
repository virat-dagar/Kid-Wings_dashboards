import axios from "axios";

// Relative "/api" goes through the Vite proxy, so the auth cookie is sent automatically
const api = axios.create({ baseURL: "/api", withCredentials: true });

export const errorMessage = (err) =>
  err.response?.data?.message || "Something went wrong. Please try again.";

export default api;
