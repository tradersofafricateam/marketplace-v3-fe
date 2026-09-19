"use client";

import { useEffect, useMemo } from "react";

/** Holds the gallery File objects for the wizard's Images step and their object-URL previews. */
export const useProductImageUploads = ({
  files,
  primaryIndex,
  onChange,
  onPrimaryIndexChange,
}: {
  files: File[];
  primaryIndex: number;
  onChange: (files: File[]) => void;
  onPrimaryIndexChange: (index: number) => void;
}) => {
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    onChange([...files, ...Array.from(newFiles)]);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
    if (index === primaryIndex) onPrimaryIndexChange(0);
    else if (index < primaryIndex) onPrimaryIndexChange(primaryIndex - 1);
  };

  return { previews, addFiles, removeFile, setPrimaryIndex: onPrimaryIndexChange };
};

export const useVariantImagePreview = (file: File | undefined) => {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  return preview;
};
