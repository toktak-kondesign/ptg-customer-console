"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/images/banner01.png", alt: "Banner 1" },
  { src: "/images/banner02.jpg", alt: "Banner 2" },
  { src: "/images/banner03.jpg", alt: "Banner 3" },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((n: number) => setCurrentSlide(n), []);
  const nextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % slides.length),
    [],
  );
  const prevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      <div className="relative w-full overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative w-full shrink-0 aspect-[1920/600]"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 rounded-full flex items-center justify-center text-gray-900 font-bold hover:bg-white transition z-10"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 rounded-full flex items-center justify-center text-gray-900 font-bold hover:bg-white transition z-10"
        >
          ❯
        </button>
      </div>
    </section>
  );
}
