import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { clearStoredToken, getStoredToken } from "../lib/api";
import { queryKeys } from "../lib/queryClient";
import { useUserQuery } from "../hooks/useAuth";
import { PageLoader } from "../components/ui/Spinner";

const AppContext = createContext();

export function AppProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(getStoredToken);

  const { data: user = null, isPending, error } = useUserQuery(token);
  const loadingUser = !!token && isPending;

  // Stale / revoked token → drop it so the app falls back to guest mode
  useEffect(() => {
    if (error?.response?.status === 401) {
      clearStoredToken();
      setToken(null);
      queryClient.removeQueries({ queryKey: queryKeys.user });
    }
  }, [error, queryClient]);

  const setUser = useCallback(
    (next) => queryClient.setQueryData(queryKeys.user, next),
    [queryClient]
  );

  /** Persist a fresh token and load the matching user. */
  const signIn = useCallback(
    (newToken, remember = true) => {
      clearStoredToken();
      (remember ? localStorage : sessionStorage).setItem("token", newToken);
      queryClient.removeQueries();
      setToken(newToken);
    },
    [queryClient]
  );

  /** Forget the token and every cached query (no data leaks between accounts). */
  const signOut = useCallback(() => {
    clearStoredToken();
    setToken(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({ token, setToken, user, setUser, loadingUser, signIn, signOut }),
    [token, user, setUser, loadingUser, signIn, signOut]
  );

  if (loadingUser) return <PageLoader />;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
