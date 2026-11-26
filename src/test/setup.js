import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import i18n from "../i18n";

// Tests assert on English copy
i18n.changeLanguage("en");

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// --- Browser APIs jsdom doesn't implement -----------------------------------
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = IO;
globalThis.ResizeObserver = IO;
window.scrollTo = () => {};
window.matchMedia ||= () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });

// --- Heavy / network-bound libraries -----------------------------------------
vi.mock("lottie-react", () => ({ default: () => null }));
vi.mock("@stripe/stripe-js", () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }) => children,
  CardElement: () => null,
  useStripe: () => null,
  useElements: () => null,
}));
