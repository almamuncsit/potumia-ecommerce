"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";

/**
 * Cross-fading banner carousel. Slides are rendered on the server (so all of
 * them are in the HTML); this only switches between them. Autoplays, pauses
 * on hover / focus, swipes on touch, and stays still for reduced motion.
 */
export function Carousel({
  children,
  label,
  interval = 6000,
  className = "",
  controlsTone = "light",
}: {
  children: React.ReactNode;
  label: string;
  interval?: number;
  className?: string;
  /** Colour of the dots / arrows: light on dark slides, dark on light slides */
  controlsTone?: "light" | "dark";
}) {
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const timer = window.setTimeout(() => go(index + 1), interval);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduced, slides.length, interval, go]);

  const light = controlsTone === "light";

  return (
    <section
      ref={regionRef}
      aria-roledescription="carousel"
      aria-label={label}
      className={`relative isolate overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !regionRef.current?.contains(e.relatedTarget as Node) && setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
          aria-hidden={i !== index}
          inert={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "z-10 opacity-100" : "z-0 opacity-0"}`}
        >
          {slide}
        </div>
      ))}

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-center justify-between px-5 sm:bottom-5 sm:px-8">
          <div className="pointer-events-auto flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-7" : "w-2"} ${
                  light ? (i === index ? "bg-white" : "bg-white/45 hover:bg-white/70") : i === index ? "bg-accent-strong" : "bg-text/20 hover:bg-text/40"
                }`}
              />
            ))}
          </div>
          <div className="pointer-events-auto hidden gap-2 sm:flex">
            {[
              { step: -1, Icon: ArrowLeftIcon, text: "Previous slide" },
              { step: 1, Icon: ArrowRightIcon, text: "Next slide" },
            ].map(({ step, Icon, text }) => (
              <button
                key={text}
                type="button"
                aria-label={text}
                onClick={() => go(index + step)}
                className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${
                  light ? "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/30" : "bg-card/80 text-text ring-1 ring-black/10 hover:bg-card"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
