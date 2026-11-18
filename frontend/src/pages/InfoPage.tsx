// InfoPage: simple text pages (Contact, Policies, Account, page not found) shown
// on a frosted card over the coloured background. All the wording is TEMPLATE text
// to be replaced with Nsoro's real details.
import type { ReactNode } from "react";
import { Link } from "react-router";

// Shared card layout for every info page.
function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-start justify-center px-4 pt-28 pb-16 sm:pt-36">
      <article className="glass w-full max-w-2xl rounded-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold uppercase [font-stretch:118%] sm:text-4xl">
          {title}
        </h1>
        <div className="mt-6 flex max-w-[65ch] flex-col gap-4 text-[1rem] leading-relaxed">
          {children}
        </div>
      </article>
    </main>
  );
}

// Contact page. TEMPLATE: real email, phone and hours come later.
export function ContactPage() {
  return (
    <InfoCard title="Contact">
      <p>
        Questions about an order, sizing or a return? Write to us and we'll
        reply within two working days.
      </p>
      <p className="font-mono">hello@nsoro.example</p>
      <p className="opacity-80">Include your order number if you have one.</p>
    </InfoCard>
  );
}

// Policies page. TEMPLATE: real shipping, returns and privacy policies come later.
export function PoliciesPage() {
  return (
    <InfoCard title="Policies">
      <h2 className="text-lg font-semibold">Shipping</h2>
      <p>
        Orders leave within 2 working days. Delivery times and prices are shown
        at checkout.
      </p>
      <h2 className="text-lg font-semibold">Returns</h2>
      <p>Unworn items with tags can be returned within 14 days of delivery.</p>
      <h2 className="text-lg font-semibold">Privacy</h2>
      <p>We only use your details to process and deliver your order.</p>
    </InfoCard>
  );
}

// Account page. Customer sign-in isn't built yet.
export function AccountPage() {
  return (
    <InfoCard title="Account">
      <p>
        Customer accounts are coming soon. For now you can shop and check out
        without signing in.
      </p>
      <Link to="/" className="font-semibold underline underline-offset-4">
        Back to the shop
      </Link>
    </InfoCard>
  );
}

// Shown for any address that doesn't match a page.
export function NotFoundPage() {
  return (
    <InfoCard title="Page not found">
      <p>
        This page doesn't exist. It may have moved, or the link may be mistyped.
      </p>
      <Link to="/" className="font-semibold underline underline-offset-4">
        Back to the shop
      </Link>
    </InfoCard>
  );
}
