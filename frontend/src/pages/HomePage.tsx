// HomePage (shown at /shop): the shop page with all the campaign cut-outs.
// Visitors arrive here from the welcome page's Discover button. It has two layouts:
// - Computers with a mouse: the cut-outs float scattered across the page, and pointing
//   at one turns the whole page that item's colour (like the Skylark inspo).
// - Phones, tablets and other touch screens (no mouse to hover with): one product
//   fills the screen at a time, swiping slides to the next one (looping round at the
//   end), and the page turns each product's colour as it slides in.
// Clicking (or tapping) an item opens its product page.
import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
  type WheelEvent,
} from "react";
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
      {scrollLayout ? <SwipeShop /> : <ScatterShop />}
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

// SwipeShop: the touch layout (phones, tablets, narrow windows). One product fills
// the screen at a time, and the products move under your finger (like Skylark):
// - While you drag, the stack follows your finger exactly. The current product slides
//   away, fading and shrinking slightly, while the next one slides in and grows.
//   You can stop halfway and hold it there.
// - When you let go, it finishes moving to the next product if you dragged far enough
//   (or flicked quickly); otherwise it springs back to the current one.
// The page takes each product's colour, a counter shows the position, and it loops in
// both directions: after the last product comes the first.
//
// Built for smoothness on phones:
// - The page never really scrolls. All products sit in one tall stack inside a fixed
//   full-screen frame, and we slide that stack ourselves. (Real scrolling caused
//   problems on iPhone Safari: resizing, getting stuck, pictures not drawn.)
// - While the finger moves, the stack is moved directly (not by re-building the page
//   in React on every tiny movement), once per screen refresh, and only the products
//   near the screen are touched. Only cheap effects are used (slide, fade, scale);
//   blur and shadows were too heavy for phones and made the swipe stutter.
//
// How the loop works: the stack is [copy of LAST, product 1 ... product 9, copy of
// FIRST]. Moving past product 9 lands on the copy of the first; once the move ends, the
// stack jumps (with no animation) to the real product 1, which looks identical, so you
// never see the jump. Going back from product 1 works the same way.

// The stack, with the two copies at its ends. "Slots" are positions in this stack.
const STACK = [HOME_ITEMS[HOME_ITEMS.length - 1], ...HOME_ITEMS, HOME_ITEMS[0]];
const FIRST_SLOT = 1;
const LAST_SLOT = HOME_ITEMS.length;
const SLIDE_MS = 450; // how long the finishing (or spring-back) move takes
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; // fast start, gentle landing
const COMMIT_SHARE = 0.2; // drag past 20% of the screen to move on when letting go
const FLICK_SPEED = 0.5; // ...or flick faster than this (pixels per millisecond)

// Turn a slot (which may be one of the copies) into the real product number, 0 to 8.
function realIndex(slotNumber: number) {
  const n = HOME_ITEMS.length;
  return (((slotNumber - 1) % n) + n) % n;
}

