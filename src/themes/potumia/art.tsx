/**
 * Potumia artwork, from the Potumia website: soft translucent circles on the
 * indigo → violet gradient, and indigo / sky glows on light sections.
 * Decorative only; each takes an id so gradients stay unique on a page.
 */

type ArtProps = { id: string; className?: string };

/** Overlapping soft circles (gradient / dark backgrounds) */
export function ArtRings({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#48c7f4" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="390" cy="230" r="210" fill={`url(#${id}-a)`} />
      <circle cx="190" cy="430" r="150" fill={`url(#${id}-b)`} />
      <circle cx="300" cy="300" r="268" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.2" />
      <circle cx="300" cy="300" r="190" fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 8" />
      <circle cx="505" cy="120" r="7" fill="#8edbf8" />
      <circle cx="120" cy="250" r="4" fill="#ffffff" fillOpacity="0.7" />
    </svg>
  );
}

/** Soft indigo, violet and sky glows with a few dots (light backgrounds) */
export function ArtFlow({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="50" />
        </filter>
        <pattern id={`${id}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#6366f1" fillOpacity="0.22" />
        </pattern>
      </defs>
      <g filter={`url(#${id}-blur)`}>
        <circle cx="620" cy="170" r="170" fill="#a78bfa" fillOpacity="0.45" />
        <circle cx="470" cy="470" r="150" fill="#48c7f4" fillOpacity="0.35" />
        <circle cx="760" cy="440" r="120" fill="#6366f1" fillOpacity="0.3" />
      </g>
      <rect x="520" y="60" width="240" height="180" fill={`url(#${id}-dots)`} />
    </svg>
  );
}

/** Dot grid fading out from the right (works on light and gradient backgrounds) */
export function ArtPattern({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`${id}-p`} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#6366f1" fillOpacity="0.35" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="80%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width="800" height="600" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-p)`} mask={`url(#${id}-m)`} />
    </svg>
  );
}

/** A short gradient bar */
export function ArtDivider({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex ${className}`}>
      <span className="h-1 w-16 rounded-full" style={{ background: "linear-gradient(90deg, #a5b4fc, #48c7f4)" }} />
    </span>
  );
}
