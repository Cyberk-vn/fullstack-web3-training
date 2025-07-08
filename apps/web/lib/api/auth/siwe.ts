import { axios } from "../config";

export const verifySiweMessage = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}) => {
  const response = await axios.post(`/auth/siwe/verify-message`, {
    message,
    signature,
  });

  return response.data;
};
