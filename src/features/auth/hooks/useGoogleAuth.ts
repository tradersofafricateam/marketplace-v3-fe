"use client";

import { useMutation } from "@tanstack/react-query";

import { getGoogleAuthUrl } from "../api";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useGoogleAuth = () => {
  const { mutate: continueWithGoogle, isPending: isRedirecting } = useMutation(
    {
      mutationFn: getGoogleAuthUrl,
      onSuccess: (data) => {
        if (data?.url) window.location.href = data.url;
      },
      onError: (error) =>
        promiseErrorFunction(
          error,
          "Couldn't start Google sign up. Please try again.",
        ),
    },
  );

  return { continueWithGoogle, isRedirecting };
};
