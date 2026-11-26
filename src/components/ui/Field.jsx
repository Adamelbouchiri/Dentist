import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const base =
  "w-full rounded-2xl bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-300 ring-1 ring-inset ring-ink-200 transition-all duration-200 outline-none hover:ring-ink-300 focus:ring-2 focus:ring-primary-500 disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed";

export const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[13px] font-semibold text-ink-700">
    <span>{children}</span>
    {hint && <span className="text-[13px] font-normal text-ink-400">{hint}</span>}
  </label>
);

/** Accepts a string, a Laravel error array, or a react-hook-form error object. Keys are translated. */
export const FieldError = ({ children }) => {
  const { t } = useTranslation();
  const raw = Array.isArray(children) ? children[0] : children?.message ?? children;
  if (!raw) return null;
  return (
    <p role="alert" className="mt-1.5 text-[13px] font-medium text-red-500">
      {t(raw, { defaultValue: raw })}
    </p>
  );
};

export const Input = ({ label, hint, error, icon: Icon, className = "", id, ...props }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} hint={hint}>
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />}
        <input
          id={inputId}
          aria-invalid={!!error || undefined}
          className={`${base} h-12 ${Icon ? "ps-11" : ""} ${error ? "ring-red-300" : ""}`}
          {...props}
        />
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const PasswordInput = ({ label, hint, error, className = "", id, ...props }) => {
  const { t } = useTranslation();
  const autoId = useId();
  const inputId = id || autoId;
  const [show, setShow] = useState(false);
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} hint={hint}>
          {label}
        </Label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={show ? "text" : "password"}
          aria-invalid={!!error || undefined}
          className={`${base} h-12 pe-12 ${error ? "ring-red-300" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t("common.hidePassword") : t("common.showPassword")}
          className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
        >
          {show ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
        </button>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Textarea = ({ label, error, className = "", id, ...props }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <textarea
        id={inputId}
        aria-invalid={!!error || undefined}
        className={`${base} min-h-40 resize-none py-3.5 ${error ? "ring-red-300" : ""}`}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </div>
  );
};

export const Select = ({ label, className = "", children, id, ...props }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative">
        <select id={inputId} className={`${base} h-11 cursor-pointer appearance-none pe-10 text-sm font-medium`} {...props}>
          {children}
        </select>
        <svg className="pointer-events-none absolute end-4 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export const Switch = ({ checked, onChange, label, description, disabled }) => (
  <label className={`flex items-start justify-between gap-6 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
    <span>
      <span className="block text-sm font-semibold text-ink-900">{label}</span>
      {description && <span className="mt-0.5 block text-[13px] text-ink-500">{description}</span>}
    </span>
    <span className="relative mt-0.5 inline-flex shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2" />
      <span className="absolute start-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5" />
    </span>
  </label>
);
