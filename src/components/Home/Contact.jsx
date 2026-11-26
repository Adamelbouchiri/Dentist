import { FiCheck } from "react-icons/fi";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Field";
import { SectionHeading } from "../ui/Misc";

export const Contact = () => {
  // No contact endpoint exists on the API yet — the form is presentational.
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Reach"
            accent="out"
            lead="Have a question or need assistance? Our dedicated team is here to help with any enquiry you may have."
          />

          <ul className="mt-10 space-y-4">
            {["Personalised assistance", "Timely response", "Comprehensive support"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink-700">
                <span className="grid size-7 place-items-center rounded-full gradient-primary text-white">
                  <FiCheck className="size-3.5" />
                </span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex items-center gap-3">
            {[FaXTwitter, FaInstagram, FaFacebookF].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid size-12 place-items-center rounded-2xl bg-white text-ink-700 shadow-soft ring-1 ring-ink-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 hover:text-white hover:ring-primary-500"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-ink-200/70 md:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Name" placeholder="Your full name" name="name" />
            <Input label="Email" type="email" placeholder="you@example.com" name="email" />
            <Textarea label="Message" placeholder="How can we help?" name="message" className="md:col-span-2" />
          </div>
          <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-[13px] text-ink-400">We usually reply within one business day.</p>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Send message
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
