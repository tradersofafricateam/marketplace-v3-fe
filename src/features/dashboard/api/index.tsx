import { axiosInstance } from "@/lib/axiosInstance";
import type { AuthUser } from "@/features/auth/types";
import {
  BuyerAnalyticsDateRange,
  BuyerAnalyticsOverview,
  ChangePasswordPayload,
  NotificationPreference,
  NotificationPreferencesPayload,
  SellerUpgradePayload,
  SellerVerificationStatus,
  UpdateProfilePayload,
  UpdateUserStatusPayload,
  UserAddress,
  UserAddressPayload,
} from "../types";

export const submitSellerUpgrade = async (payload: SellerUpgradePayload) => {
  try {
    const url = "/users/upgrade-to-seller";
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== "") formData.append(key, value);
    });
    const { data } = await axiosInstance.post(url, formData, {
      headers: { "Content-Type": undefined },
    });
    return data?.data ?? data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  try {
    const url = "/users/profile";
    const { data } = await axiosInstance.patch<AuthUser | { data: AuthUser }>(
      url,
      payload,
    );
    return "data" in data ? data.data : data;
  } catch (error) {
    throw error;
  }
};

export const getBuyerAnalyticsOverview = async (
  params: BuyerAnalyticsDateRange,
) => {
  const { data } = await axiosInstance.get<{
    success: boolean;
    data: BuyerAnalyticsOverview;
  }>("/buyer/analytics/overview", { params });

  return data.data;
};

function unwrapData<T>(response: T | { data: T }): T {
  return typeof response === "object" && response !== null && "data" in response
    ? response.data
    : response;
}

const extractArray = <T,>(response: unknown, collectionKeys: string[]): T[] => {
  let current = response;

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current as T[];
    if (typeof current !== "object" || current === null) break;

    const record = current as Record<string, unknown>;
    const collectionKey = collectionKeys.find((key) => key in record);
    if (collectionKey) {
      current = record[collectionKey];
      continue;
    }
    if ("data" in record) {
      current = record.data;
      continue;
    }
    break;
  }

  throw new Error("The server returned an invalid collection response.");
};

export const getUserAddresses = async () => {
  const { data } = await axiosInstance.get<unknown>("/users/addresses");
  return extractArray<UserAddress>(data, ["addresses"]);
};

export const createUserAddress = async (payload: UserAddressPayload) => {
  const { data } = await axiosInstance.post<
    UserAddress | { data: UserAddress }
  >("/users/addresses", payload);
  return unwrapData(data);
};

export const updateUserAddress = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<UserAddressPayload>;
}) => {
  const { data } = await axiosInstance.patch<
    UserAddress | { data: UserAddress }
  >(`/users/addresses/${id}`, payload);
  return unwrapData(data);
};

export const deleteUserAddress = async (id: string) => {
  const { data } = await axiosInstance.delete(`/users/addresses/${id}`);
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await axiosInstance.patch("/auth/change-password", payload);
  return data;
};

export const updateUserStatus = async (payload: UpdateUserStatusPayload) => {
  const { data } = await axiosInstance.patch(
    "/auth/update-user-status",
    payload,
  );
  return data;
};

export const getNotificationPreferences = async () => {
  const { data } = await axiosInstance.get<unknown>(
    "/notifications/preferences",
  );
  return extractArray<NotificationPreference>(data, ["preferences"]);
};

export const updateNotificationPreferences = async (
  payload: NotificationPreferencesPayload,
) => {
  const { data } = await axiosInstance.patch(
    "/notifications/preferences",
    payload,
  );
  return data;
};

export const getSellerVerificationStatus = async () => {
  const { data } = await axiosInstance.get<
    SellerVerificationStatus | { data: SellerVerificationStatus }
  >("/users/me/verification-status");
  return unwrapData(data);
};
