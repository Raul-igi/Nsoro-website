// CheckoutPage: a calm, light page (like the inspo checkout) with two columns.
// Left: contact, delivery address, shipping method and payment.
// Right: the order summary with a discount code box and totals.
// Payments aren't connected yet, so "Place order" explains that instead of charging.
import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { BagIcon } from "../components/icons";
import {
  formatPrice,
  SHIPPING_COUNTRIES,
  SHIPPING_OPTIONS,
} from "../config/store";
import { resolveLine, subtotal, useCart } from "../store/cart";

// Shared look for every text box on this page.
const field =
  "w-full rounded-lg border border-mist bg-white px-4 py-3.5 text-[0.9375rem] text-ink placeholder:text-slate/70 focus:border-slate focus:outline-none";

export function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const [shippingId, setShippingId] = useState<string>(SHIPPING_OPTIONS[0].id);
  const [discountNote, setDiscountNote] = useState("");
  const [orderNote, setOrderNote] = useState("");

  // Work out the money: items, chosen shipping, total.
  const itemsTotal = subtotal(lines);
  const shipping =
    SHIPPING_OPTIONS.find((o) => o.id === shippingId)?.price ?? 0;
  const total = itemsTotal + shipping;

  // The form is checked by the browser (required fields); then we explain the preview state.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setOrderNote(
      "Payments aren't connected yet, so this order wasn't placed. Your cart is still saved.",
    );
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      {/* Top bar: logo back to the shop, bag icon back to the shop too. */}
      <header className="border-b border-mist">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
          <Link to="/" aria-label="Nsoro home" className="text-slate/80">
            <span className="logo-mark block h-6 w-32" />
          </Link>
          <Link to="/shop" aria-label="Back to the shop" className="text-slate">
            <BagIcon />
          </Link>
        </div>
      </header>

      {/* Empty cart: nothing to check out. */}
      {lines.length === 0 ? (
        <main className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-slate">
            Add something from the shop to check out.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-block font-semibold underline underline-offset-4"
          >
            Browse the shop
          </Link>
        </main>
      ) : (
        <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_420px] lg:gap-16">
          {/* LEFT COLUMN: the form. */}
          <form
            onSubmit={handleSubmit}
            className="order-2 flex flex-col gap-10 lg:order-1"
          >
            {/* Contact details. */}
            <section className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-slate">Contact</h2>
              <input
                type="email"
                required
                placeholder="Email"
                autoComplete="email"
                className={field}
              />
              <label className="flex items-center gap-3 text-[0.9375rem] text-slate">
                <input type="checkbox" className="size-4 accent-slate" />
                Email me about new drops and offers
              </label>
            </section>

            {/* Delivery address. */}
            <section className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-slate">Delivery</h2>
              <label className="relative">
                <span className="absolute top-2 left-4 text-xs text-slate">
                  Country/Region
                </span>
                <select
                  required
                  className={`${field} pt-6 pb-2`}
                  defaultValue={SHIPPING_COUNTRIES[0]}
                >
                  {SHIPPING_COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="First name"
                  autoComplete="given-name"
                  className={field}
                />
                <input
                  required
                  placeholder="Last name"
                  autoComplete="family-name"
                  className={field}
                />
              </div>
              <input
                required
                placeholder="Address"
                autoComplete="address-line1"
                className={field}
              />
              <input
                placeholder="Apartment, suite, etc. (optional)"
                autoComplete="address-line2"
                className={field}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="City"
                  autoComplete="address-level2"
                  className={field}
                />
                <input
                  placeholder="Postal code (optional)"
                  autoComplete="postal-code"
                  className={field}
                />
              </div>
              <input
                required
                type="tel"
                placeholder="Phone"
                autoComplete="tel"
                className={field}
              />
            </section>

            {/* Shipping method: one card per option, the chosen one outlined. */}
            <section className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-slate">
                Shipping method
              </h2>
              <div className="overflow-hidden rounded-lg border border-mist bg-white">
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 border-b border-mist px-4 py-4 last:border-b-0 ${
                      shippingId === option.id ? "bg-mist/50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingId === option.id}
                      onChange={() => setShippingId(option.id)}
                      className="mt-1 accent-slate"
                    />
                    <span className="flex-1">
                      <span className="block">{option.name}</span>
                      <span className="block text-sm text-slate">
                        {option.detail}
                      </span>
                    </span>
                    <span>{formatPrice(option.price)}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Payment: placeholder until a payment provider is chosen and connected. */}
            <section className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-slate">Payment</h2>
              <p className="rounded-lg border border-dashed border-slate/40 bg-white px-4 py-6 text-[0.9375rem] text-slate">
                Payment options will appear here once a payment provider is
                connected.
              </p>
            </section>

            {/* Place order, plus the message explaining the preview state. */}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="rounded-lg bg-slate py-4 text-lg font-medium text-white hover:bg-ink"
              >
                Place order
              </button>
              {orderNote && (
                <p
                  role="status"
                  className="rounded-lg bg-mist px-4 py-3 text-[0.9375rem]"
                >
                  {orderNote}
                </p>
              )}
            </div>
          </form>

          {/* RIGHT COLUMN: order summary. Shown first on phones so people see what they're buying. */}
          <aside className="order-1 lg:order-2">
            <div className="flex flex-col gap-6 lg:sticky lg:top-10">
              {/* Each item with a quantity badge on its picture. */}
              <ul className="flex flex-col gap-4">
                {lines.map((line) => {
                  const item = resolveLine(line);
                  if (!item) return null;
                  return (
                    <li
                      key={`${line.slug}-${line.colorwayId}-${line.size}`}
                      className="flex items-center gap-4"
                    >
                      <span className="relative shrink-0 rounded-xl border border-mist bg-white p-1.5">
                        <img
                          src={item.colorway.images[0]}
                          alt=""
                          className="size-16 object-contain"
                        />
                        <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-ink text-xs text-white">
                          {line.quantity}
                        </span>
                      </span>
                      <span className="flex-1">
                        <span className="block font-medium uppercase">
                          {item.product.name}
                        </span>
                        <span className="block text-sm text-slate uppercase">
                          {item.colorway.name}
                          {line.size ? ` / ${line.size}` : ""}
                        </span>
                      </span>
                      <span>{formatPrice(item.total)}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Discount code box. Codes aren't set up yet, so Apply explains that. */}
              <div>
                <div className="flex gap-2">
                  <input
                    placeholder="Discount code"
                    aria-label="Discount code"
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDiscountNote("Discount codes aren't set up yet.")
                    }
                    className="rounded-lg border border-mist bg-white px-5 text-slate hover:border-slate"
                  >
                    Apply
                  </button>
                </div>
                {discountNote && (
                  <p className="mt-2 text-sm text-slate">{discountNote}</p>
                )}
              </div>

              {/* Money summary. */}
              <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-[0.9375rem]">
                <dt>Subtotal</dt>
                <dd className="text-right">{formatPrice(itemsTotal)}</dd>
                <dt>Shipping</dt>
                <dd className="text-right">{formatPrice(shipping)}</dd>
                <dt className="mt-3 text-xl font-semibold">Total</dt>
                <dd className="mt-3 text-right text-xl font-semibold">
                  {formatPrice(total)}
                </dd>
              </dl>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}
