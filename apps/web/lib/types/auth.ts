import { Profile } from "./profile";

export interface TokenResponse {
  jwt: string;
  jwtRefresh: string;
  user: {
    profileId?: null | string | number;
  };
  profile?: Profile | null;
}

export interface AuthCallbackParams {
  accessToken: string;
  provider: string;
}
