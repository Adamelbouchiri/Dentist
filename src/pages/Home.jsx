import { Navigation } from "../components/Home/Navigation";
import { Hero } from "../components/Home/Hero";
import { Services } from "../components/Home/Services";
import { About } from "../components/Home/About";
import { Doctors } from "../components/Home/Doctors";
import { Testimonials } from "../components/Home/Testimonials";
import { Location } from "../components/Home/Location";
import { Contact } from "../components/Home/Contact";
import { Footer } from "../components/Home/Footer";

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
