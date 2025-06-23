export interface TokenResponse {
  jwt?: string | null;
  jwtRefresh?: string | null;
  user?: {
    profileId?: null | string | number;
  };
}
