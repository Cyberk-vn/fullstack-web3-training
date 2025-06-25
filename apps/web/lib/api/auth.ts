import { TokenResponse, AuthCallbackParams } from "../types";
import { axios } from "./config";

export const authCallback = async ({
  accessToken,
  provider,
}: AuthCallbackParams): Promise<TokenResponse> => {
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
