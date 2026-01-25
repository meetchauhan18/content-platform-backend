// libs import
import axios from "axios";

// local imports
import { setupRequestInterceptor } from "./interceptors/request.interceptor.js";
import { setupResponseInterceptor } from "./interceptors/response.interceptor.js";
import { env } from "@/core/config/env.js";

const axiosClient = axios.create({
  baseURL: env?.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

setupRequestInterceptor(axiosClient);
setupResponseInterceptor(axiosClient);

export default axiosClient;
