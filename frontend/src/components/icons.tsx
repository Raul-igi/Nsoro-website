// Small line icons drawn in SVG. They use the current text colour, so they
// automatically match light or dark backgrounds.

// Shared props: icons are decorative, so screen readers skip them.
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  "aria-hidden": true,
};

// A person: links to the account area.
export function PersonIcon() {
  return (
    <svg {...base} fill="currentColor" stroke="none">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
  );
}

// A plus sign: opens the menu.
export function PlusIcon() {
  return (
    <svg {...base}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

// A cross: closes the menu, cart or size chart.
export function CloseIcon() {
  return (
    <svg {...base}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

// A shopping bag: used on the checkout page header.
export function BagIcon() {
  return (
    <svg {...base} strokeWidth={1.8}>
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
