"use client";

import { type ChangeEvent, type SubmitEvent, useCallback, useState } from "react";

import { SellerUpgradeFormErrors, SellerUpgradeFormState } from "../types";
import { validateSellerUpgradeForm } from "../helpers";

const initialValues: SellerUpgradeFormState = {
  storeName: "",
  companyName: "",
  registrationNumber: "",
  businessType: "",
  yearsOfBusiness: "",
  companyAddress: "",
  pickupAddress: "",
  companyBio: "",
  country: "",
};

export const useSellerUpgradeForm = (
  onValid: (values: SellerUpgradeFormState) => void,
) => {
  const [values, setValues] = useState<SellerUpgradeFormState>(initialValues);
  const [errors, setErrors] = useState<SellerUpgradeFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SellerUpgradeFormState, boolean>>
  >({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const files = "files" in e.target ? e.target.files : null;
    setValues((prev) => ({
      ...prev,
      [name]: type === "file" ? files?.[0] : value,
    }));
  }, []);

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  /** For fields that don't emit a native change event, e.g. the rich-text company bio. */
  const setFieldValue = useCallback(
    <K extends keyof SellerUpgradeFormState>(name: K, value: SellerUpgradeFormState[K]) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    [],
  );

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateSellerUpgradeForm(values);
    setErrors(validationErrors);
    setTouched(Object.fromEntries(Object.keys(values).map((key) => [key, true])));

    if (Object.keys(validationErrors).length === 0) {
      onValid(values);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, reset };
};
