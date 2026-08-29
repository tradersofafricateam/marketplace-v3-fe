"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resendOtp, signUp } from "../api";
import { SignUpFormState } from "../types";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";

export const useSignUp = () => {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationFn: signUp,
    onSuccess: (_data, variables) => {
      toast.success("Account created!", {
        description: "We've sent a verification code to your email.",
      });
      setRegisteredEmail(variables.email);
    },
    onError: (error) =>
      promiseErrorFunction(error, "We couldn't create your account. Please try again."),
  });

  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => toast.success("A new code is on its way."),
    onError: (error) =>
      promiseErrorFunction(error, "We couldn't resend the code. Please try again."),
  });

  const submit = (values: SignUpFormState) => {
    mutate({
      email: values.email,
      password: values.password,
      termsOfUse: values.termsOfUse,
      ...(values.referralCode.trim()
        ? { referralCode: values.referralCode.trim() }
        : {}),
    });
  };

  const resendCode = () => {
    if (registeredEmail) resend({ email: registeredEmail });
  };

  const reset = () => setRegisteredEmail(null);

  return {
    submit,
    isSubmitting,
    registeredEmail,
    resendCode,
    isResending,
    reset,
  };
};
