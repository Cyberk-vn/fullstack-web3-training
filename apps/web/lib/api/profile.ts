import { axios } from "./config";

export const getMyProfile = async () => {
  const { data } = await axios.get("/profile/me");
  return data;
};
