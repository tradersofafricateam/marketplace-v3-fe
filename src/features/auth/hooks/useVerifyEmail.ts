"use client";

import { type SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resendOtp, verifyEmail } from "../api";
import { isEmailValid } from "../helpers";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const RESEND_DELAY_SECONDS = 60;

export const useVerifyEmail = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const t = useTranslations("Auth.verifyEmail");
  const router = useRouter();
  const { routes } = useGetAllRoutes();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string>();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const { mutate: verify, isPending: isVerifying } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success(t("success"));
      router.push(routes.login);
    },
    onError: (error) => promiseErrorFunction(error, t("verifyError")),
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      setSecondsLeft(RESEND_DELAY_SECONDS);
      toast.success(t("resendSuccess"));
    },
    onError: (error) => promiseErrorFunction(error, t("resendError")),
  });

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setOtpError(undefined);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error(t("missingToken"));
      return;
    }

    if (otp.length !== 6) {
      setOtpError(t("invalidOtp"));
      return;
    }

    verify({ token, otp });
  };

  const handleResend = () => {
    if (!isEmailValid(email)) {
      toast.error(t("invalidEmail"));
      return;
    }
    resend({ email });
  };

  const timer = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return {
    otp,
    otpError,
    handleOtpChange,
    handleSubmit,
    handleResend,
    isVerifying,
    isResending,
    canResend: secondsLeft <= 0,
    timer,
  };
};
