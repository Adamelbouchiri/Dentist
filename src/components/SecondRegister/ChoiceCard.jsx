import { FiCheck } from "react-icons/fi";

/** Selectable option tile used across the onboarding steps. */
export const ChoiceCard = ({ selected, onClick, icon, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`relative flex items-center gap-3 rounded-2xl px-5 py-4 text-left text-[15px] font-semibold transition-all duration-300 ease-[var(--ease-luxe)] ${
      selected
        ? "bg-white text-primary-600 ring-2 ring-primary-500 shadow-lift"
        : "bg-white text-ink-700 ring-1 ring-ink-200/80 hover:-translate-y-0.5 hover:ring-ink-300 hover:shadow-soft"
    } ${className}`}
  >
    {icon && (
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl text-lg transition-colors ${
          selected ? "gradient-primary text-white" : "bg-ink-50 text-ink-500"
        }`}
      >
        {icon}
      </span>
    )}
    <span className="flex-1">{children}</span>
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-full transition-all ${
        selected ? "gradient-primary text-white scale-100" : "ring-1 ring-ink-200 scale-90"
      }`}
    >
      {selected && <FiCheck className="size-3" />}
    </span>
  </button>
);

export const StepTitle = ({ index, children, hint }) => (
  <div className="mb-5">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500">Question {index}</p>
    <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink-900">{children}</h2>
    {hint && <p className="mt-1 text-sm text-ink-500">{hint}</p>}
  </div>
);
