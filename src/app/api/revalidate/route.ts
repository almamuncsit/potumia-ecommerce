import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Called by the inventory app when the shop changes something the store
 * caches (shop info, Store details, delivery methods), so the website shows
 * it on the next visit instead of within the hour. Only the shop's own API
 * key (X-Website-Token) is accepted.
 *
 *   POST /api/revalidate   { "tags": ["store"] }
 */
const TAGS = ["store", "products", "categories", "brands"];

function sameKey(given: string | null): boolean {
  const key = process.env.WEBSITE_API_KEY ?? "";
  if (!key || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!sameKey(request.headers.get("x-website-token"))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { tags?: unknown };
  const asked = Array.isArray(body.tags) ? body.tags : ["store"];
  const tags = TAGS.filter((t) => asked.includes(t));
  // Gone at once: the next visit reads fresh data from the shop
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ ok: true, tags });
}
