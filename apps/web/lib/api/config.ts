import baseAxios from "axios";

export const axios = baseAxios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use(
  async config => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
