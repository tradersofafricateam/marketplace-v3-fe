"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { getLoginDestination } from "../helpers/loginDestination";
import { googleAuth, updateTerms } from "../api";
import { setAuthToken } from "../helpers/session";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export const useGoogleAuth = ({ returnUrl }: { returnUrl?: string } = {}) => {
  const { routes } = useGetAllRoutes();
  const navigate = async () => {
    window.location.href = await getLoginDestination(returnUrl, routes.dashboard, routes.seller);
  };

  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const { mutate: authenticate, isPending: isAuthenticating } = useMutation({
    mutationFn: googleAuth,
    onSuccess: async (data) => {
      setAuthToken(data.token);

      if (!data.user.termsOfUse) {
        setPendingUserId(data.user.id);
        return;
      }

      await navigate();
    },
    onError: (error) =>
      promiseErrorFunction(
        error,
        "Couldn't continue with Google. Please try again.",
      ),
  });

  const { mutate: acceptTerms, isPending: isAcceptingTerms } = useMutation({
    mutationFn: updateTerms,
    onSuccess: async () => {
      setPendingUserId(null);
      await navigate();
    },
    onError: (error) =>
      promiseErrorFunction(
        error,
        "Couldn't save your acceptance. Please try again.",
      ),
  });

  const handleCredential = (googleToken: string) => authenticate({ googleToken });

  const handleAcceptTerms = () => {
    if (pendingUserId) acceptTerms({ userId: pendingUserId, termsOfUse: true });
  };

  const handleDeclineTerms = () => setPendingUserId(null);

  return {
    handleCredential,
    isAuthenticating,
    showTermsModal: Boolean(pendingUserId),
    handleAcceptTerms,
    handleDeclineTerms,
    isAcceptingTerms,
  };
};
