import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";

const variants = {
  primary:
    "gradient-primary text-white shadow-glow hover:shadow-[0_14px_44px_-10px_rgb(56_2_255/0.7)] hover:brightness-110",
  dark: "bg-ink-900 text-white hover:bg-ink-800 shadow-soft",
  outline:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:ring-ink-300 hover:bg-ink-50",
  ghost: "text-ink-600 hover:text-ink-900 hover:bg-ink-100/70",
  light: "bg-white text-ink-900 hover:bg-white/90 shadow-soft",
  glass: "glass-dark text-white ring-1 ring-inset ring-white/25 hover:bg-white/15",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-soft",
  "danger-soft": "bg-red-50 text-red-600 hover:bg-red-100",
};

const sizes = {
  xs: "h-8 px-3 text-[13px] gap-1.5",
  sm: "h-9 px-4 text-[13px] gap-2",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-8 text-[15px] gap-2.5",
  icon: "size-10 justify-center",
};

export const Button = ({
  as,
  to,
  href,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}) => {
  const classes = `inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap transition-all duration-300 ease-[var(--ease-luxe)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );

  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  if (href || as === "a")
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
};
