// Store-wide settings in one place, so they're easy to change later.
// Everything marked TEMPLATE is a placeholder until real business details are decided.

// The currency prices are shown in. TEMPLATE: swap for the real currency (e.g. 'RWF').
export const CURRENCY = "USD";

// Shipping options shown at checkout. TEMPLATE: real carriers and prices come later.
export const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard delivery",
    detail: "5 to 7 business days",
    price: 8,
  },
  {
    id: "express",
    name: "Express delivery",
    detail: "2 to 3 business days",
    price: 18,
  },
] as const;

// Countries offered in the checkout form. TEMPLATE: replace with where you actually ship.
export const SHIPPING_COUNTRIES = [
  "Rwanda",
  "Kenya",
  "Uganda",
  "Tanzania",
  "United States",
  "United Kingdom",
];

// Menu links shown when the "+" menu opens. External links open in a new tab.
export const MENU_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Contact", to: "/contact" },
  { label: "Policies", to: "/policies" },
  { label: "Instagram", to: "https://instagram.com", external: true },
] as const;

// Turn a number into a price label like "USD 85.00".
const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export function formatPrice(amount: number) {
  return `${CURRENCY} ${priceFormatter.format(amount)}`;
}
