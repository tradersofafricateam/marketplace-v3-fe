import axios from "axios";

import { readCookie } from "@/lib/helpers/cookie";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = readCookie("tofaToken");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  (err) => {
    throw new Error(err);
  },
);
