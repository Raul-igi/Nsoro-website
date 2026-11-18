// CartPanel: the cart that drops down under the logo (like the inspo screenshots).
// It lists each item with its picture, colour, size and quantity controls,
// then the subtotal and a checkout button. The rest of the page is frosted behind it.
import { useEffect } from "react";
import { Link } from "react-router";
import { formatPrice } from "../config/store";
import { resolveLine, subtotal, useCart } from "../store/cart";
import { useUi } from "../store/ui";
import { CloseIcon } from "./icons";

export function CartPanel() {
  const { cartOpen, setCartOpen } = useUi();
  const { lines, setQuantity, remove } = useCart();

  // Let people close the cart with the Escape key.
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  // Nothing to draw while the cart is closed.
  if (!cartOpen) return null;

  return (
    <>
      {/* Frosted layer over the page; clicking it closes the cart. */}
      <div
        className="fixed inset-0 z-20 bg-white/25 backdrop-blur-[3px]"
        onClick={() => setCartOpen(false)}
        aria-hidden="true"
      />

      {/* The cart card itself. */}
      <section
        role="dialog"
        aria-label="Cart"
        className="glass-solid fixed top-20 left-4 z-30 flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] flex-col rounded-2xl sm:top-24 sm:left-6 sm:w-[380px]"
      >
        {/* Title row with the close button. */}
        <div className="mx-5 flex items-center justify-between border-b border-ink/15 py-4">
          <h2 className="text-xl font-semibold">Cart</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Empty cart: point people back to the products. */}
        {lines.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-slate">Your cart is empty.</p>
            <Link
              to="/"
              onClick={() => setCartOpen(false)}
              className="mt-4 inline-block font-semibold underline underline-offset-4"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            {/* The list of items; scrolls if there are many. */}
            <ul className="overflow-y-auto px-5">
              {lines.map((line, index) => {
                const item = resolveLine(line);
                // Skip lines whose product no longer exists in the catalogue.
                if (!item) return null;
                const { product, colorway, total } = item;
                return (
                  <li
                    key={`${line.slug}-${line.colorwayId}-${line.size}`}
                    className="flex gap-4 border-b border-ink/15 py-4 last:border-b-0"
                  >
                    {/* Product picture. */}
                    <img
                      src={colorway.images[0]}
                      alt=""
                      className="size-24 shrink-0 object-contain"
                    />

                    {/* Name, price, colour, size and quantity. */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 font-mono text-[0.8125rem] uppercase">
                      <div className="flex justify-between gap-3 text-[0.9375rem]">
                        <span>{product.name}</span>
                        <span className="shrink-0">{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5">
                          {colorway.name}
                          <span
                            className="size-2.5 rounded-full border border-ink/20"
                            style={{ background: colorway.swatch }}
                          />
                        </span>
                        {line.size && <span>Size: {line.size}</span>}
                      </div>
                      <p className="text-slate normal-case">Ready to ship</p>

                      {/* Quantity buttons and the remove button. */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>Qty</span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(index, line.quantity - 1)
                            }
                            aria-label={`One fewer ${product.name}`}
                            className="px-1"
                          >
                            −
                          </button>
                          <span aria-live="polite">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(index, line.quantity + 1)
                            }
                            aria-label={`One more ${product.name}`}
                            className="px-1"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-sm bg-ink/15 px-1.5 py-0.5 text-[0.75rem] hover:bg-ink/25"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Totals and the checkout button. */}
            <div className="border-t border-ink/15 px-5 pt-4 pb-5">
              <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-[0.9375rem] font-medium">
                <dt>Shipping</dt>
                <dd className="text-right">Calculated at checkout</dd>
                <dt>Subtotal</dt>
                <dd className="text-right">{formatPrice(subtotal(lines))}</dd>
              </dl>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="mt-5 block rounded-lg bg-white py-4 text-center text-lg font-semibold uppercase shadow-sm [font-stretch:110%] hover:bg-white/80"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
}
