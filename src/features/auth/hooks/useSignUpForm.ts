"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { SignUpFormErrors, SignUpFormState } from "../types";
import { validateSignUpForm } from "../helpers";

const initialValues: SignUpFormState = {
  email: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
  termsOfUse: false,
};

export const useSignUpForm = (onValid: (values: SignUpFormState) => void) => {
  const [values, setValues] = useState<SignUpFormState>(initialValues);
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpFormState, boolean>>
  >({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const setTermsOfUse = (checked: boolean) => {
    setValues((prev) => ({ ...prev, termsOfUse: checked }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateSignUpForm(values);
    setErrors(validationErrors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      termsOfUse: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      onValid(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setTermsOfUse,
    handleSubmit,
  };
};
