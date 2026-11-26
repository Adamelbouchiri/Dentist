export const Spinner = ({ className = "size-4" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Full-area branded loader. */
export const PageLoader = ({ className = "h-screen" }) => (
  <div className={`flex flex-col items-center justify-center gap-5 ${className}`}>
    <div className="relative grid place-items-center size-16">
      <span className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-ping" />
      <span className="absolute inset-0 rounded-full border border-primary-200" />
      <img src="/images/logo-icon.png" alt="" className="relative size-7" />
    </div>
    <span className="text-xs tracking-[0.3em] uppercase text-ink-400">Loading</span>
  </div>
);
