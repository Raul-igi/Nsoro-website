// HomePage: every colour of every product floats across the coloured background.
// Pointing at (or tabbing to) an item turns the whole page that item's colour,
// and the colour stays after the pointer leaves, like the Skylark inspo.
import { Link } from "react-router";
import { formatPrice } from "../config/store";
import { HOME_ITEMS } from "../data/products";
import { useUi } from "../store/ui";

// A repeatable "random" number between 0 and 1 for a given seed, so the scattered
// layout looks loose but stays exactly the same on every visit.
function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Mix the items so the same product type isn't always side by side.
const ITEMS = [...HOME_ITEMS].sort((a, b) => {
  const ka = seeded(
    a.product.slug.length * 7 +
      a.colorway.id.length * 13 +
      a.colorway.id.charCodeAt(0),
  );
  const kb = seeded(
    b.product.slug.length * 7 +
      b.colorway.id.length * 13 +
      b.colorway.id.charCodeAt(0),
  );
  return ka - kb;
});

export function HomePage() {
  const setBackground = useUi((s) => s.setBackground);

  return (
    <main className="px-4 pt-28 pb-24 sm:px-8 sm:pt-32">
      <h1 className="sr-only">Nsoro shop</h1>

      {/* The scattered grid: 2 columns on phones, 3 on tablets, 5 on wide screens. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-y-20 lg:grid-cols-5 lg:gap-y-24">
        {ITEMS.map(({ product, colorway }, index) => {
          // Nudge each item a little off the grid and vary its size, for the loose look.
          // The nudge is a share of the item's own size, so it shrinks on small phones.
          const nudgeX = (seeded(index + 1) - 0.5) * 36;
          const nudgeY = (seeded(index + 101) - 0.5) * 40;
          const size = 50 + seeded(index + 201) * 28; // percent of the column width

          return (
            <li
              key={`${product.slug}-${colorway.id}`}
              className="flex justify-center"
            >
              {/* The item: a link to its product page, already set to this colour. */}
              <Link
                to={`/product/${product.slug}?color=${colorway.id}`}
                onMouseEnter={() => setBackground(colorway.background)}
                onFocus={() => setBackground(colorway.background)}
                aria-label={`${product.name}, ${colorway.name}, ${formatPrice(product.price)}`}
                className="float-item group relative block"
                style={{
                  width: `${size}%`,
                  transform: `translate(${nudgeX}%, ${nudgeY}%)`,
                }}
              >
                <img
                  src={colorway.images[0]}
                  alt=""
                  loading={index < 8 ? "eager" : "lazy"}
                  className="aspect-square w-full object-contain"
                />

                {/* Name and price, shown only while pointed at or focused. */}
                <span className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 text-center font-mono whitespace-nowrap text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {product.name} / {colorway.name} /{" "}
                  {formatPrice(product.price)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
