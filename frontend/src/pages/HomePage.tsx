// HomePage (shown at /shop): the shop page with all the campaign cut-outs.
// Visitors arrive here from the welcome page's Discover button. It has two layouts:
// - Computers with a mouse: the cut-outs float scattered across the page, and pointing
//   at one turns the whole page that item's colour (like the Skylark inspo).
// - Phones, tablets and other touch screens (no mouse to hover with): one product
//   fills the screen at a time, scrolling snaps from one to the next, and the page
//   turns each product's colour as it scrolls into the middle of the screen.
// Clicking (or tapping) an item opens its product page.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { formatPrice } from "../config/store";
import { HOME_ITEMS } from "../data/products";
import { SCROLL_SHOP_QUERY, useMediaQuery } from "../lib/useMediaQuery";
import { useUi } from "../store/ui";

// Picks the layout that suits the device.
export function HomePage() {
  const scrollLayout = useMediaQuery(SCROLL_SHOP_QUERY);

  return (
    <>
      <h1 className="sr-only">Nsoro shop</h1>
      {scrollLayout ? <ScrollShop /> : <ScatterShop />}
    </>
  );
}

// A repeatable "random" number between 0 and 1 for a given seed, so the scattered
// layout looks loose but stays exactly the same on every visit.
function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ScatterShop: the mouse layout. Items float in a loose grid; hovering one changes
// the page colour, and the colour stays after the pointer leaves.
function ScatterShop() {
  const setBackground = useUi((s) => s.setBackground);

  return (
    <main className="px-4 pt-28 pb-24 sm:px-8 sm:pt-32">
      {/* The scattered grid: 3 columns on tablets, 5 on wide screens. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-y-16 lg:grid-cols-5 lg:gap-y-20">
        {HOME_ITEMS.map((item, index) => {
          // Nudge each item a little off the grid and vary its size, for the loose look.
          // The nudge is a share of the item's own size, so it shrinks on small screens.
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

// ScrollShop: the touch layout. One product per screen; scrolling snaps to the next,
// and whichever product sits in the middle of the screen sets the page colour.
// It loops: scrolling past the last product brings you back to the first one.
//
// How the loop works: after the last product there is one extra copy of the FIRST
// product. When you scroll onto that copy and the scrolling stops, the page jumps
// instantly to the real first product at the top. Both look identical (same picture,
// same colour), so the jump can't be seen and it feels like an endless loop.

// The products to show: all of them, then the copy of the first one at the end.
const LOOP_ITEMS = [...HOME_ITEMS, HOME_ITEMS[0]];
const LOOP_COPY_INDEX = HOME_ITEMS.length;

function ScrollShop() {
  const setBackground = useUi((s) => s.setBackground);
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Make the page snap neatly from one product to the next while this layout is shown,
  // and switch it off again when leaving the shop page.
  useEffect(() => {
    const root = document.documentElement;
    root.style.scrollSnapType = "y mandatory";
    return () => {
      root.style.scrollSnapType = "";
    };
  }, []);

  // Watch which product crosses the middle of the screen; that one becomes "active"
  // and the page takes its colour. The copy at the end counts as the first product.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActive(index === LOOP_COPY_INDEX ? 0 : index);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // The loop jump: once scrolling has stopped (no scroll movement for a short
  // moment) and the copy of the first product fills the screen, jump straight back
  // to the real first product at the top, with no animation.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const copy = sectionRefs.current[LOOP_COPY_INDEX];
        if (!copy) return;
        const copyTop = copy.getBoundingClientRect().top;
        // "Fills the screen" = its top edge is within a few pixels of the screen top.
        if (Math.abs(copyTop) < 4) {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Whenever the active product changes, fade the page to its colour.
  useEffect(() => {
    setBackground(HOME_ITEMS[active].background);
  }, [active, setBackground]);

  return (
    <main>
      {LOOP_ITEMS.map((item, index) => {
        // The last section is only the copy used for looping, so screen readers and
        // the keyboard skip it (the real first product is already in the list).
        const isLoopCopy = index === LOOP_COPY_INDEX;
        return (
          // One full-screen section per product; it snaps into place when scrolled to.
          <section
            key={isLoopCopy ? `${item.id}-loop` : item.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            data-index={index}
            aria-hidden={isLoopCopy || undefined}
            className="flex h-dvh snap-center snap-always flex-col items-center justify-center px-6 pt-16"
          >
            {/* The product picture and its name and price; tapping opens the product page. */}
            <Link
              to={`/product/${item.product.slug}?color=${item.colorway.id}`}
              aria-label={`${item.product.name}, ${formatPrice(item.product.price)}`}
              tabIndex={isLoopCopy ? -1 : undefined}
              className="flex flex-col items-center"
            >
              <img
                src={item.image}
                alt=""
                loading={index < 2 ? "eager" : "lazy"}
                className="max-h-[60dvh] w-auto max-w-[80vw] object-contain drop-shadow-[0_10px_18px_rgb(0_0_0/0.25)]"
              />
              <span className="mt-6 font-mono text-xs">
                {item.product.name} / {formatPrice(item.product.price)}
              </span>
            </Link>
          </section>
        );
      })}

      {/* Position counter in the bottom corner, e.g. "3 / 9". */}
      <p
        aria-live="polite"
        className="fixed right-4 bottom-4 z-10 font-mono text-xs opacity-80"
      >
        {active + 1} / {HOME_ITEMS.length}
      </p>
    </main>
  );
}
