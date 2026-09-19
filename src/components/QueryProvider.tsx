"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        retry: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
