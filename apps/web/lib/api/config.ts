import baseAxios from "axios";

export const axios = baseAxios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
}); 