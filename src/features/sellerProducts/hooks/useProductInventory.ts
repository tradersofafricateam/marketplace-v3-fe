"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductInventory, type InventoryPayload } from "../api";
export function useProductInventory(id: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (payload: InventoryPayload) => updateProductInventory(id, payload), onSuccess: () => {
    void client.invalidateQueries({ queryKey: ["sellerProducts"] });
    void client.invalidateQueries({ queryKey: ["sellerProduct", id] });
    void client.invalidateQueries({ queryKey: ["publicProducts"] });
    void client.invalidateQueries({ queryKey: ["publicProduct"] });
  } });
}
