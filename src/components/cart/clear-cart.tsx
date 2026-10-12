"use client";

import { useEffect } from "react";
import { cart } from "./cart-store";

/** Empties the cart once the order is placed */
export function ClearCart() {
  useEffect(() => cart.clear(), []);
  return null;
}
