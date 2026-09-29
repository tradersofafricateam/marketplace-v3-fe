"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "../api";
import { AUTH_COOKIE_CHANGE_EVENT, readCookie } from "@/lib/helpers/cookie";
import { useStore } from "@/store/authStore";

export const useGetCurrentUser = () => {
  const queryClient = useQueryClient();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const clearCurrentUser = useStore((state) => state.clearCurrentUser);
  const setIsAuthInitialized = useStore(
    (state) => state.setIsAuthInitialized,
  );

  // Lazily read the cookie on the client's first render, so `token` is
  // already correct by the time the effect below runs - no artificial
  // "no token" flash before the real value is known.
  const [session, setSession] = useState(() => ({
    token: readCookie("tofaToken"),
    revision: 0,
  }));
  const token = session.token;

  useEffect(() => {
    const handleChange = () => {
      const nextToken = readCookie("tofaToken");
      if (nextToken === token) return;
      clearCurrentUser();
      setIsAuthInitialized(false);
      // Cancel old requests and discard private cached data when accounts change.
      queryClient.removeQueries();
      setSession((current) => ({ token: nextToken, revision: current.revision + 1 }));
    };
    window.addEventListener(AUTH_COOKIE_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(AUTH_COOKIE_CHANGE_EVENT, handleChange);
  }, [token, clearCurrentUser, setIsAuthInitialized, queryClient]);

  const query = useQuery({
    queryKey: ["currentUser", session.revision],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!token) {
      clearCurrentUser();
      setIsAuthInitialized(true);
      return;
    }

    if (query.isFetching) {
      setIsAuthInitialized(false);
      return;
    }

    if (query.isSuccess) {
      setCurrentUser(query.data);
      return;
    }

    if (query.isError) {
      clearCurrentUser();
      setIsAuthInitialized(true);
      return;
    }

    // A token just appeared (e.g. right after login) and its `/users/me`
    // check hasn't resolved yet. Without this, `isAuthInitialized` would
    // stay stuck at whatever it was for the *previous* token state (e.g.
    // `true` from being logged out a moment ago), and a route guard
    // reading `isAuthInitialized && !currentUser` would wrongly treat
    // that as "definitely not logged in" and redirect away before the
    // real answer comes back.
    setIsAuthInitialized(false);
  }, [
    token,
    clearCurrentUser,
    query.data,
    query.isError,
    query.isFetching,
    query.isSuccess,
    setCurrentUser,
    setIsAuthInitialized,
  ]);

  return query;
};
