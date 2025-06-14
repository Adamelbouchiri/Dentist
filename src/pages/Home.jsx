import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { Services } from "../components/Services";
import { About } from "../components/About";
import { Doctors } from "../components/Doctors";
import { Testimonials } from "../components/Testimonials";
import { Location } from "../components/Location";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export const Home = () => {

  return (
    <div>
      <Navigation />

      <div className="px-8 md:px-10 2xl:px-32">
        <Hero />
        <Services />
        <About />
        <Doctors />
        <Testimonials />
        <Location />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};
