"use client";

import { useSyncExternalStore } from "react";

/**
 * The cart, kept in this browser (localStorage) and shared by every tab.
 * Prices here are only for display: the shop prices the order at checkout.
 */
export type CartLine = {
  product_id: number;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
  /** Stock when added, to cap the quantity picker */
  max: number;
};

const KEY = "store-cart:v1";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let snapshot: CartLine[] | null = null;

function read(): CartLine[] {
  if (snapshot) return snapshot;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    snapshot = Array.isArray(parsed) ? parsed : [];
  } catch {
    snapshot = [];
  }
  return snapshot;
}

function write(lines: CartLine[]) {
  snapshot = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private mode / storage full: the cart still works for this page view
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return { lines, count, subtotal };
}

const clamp = (quantity: number, max: number) => Math.max(1, Math.min(Math.floor(quantity) || 1, Math.max(1, Math.floor(max)), 999));

export const cart = {
  add(line: Omit<CartLine, "quantity">, quantity = 1) {
    const lines = read();
    const existing = lines.find((l) => l.product_id === line.product_id);
    write(
      existing
        ? lines.map((l) => (l === existing ? { ...l, ...line, quantity: clamp(l.quantity + quantity, line.max) } : l))
        : [...lines, { ...line, quantity: clamp(quantity, line.max) }],
    );
  },
  setQuantity(productId: number, quantity: number) {
    write(read().map((l) => (l.product_id === productId ? { ...l, quantity: clamp(quantity, l.max) } : l)));
  },
  remove(productId: number) {
    write(read().filter((l) => l.product_id !== productId));
  },
  clear() {
    write([]);
  },
};

/**
 * The slide-in mini cart: opened after adding something (with the item that
 * was added) or from the header bag icon.
 */
type DrawerState = { open: boolean; added: CartLine | null };
let drawer: DrawerState = { open: false, added: null };
const drawerListeners = new Set<() => void>();
const CLOSED: DrawerState = { open: false, added: null };

function setDrawer(next: DrawerState) {
  drawer = next;
  drawerListeners.forEach((listener) => listener());
}

export const cartDrawer = {
  open(added: CartLine | null = null) {
    setDrawer({ open: true, added });
  },
  close() {
    setDrawer({ ...drawer, open: false });
  },
};

export function useCartDrawer(): DrawerState {
  return useSyncExternalStore(
    (listener) => {
      drawerListeners.add(listener);
      return () => drawerListeners.delete(listener);
    },
    () => drawer,
    () => CLOSED,
  );
}

/** Add to the bag and show it in the mini cart */
export function addToBag(line: Omit<CartLine, "quantity">, quantity = 1) {
  cart.add(line, quantity);
  cartDrawer.open({ ...line, quantity });
}
