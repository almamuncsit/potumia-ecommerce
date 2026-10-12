"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with an elegant stand-in when there's no picture or it fails to
 * load: the item's initial in the brand serif on sand (no broken-image icon).
 */
export function StoreImage({ src, alt, fallback, fallbackClassName = "text-5xl", ...props }: Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  fallback: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center placeholder-surface font-display text-accent-strong/45 ${fallbackClassName}`}
      >
        {fallback.trim().slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return <Image src={src} alt={alt} onError={() => setFailed(true)} {...props} />;
}
