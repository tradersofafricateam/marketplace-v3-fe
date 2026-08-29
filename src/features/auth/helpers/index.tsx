import { SignUpFormErrors, SignUpFormState } from "../types";

export const passwordRules = [
  {
    key: "length",
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    key: "upper",
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: "lower",
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: "number",
    label: "One number",
    test: (value: string) => /\d/.test(value),
  },
] as const;

export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordValid = (password: string) =>
  passwordRules.every((rule) => rule.test(password));

export const validateSignUpForm = (
  values: SignUpFormState,
): SignUpFormErrors => {
  const errors: SignUpFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email address is required";
  } else if (!isEmailValid(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (!isPasswordValid(values.password)) {
    errors.password = "Password doesn't meet the requirements below";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!values.termsOfUse) {
    errors.termsOfUse = "You must accept the Terms of Use to continue";
  }

  return errors;
};
