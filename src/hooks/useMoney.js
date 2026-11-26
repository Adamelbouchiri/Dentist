import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyContext } from "../context/CurrencyContext";
import { BASE_CURRENCY, formatCurrency } from "../lib/currency";

/**
 * `money(usd)` → price in the visitor's chosen currency, e.g. "1,500 MAD".
 * Falls back to USD while no rate is available. `base(usd)` always formats in USD (what Stripe charges).
 */
export const useMoney = () => {
  const ctx = useContext(CurrencyContext);
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const selected = ctx?.currency ?? BASE_CURRENCY;
  const rate = ctx?.fx?.rates?.[selected];
  const currency = rate ? selected : BASE_CURRENCY;

  const money = useCallback(
    (usd, opts) => formatCurrency(Number(usd || 0) * (rate || 1), currency, locale, opts),
    [rate, currency, locale]
  );
  const base = useCallback((usd) => formatCurrency(usd, BASE_CURRENCY, locale), [locale]);

  return {
    money,
    base,
    currency,
    converted: currency !== BASE_CURRENCY,
    setCurrency: ctx?.setCurrency ?? (() => {}),
    selected,
    updatedAt: ctx?.fx?.updatedAt ?? null,
  };
};
