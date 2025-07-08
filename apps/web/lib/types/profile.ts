export interface Profile {
  id: number;
  name: string;
  email: string;
  dob: string | null;
  avatar: string | null;
  walletAddress: string | null;
  createdAt: string;
  updatedAt: string;
}
