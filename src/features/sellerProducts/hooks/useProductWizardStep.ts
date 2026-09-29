"use client";

import { useState } from "react";

export const useProductWizardStep = (stepCount: number) => {
  const [stepIndex, setStepIndex] = useState(0);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, stepCount - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goTo = (index: number) => setStepIndex(Math.min(Math.max(index, 0), stepCount - 1));

  return {
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === stepCount - 1,
    goNext,
    goBack,
    goTo,
  };
};
