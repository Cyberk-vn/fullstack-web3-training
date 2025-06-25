export interface TokenResponse {
  jwt?: string | null;
  jwtRefresh?: string | null;
  user?: {
    profileId?: null | string | number;
  };
}

export interface AuthCallbackParams {
  accessToken: string;
  provider: string;
} 