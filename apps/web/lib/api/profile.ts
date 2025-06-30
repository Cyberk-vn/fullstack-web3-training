import { axios } from "./config";
import { Profile } from "../types/profile";

export const getProfile = async (): Promise<Profile> => {
  const response = await axios.get("/profile/me");
  return response.data;
};