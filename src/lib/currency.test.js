import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchRates, formatCurrency, readCachedRates, todayKey } from "./currency";

const apiResponse = {
  result: "success",
  time_last_update_unix: 1795651200,
  rates: { USD: 1, MAD: 10, EUR: 0.9, SAR: 3.75, AED: 3.6725, JPY: 150 },
};

describe("exchange rates", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("keeps only the supported currencies and caches them for today", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, json: async () => apiResponse });

    const data = await fetchRates();

    expect(data.rates).toEqual({ USD: 1, MAD: 10, EUR: 0.9, SAR: 3.75, AED: 3.6725 });
    expect(data.day).toBe(todayKey());
    expect(readCachedRates()).toEqual(data);
  });

  it("falls back to the last cached rates when the request fails", async () => {
    localStorage.setItem("fx-rates", JSON.stringify({ day: "2026-01-01", rates: { USD: 1, MAD: 9.5 }, updatedAt: 1 }));
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    const data = await fetchRates();

    expect(data.rates.MAD).toBe(9.5);
    expect(data.outdated).toBe(true);
  });

  it("throws when offline with nothing cached (UI then shows USD)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    await expect(fetchRates()).rejects.toThrow("offline");
  });
});

describe("formatCurrency", () => {
  it("formats whole amounts with a symbol for USD/EUR and the code otherwise", () => {
    expect(formatCurrency(150, "USD", "en")).toBe("$150");
    expect(formatCurrency(1500, "MAD", "en")).toMatch(/^MAD\s1,500$/);
    expect(formatCurrency(136.8, "EUR", "en")).toBe("€137");
  });
});
