"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";

/**
 * Crossfading slides: autoplay that pauses on hover, focus, a hidden tab or
 * "reduce motion"; arrows, dots and swipe. All slides are rendered on the
 * server (the first is visible without JavaScript); hidden ones are inert.
 */
export function Slider({ slides, label, interval = 6000 }: { slides: React.ReactNode[]; label: string; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) go(1);
    }, interval);
    return () => window.clearInterval(timer);
  }, [count, paused, interval, go]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="group/slider relative h-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="grid h-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={`col-start-1 row-start-1 transition-opacity duration-700 ease-out ${i === index ? "z-10 opacity-100" : "opacity-0"}`}
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {[
            { step: -1, Icon: ArrowLeftIcon, text: "Previous slide", side: "left-3" },
            { step: 1, Icon: ArrowRightIcon, text: "Next slide", side: "right-3" },
          ].map(({ step, Icon, text, side }) => (
            <button
              key={step}
              type="button"
              aria-label={text}
              onClick={() => go(step)}
              className={`absolute top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-text shadow-md transition hover:bg-brand hover:text-white focus-visible:opacity-100 sm:grid sm:opacity-0 sm:group-hover/slider:opacity-100 ${side}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-brand" : "w-2 bg-text/20 hover:bg-text/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
