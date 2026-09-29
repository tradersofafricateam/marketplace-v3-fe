import { Upload } from "lucide-react";

import { useVariantImagePreview } from "../../../hooks/useProductImageUploads";
import { getRequiredColors } from "../../../helpers/variantCombinations";
import ProductImageUploader from "../../molecules/ProductImageUploader/ProductImageUploader";
import type { ProductFormErrors, ProductFormHandlers, ProductFormState } from "../../../types";

const ColorImagePicker = ({
  color,
  file,
  onSelect,
}: {
  color: string;
  file: File | undefined;
  onSelect: (file: File) => void;
}) => {
  const preview = useVariantImagePreview(file);

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 hover:border-(--orange)/40">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview ? <img src={preview} alt="" className="size-full object-cover" /> : <Upload size={16} />}
      </span>
      <span className="flex-1 text-sm font-medium">{color}</span>
      <span className="text-xs font-semibold text-(--orange)">{file ? "Change" : "Add image"}</span>
    </label>
  );
};

const ProductImagesStep = ({
  values,
  errors,
  setFieldValue,
}: {
  values: ProductFormState;
  errors: ProductFormErrors;
} & ProductFormHandlers) => {
  const requiredColors = values.productType === "VARIABLE" ? getRequiredColors(values.variantOptions) : [];

  return (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-bold">Product gallery</p>
        <ProductImageUploader
          files={values.galleryImages}
          primaryIndex={values.primaryImageIndex}
          onFilesChange={(files) => setFieldValue("galleryImages", files)}
          onPrimaryIndexChange={(index) => setFieldValue("primaryImageIndex", index)}
          error={errors.galleryImages}
        />
      </div>

      {requiredColors.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-bold">Color images</p>
          <p className="mb-3 text-xs text-muted-foreground">One image per color - shared across every variant with that color.</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {requiredColors.map((color) => (
              <ColorImagePicker
                key={color}
                color={color}
                file={values.variantImagesByColor[color]}
                onSelect={(file) =>
                  setFieldValue("variantImagesByColor", { ...values.variantImagesByColor, [color]: file })
                }
              />
            ))}
          </div>
          {errors.variantImagesByColor && (
            <p className="mt-2 text-xs font-medium text-destructive">{errors.variantImagesByColor}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImagesStep;
