import { useEffect } from "react";

const SITE = "Doctor Bennani";

const setMeta = (selector, attr, value) => {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/);
    el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

/** Sets document title + description (and OG equivalents) for the current page. */
export const usePageMeta = (title, description) => {
  useEffect(() => {
    const full = title ? `${title} · ${SITE}` : `${SITE} — Dentistry & Orthodontics in Casablanca`;
    document.title = full;
    setMeta('meta[property="og:title"]', "content", full);
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:description"]', "content", description);
  }, [title, description]);
};
