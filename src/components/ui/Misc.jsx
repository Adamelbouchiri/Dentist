import Lottie from "lottie-react";
import { FiInfo, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import noData from "../../animation/non-data-found.json";
import { avatarUrl } from "../../lib/api";

export const Logo = ({ variant = "dark", className = "", to = "/" }) => (
  <Link to={to} className={`inline-flex shrink-0 ${className}`} aria-label="Doctor Bennani">
    <img
      src={variant === "light" ? "/images/logo-2.png" : "/images/logo.png"}
      alt="Doctor Bennani — Dentistry and Orthodontics"
      className="h-full w-auto"
    />
  </Link>
);

export const Avatar = ({ user, className = "size-10", rounded = "rounded-full" }) => {
  const src = avatarUrl(user?.avatar);
  if (src) return <img src={src} alt={user?.name || ""} className={`${className} ${rounded} object-cover`} />;
  const initials = (user?.name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className={`${className} ${rounded} gradient-primary grid shrink-0 place-items-center font-semibold text-white`}>
      {initials || <FiUser className="size-1/2" />}
    </span>
  );
};

/** Small uppercase label with a gradient dot. */
export const Eyebrow = ({ children, tone = "dark", className = "" }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${
      tone === "light"
        ? "glass-dark text-white/90 ring-1 ring-inset ring-white/20"
        : "bg-white text-ink-600 ring-1 ring-inset ring-ink-200/80 shadow-soft"
    } ${className}`}
  >
    <span className="size-1.5 rounded-full gradient-primary" />
    {children}
  </span>
);

/** Section heading: eyebrow + title (with optional serif italic accent) + lead. */
export const SectionHeading = ({ eyebrow, title, accent, lead, align = "center", className = "" }) => (
  <div className={`${align === "center" ? "mx-auto items-center text-center" : "items-start"} flex max-w-2xl flex-col ${className}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-ink-900 md:text-5xl lg:text-[56px]">
      {title} {accent && <span className="font-display italic text-gradient pe-1">{accent}</span>}
    </h2>
    {lead && <p className="mt-5 text-base leading-relaxed text-ink-500 md:text-lg">{lead}</p>}
  </div>
);

const badgeTones = {
  upcoming: "bg-primary-50 text-primary-600 ring-primary-100",
  scheduled: "bg-primary-50 text-primary-600 ring-primary-100",
  confirmed: "bg-accent-50 text-accent-600 ring-accent-100",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-red-50 text-red-600 ring-red-100",
  refunded: "bg-ink-100 text-ink-600 ring-ink-200",
  pay_in_person: "bg-ink-100 text-ink-600 ring-ink-200",
  unread: "bg-primary-50 text-primary-600 ring-primary-100",
  read: "bg-ink-100 text-ink-500 ring-ink-200",
  inactive: "bg-ink-100 text-ink-500 ring-ink-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  admin: "bg-ink-900 text-white ring-ink-900",
  user: "bg-primary-50 text-primary-600 ring-primary-100",
};

export const Badge = ({ value, className = "" }) => {
  const { t } = useTranslation();
  if (!value) return <span className="text-ink-300">—</span>;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        badgeTones[value] || "bg-ink-100 text-ink-600 ring-ink-200"
      } ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {t(`status.${value}`, String(value).replaceAll("_", " "))}
    </span>
  );
};

export const EmptyState = ({ title, description, action, compact = false }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-white/60 px-6 py-10 text-center">
      <Lottie animationData={noData} loop style={{ height: compact ? 120 : 170 }} />
      <h3 className="mt-2 text-base font-semibold text-ink-900">{title ?? t("common.nothingYet")}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

/** Shown where a feature's backend endpoint doesn't exist yet. */
export const NotImplemented = ({ endpoint }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-500">
        <FiInfo className="size-5" />
      </span>
      <div>
        <h3 className="font-semibold text-ink-900">{t("common.comingSoon")}</h3>
        <p className="mt-1 text-sm text-ink-500">{t("common.needsBackend")}</p>
        {endpoint && (
          <code className="mt-3 inline-block rounded-lg bg-ink-50 px-2.5 py-1 font-mono text-[13px] text-ink-600 ring-1 ring-ink-100" dir="ltr">
            {endpoint}
          </code>
        )}
      </div>
    </div>
  );
};

export const Card = ({ className = "", children, ...props }) => (
  <div className={`rounded-3xl bg-white shadow-soft ring-1 ring-ink-200/70 ${className}`} {...props}>
    {children}
  </div>
);
