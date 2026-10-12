import "server-only";
import { api, ApiError } from "./api";
import type { Order, OrderStatus, OrderSummary } from "./types";

/** A logged-in customer's orders (never cached: personal and changing) */
export async function getOrders(token: string): Promise<OrderSummary[]> {
  return (await api<{ data: OrderSummary[] }>("/customer/orders", { token })).data;
}

export async function getOrder(token: string, number: string): Promise<Order | null> {
  try {
    return (await api<{ data: Order }>(`/customer/orders/${encodeURIComponent(number)}`, { token })).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const STATUS_LABELS: Record<OrderStatus, { label: string; tone: string }> = {
  pending: { label: "Order placed", tone: "bg-surface text-text" },
  processing: { label: "Processing", tone: "bg-brand-soft text-brand" },
  shipping: { label: "On the way", tone: "bg-brand-soft text-brand" },
  delivered: { label: "Delivered", tone: "bg-ok/10 text-ok" },
  completed: { label: "Completed", tone: "bg-ok/10 text-ok" },
  canceled: { label: "Canceled", tone: "bg-danger/10 text-danger" },
};
