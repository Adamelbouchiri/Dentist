import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { FiArrowLeft, FiArrowRight, FiStar } from "react-icons/fi";
import { testimonials } from "../../data/clinic";
import { Eyebrow } from "../ui/Misc";

export const Testimonials = () => {
  const swiperRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="relative isolate overflow-hidden rounded-[40px] bg-ink-950 px-6 py-16 md:px-12 lg:px-16 lg:py-24">
        <div className="absolute -left-40 -top-40 -z-10 size-[520px] rounded-full bg-primary-500/40 blur-[140px]" />
        <div className="absolute -bottom-40 right-0 -z-10 size-[420px] rounded-full bg-accent-500/25 blur-[140px]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow tone="light">Testimonials</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-5xl lg:text-[56px]">
              What our clients are{" "}
              <span className="font-display italic text-accent-300">saying</span>
            </h2>
            <p className="mt-5 max-w-md text-white/60 leading-relaxed">
              Real stories from patients who trusted us with their smiles.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex gap-2">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous testimonial"
                  className="grid size-12 place-items-center rounded-full text-white ring-1 ring-white/20 transition hover:bg-white hover:text-ink-900"
                >
                  <FiArrowLeft />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next testimonial"
                  className="grid size-12 place-items-center rounded-full bg-white text-ink-900 transition hover:bg-accent-300"
                >
                  <FiArrowRight />
                </button>
              </div>
              <p className="font-display text-3xl italic text-white">
                0{activeIndex + 1}
                <span className="text-lg text-white/40"> / 0{testimonials.length}</span>
              </p>
            </div>
          </div>

          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            cardsEffect={{ perSlideOffset: 9, perSlideRotate: 3, slideShadows: false }}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            className="w-full max-w-[560px]"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <figure
                  className={`relative flex min-h-[400px] flex-col overflow-hidden rounded-[28px] p-8 transition-colors duration-500 md:min-h-[420px] md:p-10 ${
                    i === activeIndex ? "bg-white" : "bg-ink-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <img src="/images/logo.png" alt="Doctor Bennani" className="h-10" />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <FiStar key={k} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <span className="mt-6 font-display text-7xl leading-none text-gradient">“</span>
                  <blockquote className="text-lg font-medium leading-relaxed tracking-tight text-ink-800 md:text-xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 border-t border-ink-100 pt-6">
                    {t.image ? (
                      <span className="relative size-12 overflow-hidden rounded-full bg-ink-50 ring-1 ring-ink-200">
                        <img
                          src={t.image}
                          alt=""
                          className="absolute left-1/2 top-0 w-[260%] max-w-none -translate-x-1/2"
                        />
                      </span>
                    ) : (
                      <span className="grid size-12 place-items-center rounded-full gradient-primary text-sm font-semibold text-white">
                        {t.name[0]}
                      </span>
                    )}
                    <div>
                      <p className="font-semibold text-ink-900">{t.name}</p>
                      <p className="text-sm text-ink-400">{t.title}</p>
                    </div>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};
