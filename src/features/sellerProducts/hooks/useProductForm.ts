"use client";

import { errorsForFields } from "../helpers/stepValidation";

import { type ChangeEvent, useCallback, useState } from "react";

import { validateProductForm } from "../helpers/validateProductForm";
import type { ProductFormErrors, ProductFormState } from "../types";

const emptyValues: ProductFormState = {
  productName: "",
  productDescription: "",
  categoryIds: [],
  countryOfOrigin: "",
  currency: "",
  productType: "SIMPLE",
  price: "",
  discount: "",
  quantity: "",
  barcode: "",
  supplyCapacity: "",
  unitForSupplyCapacity: "",
  minOrdersAllowed: "",
  unitForMinOrder: "",
  minDuration: "",
  maxDuration: "",
  durationUnit: "days",
  variantOptions: [],
  variants: [],
  galleryImages: [],
  primaryImageIndex: 0,
  variantImagesByColor: {},
};

export const useProductForm = (initialValues: ProductFormState = emptyValues, hasExistingImages = false) => {
  const [values, setValues] = useState<ProductFormState>(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldValue = useCallback(
    <K extends keyof ProductFormState>(name: K, value: ProductFormState[K]) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const validate = useCallback((fields?: (keyof ProductFormState)[]) => {
    const validationErrors = errorsForFields(validateProductForm(values, hasExistingImages), fields);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, hasExistingImages]);

  return { values, errors, handleChange, setFieldValue, validate };
};
