import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000
});

export const fetchSentiment = (asset, range) =>
  api.get("/sentiment", { params: { asset, range } }).then((res) => res.data);

export const fetchTrend = (asset, range) =>
  api.get("/sentiment/trend", { params: { asset, range } }).then((res) => res.data);

export const fetchCorrelation = (asset, range) =>
  api.get("/correlation", { params: { asset, range } }).then((res) => res.data);

export const fetchAssets = () => api.get("/assets").then((res) => res.data.assets);

export default api;
