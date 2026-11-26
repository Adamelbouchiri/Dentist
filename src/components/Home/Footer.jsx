import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight, FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { clinic } from "../../data/clinic";
import { Button } from "../ui/Button";

const quickLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#dentists", label: "Meet the dentists" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact us" },
];

export const Footer = () => {
  return (
    <footer className="px-3 pb-3 md:px-5 md:pb-5">
      <div className="relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[40px] gradient-primary-to-b text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* CTA band */}
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-8 border-b border-white/15 px-6 py-14 md:px-12 lg:flex-row lg:items-end lg:py-20">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl lg:text-7xl">
            Your best smile <span className="font-display italic text-white/90">starts here.</span>
          </h2>
          <Button to="/create-appointments" variant="light" size="lg">
            Book an appointment <FiArrowUpRight />
          </Button>
        </div>

        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <img src="/images/logo-2.png" alt="Doctor Bennani" className="h-14 brightness-0 invert" />
            <p className="mt-6 max-w-sm text-white/75 leading-relaxed">
              At Doctor Bennani, we're committed to providing gentle, expert dental care for patients of all
              ages.
            </p>
            <div className="mt-8 flex gap-2">
              {[FaInstagram, FaXTwitter, FaLinkedinIn].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid size-11 place-items-center rounded-full ring-1 ring-white/30 transition hover:bg-white hover:text-primary-500"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Quick links</h3>
            <ul className="mt-6 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="group inline-flex items-center gap-1 text-white/90 transition hover:text-white">
                    {l.label}
                    <FiArrowUpRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Clinic</h3>
            <ul className="mt-6 space-y-4 text-white/90">
              {[
                { icon: FiMapPin, text: clinic.address },
                { icon: FiPhone, text: clinic.phone, href: clinic.phoneHref },
                { icon: FiMail, text: clinic.email, href: `mailto:${clinic.email}` },
                { icon: FiClock, text: clinic.hours },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon className="mt-1 size-4 shrink-0 text-white/60" />
                  {href ? (
                    <a href={href} className="hover:underline">
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
          <p>© {new Date().getFullYear()} Doctor Bennani — Dentistry and Orthodontics.</p>
          <p>Crafted with care in Casablanca.</p>
        </div>
      </div>
    </footer>
  );
};
