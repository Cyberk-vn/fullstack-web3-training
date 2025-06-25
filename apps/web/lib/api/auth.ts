import { axios } from "@/lib/api";
import { TokenResponse } from "@/lib/types";
export const authCallback = async (accessToken: string) => {
  const response = await axios.get<TokenResponse>("/auth/google/callback", {
    params: {
      access_token: accessToken,
    },
  });
  return response.data;
};
