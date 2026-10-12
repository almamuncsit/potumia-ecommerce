/**
 * Banner artwork drawn in SVG, in the brand's ink, sand and brushed gold:
 * sharp at any size and a few kilobytes instead of large photos. Each takes an
 * id so gradients stay unique when several are on one page. Decorative only.
 */

type ArtProps = { id: string; className?: string };

/** Concentric gold rings with a soft glow (dark backgrounds) */
export function GoldRings({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c6a25a" stopOpacity="0.38" />
          <stop offset="45%" stopColor="#8a6a2e" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#0e0d0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e7cf96" />
          <stop offset="50%" stopColor="#c6a25a" />
          <stop offset="100%" stopColor="#8a6a2e" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="300" r="300" fill={`url(#${id}-glow)`} />
      {[118, 160, 205, 252, 290].map((r, i) => (
        <circle
          key={r}
          cx="300"
          cy="300"
          r={r}
          fill="none"
          stroke={`url(#${id}-stroke)`}
          strokeWidth={i === 2 ? 1.4 : 0.8}
          strokeOpacity={0.55 - i * 0.08}
          strokeDasharray={i % 2 ? "2 7" : undefined}
        />
      ))}
      <path d="M70 300a230 230 0 0 1 460 0" fill="none" stroke={`url(#${id}-stroke)`} strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
      <circle cx="530" cy="300" r="4" fill="#e7cf96" />
    </svg>
  );
}

/** Flowing fabric folds in sand and gold (light backgrounds) */
export function Drape({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#efe7d9" />
          <stop offset="55%" stopColor="#e2cfa6" />
          <stop offset="100%" stopColor="#c6a25a" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9c08a" />
          <stop offset="60%" stopColor="#b38a45" />
          <stop offset="100%" stopColor="#7c5d26" />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f6efe2" />
          <stop offset="100%" stopColor="#e7cf96" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8e8" />
          <stop offset="70%" stopColor="#f0e2c2" />
          <stop offset="100%" stopColor="#e9dcc0" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <circle cx="560" cy="210" r="190" fill={`url(#${id}-sun)`} />
      <path d="M0 330C140 250 280 420 450 330S700 200 800 250V600H0Z" fill="#7c5d26" opacity="0.25" filter={`url(#${id}-soft)`} />
      <path d="M0 320C140 240 280 410 450 320S700 190 800 240V600H0Z" fill={`url(#${id}-a)`} />
      <path d="M0 420C170 340 300 520 480 420S720 330 800 370V600H0Z" fill="#5b431b" opacity="0.22" filter={`url(#${id}-soft)`} />
      <path d="M0 410C170 330 300 510 480 410S720 320 800 360V600H0Z" fill={`url(#${id}-b)`} />
      <path d="M0 500C190 440 330 600 520 500S730 450 800 470V600H0Z" fill={`url(#${id}-c)`} />
      <path d="M0 320C140 240 280 410 450 320S700 190 800 240" fill="none" stroke="#fff6e0" strokeOpacity="0.8" strokeWidth="1.5" />
      <path d="M0 410C170 330 300 510 480 410S720 320 800 360" fill="none" stroke="#f6e3b4" strokeOpacity="0.7" strokeWidth="1.2" />
    </svg>
  );
}

/** Diamond lattice fading out from a warm glow (dark backgrounds) */
export function Lattice({ id, className }: ArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`${id}-p`} width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0H56M0 0V56" stroke="#c6a25a" strokeWidth="0.7" strokeOpacity="0.5" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="70%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width="800" height="600" fill={`url(#${id}-fade)`} />
        </mask>
        <radialGradient id={`${id}-glow`} cx="70%" cy="50%" r="45%">
          <stop offset="0%" stopColor="#c6a25a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#0e0d0b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-glow)`} />
      <rect width="800" height="600" fill={`url(#${id}-p)`} mask={`url(#${id}-m)`} />
      <path d="M560 120 680 300 560 480 440 300Z" fill="none" stroke="#e7cf96" strokeOpacity="0.85" strokeWidth="1.5" />
      <path d="M560 165 650 300 560 435 470 300Z" fill="none" stroke="#c6a25a" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

/** A thin gold divider with a diamond in the middle */
export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center justify-center gap-3 text-gold ${className}`}>
      <span className="h-px w-12 bg-current opacity-60" />
      <span className="h-1.5 w-1.5 rotate-45 bg-current" />
      <span className="h-px w-12 bg-current opacity-60" />
    </span>
  );
}
