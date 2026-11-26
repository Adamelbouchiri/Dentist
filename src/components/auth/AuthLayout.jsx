import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { doctors } from "../../data/clinic";
import { Logo } from "../ui/Misc";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { api } from "../../lib/api";

const ease = [0.22, 1, 0.36, 1];

export const AuthLayout = ({ title, accent, subtitle, children, footer }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-ivory p-3 md:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1500px] gap-4 md:min-h-[calc(100vh-32px)] lg:grid-cols-[1fr_1fr]">
        {/* Form column */}
        <div className="flex flex-col px-3 py-4 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex items-center justify-between">
            <Logo className="h-11" />
            <LanguageSwitcher />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12"
          >
            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-ink-900 md:text-[44px] md:leading-[1.05]">
              {title} {accent && <span className="font-display italic text-gradient pe-1">{accent}</span>}
            </h1>
            {subtitle && <div className="mt-3 text-[15px] text-ink-500">{subtitle}</div>}
            <div className="mt-10">{children}</div>
          </motion.div>

          <div className="text-center text-[13px] text-ink-400 lg:text-start">
            {footer ?? t("footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </div>

        {/* Brand panel */}
        <motion.aside
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease }}
          className="relative isolate hidden flex-col overflow-hidden rounded-[36px] gradient-primary-to-b p-10 text-white lg:flex xl:p-14"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.1)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -end-32 -top-32 -z-10 size-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-40 -start-20 -z-10 size-96 rounded-full bg-accent-300/40 blur-3xl" />

          <div className="flex items-center justify-between">
            <span className="grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <img src="/images/logo-icon.png" alt="" className="size-7 brightness-0 invert" />
            </span>
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ring-1 ring-white/25 backdrop-blur">
              {t("auth.portal")}
            </span>
          </div>

          <h2 className="mt-12 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.035em] xl:text-5xl">
            {t("auth.panelTitle")} <span className="font-display italic">{t("auth.panelAccent")}</span>
          </h2>

          <div className="relative my-auto flex justify-center py-10">
            <div className="absolute inset-x-10 top-1/2 h-40 -translate-y-1/2 rounded-full bg-white/25 blur-3xl" />
            <motion.img
              src="/images/login-img.png"
              alt=""
              className="relative w-[300px] drop-shadow-[0_30px_40px_rgb(11_10_26/0.35)] xl:w-[340px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="max-w-xs text-lg font-semibold leading-snug">
              {t("auth.panelQuote")} <span className="font-normal text-white/75">{t("auth.panelQuoteAccent")}</span>
            </p>
            <div className="glass flex items-center gap-3 rounded-2xl p-3 pe-5 text-ink-900 ring-1 ring-white/60">
              <div className="flex -space-x-2.5 rtl:space-x-reverse">
                {doctors.map((d) => (
                  <img key={d.id} src={d.image} alt="" className="size-9 rounded-full object-cover object-top ring-2 ring-white" />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold">{t("auth.joinPatients")}</p>
                <p className="flex items-center gap-1 text-[13px] text-ink-500">
                  <FiStar className="size-3 fill-amber-400 text-amber-400" /> {t("auth.avgRating")}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};

const oauthRedirect = (provider) => {
  window.location.href = `${api.defaults.baseURL}/auth/${provider}/redirect`;
};

export const SocialButtons = () => (
  <div className="grid gap-3 sm:grid-cols-2">
    <button
      type="button"
      onClick={() => oauthRedirect("google")}
      className="flex h-12 items-center justify-center gap-3 rounded-full bg-white text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50 hover:ring-ink-300"
    >
      <img src="/images/google.png" alt="" className="size-5" /> Google
    </button>
    <button
      type="button"
      onClick={() => oauthRedirect("facebook")}
      className="flex h-12 items-center justify-center gap-3 rounded-full bg-white text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition hover:bg-ink-50 hover:ring-ink-300"
    >
      <FaFacebook className="size-5 text-[#1877f2]" /> Facebook
    </button>
  </div>
);

export const Divider = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="my-7 flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-300">
      <span className="h-px flex-1 bg-ink-200" />
      {children ?? t("auth.orContinue")}
      <span className="h-px flex-1 bg-ink-200" />
    </div>
  );
};
