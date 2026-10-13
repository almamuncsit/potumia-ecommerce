"use server";

import { redirect } from "next/navigation";
import { api, ApiError, fieldErrors } from "./api";
import { clearSession, getToken, setSession } from "./session";
import type { Customer, Order } from "./types";

export type FormState = {
  error?: string;
  fields?: Record<string, string>;
  ok?: string;
  values?: Record<string, string>;
};

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

/** Only send people back to pages on this site */
const safeNext = (value: string) => (value.startsWith("/") && !value.startsWith("//") ? value : "/account");

function failed(error: unknown, values: Record<string, string> = {}): FormState {
  if (error instanceof ApiError) {
    if (error.status === 429) return { error: error.message, values };
    if (error.status === 422) return { error: error.message, fields: fieldErrors(error), values };
  }
  console.error(error);
  return { error: "Something went wrong. Please try again.", values };
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const values = { email: text(form, "email") };
  try {
    const res = await api<{ token: string }>("/customer/login", {
      method: "POST",
      body: { email: values.email, password: String(form.get("password") ?? "") },
    });
    await setSession(res.token);
  } catch (error) {
    return failed(error, values);
  }
  redirect(safeNext(text(form, "next")));
}

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const values = { name: text(form, "name"), email: text(form, "email"), mobile: text(form, "mobile") };
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("password_confirmation") ?? "")) {
    return { fields: { password_confirmation: "The passwords don't match." }, values };
  }
  try {
    const res = await api<{ token: string }>("/customer/register", {
      method: "POST",
      body: { ...values, mobile: values.mobile || null, password },
    });
    await setSession(res.token);
  } catch (error) {
    return failed(error, values);
  }
  redirect(safeNext(text(form, "next")));
}

export async function logout() {
  const token = await getToken();
  if (token) {
    await api("/customer/logout", { method: "POST", token }).catch(() => undefined);
  }
  await clearSession();
  redirect("/");
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const token = await getToken();
  if (!token) redirect("/account/login");
  const values = { name: text(form, "name"), mobile: text(form, "mobile"), address: text(form, "address") };
  try {
    await api<{ data: Customer }>("/customer/me", {
      method: "PUT",
      token,
      body: { name: values.name, mobile: values.mobile || null, address: values.address || null },
    });
  } catch (error) {
    return failed(error, values);
  }
  return { ok: "Your details are saved.", values };
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const token = await getToken();
  if (!token) redirect("/account/login");
  const password = String(form.get("password") ?? "");
  if (password !== String(form.get("password_confirmation") ?? "")) {
    return { fields: { password_confirmation: "The passwords don't match." } };
  }
  try {
    await api("/customer/password", {
      method: "PUT",
      token,
      body: { current_password: String(form.get("current_password") ?? ""), password },
    });
  } catch (error) {
    return failed(error);
  }
  return { ok: "Password changed. Other devices have been logged out." };
}

export type CheckoutState = FormState & { cartErrors?: Record<number, string> };

/**
 * Place the order. The cart sends only product ids and quantities: prices and
 * stock are checked by the shop. client_ref makes a resubmission (double
 * click, retry) record the order once.
 */
export async function placeOrder(_: CheckoutState, form: FormData): Promise<CheckoutState> {
  const token = await getToken();
  let items: { product_id: number; quantity: number }[] = [];
  try {
    items = JSON.parse(String(form.get("items") ?? "[]"));
  } catch {
    items = [];
  }
  const values = {
    name: text(form, "name"),
    email: text(form, "email"),
    mobile: text(form, "mobile"),
    address: text(form, "address"),
    notes: text(form, "notes"),
  };

  let order: Order;
  try {
    order = (
      await api<{ data: Order }>("/orders", {
        method: "POST",
        token,
        body: {
          client_ref: text(form, "client_ref"),
          payment_method: text(form, "payment_method") || "cod",
          delivery_method_id: Number(text(form, "delivery_method_id")) || null,
          items,
          ...values,
          name: values.name || null,
          email: values.email || null,
          notes: values.notes || null,
        },
      })
    ).data;
  } catch (error) {
    const state: CheckoutState = failed(error, values);
    // "items.2.quantity" → the cart line it belongs to
    const cartErrors: Record<number, string> = {};
    for (const [field, message] of Object.entries(state.fields ?? {})) {
      const match = /^items\.(\d+)\./.exec(field);
      if (match && items[Number(match[1])]) cartErrors[items[Number(match[1])].product_id] = message;
    }
    return { ...state, cartErrors };
  }

  redirect(`/checkout/success?order=${encodeURIComponent(order.number)}&total=${order.total}`);
}
