export interface TokenResponse {
  jwt?: string | null;
  jwtRefresh?: string | null;
  user?: {
    profileId?: string | null;
  };
}
