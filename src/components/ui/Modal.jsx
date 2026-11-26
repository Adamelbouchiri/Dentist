import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const sizes = { md: "max-w-md", lg: "max-w-xl", xl: "max-w-2xl" };

export const Modal = ({ open, onClose, title, description, icon: Icon, tone = "primary", size = "md", children, footer }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`relative max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl ring-1 ring-ink-200/60 ${sizes[size]}`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label={t("common.close")}
              className="absolute end-4 top-4 rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900"
            >
              <FiX className="size-4" />
            </button>
            {Icon && (
              <div
                className={`mb-5 grid size-12 place-items-center rounded-2xl ${
                  tone === "danger" ? "bg-red-50 text-red-600" : "bg-primary-50 text-primary-500"
                }`}
              >
                <Icon className="size-5" />
              </div>
            )}
            {title && <h3 className="pe-8 text-xl font-semibold tracking-tight text-ink-900">{title}</h3>}
            {description && <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{description}</p>}
            {children && <div className="mt-6">{children}</div>}
            {footer && <div className="mt-7 flex flex-wrap justify-end gap-2">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
