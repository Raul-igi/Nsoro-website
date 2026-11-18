// useMediaQuery: tells a component whether a screen condition is true right now,
// e.g. "is this a touch screen?", and updates it if the condition changes
// (for example when a window is resized or a phone is rotated).
import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    // Listen for the browser telling us the condition changed.
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    // Read the current answer (true or false).
    () => window.matchMedia(query).matches,
  );
}

// The screens that get the one-product-at-a-time scrolling shop:
// - devices that can't hover (phones and tablets with no mouse), or
// - very narrow windows (phone-sized), where the scattered layout gets cramped.
// Everything else (computers with a mouse) keeps the scattered, hover-to-colour shop.
export const SCROLL_SHOP_QUERY = "(hover: none), (max-width: 639px)";
