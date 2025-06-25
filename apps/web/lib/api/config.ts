import baseAxios from "axios";

export const axios = baseAxios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
