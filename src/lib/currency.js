import { toLocalISODate } from "./api";

/** Prices are stored (and charged by Stripe) in this currency; others are display conversions. */
export const BASE_CURRENCY = "USD";

export const CURRENCIES = [
  { code: "USD", flag: "🇺🇸" },
  { code: "MAD", flag: "🇲🇦" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "SAR", flag: "🇸🇦" },
  { code: "AED", flag: "🇦🇪" },
];

// Free, key-less, CORS-enabled, refreshed once a day. Plain fetch (not the API client) so no auth token leaves the app.
const RATES_URL = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;
const RATES_KEY = "fx-rates";
const PREF_KEY = "currency";

export const todayKey = () => toLocalISODate(new Date());

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private mode / storage blocked: keep working in memory */
    }
  },
};

/** `{ day, rates, updatedAt }` from the last successful fetch, or null. */
export const readCachedRates = () => {
  try {
    const cached = JSON.parse(storage.get(RATES_KEY));
    return cached?.rates ? cached : null;
  } catch {
    return null;
  }
};

/** Today's rates for the supported currencies. Falls back to the last cached day if the network fails. */
export const fetchRates = async () => {
  try {
    const res = await fetch(RATES_URL);
    if (!res.ok) throw new Error(`Rates request failed (${res.status})`);
    const body = await res.json();
    if (body.result !== "success") throw new Error("Rates unavailable");

    const rates = Object.fromEntries(CURRENCIES.map(({ code }) => [code, Number(body.rates?.[code])]).filter(([, r]) => r > 0));
    rates[BASE_CURRENCY] = 1;

    const data = { day: todayKey(), rates, updatedAt: (body.time_last_update_unix ?? Date.now() / 1000) * 1000 };
    storage.set(RATES_KEY, JSON.stringify(data));
    return data;
  } catch (error) {
    const cached = readCachedRates();
    if (cached) return { ...cached, outdated: true };
    throw error;
  }
};

export const readCurrencyPref = () => {
  const code = storage.get(PREF_KEY);
  return CURRENCIES.some((c) => c.code === code) ? code : BASE_CURRENCY;
};

export const saveCurrencyPref = (code) => storage.set(PREF_KEY, code);

/** Format an amount already expressed in `currency`. Whole units — clinic prices don't need cents. */
export const formatCurrency = (amount, currency, locale, { compact = false } = {}) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: currency === BASE_CURRENCY || currency === "EUR" ? "narrowSymbol" : "code",
    maximumFractionDigits: 0,
    numberingSystem: "latn",
    ...(compact && { notation: "compact", maximumFractionDigits: 1 }),
  }).format(Number(amount) || 0);
