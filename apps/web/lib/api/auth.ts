import { TokenResponse } from "../types";
import { axios } from "./api";

interface AuthCallbackParams {
  accessToken: string;
  provider: "google";
}

export const authCallback = async ({
  accessToken,
  provider,
}: AuthCallbackParams) => {
  const res = await axios.get<TokenResponse>(`/auth/${provider}/callback`, {
    params: {
      access_token: accessToken,
    },
  });
  return res.data;
};
