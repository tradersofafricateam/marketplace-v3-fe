"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { currentQueryState } from "@/lib/query/currentQueryState";

/** Page data is only exposed after its current request has settled successfully. */
export function useFreshQuery<T>(options: UseQueryOptions<T, Error>) {
  const query = useQuery({
    ...options,
    staleTime: 0,
    refetchOnMount: "always",
    placeholderData: undefined,
    initialData: undefined,
  });
  return { ...query, ...currentQueryState(query) };
}
