import React from "react";
import { Link } from "react-router-dom";

export const Services = () => {
  const services = [
    {
      id: 1,
      title: "General Checkups",
      desc: "Routine checkups, cleaning and preventive care to keep your teeth and gums healthy around the year",
      image: "/images/services-icon-1.png",
    },
    {
      id: 2,
      title: "Teeth Whitening",
      desc: "Professional, safe and fast teeth whitening treatments to brighten your smile by several shades by one visit",
      image: "/images/services-icon-2.png",
    },
    {
      id: 3,
      title: "Braces/Invisalign",
      desc: "raighten your teeth with traditional braces or clear Invisalign aligners- discreet and effective treatment",
      image: "/images/services-icon-3.png",
    },
    {
      id: 4,
      title: "Emergency Dentisiry",
      desc: "Same-day appointments for toothaches, broken teeth, or dental injuries — fast relief when you need it most",
      image: "/images/services-icon-4.png",
    },
    {
      id: 5,
      title: "Cosmetic Dentistry",
      desc: "Smile makeovers with veneers, bonding, and contouring to enhance the appearance of your teeth and boost confidence.",
      image: "/images/services-icon-5.png",
    },
  ];

  return (
    <div id="services" className="pt-40 lg:pt-50">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wider text-center pb-6">
          Explore Our Key Product <br /> and achievement
        </h1>

        <button className="text-xl text-white border border-white px-14 py-2 rounded-full gradient-primary font-bold cursor-pointer">
          More
        </button>
      </div>

      <div className="flex gap-10 justify-center flex-wrap mt-10">
        {services.map((service) => (
          <div
            key={service.id}
            className={`${
              service.id === 2
                ? "bg-white border 2xl:border-0 p-10 2xl:px-20 2xl:bg-[#e0d6ff] 2xl:translate-y-[60px] 2xl:py-6 2xl:h-fit "
                : "bg-white border p-10"
            } relative shadow border-zinc-200 flex flex-col items-center rounded-xl`}
          >
            <img src={service.image} alt="service" loading="lazy"/>
            <h1 className="text-2xl md:text-3xl font-bold py-4">
              {service.title}
            </h1>

            <p className="w-72 text-center pb-4">{service.desc}</p>

            <Link to="/appointments" className="text-sm cursor-pointer text-white border border-white px-6 py-1 rounded-full gradient-primary font-bold ">
              Schedule an appointment
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
