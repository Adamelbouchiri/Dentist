import React from "react";

export const About = () => {
  return (
    <div className="pt-40 lg:pt-50">
      <div  className="flex flex-col items-center lg:flex-row lg:justify-between">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-wider">
          Why Choose Us
        </h1>
        <p className="text-xl tracking-wider py-2 text-center lg:text-start mt-4 lg:mt-0 text-zinc-500 lg:ps-[100px]">
          We're not just about fixing teeth - we're here to give you a
          stress-free, comfortable, and positive dental experienet
        </p>
      </div>

      <div className="py-10 flex items-center gap-8">
        <img
          src="/images/about.jpg"
          alt="about"
          className="hidden lg:block lg:w-[600px] rounded-xl"
        />

        <div className="flex-1 flex flex-col gap-3">
          <div className="p-4 duration-300 transition-colors hover:gradient hover:bg-gradient-to-t hover:from-[#3802ff] hover:to-[#04b7fe] rounded-xl hover:text-white hover:border-white border border-gray-200">
            <p className="text-xl tracking-wider">
              Family-friendly, welcoming environment
            </p>
          </div>
          <div className="p-4 duration-300 transition-colors hover:gradient hover:bg-gradient-to-t hover:from-[#3802ff] hover:to-[#04b7fe] rounded-xl hover:text-white hover:border-white border border-gray-200">
            <p className="text-xl tracking-wider">
              Same-day and emergency appointments available
            </p>
          </div>
          <div className="p-4 duration-300 transition-colors hover:gradient hover:bg-gradient-to-t hover:from-[#3802ff] hover:to-[#04b7fe] rounded-xl hover:text-white hover:border-white border border-gray-200">
            <p className="text-xl tracking-wider">
              Modern technology for safer, faster treatment
            </p>
          </div>
          <div className="p-4 duration-300 transition-colors hover:gradient hover:bg-gradient-to-t hover:from-[#3802ff] hover:to-[#04b7fe] rounded-xl hover:text-white hover:border-white border border-gray-200">
            <p className="text-xl tracking-wider">
              Ransparent pricing & insurance accepted
            </p>
          </div>
          <div className="p-4 duration-300 transition-colors hover:gradient hover:bg-gradient-to-t hover:from-[#3802ff] hover:to-[#04b7fe] rounded-xl hover:text-white hover:border-white border border-gray-200">
            <p className="text-xl tracking-wider">
              5-star rated care trusted by your neighbors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
