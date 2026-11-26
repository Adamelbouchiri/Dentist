import { FiArrowUpRight, FiClock, FiMapPin, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { clinic } from "../../data/clinic";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/Misc";

export const Location = () => {
  const { t } = useTranslation();
  return (
    <section id="location" className="scroll-mt-24">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading align="left" eyebrow={t("location.eyebrow")} title={t("location.title")} accent={t("location.titleAccent")} />
        <p className="max-w-lg leading-relaxed text-ink-500 lg:pb-2">{t("location.lead")}</p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-ink-100 ring-1 ring-ink-200/70">
          <iframe
            title={t("location.mapTitle")}
            src={clinic.mapsEmbed}
            loading="lazy"
            className="absolute inset-0 size-full grayscale-[35%] contrast-[1.05]"
          />
        </div>

        <div className="relative isolate flex flex-col overflow-hidden rounded-[32px] gradient-primary-to-b p-8 text-white md:p-10">
          <div className="absolute -end-24 -top-24 -z-10 size-72 rounded-full bg-white/15 blur-3xl" />
          <img src="/images/logo-icon.png" alt="" className="absolute -bottom-6 -end-6 -z-10 w-48 opacity-10 brightness-0 invert" />

          <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {t("location.cardTitle")} <span className="font-display italic">{t("location.cardAccent")}</span>
          </h3>
          <p className="mt-4 leading-relaxed text-white/80">{t("location.cardText")}</p>

          <ul className="mt-8 space-y-4 text-sm">
            {[
              { icon: FiMapPin, text: clinic.address },
              { icon: FiClock, text: t("clinic.hours") },
              { icon: FiPhone, text: clinic.phone, ltr: true },
            ].map(({ icon: Icon, text, ltr }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <Icon className="size-4" />
                </span>
                <span dir={ltr ? "ltr" : undefined}>{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <Button href={clinic.mapsUrl} target="_blank" rel="noreferrer" variant="light" size="lg">
              {t("location.directions")} <FiArrowUpRight className="rtl:-scale-x-100" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
