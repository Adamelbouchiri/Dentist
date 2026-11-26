import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CurrencyContext } from "./CurrencyContext";
import { fetchRates, readCachedRates, readCurrencyPref, saveCurrencyPref, todayKey } from "../lib/currency";

/**
 * Exchange rates are fetched at most once per calendar day: the query key carries today's date,
 * so the first visit of a new day (patient or admin) refetches, and every other visit reuses the cache.
 */
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(readCurrencyPref);
  const day = todayKey();

  const { data: fx } = useQuery({
    queryKey: ["exchangeRates", day],
    queryFn: fetchRates,
    initialData: () => {
      const cached = readCachedRates();
      return cached?.day === day ? cached : undefined;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    refetchOnWindowFocus: false,
    // Older day's rates stay usable while today's are loading.
    placeholderData: readCachedRates,
  });

  const setCurrency = useCallback((code) => {
    setCurrencyState(code);
    saveCurrencyPref(code);
  }, []);

  const value = useMemo(() => ({ currency, setCurrency, fx: fx ?? null }), [currency, setCurrency, fx]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
