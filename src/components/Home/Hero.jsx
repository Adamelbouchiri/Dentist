import React from "react";

export const Hero = () => {
  return (
    <div id="home" className="">
      <div className="hero h-[50vh]  lg:h-[85vh] rounded-2xl relative">
        <div className="flex justify-end relative">
          <img
            src="/images/hero-icons.png"
            alt="social"
            className="mt-10 me-8"
          />
        </div>

        <div className="justify-center relative lg:pt-32 hidden lg:flex">
          <span className="w-[360px] h-[1px] bg-white mt-4 me-4"></span>
          <h1 className="gradient-primary relative hero-heading text-md text-white font-bold px-4 py-1 rounded-full border border-white">
            24/7 Available service
          </h1>
          <span className="w-[360px] h-[1px] bg-white mt-4 ms-4"></span>
        </div>

        <div className="pt-14 lg:pt-10 text-center relative">
          <h1 className="text-3xl md:text-4xl lg:text-6xl text-white font-bold tracking-wider">Gentle, Trusted Dental <br />care in Casablanca</h1>
          <p className="text-gray-200 text-sm md:text-lg tracking-wider py-2 px-10 md:px-0">Now accepting new patients,feel free to book an appointment</p>
        </div>

        <div className="flex justify-center relative pt-6 lg:pt-10">
          <button className="text-white border border-white px-4 py-2 rounded-full gradient-primary font-bold cursor-pointer">Book an Appointment</button>
        </div>

        <div className="absolute hidden lg:block bottom-10 left-10">
          <img src="/images/hero-items.png" alt="items" />
        </div>
      </div>
    </div>
  );
};
