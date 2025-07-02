export interface TokenResponse {
  jwt: string;
  jwtRefresh: string;
  user: {
    id: number;
    role: string;
    name: string;
    blocked: boolean;
    confirmed: boolean;
    username: string;
    provider: string;
    profileId: number;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    dob: string | null;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
    id: number;
    name: string;
    email: string;
    walletAddress: string | null;
  };
}
