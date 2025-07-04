import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const Testimonials = () => {
  const swiperRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "' Absolutely the best dental experience I’ve ever had \n The team made me feel so comfortable, and my cleaning was\n quick and painless. '",
      name: "Sarah M.",
      title: "Product designer",
      image: "/images/testimonials-1.png",
      logo: "/images/logo.png",
    },
    {
      quote:
        "' Absolutely the best dental experience I’ve ever had \n The team made me feel so comfortable, and my cleaning was\n quick and painless. '",
      name: "Sarah M.",
      title: "Product designer",
      image: "/images/testimonials-1.png",
      logo: "/images/logo.png",
    },
    {
      quote:
        "' Absolutely the best dental experience I’ve ever had \n The team made me feel so comfortable, and my cleaning was\n quick and painless. '",
      name: "Sarah M.",
      title: "Product designer",
      image: "/images/testimonials-1.png",
      logo: "/images/logo.png",
    },
    // Add more slides as needed...
  ];

  return (
    <div id="reviews" className="flex justify-center items-center pt-40">
      {/* Left Button */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200"
      >
        <FaArrowLeft />
      </button>

      <Swiper
        effect="cards"
        grabCursor={true}
        modules={[EffectCards]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-[75%] lg:w-[60%] mySwiper mx-20"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide className="overflow-hidden" key={i}>
            <div
              className={`${
                i === activeIndex ? "bg-black text-white" : "bg-gray-200 text-black"
              } rounded-xl flex flex-col justify-between h-full shadow-lg overflow-hidden relative transition-all duration-300`}
            >
              <img src={t.logo} alt="logo" className="w-40 lg:w-50 py-6 lg:py-8 mx-auto" loading="lazy"/>
              <div className="text-md lg:text-lg mb-6 text-start font-light px-6">
                {t.quote.split("\n").map((line, index) => (
                  <p key={index}>
                    {line}
                    <br />
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="p-4 lg:p-6">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.title}</p>
                </div>
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-50 lg:w-[280px] xl:w-80 absolute bottom-0 right-2 lg:-right-10"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Right Button */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="z-10 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};
