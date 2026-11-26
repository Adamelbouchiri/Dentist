import { useState } from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { SectionHeading } from "../ui/Misc";

const reasons = [
  { title: "Family-friendly, welcoming environment", desc: "A calm, design-led clinic where every age feels at ease from the moment they arrive." },
  { title: "Same-day & emergency appointments", desc: "Urgent pain or a broken tooth? We keep time aside every day for emergencies." },
  { title: "Modern technology for safer, faster care", desc: "Digital imaging and minimally invasive techniques mean less time in the chair." },
  { title: "Transparent pricing & insurance accepted", desc: "Clear treatment plans and fees up front — no surprises, ever." },
  { title: "5-star care trusted by your neighbours", desc: "Thousands of Casablanca families rely on us for their long-term dental health." },
];

export const About = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="about" className="scroll-mt-24">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading align="left" eyebrow="Why choose us" title="Care that feels" accent="different" />
        <p className="max-w-md text-ink-500 leading-relaxed lg:pb-2">
          We're not just about fixing teeth — we're here to give you a stress-free, comfortable and positive
          dental experience.
        </p>
      </div>

      <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[32px]">
          <img
            src="/images/about.jpg"
            alt="Dentist treating a smiling patient"
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
          <div className="glass absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-3xl p-4 ring-1 ring-white/60 sm:right-auto sm:pr-8">
            <span className="grid size-12 place-items-center rounded-2xl gradient-primary text-white shadow-glow">
              <FiShield className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">Modern, gentle technology</p>
              <p className="text-[13px] text-ink-500">Safer, faster treatment at every visit</p>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {reasons.map((r, i) => {
            const isActive = active === i;
            return (
              <li
                key={r.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={`group relative cursor-default overflow-hidden rounded-3xl p-6 outline-none transition-all duration-500 ease-[var(--ease-luxe)] ${
                  isActive
                    ? "gradient-primary text-white shadow-glow"
                    : "bg-white text-ink-900 ring-1 ring-ink-200/70"
                }`}
              >
                <div className="flex items-start gap-5">
                  <span className={`font-display text-2xl italic ${isActive ? "text-white/70" : "text-ink-300"}`}>
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold tracking-tight">{r.title}</h3>
                      <FiArrowRight
                        className={`size-4 shrink-0 transition-all duration-500 ${
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                      />
                    </div>
                    <div
                      className={`grid transition-all duration-500 ease-[var(--ease-luxe)] ${
                        isActive ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden text-sm leading-relaxed text-white/80">{r.desc}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
