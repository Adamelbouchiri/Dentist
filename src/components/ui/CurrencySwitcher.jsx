import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { CURRENCIES } from "../../lib/currency";
import { useMoney } from "../../hooks/useMoney";

export const CurrencySwitcher = ({ tone = "light", className = "" }) => {
  const { t, i18n } = useTranslation();
  const { selected, setCurrency, updatedAt } = useMoney();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
        aria-label={t("currency.label")}
        aria-expanded={open}
        dir="ltr"
        className={`inline-flex h-10 items-center rounded-full px-3 text-[13px] font-semibold transition ${
          tone === "dark"
            ? "text-white ring-1 ring-white/25 hover:bg-white/10"
            : "text-ink-700 ring-1 ring-ink-200/80 hover:bg-white"
        }`}
      >
        {selected}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 top-12 z-50 w-60 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_20px_50px_-15px_rgb(11_10_26/0.3)] ring-1 ring-ink-200/70"
          >
            <ul>
              {CURRENCIES.map(({ code, flag }) => (
                <li key={code}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      code === selected ? "bg-ink-50 text-ink-900" : "text-ink-600 hover:bg-ink-50"
                    }`}
                  >
                    <span aria-hidden>{flag}</span>
                    <span className="flex-1 text-start">{t(`currency.names.${code}`)}</span>
                    <span className="text-[12px] font-semibold text-ink-400" dir="ltr">{code}</span>
                    {code === selected && <FiCheck className="size-4 text-primary-500" />}
                  </button>
                </li>
              ))}
            </ul>
            {updatedAt && (
              <p className="border-t border-ink-100 px-3 pb-1.5 pt-2.5 text-[12px] leading-snug text-ink-400">
                {t("currency.updated", {
                  date: new Date(updatedAt).toLocaleDateString(i18n.language, { day: "numeric", month: "short" }),
                })}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
