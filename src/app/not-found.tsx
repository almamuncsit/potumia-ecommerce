import Link from "next/link";
import { GoldRings } from "@/components/banners/art";

export default function NotFound() {
  return (
    <div className="container-x py-12 lg:py-20">
      <div className="relative isolate mx-auto max-w-3xl overflow-hidden rounded-3xl bg-[radial-gradient(120%_120%_at_50%_0%,#2a2419,#0e0d0b_65%)] px-6 py-20 text-center text-on-ink">
        <GoldRings id="nf" className="absolute left-1/2 top-1/2 -z-10 h-[140%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <p className="font-display text-gold-gradient text-8xl font-medium">404</p>
        <h1 className="font-display mt-4 text-4xl font-medium">This page has moved on</h1>
        <p className="mx-auto mt-3 max-w-md text-on-ink-muted">The piece may no longer be available, or the link isn&apos;t quite right. Let&apos;s find you something else.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-gold">Shop all</Link>
          <Link href="/" className="btn btn-ghost-light">Home</Link>
        </div>
      </div>
    </div>
  );
}
