import { TokenResponse } from "../types";
import { axios } from "./config";

export interface AuthCallbackParams {
  accessToken: string;
  provider: string;
}

export const authCallback = async ({
  accessToken,
  provider,
}: AuthCallbackParams) => {
  const response = await axios.get<TokenResponse>(
    `/auth/${provider}/callback`,
    {
      params: {
        access_token: accessToken,
      },
    }
  );
  return response.data;
};
