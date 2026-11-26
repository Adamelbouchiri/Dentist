import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { languages } from "../../i18n";

export const LanguageSwitcher = ({ tone = "light", className = "" }) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find((l) => i18n.resolvedLanguage === l.code) ?? languages[0];

  useEffect(() => {
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.language")}
        aria-expanded={open}
        className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition ${
          tone === "dark"
            ? "text-white ring-1 ring-white/25 hover:bg-white/10"
            : "text-ink-700 ring-1 ring-ink-200/80 hover:bg-white"
        }`}
      >
        <FiGlobe className="size-4" />
        {current.short}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 top-12 z-50 w-44 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_20px_50px_-15px_rgb(11_10_26/0.3)] ring-1 ring-ink-200/70"
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(l.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    l.code === current.code ? "bg-ink-50 text-ink-900" : "text-ink-600 hover:bg-ink-50"
                  }`}
                >
                  <span>{l.label}</span>
                  {l.code === current.code && <FiCheck className="size-4 text-primary-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
