import { axios } from "./config";

export const getMyProfile = async () => {
  const response = await axios.get("/profile/me");
  return response.data;
};
