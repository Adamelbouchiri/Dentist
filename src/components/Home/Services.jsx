import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useServices } from "../../hooks/useCatalog";
import { useMoney } from "../../hooks/useMoney";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/Misc";

export const Services = () => {
  const { t } = useTranslation();
  const { data: services = [] } = useServices();
  const { money } = useMoney();

  return (
    <section id="services" className="scroll-mt-24">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading align="left" eyebrow={t("services.eyebrow")} title={t("services.title")} accent={t("services.titleAccent")} />
        <div className="max-w-sm lg:pb-2">
          <p className="leading-relaxed text-ink-500">{t("services.lead")}</p>
          <Button to="/create-appointments" variant="dark" size="sm" className="mt-6 h-10">
            {t("services.bookVisit")} <FiArrowUpRight className="rtl:-scale-x-100" />
          </Button>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        {services.map((s, i) => {
          const featured = s.slug === "whitening";
          const wide = services.length === 5 ? i >= 3 : false;
          return (
            <article
              key={s.id}
              className={`group relative flex flex-col overflow-hidden rounded-[28px] p-7 transition-all duration-500 ease-[var(--ease-luxe)] hover:-translate-y-1.5 lg:p-8 ${
                wide ? "lg:col-span-3" : "lg:col-span-2"
              } ${
                featured
                  ? "bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 ring-1 ring-primary-200/70"
                  : "bg-white ring-1 ring-ink-200/70 shadow-soft hover:shadow-lift"
              }`}
            >
              <div className="pointer-events-none absolute -end-20 -top-20 size-56 rounded-full gradient-primary opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-15" />

              <div className="flex items-start justify-between">
                <div className="grid size-16 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-ink-100">
                  {s.icon && <img src={s.icon} alt="" className="max-h-9 max-w-10 object-contain" loading="lazy" />}
                </div>
                <span className="font-display text-3xl italic text-ink-300">{String(i + 1).padStart(2, "0")}</span>
              </div>

              <h3 className="mt-10 text-2xl font-semibold tracking-tight text-ink-900">{t(`services.${s.slug}.name`, s.name)}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{t(`services.${s.slug}.desc`, s.desc)}</p>

              <div className="mt-auto flex items-center justify-between pt-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{t("services.from")}</p>
                  <p className="text-lg font-semibold text-ink-900">{money(s.price)}</p>
                </div>
                <Link
                  to="/create-appointments"
                  aria-label={`${t("services.schedule")} — ${s.name}`}
                  className="flex items-center gap-2 rounded-full bg-ink-900 py-2 pe-2 ps-4 text-[13px] font-semibold text-white transition-all duration-300 group-hover:gradient-primary"
                >
                  {t("services.schedule")}
                  <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:rotate-45">
                    <FiArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
