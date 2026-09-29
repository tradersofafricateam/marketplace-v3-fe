import { Star, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useProductImageUploads } from "../../../hooks/useProductImageUploads";

const ProductImageUploader = ({
  files,
  primaryIndex,
  onFilesChange,
  onPrimaryIndexChange,
  disabled,
  error,
}: {
  files: File[];
  primaryIndex: number;
  onFilesChange: (files: File[]) => void;
  onPrimaryIndexChange: (index: number) => void;
  disabled?: boolean;
  error?: string;
}) => {
  const { previews, addFiles, removeFile, setPrimaryIndex } = useProductImageUploads({
    files,
    primaryIndex,
    onChange: onFilesChange,
    onPrimaryIndexChange,
  });

  return (
    <div className="flex flex-col gap-3">
      <label
        className={cn(
          "group relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-(--orange)/30 bg-background px-4 py-6 text-center transition hover:border-(--orange) hover:bg-(--orange)/5",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(e) => addFiles(e.target.files)}
          className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        />
        <UploadCloud size={28} className="text-(--orange)" strokeWidth={1.5} />
        <span className="text-sm font-semibold text-(--orange)">Add product photos</span>
        <span className="text-xs text-muted-foreground">PNG or JPG, multiple allowed</span>
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {previews.map((preview, index) => (
            <div key={preview} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              {/* Object-URL preview of a not-yet-uploaded file. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => setPrimaryIndex(index)}
                aria-label="Set as primary image"
                aria-pressed={index === primaryIndex}
                className={cn(
                  "absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full transition-colors",
                  index === primaryIndex ? "bg-(--orange) text-white" : "bg-black/40 text-white/80 hover:bg-black/60",
                )}
              >
                <Star size={12} fill={index === primaryIndex ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => removeFile(index)}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/40 text-white/80 transition-colors hover:bg-black/60"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default ProductImageUploader;
