"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductImage } from "../api";
export function useDeleteProductImage() {
  const client = useQueryClient();
  return useMutation({ mutationFn: deleteProductImage, onSuccess: (_, { productId }) => {
    // Keep the mounted editor and its unsaved fields; fetch fresh details on next mount.
    void client.invalidateQueries({ queryKey: ["sellerProduct", productId], refetchType: "none" });
    void client.invalidateQueries({ queryKey: ["sellerProducts"] });
  } });
}
