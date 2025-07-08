import { Address } from "viem";
import { axios } from "..";
import { AxiosResponse } from "axios";

export const getNonce = async (
  address: Address
): Promise<AxiosResponse<{ nonce: string }>> => {
  const response = await axios.get(`/auth/siwe/nonce?address=${address}`);
  return response;
};
