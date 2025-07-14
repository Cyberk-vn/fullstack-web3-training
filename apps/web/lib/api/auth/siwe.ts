import { axios } from "../config";

export const verifySiweMessage = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}) => {
  const response = await axios.post(`/auth/siwe`, {
    message,
    signature,
  });

  return response.data;
};
export const logout = async () => {
  const token = localStorage.getItem("access_token");
  const response = await axios.post(
    `/auth/signout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
