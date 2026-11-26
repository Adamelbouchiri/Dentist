import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight, FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { clinic } from "../../data/clinic";
import { Button } from "../ui/Button";

const linkIds = ["home", "services", "about", "dentists", "reviews", "contact"];

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[40px] gradient-primary-to-b text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-8 border-b border-white/15 px-6 py-14 md:px-12 lg:flex-row lg:items-end lg:py-20">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl lg:text-7xl">
            {t("footer.cta")} <span className="font-display italic text-white/90">{t("footer.ctaAccent")}</span>
          </h2>
          <Button to="/create-appointments" variant="light" size="lg">
            {t("hero.cta")} <FiArrowUpRight className="rtl:-scale-x-100" />
          </Button>
        </div>

        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <img src="/images/logo-2.png" alt="Doctor Bennani" className="h-14 brightness-0 invert" />
            <p className="mt-6 max-w-sm leading-relaxed text-white/75">{t("footer.about")}</p>
            <div className="mt-8 flex gap-2">
              {[FaInstagram, FaXTwitter, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={t("common.social")}
                  className="grid size-11 place-items-center rounded-full ring-1 ring-white/30 transition hover:bg-white hover:text-primary-500"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{t("footer.quickLinks")}</h3>
            <ul className="mt-6 space-y-3">
              {linkIds.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="group inline-flex items-center gap-1 text-white/90 transition hover:text-white">
                    {t(`nav.${id}`)}
                    <FiArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100 rtl:-scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{t("footer.clinic")}</h3>
            <ul className="mt-6 space-y-4 text-white/90">
              {[
                { icon: FiMapPin, text: clinic.address },
                { icon: FiPhone, text: clinic.phone, href: clinic.phoneHref, ltr: true },
                { icon: FiMail, text: clinic.email, href: `mailto:${clinic.email}`, ltr: true },
                { icon: FiClock, text: t("clinic.hours") },
              ].map(({ icon: Icon, text, href, ltr }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-1 size-4 shrink-0 text-white/60" />
                  {href ? (
                    <a href={href} className="hover:underline" dir={ltr ? "ltr" : undefined}>
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-2 border-t border-white/15 px-6 py-6 text-[13px] text-white/60 sm:flex-row md:px-12">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.crafted")}</p>
        </div>
      </div>
    </footer>
  );
};
