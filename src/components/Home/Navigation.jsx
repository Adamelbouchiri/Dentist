import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { FiArrowUpRight, FiChevronRight, FiX } from "react-icons/fi";

import AppContext from "../../context/AppProvider";
import { Button } from "../ui/Button";
import { Avatar, Logo } from "../ui/Misc";

const links = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "dentists", label: "Dentists" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

/**
 * Scroll-spy: the active link is the last section whose top has passed
 * a line 35% down the viewport. At the very bottom, the last section wins.
 * Clicking a link sets it immediately and pauses the spy until the
 * smooth scroll settles, so the pill doesn't flicker through sections.
 */
const useActiveSection = () => {
  const [active, setActive] = useState("home");
  const lockUntil = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (Date.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.35;
      let current = links[0].id;
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - line <= 0) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? links[links.length - 1].id : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const select = (id) => {
    setActive(id);
    lockUntil.current = Date.now() + 900;
  };

  return [active, select];
};

export const Navigation = () => {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, selectSection] = useActiveSection();

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-5">
      <nav
        className={`mx-auto flex max-w-[1360px] items-center justify-between gap-4 rounded-full py-2.5 pl-5 pr-2.5 transition-all duration-500 ease-[var(--ease-luxe)] md:pl-7 ${
          scrolled ? "glass shadow-soft ring-1 ring-ink-200/60" : "bg-transparent"
        }`}
      >
        <Logo className="h-10 md:h-11" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 rounded-full bg-white/70 p-1 ring-1 ring-ink-200/60 backdrop-blur lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => selectSection(l.id)}
                className={`relative block rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  active === l.id ? "text-white" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink-900"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              to={dashboardPath}
              className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-4 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200/70 transition hover:bg-white hover:ring-ink-300"
            >
              <Avatar user={user} className="size-8" />
              <span className="max-w-32 truncate">{user.name}</span>
            </Link>
          ) : (
            <Button to="/login" variant="ghost" size="sm">
              Sign in
            </Button>
          )}
          <Button to="/create-appointments" size="sm" className="h-10 pl-5 pr-4">
            Book appointment <FiArrowUpRight className="size-4" />
          </Button>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          className="grid size-11 place-items-center rounded-full bg-ink-900 text-white lg:hidden"
        >
          <HiOutlineMenuAlt4 className="size-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-ink-950/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-3 right-3 z-[100] flex w-[min(88vw,380px)] flex-col rounded-[28px] bg-white p-6 shadow-2xl lg:hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Logo className="h-10" />
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full bg-ink-100 text-ink-700"
                >
                  <FiX className="size-5" />
                </button>
              </div>

              <ul className="mt-10 flex flex-col">
                {links.map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.04 }}
                  >
                    <a
                      href={`#${l.id}`}
                      onClick={() => {
                        selectSection(l.id);
                        setIsOpen(false);
                      }}
                      className="group flex items-center justify-between border-b border-ink-100 py-4"
                    >
                      <span
                        className={`text-2xl font-semibold tracking-tight ${
                          active === l.id ? "text-gradient" : "text-ink-900"
                        }`}
                      >
                        {l.label}
                      </span>
                      <span className="text-[13px] font-medium text-ink-300">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto space-y-3 pt-8">
                <Button to="/create-appointments" className="w-full" size="lg">
                  Book appointment <FiArrowUpRight />
                </Button>
                {user ? (
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-100"
                  >
                    <Avatar user={user} className="size-11" rounded="rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink-900">{user.name}</p>
                      <p className="truncate text-[13px] text-ink-400">
                        {user.facebook_id ? "Facebook account" : user.email}
                      </p>
                    </div>
                    <FiChevronRight className="text-ink-400" />
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button to="/login" variant="outline">
                      Sign in
                    </Button>
                    <Button to="/register" variant="dark">
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
