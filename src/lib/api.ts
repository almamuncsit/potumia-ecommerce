import "server-only";

/**
 * Calls to the inventory API's online-store endpoints. Server-only: the
 * website key (which identifies the shop) and customer tokens never reach
 * the browser.
 */

const API_URL = (process.env.API_URL ?? "http://127.0.0.1:8001/api").replace(/\/+$/, "");
const WEBSITE_API_KEY = process.env.WEBSITE_API_KEY ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

type Options = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  /** A logged-in customer's token */
  token?: string;
};

export async function api<T>(path: string, { method = "GET", query, body, token }: Options = {}): Promise<T> {
  if (!WEBSITE_API_KEY) {
    throw new Error("WEBSITE_API_KEY is not set. Add the shop's website key to .env.local (see README).");
  }

  const url = new URL(`${API_URL}/ecommerce/store${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "" && value !== false) {
      url.searchParams.set(key, value === true ? "1" : String(value));
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "X-Website-Token": WEBSITE_API_KEY,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // Not cached here: catalog reads are cached by the "use cache"
    // functions in catalog.ts; customer calls are never cached
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(response.status, payload?.message ?? `Request failed (${response.status})`, payload?.errors ?? {});
  }

  return payload as T;
}

/** First message of each field, for forms */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  return Object.fromEntries(Object.entries(error.errors).map(([field, messages]) => [field, messages[0]]));
}
