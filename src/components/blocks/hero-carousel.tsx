"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: "phones",
    title: "Find your next device",
    subtitle: "Browse the latest electronics available in our store.",
    image:
      "/img-3.jpg",
  },
  {
    id: "Electronics",
    title: "Everything youn eed",
    subtitle: "All Electronics to digital life",
    image:
      "/img-2.jpg",
  },
  {
    id: "laptops",
    title: "Power through your day",
    subtitle: "Laptops built for work, gaming, and everything between.",
    image:
      "/img-1.jpg",
  },
];

export default function DeviceHeroBanner() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <section className="relative mx-auto mb-5 aspect-[2/1] w-[95%] max-w-5xl overflow-hidden shadow-md rounded-3xl bg-background">
      {/* Background photo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt="image"
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Readability gradient over the photo */}
      <div className="pointer-events-none absolute inset-0" />

      {/* Copy */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 sm:px-10 sm:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {slide.title}
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground  sm:text-lg">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel dots */}
        <div className="absolute bottom-6 right-6 flex gap-2 sm:bottom-8 sm:right-10">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-2 rounded-full bg-foreground/30 transition-all duration-300",
                i === active ? "w-6 bg-foreground" : "w-2 hover:bg-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
