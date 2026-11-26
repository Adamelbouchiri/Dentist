import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiHome, FiLogOut, FiMenu, FiX } from "react-icons/fi";

import AppContext from "../../context/AppProvider";
import { useLogout } from "../../hooks/useAuth";
import { getErrorMessage } from "../../lib/api";
import { flash } from "../../utils/flash";
import { Avatar, Logo } from "../ui/Misc";
import { Button } from "../ui/Button";

/**
 * Shared layout for the patient and admin areas.
 * `items`: [{ to, label, icon, end }]
 */
export const DashboardShell = ({ role, items, label }) => {
  const { user, signOut } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [location.pathname]);

  if (user.role !== role) return <Navigate to="/" replace />;

  const handleLogout = () =>
    logout.mutate(undefined, {
      onSuccess: (data) => {
        signOut();
        flash.show(data?.message || "Signed out", "success", 3000);
        navigate("/");
      },
      onError: (error) => flash.show(getErrorMessage(error, "Unable to sign out"), "error", 3000),
    });

  const current = items.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2">
        <Logo className="h-10" />
        <button
          onClick={() => setIsOpen(false)}
          className="grid size-9 place-items-center rounded-full bg-ink-100 text-ink-600 lg:hidden"
          aria-label="Close menu"
        >
          <FiX />
        </button>
      </div>

      <p className="mt-10 px-3 text-xs font-semibold uppercase tracking-[0.24em] text-ink-400">{label}</p>
      <nav className="mt-3 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                isActive ? "text-white" : "text-ink-500 hover:bg-ink-100/70 hover:text-ink-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId={`side-pill-${role}`}
                    className="absolute inset-0 rounded-2xl bg-ink-900 shadow-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span
                  className={`relative grid size-8 place-items-center rounded-xl transition-colors ${
                    isActive ? "gradient-primary text-white" : "bg-white text-ink-500 ring-1 ring-ink-200/70"
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <span className="relative">{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-ink-500 transition hover:bg-ink-100/70 hover:text-ink-900"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-white text-ink-500 ring-1 ring-ink-200/70">
            <FiHome className="size-4" />
          </span>
          Back to website
        </Link>
      </nav>

      {role === "user" && (
        <div className="relative mt-8 overflow-hidden rounded-3xl gradient-primary-to-b p-5 text-white">
          <div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/20 blur-2xl" />
          <p className="relative text-sm font-semibold">Time for a check-up?</p>
          <p className="relative mt-1 text-[13px] text-white/75">Book your next visit in under a minute.</p>
          <Button to="/create-appointments" variant="light" size="xs" className="relative mt-4">
            Book now <FiArrowUpRight />
          </Button>
        </div>
      )}

      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-ink-200/70">
          <Avatar user={user} className="size-10" rounded="rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
            <p className="truncate text-[13px] capitalize text-ink-400">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            title="Sign out"
            aria-label="Sign out"
            className="grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <FiLogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-ivory lg:h-screen lg:overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 p-4 pr-0 lg:block">
        <div className="h-full rounded-[28px] bg-ink-50/60 p-4 ring-1 ring-ink-200/60">{sidebar}</div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-3 left-3 z-50 w-[min(86vw,300px)] rounded-[28px] bg-ivory p-4 shadow-2xl lg:hidden"
              initial={{ x: "-110%" }}
              animate={{ x: 0 }}
              exit={{ x: "-110%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-y-auto">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-ivory/80 px-5 py-4 backdrop-blur-xl md:px-8 lg:py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="grid size-10 place-items-center rounded-full bg-ink-900 text-white lg:hidden"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
            <div>
              <p className="hidden text-[13px] text-ink-400 sm:block">
                {label} <span className="mx-1 text-ink-300">/</span> {current?.label}
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-ink-900 sm:text-xl">{current?.label}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-right text-sm text-ink-500 md:block">
              Hello, <span className="font-semibold text-ink-900">{user.name?.split(" ")[0]}</span>
            </p>
            <Avatar user={user} className="size-10" />
          </div>
        </header>

        <main className="flex-1 px-5 pb-10 md:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

/** Section header used within dashboard pages. */
export const PageHeader = ({ title, accent, description, action }) => (
  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div>
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink-900 md:text-4xl">
        {title} {accent && <span className="font-display italic text-gradient pr-1">{accent}</span>}
      </h2>
      {description && <p className="mt-2 text-ink-500">{description}</p>}
    </div>
    {action}
  </div>
);
