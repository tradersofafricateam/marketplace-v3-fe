"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";
import { useStore } from "@/store/authStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  changePassword,
  createUserAddress,
  deleteUserAddress,
  getNotificationPreferences,
  getUserAddresses,
  updateNotificationPreferences,
  updateUserAddress,
  updateUserStatus,
} from "@/features/dashboard/api";
import type {
  NotificationPreferencesPayload,
  UserAddressPayload,
} from "@/features/dashboard/types";
import { clearAuthToken } from "@/features/auth/helpers/session";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export const useAddresses = () => {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({ queryKey: ["userAddresses", userId], queryFn: getUserAddresses, enabled: !!userId });
};

export const useAddressMutations = () => {
  const t = useTranslations("Settings.addresses");
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: ["userAddresses"] });
  const options = (message: string) => ({
    onSuccess: () => {
      toast.success(message);
      refresh();
    },
    onError: (error: Error) => promiseErrorFunction(error, t("error")),
  });
  const create = useMutation({ mutationFn: createUserAddress, ...options(t("added")) });
  const update = useMutation({ mutationFn: updateUserAddress, ...options(t("updated")) });
  const remove = useMutation({ mutationFn: deleteUserAddress, ...options(t("deleted")) });

  return {
    createAddress: (payload: UserAddressPayload) => create.mutateAsync(payload),
    updateAddress: (id: string, payload: Partial<UserAddressPayload>) =>
      update.mutateAsync({ id, payload }),
    setActiveAddress: (id: string, onSuccess: () => void) =>
      update.mutate({ id, payload: { isDefault: true } }, { onSuccess }),
    deleteAddress: remove.mutate,
    isPending: create.isPending || update.isPending || remove.isPending,
  };
};

export const useChangePassword = () => {
  const t = useTranslations("Settings.password");
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => toast.success(t("success")),
    onError: (error) => promiseErrorFunction(error, t("error")),
  });
};

export const useDeactivateAccount = () => {
  const t = useTranslations("Settings.profile");
  const { routes } = useGetAllRoutes();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: () => {
      toast.success(t("deactivated"));
      clearAuthToken();
      window.location.href = routes.home;
    },
    onError: (error) => promiseErrorFunction(error, t("deactivateError")),
  });
};

export const useNotificationPreferences = () => {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({
    queryKey: ["notificationPreferences", userId],
    queryFn: getNotificationPreferences,
    enabled: !!userId,
  });
};

export const useUpdateNotificationPreferences = () => {
  const t = useTranslations("Settings.notifications");
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: NotificationPreferencesPayload) =>
      updateNotificationPreferences(payload),
    onSuccess: () => {
      toast.success(t("success"));
      client.invalidateQueries({ queryKey: ["notificationPreferences"] });
    },
    onError: (error) => promiseErrorFunction(error, t("error")),
  });
};
