import baseAxios from "axios";
import { useUserStore } from "@/lib/stores/user.store";

export const axios = baseAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor to automatically include JWT token
axios.interceptors.request.use(
  config => {
    if (typeof window !== "undefined") {
      const jwt = useUserStore.getState().jwt;
      if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
