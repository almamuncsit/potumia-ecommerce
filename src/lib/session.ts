import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { api, ApiError } from "./api";
import type { Customer } from "./types";

/**
 * The customer's login lives in an httpOnly cookie holding their API token,
 * so page scripts can't read it. This is the store's own login: inventory
 * staff accounts don't work here and customer accounts don't work there.
 */
export const SESSION_COOKIE = "store_session";

const MAX_AGE = 30 * 24 * 60 * 60; // matches the API token lifetime

export async function setSession(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** The logged-in customer, or null (an expired token counts as logged out). Once per request. */
export const getCustomer = cache(async (): Promise<Customer | null> => {
  const token = await getToken();
  if (!token) return null;
  try {
    return (await api<{ data: Customer }>("/customer/me", { token })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});
