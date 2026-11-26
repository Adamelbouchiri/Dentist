import { FiArrowUpRight, FiClock, FiMapPin, FiPhone } from "react-icons/fi";
import { clinic } from "../../data/clinic";
import { Button } from "../ui/Button";
import { SectionHeading } from "../ui/Misc";

export const Location = () => {
  return (
    <section id="location" className="scroll-mt-24">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading align="left" eyebrow="Visit us" title="Get" accent="directions" />
        <p className="max-w-lg text-ink-500 leading-relaxed lg:pb-2">
          Our modern, easy-to-find clinic is designed for your comfort. Whether you're coming from work,
          home or school, we're minutes away — with free parking and flexible appointment times.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative min-h-[380px] overflow-hidden rounded-[32px] bg-ink-100 ring-1 ring-ink-200/70">
          <iframe
            title="Clinic location"
            src={clinic.mapsEmbed}
            loading="lazy"
            className="absolute inset-0 size-full grayscale-[35%] contrast-[1.05]"
          />
        </div>

        <div className="relative isolate flex flex-col overflow-hidden rounded-[32px] gradient-primary-to-b p-8 text-white md:p-10">
          <div className="absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-white/15 blur-3xl" />
          <img src="/images/logo-icon.png" alt="" className="absolute -bottom-6 -right-6 -z-10 w-48 opacity-10 brightness-0 invert" />

          <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Our <span className="font-display italic">location</span>
          </h3>
          <p className="mt-4 text-white/80 leading-relaxed">
            Conveniently located in the heart of Casablanca — a modern clinic designed for your comfort and
            convenience.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            {[
              { icon: FiMapPin, text: clinic.address },
              { icon: FiClock, text: clinic.hours },
              { icon: FiPhone, text: clinic.phone },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <Button href={clinic.mapsUrl} target="_blank" rel="noreferrer" variant="light" size="lg">
              Get directions <FiArrowUpRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
