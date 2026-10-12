"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import { Drape, GoldRings, Lattice } from "./art";

type Slide = {
  key: string;
  theme: "dark" | "light";
  eyebrow: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    key: "season",
    theme: "dark",
    eyebrow: "New season collection",
    title: "Dressed in quiet confidence",
    text: "Refined pieces in considered fabrics, designed to be worn and remembered. Discover what's new at Evoke.",
    primary: { label: "Shop the collection", href: "/products" },
    secondary: { label: "New arrivals", href: "/products?sort=newest" },
  },
  {
    key: "essentials",
    theme: "light",
    eyebrow: "The Evoke edit",
    title: "Timeless essentials, made to last",
    text: "Clean lines, easy fits and colours that work together. The pieces our customers come back for.",
    primary: { label: "Shop best sellers", href: "/products?sort=popular" },
    secondary: { label: "Our story", href: "/about" },
  },
  {
    key: "delivery",
    theme: "dark",
    eyebrow: "Shop with ease",
    title: "Cash on delivery, all over Bangladesh",
    text: `Order online and pay when it reaches your door. Not quite right? Exchange it within ${BRAND.policies.exchangeDays} days.`,
    primary: { label: "Start shopping", href: "/products" },
    secondary: { label: "Delivery details", href: "/shipping" },
  },
];

const INTERVAL = 6500;

function SlideArt({ slide, active }: { slide: Slide; active: boolean }) {
  const motion = `transition-transform duration-[2500ms] ease-out ${active ? "scale-100" : "scale-105"}`;

  if (slide.key === "season") {
    return (
      <div className={`absolute inset-0 ${motion}`}>
        <GoldRings id="hero-rings" className="absolute -right-24 top-1/2 h-[140%] w-auto -translate-y-1/2 opacity-60 md:right-0 md:opacity-100" />
        <Image
          src={BRAND.logo.mark.src}
          alt=""
          width={BRAND.logo.mark.width}
          height={BRAND.logo.mark.height}
          priority
          sizes="(min-width: 768px) 34vw, 60vw"
          className="absolute right-[-6%] top-1/2 w-[62%] max-w-[26rem] -translate-y-1/2 opacity-30 drop-shadow-[0_20px_60px_rgba(198,162,90,0.35)] md:right-[11%] md:w-[30%] md:opacity-95"
        />
      </div>
    );
  }
  if (slide.key === "essentials") {
    return (
      <div className={`absolute inset-0 ${motion}`}>
        <Drape id="hero-drape" className="absolute inset-0 h-full w-full" />
      </div>
    );
  }
  return (
    <div className={`absolute inset-0 ${motion}`}>
      <Lattice id="hero-lattice" className="absolute inset-0 h-full w-full" />
    </div>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduced, go]);

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !regionRef.current?.contains(e.relatedTarget as Node) && setPaused(false)}
    >
      <div className="relative h-[34rem] sm:h-[36rem] lg:h-[40rem]">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          const dark = slide.theme === "dark";
          const Heading = i === 0 ? "h1" : "h2";

          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={!active}
              inert={!active}
              className={`absolute inset-0 transition-opacity duration-1000 ${active ? "z-10 opacity-100" : "z-0 opacity-0"} ${
                dark ? "bg-[radial-gradient(120%_120%_at_80%_40%,#2a2419_0%,#0e0d0b_60%)] text-on-ink" : "bg-[#f1eadc] text-text"
              }`}
            >
              <SlideArt slide={slide} active={active} />
              {/* Keeps text readable where the art runs behind it on small screens */}
              <div
                className={`absolute inset-0 md:hidden ${dark ? "bg-gradient-to-t from-ink via-ink/70 to-ink/20" : "bg-gradient-to-t from-[#f1eadc] via-[#f1eadc]/80 to-transparent"}`}
              />
              <div className="container-x relative flex h-full items-end pb-20 md:items-center md:pb-0">
                <div key={active ? `on-${index}` : "off"} className={`max-w-xl ${active ? "animate-fade-up" : ""}`}>
                  <p className={`eyebrow ${dark ? "text-gold-light" : "text-gold-deep"}`}>{slide.eyebrow}</p>
                  <Heading className="font-display mt-4 text-[2.6rem] font-medium leading-[1.05] sm:text-6xl lg:text-7xl">
                    {slide.title}
                  </Heading>
                  <p className={`mt-5 max-w-md text-base leading-relaxed sm:text-lg ${dark ? "text-on-ink-muted" : "text-muted"}`}>{slide.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={slide.primary.href} className={`btn ${dark ? "btn-gold" : "btn-primary"}`}>
                      {slide.primary.label}
                    </Link>
                    {slide.secondary && (
                      <Link href={slide.secondary.href} className={`btn ${dark ? "btn-ghost-light" : "btn-outline"}`}>
                        {slide.secondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-6 z-20 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}: ${slide.title}`}
              aria-current={i === index}
              className="group relative h-6 w-10"
            >
              <span className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full ${SLIDES[index].theme === "dark" ? "bg-white/25" : "bg-black/15"}`} />
              <span
                className={`absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gold ${
                  i === index ? (paused || reduced ? "w-full" : "w-full transition-[width] ease-linear") : "w-0"
                }`}
                style={i === index && !paused && !reduced ? { animation: `hero-progress ${INTERVAL}ms linear` } : undefined}
              />
            </button>
          ))}
        </div>
        <div className="pointer-events-auto flex gap-2">
          {[
            { label: "Previous slide", step: -1, Icon: ArrowLeftIcon },
            { label: "Next slide", step: 1, Icon: ArrowRightIcon },
          ].map(({ label, step, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => go(index + step)}
              className={`grid h-11 w-11 place-items-center rounded-full border transition ${
                SLIDES[index].theme === "dark" ? "border-white/30 text-on-ink hover:border-gold-light hover:text-gold-light" : "border-black/20 text-text hover:bg-text hover:text-bg"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes hero-progress { from { width: 0 } to { width: 100% } }`}</style>
    </section>
  );
}
