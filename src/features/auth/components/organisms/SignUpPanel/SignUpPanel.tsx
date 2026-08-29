"use client";

import { AnimatePresence, motion } from "framer-motion";

import SignUpForm from "@/features/auth/components/organisms/SignUpForm/SignUpForm";
import AuthSuccessPanel from "@/features/auth/components/organisms/AuthSuccessPanel/AuthSuccessPanel";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

const SignUpPanel = () => {
  const {
    submit,
    isSubmitting,
    registeredEmail,
    resendCode,
    isResending,
    reset,
  } = useSignUp();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {registeredEmail ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <AuthSuccessPanel
            email={registeredEmail}
            onResend={resendCode}
            onChangeEmail={reset}
            resending={isResending}
          />
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <SignUpForm onSubmit={submit} isSubmitting={isSubmitting} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpPanel;
