import { FiCheck } from "react-icons/fi";

export const onboardingSteps = [
  { label: "General details", desc: "Some basic information so we get to know you" },
  { label: "Physical health", desc: "Health conditions that are important to consider" },
  { label: "Contact details", desc: "How we can reach out to you" },
];

export const ProgressBar = ({ currentStep }) => {
  return (
    <>
      {/* Mobile: compact bar */}
      <div className="w-full md:hidden">
        <div className="flex gap-1.5">
          {onboardingSteps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                currentStep > i ? "gradient-primary" : "bg-ink-200"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-500">
          Step {currentStep} of {onboardingSteps.length} ·{" "}
          <span className="font-semibold text-ink-900">{onboardingSteps[currentStep - 1].label}</span>
        </p>
      </div>

      {/* Desktop: vertical timeline */}
      <ol className="hidden md:block">
        {onboardingSteps.map((step, index) => {
          const n = index + 1;
          const isActive = currentStep === n;
          const isDone = currentStep > n;
          return (
            <li key={step.label} className="relative flex gap-4 pb-10 last:pb-0">
              {index < onboardingSteps.length - 1 && (
                <span className="absolute left-[17px] top-10 h-[calc(100%-44px)] w-px bg-ink-200">
                  <span
                    className="block w-full gradient-primary-to-b transition-all duration-700"
                    style={{ height: isDone ? "100%" : "0%" }}
                  />
                </span>
              )}
              <span
                className={`relative grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-all duration-500 ${
                  isDone
                    ? "gradient-primary text-white"
                    : isActive
                    ? "bg-white text-primary-500 ring-2 ring-primary-500 shadow-glow"
                    : "bg-white text-ink-400 ring-1 ring-ink-200"
                }`}
              >
                {isDone ? <FiCheck className="size-4" /> : n}
              </span>
              <div className="pt-1.5">
                <p className={`text-sm font-semibold ${isActive || isDone ? "text-ink-900" : "text-ink-400"}`}>
                  {step.label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-400">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
};
