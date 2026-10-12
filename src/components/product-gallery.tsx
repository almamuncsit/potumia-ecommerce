"use client";

import { useEffect, useState } from "react";
import type { ProductImage } from "@/lib/types";
import { StoreImage } from "./store-image";

/**
 * The product's photos: a large one and, when there are more, thumbnails to
 * switch between them (main photo first, then the shop's extra photos).
 */
export function ProductGallery({ images, name, badge }: { images: ProductImage[]; name: string; badge?: React.ReactNode }) {
  const [index, setIndex] = useState(0);

  // A chosen variation (e.g. a color) with its own photo shows it
  useEffect(() => {
    const show = (e: Event) => {
      const at = images.findIndex((img) => img.image === (e as CustomEvent<string>).detail);
      if (at >= 0) setIndex(at);
    };
    window.addEventListener("product-photo", show);
    return () => window.removeEventListener("product-photo", show);
  }, [images]);
  const current = images[index] ?? null;

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface">
        <StoreImage
          key={current?.image ?? "none"}
          src={current?.image}
          fallback={name}
          fallbackClassName="text-[9rem]"
          alt={images.length > 1 ? `${name}, photo ${index + 1} of ${images.length}` : name}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="animate-[fade-in_0.3s_ease-out] object-cover"
        />
        {badge}
      </div>

      {images.length > 1 && (
        <ul aria-label="Product photos" className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <li key={img.image} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`relative block h-20 w-16 overflow-hidden rounded-xl bg-surface ring-2 transition sm:h-24 sm:w-20 ${
                  i === index ? "ring-accent-strong" : "ring-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <StoreImage src={img.thumb ?? img.image} alt="" fallback={name} fallbackClassName="text-xl" fill sizes="5rem" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
