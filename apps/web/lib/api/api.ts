import mainaxios from "axios";

export const axios = mainaxios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
