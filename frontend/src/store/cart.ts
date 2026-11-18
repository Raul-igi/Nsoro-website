// The shopping cart. Zustand keeps it in memory and `persist` saves it in the
// browser, so the cart survives a page refresh.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Size } from "../data/products";

// One line in the cart: which product, which colour, which size, how many.
export interface CartLine {
  slug: string;
  colorwayId: string;
  size: Size | null; // null for one-size items
  quantity: number;
}

// Everything the cart can do.
interface CartState {
  lines: CartLine[];
  add: (line: Omit<CartLine, "quantity">) => void;
  setQuantity: (index: number, quantity: number) => void;
  remove: (index: number) => void;
  clear: () => void;
}

// Two lines are the same item if product, colour and size all match.
function sameItem(
  a: Omit<CartLine, "quantity">,
  b: Omit<CartLine, "quantity">,
) {
  return (
    a.slug === b.slug && a.colorwayId === b.colorwayId && a.size === b.size
  );
}

// Create the cart store and save it under "nsoro-cart" in the browser.
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],

      // Adding something already in the cart just bumps its quantity.
      add: (item) =>
        set((state) => {
          const index = state.lines.findIndex((line) => sameItem(line, item));
          if (index === -1)
            return { lines: [...state.lines, { ...item, quantity: 1 }] };
          const lines = [...state.lines];
          lines[index] = {
            ...lines[index],
            quantity: lines[index].quantity + 1,
          };
          return { lines };
        }),

      // Lowering the quantity to 0 removes the line.
      setQuantity: (index, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((_, i) => i !== index)
              : state.lines.map((line, i) =>
                  i === index ? { ...line, quantity } : line,
                ),
        })),

      remove: (index) =>
        set((state) => ({ lines: state.lines.filter((_, i) => i !== index) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "nsoro-cart",
      // When a saved cart is loaded, drop any lines whose product no longer exists,
      // so the cart never shows (or counts) items that can't be bought.
      merge: (saved, current) => ({
        ...current,
        lines: ((saved as Partial<CartState> | undefined)?.lines ?? []).filter(
          (line) => resolveLine(line) !== null,
        ),
      }),
    },
  ),
);

// Look up the full product and colour details for a cart line.
// Returns null if the product no longer exists (e.g. removed from the catalogue).
export function resolveLine(line: CartLine) {
  const product = PRODUCTS.find((p) => p.slug === line.slug);
  const colorway = product?.colorways.find((c) => c.id === line.colorwayId);
  if (!product || !colorway) return null;
  return { product, colorway, total: product.price * line.quantity };
}

// Total number of items, e.g. for the count bubble in the header.
// Lines for products that no longer exist (e.g. an old saved cart) aren't counted.
export function countItems(lines: CartLine[]) {
  return lines.reduce(
    (sum, line) => sum + (resolveLine(line) ? line.quantity : 0),
    0,
  );
}

// Sum of all line totals, before shipping.
export function subtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + (resolveLine(line)?.total ?? 0), 0);
}
