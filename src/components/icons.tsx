/** Line icons (24×24, currentColor). Decorative: hidden from screen readers. */
type IconProps = { className?: string };

function Svg({ className = "h-5 w-5", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Svg>;
export const UserIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20.5c.9-3.7 3.9-5.8 7.5-5.8s6.6 2.1 7.5 5.8" /></Svg>;
export const BagIcon = (p: IconProps) => <Svg {...p}><path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" /><path d="M9 10V6.5a3 3 0 0 1 6 0V10" /></Svg>;
export const MenuIcon = (p: IconProps) => <Svg {...p}><path d="M4 7h16M4 12h16M4 17h10" /></Svg>;
export const CloseIcon = (p: IconProps) => <Svg {...p}><path d="m6 6 12 12M18 6 6 18" /></Svg>;
export const ArrowRightIcon = (p: IconProps) => <Svg {...p}><path d="M4 12h15m-5-5 5 5-5 5" /></Svg>;
export const ArrowLeftIcon = (p: IconProps) => <Svg {...p}><path d="M20 12H5m5-5-5 5 5 5" /></Svg>;
export const ChevronDownIcon = (p: IconProps) => <Svg {...p}><path d="m6 9 6 6 6-6" /></Svg>;
export const PlusIcon = (p: IconProps) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const MinusIcon = (p: IconProps) => <Svg {...p}><path d="M5 12h14" /></Svg>;
export const TruckIcon = (p: IconProps) => <Svg {...p}><path d="M3 6.5h11v9H3zM14 9.5h3.8l3.2 3.2v2.8h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></Svg>;
export const CashIcon = (p: IconProps) => <Svg {...p}><rect x="3" y="6.5" width="18" height="11" rx="1.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6.5 9.5v.01M17.5 14.5v.01" /></Svg>;
export const ExchangeIcon = (p: IconProps) => <Svg {...p}><path d="M4 8.5h13.5L14 5M20 15.5H6.5L10 19" /></Svg>;
export const ShieldIcon = (p: IconProps) => <Svg {...p}><path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6l7-2.5Z" /><path d="m9 12 2.2 2.2L15.5 10" /></Svg>;
export const PhoneIcon = (p: IconProps) => <Svg {...p}><path d="M6.6 3.8 9 4.4l1.2 3.7-1.8 1.3a10.6 10.6 0 0 0 6.2 6.2l1.3-1.8 3.7 1.2.6 2.4c.2 1-.6 2-1.6 2C10.7 19.4 4.6 13.3 4.6 5.4c0-1 1-1.8 2-1.6Z" /></Svg>;
export const MailIcon = (p: IconProps) => <Svg {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></Svg>;
export const PinIcon = (p: IconProps) => <Svg {...p}><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.4" /></Svg>;
export const ClockIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Svg>;
export const SparkleIcon = (p: IconProps) => <Svg {...p}><path d="M12 3.5 13.8 10 20.5 12l-6.7 2-1.8 6.5-1.8-6.5L3.5 12l6.7-2L12 3.5Z" /></Svg>;
export const RulerIcon = (p: IconProps) => <Svg {...p}><rect x="2.5" y="8" width="19" height="8" rx="1" /><path d="M6 8v3M9.5 8v4.5M13 8v3M16.5 8v4.5" /></Svg>;
export const WhatsAppIcon = ({ className = "h-5 w-5" }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.5A9.5 9.5 0 0 0 3.8 16.8L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5Zm0 17.3c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.8Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z" />
  </svg>
);

/** Social networks, keyed by the label the shop's links use (Store details) */
export const SOCIAL_ICONS = {
  Facebook: (p: IconProps) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={p.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.4 1.5-1.4h1.4V5.1c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8Z" />
    </svg>
  ),
  Instagram: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17.2 6.8v.01" />
    </Svg>
  ),
  YouTube: (p: IconProps) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={p.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M21.2 7.7a2.4 2.4 0 0 0-1.7-1.7C18 5.6 12 5.6 12 5.6s-6 0-7.5.4a2.4 2.4 0 0 0-1.7 1.7C2.4 9.2 2.4 12 2.4 12s0 2.8.4 4.3c.2.8.9 1.5 1.7 1.7 1.5.4 7.5.4 7.5.4s6 0 7.5-.4a2.4 2.4 0 0 0 1.7-1.7c.4-1.5.4-4.3.4-4.3s0-2.8-.4-4.3ZM10.1 14.9V9.1l5 2.9-5 2.9Z" />
    </svg>
  ),
  TikTok: (p: IconProps) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={p.className ?? "h-5 w-5"} fill="currentColor">
      <path d="M16.6 3h-3.2v12.2a2.6 2.6 0 1 1-1.8-2.5V9.4a5.8 5.8 0 1 0 5 5.8V9.1a7.4 7.4 0 0 0 4.1 1.3V7.2c-2.3 0-4-1.8-4.1-4.2Z" />
    </svg>
  ),
};
