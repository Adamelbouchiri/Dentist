import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiPhone, FiStar } from "react-icons/fi";
import { clinic, doctors } from "../../data/clinic";
import { SectionHeading } from "../ui/Misc";

export const Doctors = () => {
  return (
    <section id="dentists" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Our specialists"
        title="Meet our dedicated"
        accent="experts"
        lead="Our skilled and caring dental team is here to make every visit comfortable and stress-free."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <article key={d.id} className="group relative aspect-[3/4] overflow-hidden rounded-[32px] bg-ink-100">
            <img
              src={d.image}
              alt={d.name}
              loading="lazy"
              className="absolute inset-0 size-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-transparent" />

            <span className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink-900 ring-1 ring-white/60">
              <FiStar className="size-3.5 fill-amber-400 text-amber-400" /> {d.rating}
            </span>

            <div className="glass absolute inset-x-3 bottom-3 rounded-[24px] p-5 ring-1 ring-white/70 transition-all duration-500 ease-[var(--ease-luxe)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-ink-900">{d.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-500">{d.speciality}</p>
                </div>
                <a
                  href={clinic.phoneHref}
                  className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-3.5 py-2 text-[13px] font-semibold text-white shadow-glow transition hover:brightness-110"
                >
                  <FiPhone className="size-3.5" /> Call now
                </a>
              </div>
              <div className="mt-4 flex items-center gap-1.5 border-t border-ink-200/60 pt-4">
                {[FaInstagram, FaXTwitter, FaFacebookF, FaLinkedinIn].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social profile"
                    className="grid size-8 place-items-center rounded-full text-ink-500 ring-1 ring-ink-200 transition hover:bg-ink-900 hover:text-white hover:ring-ink-900"
                  >
                    <Icon className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
