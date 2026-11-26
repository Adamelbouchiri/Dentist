import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { useDoctors } from "../../hooks/useCatalog";

const ease = [0.22, 1, 0.36, 1];
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease },
});

export const Hero = () => {
  const { t } = useTranslation();
  const { data: doctors = [] } = useDoctors();

  const stats = [
    { k: "20k+", v: t("hero.statPatients") },
    { k: t("hero.statSameDay"), v: t("hero.statEmergency") },
    {
      k: (
        <span className="inline-flex items-center gap-1.5">
          4.9 <FiStar className="size-5 fill-amber-300 text-amber-300" />
        </span>
      ),
      v: t("hero.statRating"),
    },
  ];

  return (
    <section id="home" className="scroll-mt-24 px-3 pt-3 md:px-5">
      <div className="relative isolate mx-auto flex min-h-[640px] max-w-[1600px] flex-col overflow-hidden rounded-[32px] bg-ink-900 md:h-[calc(100svh-100px)] md:max-h-[900px] md:rounded-[40px]">
        <motion.img
          src="/images/hero.jpg"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/55 via-ink-950/35 to-ink-950/85" />
        <div className="absolute -start-40 top-1/3 -z-10 size-[520px] rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="absolute -end-32 bottom-0 -z-10 size-[420px] rounded-full bg-accent-500/25 blur-[120px]" />

        {/* Social rail */}
        <div className="absolute end-6 top-6 hidden flex-col gap-2 md:flex">
          {[FaInstagram, FaXTwitter, FaFacebookF].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label={t("common.social")}
              className="glass-dark grid size-10 place-items-center rounded-full text-white/85 ring-1 ring-white/15 transition hover:bg-white hover:text-ink-900"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-20 text-center">
          <motion.div {...rise(0.1)} className="flex items-center gap-4">
            <span className="hidden h-px w-24 bg-gradient-to-r from-transparent to-white/60 sm:block md:w-40 rtl:bg-gradient-to-l" />
            <span className="inline-flex items-center gap-2 rounded-full gradient-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white ring-1 ring-white/40">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-white" />
              </span>
              {t("hero.badge")}
            </span>
            <span className="hidden h-px w-24 bg-gradient-to-l from-transparent to-white/60 sm:block md:w-40 rtl:bg-gradient-to-r" />
          </motion.div>

          <motion.h1
            {...rise(0.25)}
            className="mt-8 max-w-5xl text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[96px]"
          >
            {t("hero.title")}{" "}
            <span className="font-display italic tracking-[-0.02em] text-accent-300">{t("hero.titleAccent")}</span>
          </motion.h1>

          <motion.p {...rise(0.4)} className="mt-7 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            {t("hero.lead")}
          </motion.p>

          <motion.div {...rise(0.55)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button to="/create-appointments" size="lg">
              {t("hero.cta")} <FiArrowUpRight className="size-4 rtl:-scale-x-100" />
            </Button>
            <Button href="#services" variant="glass" size="lg">
              {t("hero.explore")}
            </Button>
          </motion.div>
        </div>

        {/* Bottom trust bar */}
        <motion.div
          {...rise(0.75)}
          className="mx-3 mb-3 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-white/10 ring-1 ring-white/15 backdrop-blur-xl md:mx-6 md:mb-6 md:grid-cols-4 md:rounded-[28px]"
        >
          <div className="col-span-2 flex items-center gap-4 bg-ink-950/20 px-5 py-4 md:col-span-1 md:px-6">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {doctors.slice(0, 4).map((d) => (
                <img key={d.id} src={d.image} alt="" className="size-10 rounded-full object-cover object-top ring-2 ring-ink-900" />
              ))}
            </div>
            <div className="text-start">
              <p className="text-sm font-semibold text-white">{t("hero.specialists")}</p>
              <p className="text-[13px] text-white/60">{t("hero.meetTeam")}</p>
            </div>
          </div>
          {stats.map((s, i) => (
            <div key={i} className="bg-ink-950/20 px-5 py-4 text-start md:px-6">
              <p className="text-2xl font-semibold tracking-tight text-white md:text-[28px]">{s.k}</p>
              <p className="text-[13px] text-white/60">{s.v}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
