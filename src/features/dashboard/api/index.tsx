import { axiosInstance } from "@/lib/axiosInstance";
import { SellerUpgradePayload } from "../types";

export const submitSellerUpgrade = async (payload: SellerUpgradePayload) => {
  try {
    const url = "/users/seller-upgrade";
    const { data } = await axiosInstance.post(url, payload);
    return data?.data ?? data;
  } catch (error) {
    throw error;
  }
};
