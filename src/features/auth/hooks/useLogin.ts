"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { safeReturnUrl } from "../helpers/routeAccess";
import { getLoginDestination } from "../helpers/loginDestination";
import { login } from "../api";
import { LoginFormState } from "../types";
import { setAuthToken } from "../helpers/session";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export const useLogin = ({ returnUrl }: { returnUrl?: string } = {}) => {
  const t = useTranslations("Auth.login");
  const router = useRouter();
  const { routes } = useGetAllRoutes();

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: (values: LoginFormState) =>
      login({ email: values.email.trim(), password: values.password }),
    onSuccess: async (data, variables) => {
      if (data.requiresEmailVerification) {
        toast.info(t("verificationRequired"));
        const query = new URLSearchParams({
          token: data.token,
          email: variables.email.trim(),
        });
        const intended = safeReturnUrl(returnUrl);
        if (intended) query.set("returnUrl", intended);
        router.push(`${routes.verifyEmail}?${query.toString()}`);
        return;
      }

      setAuthToken(data.token, variables.rememberMe);
      toast.success(t("success"));

      // A hard navigation here (rather than router.push) is deliberate: it
      // guarantees the auth cookie is already present when the destination
      // page's providers/guards mount fresh, so there is no window left for
      // a stale guard effect to read pre-login auth state and bounce back
      // to /login (mirrors the fix applied to useLogout for the same race).
      window.location.href = await getLoginDestination(returnUrl, routes.dashboard, routes.seller);
    },
    onError: (error) => promiseErrorFunction(error, t("loginError")),
  });

  const submit = (values: LoginFormState) => mutate(values);

  return { submit, isSubmitting };
};
