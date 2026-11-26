import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const base =
  "w-full rounded-2xl bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-300 ring-1 ring-inset ring-ink-200 transition-all duration-200 outline-none hover:ring-ink-300 focus:ring-2 focus:ring-primary-500 disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed";

export const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="mb-2 flex items-baseline justify-between text-[13px] font-semibold text-ink-700">
    <span>{children}</span>
    {hint && <span className="text-[13px] font-normal text-ink-400">{hint}</span>}
  </label>
);

export const FieldError = ({ children }) =>
  children ? <p className="mt-1.5 text-[13px] font-medium text-red-500">{children}</p> : null;

const asText = (e) => (Array.isArray(e) ? e[0] : e);

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
        {Icon && <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400" />}
        <input
          id={inputId}
          className={`${base} h-12 ${Icon ? "pl-11" : ""} ${error ? "ring-red-300" : ""}`}
          {...props}
        />
      </div>
      <FieldError>{asText(error)}</FieldError>
    </div>
  );
};

export const PasswordInput = ({ label, hint, error, className = "", id, ...props }) => {
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
          className={`${base} h-12 pr-12 ${error ? "ring-red-300" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
        >
          {show ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
        </button>
      </div>
      <FieldError>{asText(error)}</FieldError>
    </div>
  );
};

export const Textarea = ({ label, error, className = "", id, ...props }) => {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={className}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <textarea id={inputId} className={`${base} min-h-40 resize-none py-3.5`} {...props} />
      <FieldError>{asText(error)}</FieldError>
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
        <select id={inputId} className={`${base} h-11 cursor-pointer appearance-none pr-10 text-sm font-medium`} {...props}>
          {children}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
