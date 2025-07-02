import baseAxios from "axios";
import { useUserStore } from "../stores";

export const axios = baseAxios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  async config => {
    const token = useUserStore.getState().jwt;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
