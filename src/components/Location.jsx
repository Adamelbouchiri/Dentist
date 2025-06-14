import React from "react";

export const Location = () => {
  return (
    <div className="pt-40 lg:pt-50">
      <div className="flex justify-center flex-col lg:flex-row lg:justify-between items-center lg:items-start">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-wider pb-10 lg:pb-0">
          Get Directions
        </h1>
        <p className="text-gray-400 text-lg tracking-wider text-center lg:text-start w-[350px] lg:w-[700px] xl:w-[1000px]">
          modern, easy-to-find dental clinic is designed for your comfort and
          convenienc our modern, easy-to-find dental cl d for your comfort and
          convenience. whether you're visiting us from work, home, or school,
          we're just minutes away with free parking and flexible appointment
          times to fit your schedule.
        </p>
      </div>

      <div className="pt-20 flex flex-col-reverse lg:flex-row items-center lg:items-start justify-center gap-6">
        <div className="rounded-xl overflow-hidden w-full lg:w-[60%] shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5588.412155722465!2d-7.634610083761219!3d33.608164985823414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2607994d58f%3A0x67a1d618e7b0d072!2sMosqu%C3%A9e%20Hassan-II!5e0!3m2!1sfr!2sma!4v1749063889355!5m2!1sfr!2sma"
            width="100%"
            height="450"
            loading="lazy"
            className="rounded-xl"
          ></iframe>
        </div>

        <div className="w-full lg:w-[40%] gradient bg-gradient-to-b from-primary-500 to-accent-500 rounded-xl text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold pb-6">Our Location</h1>
          <p className="text-lg tracking-wider pb-6">
            conveniently located in the heart of casablanca our modern,
            easy-to-find dental clinic is designed for your comfort and
            convenience
          </p>
          <a
            href="https://www.google.com/maps/place/Mosqu%C3%A9e+Hassan-II/@33.608165,-7.6346101,16.25z/data=!4m6!3m5!1s0xda7d2607994d58f:0x67a1d618e7b0d072!8m2!3d33.6082229!4d-7.632668!16zL20vMDQzNjds?entry=ttu&g_ep=EgoyMDI1MDYwMS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank" 
            className=" border border-white bg-white text-accent-500 px-6 py-2 rounded-xl font-bold cursor-pointer w-fit"
          >
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
};
