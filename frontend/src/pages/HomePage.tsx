// HomePage (shown at /shop): cut-outs from the Nsoro campaign float across the
// coloured background. Visitors arrive here from the welcome page's Discover button.
// Pointing at (or tabbing to) an item turns the whole page that item's colour,
// and the colour stays after the pointer leaves, like the Skylark inspo.
// Clicking an item opens its product page.
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

export function HomePage() {
  const setBackground = useUi((s) => s.setBackground);

  return (
    <main className="px-4 pt-28 pb-24 sm:px-8 sm:pt-32">
      <h1 className="sr-only">Nsoro shop</h1>

      {/* The scattered grid: 2 columns on phones, 3 on tablets, 5 on wide screens. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-y-16 lg:grid-cols-5 lg:gap-y-20">
        {HOME_ITEMS.map((item, index) => {
          // Nudge each item a little off the grid and vary its size, for the loose look.
          // The nudge is a share of the item's own size, so it shrinks on small phones.
          const nudgeX = (seeded(index + 1) - 0.5) * 30;
          const nudgeY = (seeded(index + 101) - 0.5) * 30;
          const size = 70 + seeded(index + 201) * 25; // percent of the column width

          return (
            <li key={item.id} className="flex justify-center">
              {/* The item: a link to its product page, already set to this colour. */}
              <Link
                to={`/product/${item.product.slug}?color=${item.colorway.id}`}
                onMouseEnter={() => setBackground(item.background)}
                onFocus={() => setBackground(item.background)}
                aria-label={`${item.product.name}, ${formatPrice(item.product.price)}`}
                className="float-item group relative block"
                style={{
                  width: `${size}%`,
                  transform: `translate(${nudgeX}%, ${nudgeY}%)`,
                }}
              >
                {/* Portrait-shaped box, since most cut-outs are of a standing model. */}
                <img
                  src={item.image}
                  alt=""
                  loading={index < 10 ? "eager" : "lazy"}
                  className="aspect-[3/4] w-full object-contain drop-shadow-[0_10px_18px_rgb(0_0_0/0.25)]"
                />

                {/* Name and price, shown only while pointed at or focused. */}
                <span className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 text-center font-mono whitespace-nowrap text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {item.product.name} / {formatPrice(item.product.price)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
