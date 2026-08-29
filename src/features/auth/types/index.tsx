export type SignUpPayload = {
  email: string;
  password: string;
  referralCode?: string;
  termsOfUse: boolean;
};

export type SignUpResponse = {
  id: string;
  email: string;
  status: "PENDING" | "ACTIVE";
};

export type ResendOtpPayload = {
  email: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type SignUpFormState = {
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  termsOfUse: boolean;
};

export type SignUpFormErrors = Partial<
  Record<keyof SignUpFormState, string>
>;
