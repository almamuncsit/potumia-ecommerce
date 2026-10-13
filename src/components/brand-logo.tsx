import Image from "next/image";
import type { SiteBrand } from "@/lib/site";

type Tone = "light" | "dark";
type Size = "sm" | "md" | "lg";

const HEIGHT: Record<Size, string> = { sm: "h-7", md: "h-8 lg:h-10", lg: "h-10" };
const MARK: Record<Size, string> = { sm: "h-8 w-8 text-sm", md: "h-9 w-9 text-base lg:h-11 lg:w-11 lg:text-lg", lg: "h-11 w-11 text-lg" };
const NAME: Record<Size, string> = { sm: "text-lg", md: "text-lg lg:text-2xl", lg: "text-2xl" };

/** "Dokan Pat" → "DP", "Dokanpat" → "D" */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/**
 * The store's logo. Themes for one brand show their own artwork; themes for
 * any shop show the shop's logo and name from the shop info: a wide logo on
 * its own, a square one beside the name, and the name with its initials when
 * the shop has no logo. Works in server and client components.
 */
export function BrandLogo({ brand, tone = "light", size = "md", priority = false }: { brand: SiteBrand; tone?: Tone; size?: Size; priority?: boolean }) {
  if (!brand.fromShop) {
    const art = tone === "dark" ? brand.logo.onDark : brand.logo.onLight;
    return <Image src={art.src} alt={brand.name} width={art.width} height={art.height} priority={priority} className={`${HEIGHT[size]} w-auto`} />;
  }

  const onDark = tone === "dark";
  // On dark backgrounds: the dark-background logo when the shop set one,
  // else the logo on a white tile (logos are made for light backgrounds)
  const logo = (onDark && brand.shopLogoDark) || brand.shopLogo;
  const tile = onDark && !brand.shopLogoDark ? "rounded-lg bg-white p-1" : "";

  if (logo?.wide) {
    return (
      <span className={`inline-flex ${tile}`}>
        <Image src={logo.src} alt={brand.name} width={logo.width} height={logo.height} priority={priority} className={`${HEIGHT[size]} w-auto max-w-[14rem] object-contain`} />
      </span>
    );
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      {logo ? (
        <span className={`inline-flex shrink-0 ${tile}`}>
          <Image src={logo.src} alt="" width={logo.width} height={logo.height} priority={priority} className={`${MARK[size]} rounded-lg object-contain`} />
        </span>
      ) : (
        <span aria-hidden="true" className={`brand-mark grid shrink-0 place-items-center rounded-xl font-extrabold text-white ${MARK[size]}`}>
          {initials(brand.name)}
        </span>
      )}
      <span className={`font-display truncate font-extrabold leading-none tracking-tight ${NAME[size]} ${onDark ? "text-on-ink" : "text-text"}`}>{brand.name}</span>
    </span>
  );
}
