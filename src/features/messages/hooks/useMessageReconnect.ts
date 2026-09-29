"use client";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/authStore";
import { messageKeys } from "./useMessageQueries";

/** Reconcile REST state on network recovery; no idle polling or invented socket transport. */
export function useMessageReconnect() {
  const client = useQueryClient();
  const userId = useStore((state) => state.currentUser?.id);
  useEffect(() => {
    if (!userId) return;
    const refresh = () => { void client.invalidateQueries({ queryKey: messageKeys.all(userId) }); };
    window.addEventListener("online", refresh);
    return () => window.removeEventListener("online", refresh);
  }, [client, userId]);
}
