export const StatTile = ({ label, value, hint, icon: Icon, featured = false }) => (
  <div
    className={`relative overflow-hidden rounded-3xl p-6 ${
      featured ? "gradient-primary text-white shadow-glow" : "bg-white ring-1 ring-ink-200/70 shadow-soft"
    }`}
  >
    {featured && <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl" />}
    <div className="relative flex items-center justify-between">
      <p className={`text-sm font-medium ${featured ? "text-white/80" : "text-ink-500"}`}>{label}</p>
      {Icon && (
        <span
          className={`grid size-9 place-items-center rounded-xl ${
            featured ? "bg-white/15 ring-1 ring-white/25" : "bg-primary-50 text-primary-500"
          }`}
        >
          <Icon className="size-4" />
        </span>
      )}
    </div>
    <p className="relative mt-5 text-4xl font-semibold tracking-tight">{value}</p>
    {hint && <p className={`relative mt-1 text-[13px] ${featured ? "text-white/70" : "text-ink-400"}`}>{hint}</p>}
  </div>
);
