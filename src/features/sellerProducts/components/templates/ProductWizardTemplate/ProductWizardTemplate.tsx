"use client";

import { stepFields } from "../../../helpers/stepValidation";
import { validateProductForm } from "../../../helpers/validateProductForm";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useSellerProduct } from "../../../hooks/useSellerProduct";
import { useProductForm } from "../../../hooks/useProductForm";
import { useProductWizardStep } from "../../../hooks/useProductWizardStep";
import { useCreateProduct } from "../../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../../hooks/useUpdateProduct";
import { mapProductToFormState } from "../../../helpers/mapProductToFormState";
import { getWizardSteps } from "../../../constants/wizardSteps";
import WizardStepper from "../../molecules/WizardStepper/WizardStepper";
import ProductBasicInfoStep from "../../organisms/ProductBasicInfoStep/ProductBasicInfoStep";
import ProductPricingStep from "../../organisms/ProductPricingStep/ProductPricingStep";
import ProductLogisticsStep from "../../organisms/ProductLogisticsStep/ProductLogisticsStep";
import ProductVariantsStep from "../../organisms/ProductVariantsStep/ProductVariantsStep";
import ProductImagesStep from "../../organisms/ProductImagesStep/ProductImagesStep";
import ProductReviewStep from "../../organisms/ProductReviewStep/ProductReviewStep";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";

const ProductWizardTemplate = ({
  mode,
  productId,
}: {
  mode: "create" | "edit";
  productId?: string;
}) => {
  const router = useRouter();
  const { routes } = useGetAllRoutes();
  const existingProduct = useSellerProduct(productId ?? "");

  if (mode === "edit" && existingProduct.isLoadingCurrentData)
    return <DashboardSkeleton />;

  if (mode === "edit" && existingProduct.isError) {
    return (
      <div role="alert" className="mx-auto max-w-lg py-16 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load this product.
        </p>
        <button
          type="button"
          onClick={() => void existingProduct.refetch()}
          className="mt-4 rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <ProductWizardForm
      key={`${mode}:${productId ?? "new"}`}
      mode={mode}
      hasExistingImages={!!existingProduct.data?.images?.length}
      productId={productId}
      initialValues={
        existingProduct.data
          ? mapProductToFormState(existingProduct.data)
          : undefined
      }
      onDone={() => router.push(routes.sellerProducts)}
    />
  );
};

const ProductWizardForm = ({
  mode,
  productId,
  initialValues,
  hasExistingImages,
  onDone,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: ReturnType<typeof mapProductToFormState>;
  hasExistingImages: boolean;
  onDone: () => void;
}) => {
  const {
    currencies,
    isLoading: currenciesLoading,
    isError: currenciesError,
  } = useCurrency();
  const currencyT = useTranslations("CurrencyData");
  const { values, errors, handleChange, setFieldValue, validate } =
    useProductForm(initialValues, hasExistingImages);
  const steps = getWizardSteps(values.productType);
  const { stepIndex, isFirstStep, isLastStep, goBack, goTo } =
    useProductWizardStep(steps.length);

  const { createProduct, isCreating } = useCreateProduct({ onSuccess: onDone });
  const { updateProduct, isUpdating } = useUpdateProduct({
    productId: productId ?? "",
    onSuccess: onDone,
  });
  const isSaving = isCreating || isUpdating;

  const handleSubmit = () => {
    if (!validate()) {
      const invalid = validateProductForm(values, hasExistingImages);
      const index = steps.findIndex((step) =>
        stepFields[step.key]?.some((field) => invalid[field]),
      );
      if (index >= 0) goTo(index);
      toast.error("Please complete the required fields highlighted below.");
      return;
    }
    if (
      currenciesLoading ||
      currenciesError ||
      !currencies.some((item) => item.code === values.currency)
    ) {
      toast.error(
        currencyT(
          currenciesLoading
            ? "loading"
            : currenciesError
              ? "error"
              : "unsupported",
        ),
      );
      return;
    }
    if (mode === "create") createProduct(values);
    else updateProduct(values);
  };

  const currentStepKey = steps[stepIndex].key;

  const navigateToStep = (target: number) => {
    if (isSaving) return;
    if (target <= stepIndex) {
      goTo(target);
      return;
    }
    const invalid = validateProductForm(values, hasExistingImages);
    for (let index = 0; index < target; index++) {
      const fields = stepFields[steps[index].key] ?? [];
      if (fields.some((field) => invalid[field])) {
        validate(fields);
        goTo(index);
        toast.error("Please complete the required fields highlighted below.");
        return;
      }
      if (
        steps[index].key === "basicInfo" &&
        (currenciesLoading ||
          currenciesError ||
          !currencies.some((item) => item.code === values.currency))
      ) {
        goTo(index);
        toast.error(
          currencyT(
            currenciesLoading
              ? "loading"
              : currenciesError
                ? "error"
                : "unsupported",
          ),
        );
        return;
      }
    }
    goTo(target);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-(--brown) px-6 py-8 text-white sm:px-10 sm:py-10">
        <Image
          src="/assets/images/product-wizard-header.png"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(25,15,8,0.9)_0%,rgba(25,15,8,0.72)_50%,rgba(25,15,8,0.25)_100%)]"
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest text-(--orange)">
            {mode === "create" ? "New product" : "Edit product"}
          </p>
          <h1 className="heading-font mt-2 text-2xl font-bold sm:text-3xl">
            {mode === "create"
              ? "Tell buyers about your product"
              : values.productName || "Edit product"}
          </h1>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-5 sm:p-7">
        <WizardStepper
          steps={steps}
          activeIndex={stepIndex}
          onStepClick={navigateToStep}
        />

        <div className="mt-7">
          {currentStepKey === "basicInfo" && (
            <ProductBasicInfoStep
              values={values}
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
          )}
          {currentStepKey === "pricing" && (
            <ProductPricingStep
              values={values}
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
          )}
          {currentStepKey === "variants" && (
            <ProductVariantsStep
              options={values.variantOptions}
              variants={values.variants}
              errors={errors}
              onOptionsChange={(variantOptions) =>
                setFieldValue("variantOptions", variantOptions)
              }
              onVariantsChange={(variants) =>
                setFieldValue("variants", variants)
              }
            />
          )}
          {currentStepKey === "logistics" && (
            <ProductLogisticsStep
              values={values}
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
          )}
          {currentStepKey === "images" && (
            <ProductImagesStep
              values={values}
              errors={errors}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
          )}
          {currentStepKey === "review" && (
            <ProductReviewStep values={values} isEditing={mode === "edit"} />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep || isSaving}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-(--orange) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--orange-dark) disabled:opacity-60"
            >
              {isSaving && <LoaderCircle size={16} className="animate-spin" />}
              {mode === "create" ? "Create product" : "Save changes"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigateToStep(stepIndex + 1)}
              className="flex items-center gap-1.5 rounded-xl bg-(--orange) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--orange-dark)"
            >
              Next <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductWizardTemplate;
