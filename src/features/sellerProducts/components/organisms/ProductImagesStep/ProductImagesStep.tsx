import { useState } from "react";
import { useDeleteProductImage } from "../../../hooks/useDeleteProductImage";
import ConfirmDeleteDialog from "../../molecules/ConfirmDeleteDialog/ConfirmDeleteDialog";
import { Upload } from "lucide-react";
import { useVariantImagePreview } from "../../../hooks/useProductImageUploads";
import { variantImageKey } from "../../../helpers/variantImageKey";
import ProductImageUploader from "../../molecules/ProductImageUploader/ProductImageUploader";
import ProductImageGuide from "../../molecules/ProductImageGuide";
import type { ProductFormErrors, ProductFormHandlers, ProductFormState, ProductVariant } from "../../../types";

function VariantImagePicker({ variant, file, onSelect }: { variant: ProductVariant; file?: File; onSelect: (file: File) => void }) {
  const preview = useVariantImagePreview(file) || variant.image || undefined;
  const name = Object.values(variant.attributes).map((value) => value.toLowerCase()).join(" / ");
  return <div className="space-y-3 rounded-xl border border-border p-4">
    <label className="flex cursor-pointer items-center gap-3">
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => { const selected = event.target.files?.[0]; if (selected) onSelect(selected); event.target.value = ""; }} />
      <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview ? <img src={preview} alt={name} className="size-full object-contain" /> : <Upload size={20} />}
      </span><span className="min-w-0 flex-1 text-sm font-semibold">{name}</span><span className="text-xs font-semibold text-(--orange)">{preview ? "Replace image" : "Add image"}</span>
    </label>
    <p className="text-xs text-muted-foreground">{variant.quantity === 0 ? "Image optional: this variant has zero stock." : "Each variant can have its own photo."} Use a plain background and centre the product.</p>
  </div>;
}

export default function ProductImagesStep({ values, errors, setFieldValue, productId }: { values: ProductFormState; errors: ProductFormErrors; productId?: string } & ProductFormHandlers) {
  const [removeIndex, setRemoveIndex] = useState<number>();
  const remove = useDeleteProductImage();
  const existing = values.existingImages ?? [];
  const selectedPreview = useVariantImagePreview(values.galleryImages[values.primaryImageIndex - existing.length]);
  const preview = selectedPreview || existing[values.primaryImageIndex]?.url;
  const confirmRemove = () => {
    if (removeIndex === undefined || !productId) return;
    remove.mutate({ productId, imageId: existing[removeIndex].id }, { onSuccess: () => {
      setFieldValue("existingImages", existing.filter((_, i) => i !== removeIndex));
      setFieldValue("primaryImageIndex", values.primaryImageIndex === removeIndex ? 0 : values.primaryImageIndex > removeIndex ? values.primaryImageIndex - 1 : values.primaryImageIndex);
      setRemoveIndex(undefined);
    } });
  };
  return <div className="space-y-8">
    <ConfirmDeleteDialog open={removeIndex !== undefined} title="Remove this product image?" description={remove.isError ? "The image could not be removed. Please try again." : "This removes the saved image from your product."} pending={remove.isPending} onClose={() => setRemoveIndex(undefined)} onConfirm={confirmRemove} />
    <ProductImageGuide preview={preview} />
    <div><p className="mb-3 text-sm font-bold">Product gallery</p>
      {!!existing.length && <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{existing.map((image, index) => <div key={image.id || image.url} className="rounded-xl border border-border p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} alt="Existing product photo" className="aspect-4/3 w-full bg-white object-contain" />
        <button type="button" aria-pressed={values.primaryImageIndex === index} onClick={() => setFieldValue("primaryImageIndex", index)} className="mt-2 text-xs font-semibold text-(--orange)">{values.primaryImageIndex === index ? "Main image" : "Set as main image"}</button>
        <button type="button" onClick={() => setRemoveIndex(index)} className="ml-3 text-xs text-destructive">Remove</button>
      </div>)}</div>}
      <ProductImageUploader files={values.galleryImages} primaryIndex={values.primaryImageIndex - existing.length} onFilesChange={(files) => setFieldValue("galleryImages", files)} onPrimaryIndexChange={(index) => setFieldValue("primaryImageIndex", existing.length + index)} error={errors.galleryImages} />
    </div>
    {values.productType === "VARIABLE" && <div><h3 className="mb-3 font-semibold">Variant images</h3><p className="text-body mb-4 text-muted-foreground">Each variant can have its own photo, separate from the product gallery.</p><div className="grid gap-3 sm:grid-cols-2">{values.variants.map((variant) => { const key = variantImageKey(variant.attributes); return <VariantImagePicker key={key} variant={variant} file={values.variantImageFiles[key]} onSelect={(file) => setFieldValue("variantImageFiles", { ...values.variantImageFiles, [key]: file })} />; })}</div></div>}
  </div>;
}