function SwipeShop() {
  const setBackground = useUi((s) => s.setBackground);
  // The product shown (0 to 8): drives the counter and the page colour. It's the only
  // thing React re-renders, and only when it changes (not on every finger movement).
  const [active, setActive] = useState(0);

  // Everything that changes many times a second lives in refs (not React state), so
  // updating it doesn't make React rebuild the page.
  const frameRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pos = useRef(FIRST_SLOT); // where the stack is now, in slots (e.g. 3.4)
  const moving = useRef(false); // true while a finishing move is running
  const startSlot = useRef(FIRST_SLOT); // the product the current drag started on
  const frameRequest = useRef(0); // the pending screen-refresh update, if any
  // The current touch: where it started, where and when the finger was last seen, how
  // fast it was moving (+ up / - down, pixels per ms), and whether it's an up/down drag.
  const touch = useRef<{
    x: number;
    y: number;
    lastY: number;
    lastT: number;
    speed: number;
    vertical: boolean | null;
  } | null>(null);

  // Draw the stack at a position. With `animated`, the browser glides there smoothly;
  // without it, it moves instantly (used while the finger drags, and for the loop jump).
  // Each product near the screen fades and shrinks with its distance from the centre;
  // products further away are simply hidden.
  function draw(position: number, animated: boolean) {
    pos.current = position;
    const track = trackRef.current;
    if (!track) return;
    const transition = animated ? `${SLIDE_MS}ms ${EASE}` : "0s";
    track.style.transition = `transform ${transition}`;
    track.style.transform = `translate3d(0, ${-position * 100}%, 0)`;
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;
      const d = Math.min(Math.abs(index - position), 1);
      section.style.transition = `opacity ${transition}, transform ${transition}`;
      section.style.opacity = String(1 - d);
      section.style.transform = `scale(${1 - 0.08 * d})`;
    });
    // Update the counter and page colour once the nearest product changes.
    setActive(realIndex(Math.round(position)));
  }

  // Place the stack on the first product as soon as the page appears.
  useEffect(() => {
    draw(FIRST_SLOT, false);
    return () => cancelAnimationFrame(frameRequest.current);
    // Runs once on purpose: draw only touches refs and a state setter.
  }, []);

  // Fade the page to the colour of the product nearest the centre.
  useEffect(() => {
    setBackground(HOME_ITEMS[active].background);
  }, [active, setBackground]);

  // While this layout is shown, stop the phone's pull-to-refresh and "bounce" so a
  // swipe down at the top doesn't reload the page. Switched back on when leaving.
  useEffect(() => {
    const root = document.documentElement;
    root.style.overscrollBehavior = "none";
    return () => {
      root.style.overscrollBehavior = "";
    };
  }, []);

  // Glide one product forward (+1), back (-1), or back to where we started (0),
  // counting from the product the gesture began on. When it lands on a copy at either
  // end, jump instantly to the real product it copies.
  function settle(step: -1 | 0 | 1, from = Math.round(pos.current)) {
    moving.current = true;
    const target = from + step;
    draw(target, true);
    window.setTimeout(() => {
      if (target > LAST_SLOT) draw(FIRST_SLOT, false);
      else if (target < FIRST_SLOT) draw(LAST_SLOT, false);
      moving.current = false;
    }, SLIDE_MS + 30);
  }

  // Finger down: remember where and when.
  function onTouchStart(e: TouchEvent) {
    if (moving.current) return;
    const t = e.touches[0];
    startSlot.current = Math.round(pos.current);
    touch.current = {
      x: t.clientX,
      y: t.clientY,
      lastY: t.clientY,
      lastT: performance.now(),
      speed: 0,
      vertical: null,
    };
  }

  // Finger moving: once it's clearly an up/down drag, move the stack with it (at most
  // one screen either way), drawing at most once per screen refresh.
  function onTouchMove(e: TouchEvent) {
    const start = touch.current;
    if (!start) return;
    const t = e.touches[0];
    const dy = start.y - t.clientY;
    const dx = start.x - t.clientX;
    // Decide once, after a few pixels, whether this is an up/down drag at all.
    if (start.vertical === null && Math.hypot(dx, dy) > 8) {
      start.vertical = Math.abs(dy) > Math.abs(dx);
    }
    if (!start.vertical) return;
    // Measure the finger's speed from its previous position, smoothing out jitter.
    const now = performance.now();
    const instant = (start.lastY - t.clientY) / Math.max(1, now - start.lastT);
    start.speed = start.speed * 0.4 + instant * 0.6;
    start.lastY = t.clientY;
    start.lastT = now;
    // Where the stack should be: the slot we started on plus the drag distance.
    const height = frameRef.current?.clientHeight || window.innerHeight;
    const target = startSlot.current + Math.max(-1, Math.min(1, dy / height));
    cancelAnimationFrame(frameRequest.current);
    frameRequest.current = requestAnimationFrame(() => draw(target, false));
  }

  // Finger up: move on if dragged far enough or flicked quickly; otherwise spring back.
  // A touch that never became a drag is a tap, so tapping a product still opens it.
  function onTouchEnd() {
    const start = touch.current;
    touch.current = null;
    if (!start || !start.vertical) return;
    cancelAnimationFrame(frameRequest.current);
    // How far the stack was dragged from the starting product (in screens), and how
    // fast the finger was going (only if it was still moving just before lifting).
    const offset = pos.current - startSlot.current;
    const speed = performance.now() - start.lastT < 100 ? start.speed : 0;
    if (offset > COMMIT_SHARE || speed > FLICK_SPEED)
      settle(1, startSlot.current);
    else if (offset < -COMMIT_SHARE || speed < -FLICK_SPEED)
      settle(-1, startSlot.current);
    else settle(0, startSlot.current);
  }

  // Mouse wheel and trackpad (for narrow computer windows): one product per gesture.
  function onWheel(e: WheelEvent) {
    if (moving.current || Math.abs(e.deltaY) < 10) return;
    settle(e.deltaY > 0 ? 1 : -1);
  }

  // Keyboard: arrow and page keys move between products.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (moving.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") settle(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") settle(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      {/* The fixed full-screen frame. It hides everything outside one screen, sits on
          a layer above the coloured background (z-[1]), and touch-none tells the
          phone not to scroll or zoom here, because we move the products ourselves. */}
      <main
        ref={frameRef}
        className="fixed inset-0 z-[1] touch-none overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={() => {
          touch.current = null;
          if (!moving.current) settle(0);
        }}
        onWheel={onWheel}
      >
        {/* The stack of products. Its position is set by draw() above, not here, so
            React never resets it. will-change keeps it on the phone's graphics chip. */}
        <div
          ref={trackRef}
          className="flex h-full flex-col will-change-transform"
        >
          {STACK.map((item, index) => {
            // The first and last entries are only copies used for looping, so screen
            // readers and the keyboard skip them.
            const isCopy = index < FIRST_SLOT || index > LAST_SLOT;
            return (
              // One screen-height section per product; draw() fades and scales it.
              <section
                key={isCopy ? `${item.id}-copy-${index}` : item.id}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                aria-hidden={isCopy || undefined}
                className="flex h-full shrink-0 flex-col items-center justify-center px-6 pt-16 will-change-[opacity,transform]"
              >
                {/* The product picture with its name and price; tapping opens it. */}
                <Link
                  to={`/product/${item.product.slug}?color=${item.colorway.id}`}
                  aria-label={`${item.product.name}, ${formatPrice(item.product.price)}`}
                  tabIndex={isCopy ? -1 : undefined}
                  // Tabbing to a product with the keyboard slides it into view.
                  onFocus={() => !isCopy && draw(index, true)}
                  draggable={false}
                  className="flex flex-col items-center"
                >
                  {/* No shadow filter here: filters are slow to redraw while moving. */}
                  <img
                    src={item.image}
                    alt=""
                    // All pictures load up front (they're small) so swiping never waits,
                    // but the first product gets top priority and the rest go after it.
                    loading="eager"
                    fetchPriority={index === FIRST_SLOT ? "high" : "low"}
                    decoding="async"
                    draggable={false}
                    className="max-h-[60svh] w-auto max-w-[80vw] object-contain"
                  />
                  <span className="mt-6 font-mono text-xs">
                    {item.product.name} / {formatPrice(item.product.price)}
                  </span>
                </Link>
              </section>
            );
          })}
        </div>
      </main>

      {/* Position counter in the bottom corner, e.g. "3 / 9". */}
      <p
        aria-live="polite"
        className="fixed right-4 bottom-4 z-10 font-mono text-xs opacity-80"
      >
        {active + 1} / {HOME_ITEMS.length}
      </p>
    </>
  );
}
