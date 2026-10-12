"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/**
 * A horizontal, swipeable row (product rails, category chips). Scroll-snaps
 * on touch; on larger screens round arrow buttons appear when there's more to
 * see. Plain overflow scrolling without JavaScript.
 */
export function Rail({ children, label, itemClassName = "w-[46%] sm:w-[31%] lg:w-[23.5%]" }: { children: React.ReactNode; label: string; itemClassName?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <div className="group/rail relative">
      <ul
        ref={ref}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 py-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className={`shrink-0 snap-start ${itemClassName}`}>{child}</li>
        ))}
      </ul>
      {[
        { dir: -1 as const, hidden: edges.start, Icon: ArrowLeftIcon, label: "Scroll back", side: "-left-5" },
        { dir: 1 as const, hidden: edges.end, Icon: ArrowRightIcon, label: "Scroll for more", side: "-right-5" },
      ].map(({ dir, hidden, Icon, label: text, side }) => (
        <button
          key={dir}
          type="button"
          aria-label={text}
          onClick={() => scroll(dir)}
          className={`absolute top-[38%] z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-card text-text shadow-lg ring-1 ring-black/5 transition hover:bg-accent-strong hover:text-white lg:grid ${side} ${
            hidden ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
