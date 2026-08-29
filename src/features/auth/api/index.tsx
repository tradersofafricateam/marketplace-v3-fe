import { axiosInstance } from "@/lib/axiosInstance";
import {
  ResendOtpPayload,
  SignUpPayload,
  SignUpResponse,
  VerifyEmailPayload,
} from "../types";

export const signUp = async (payload: SignUpPayload) => {
  try {
    const url = "/auth/signup";
    const { data } = await axiosInstance.post<{ data: SignUpResponse }>(
      url,
      payload,
    );
    return data?.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async ({ email }: ResendOtpPayload) => {
  try {
    const url = "/auth/resend-otp";
    const { data } = await axiosInstance.post(url, { email });
    return data?.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async ({ email, otp }: VerifyEmailPayload) => {
  try {
    const url = "/auth/verify-email";
    const { data } = await axiosInstance.post(url, { email, otp });
    return data?.data;
  } catch (error) {
    throw error;
  }
};

export const getGoogleAuthUrl = async () => {
  try {
    const url = "/auth/google";
    const { data } = await axiosInstance.post<{ url: string }>(url);
    return data;
  } catch (error) {
    throw error;
  }
};
