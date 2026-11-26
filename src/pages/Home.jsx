import { Navigation } from "../components/Home/Navigation";
import { Hero } from "../components/Home/Hero";
import { Services } from "../components/Home/Services";
import { About } from "../components/Home/About";
import { Doctors } from "../components/Home/Doctors";
import { Testimonials } from "../components/Home/Testimonials";
import { Location } from "../components/Home/Location";
import { Contact } from "../components/Home/Contact";
import { Footer } from "../components/Home/Footer";
import { FadeInSection } from "../components/fadeIn/FadeInSection";
import { usePageMeta } from "../hooks/usePageMeta";
import { useTranslation } from "react-i18next";

const sections = [Services, About, Doctors, Testimonials, Location, Contact];

export const Home = () => {
  const { t } = useTranslation();
  usePageMeta(null, t("meta.homeDescription"));

  return (
    <div className="bg-ivory">
      <Navigation />
      <Hero />

      <main className="mx-auto flex max-w-[1360px] flex-col gap-28 px-5 py-28 md:gap-40 md:px-8 md:py-40">
        {sections.map((Section, i) => (
          <FadeInSection key={i}>
            <Section />
          </FadeInSection>
        ))}
      </main>

      <Footer />
    </div>
  );
};
