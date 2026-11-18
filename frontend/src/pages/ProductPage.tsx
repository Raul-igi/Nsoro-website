// ProductPage: one product, with the page turned to the chosen colour.
// The pictures (front, back, close-up) are stacked so you scroll through the angles;
// thumbnails sit bottom-left, and the details card and add-to-cart bar sit bottom-right.
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { SizeChart } from "../components/SizeChart";
import { formatPrice } from "../config/store";
import { findProduct, type Size } from "../data/products";
import { useCart } from "../store/cart";
import { useUi } from "../store/ui";

export function ProductPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const product = findProduct(slug);

  // Product not found (bad link): say so and point back to the shop.
  if (!product) {
    return (
      <main className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="text-3xl font-bold [font-stretch:115%]">
            This product isn't available
          </h1>
          <Link
            to="/"
            className="mt-4 inline-block underline underline-offset-4"
          >
            Back to the shop
          </Link>
        </div>
      </main>
    );
  }

  // The colour comes from the address (?color=sand); fall back to the first one.
  const colorway =
    product.colorways.find((c) => c.id === searchParams.get("color")) ??
    product.colorways[0];

  // Keying by product + colour resets the size choice and scroll tracking on change.
  return (
    <ProductView
      key={`${product.slug}-${colorway.id}`}
      product={product}
      colorwayId={colorway.id}
      onPickColour={(id) => setSearchParams({ color: id }, { replace: true })}
    />
  );
}

interface ViewProps {
  product: NonNullable<ReturnType<typeof findProduct>>;
  colorwayId: string;
  onPickColour: (id: string) => void;
}

// The actual product layout, for one product in one colour.
function ProductView({ product, colorwayId, onPickColour }: ViewProps) {
  const colorway = product.colorways.find((c) => c.id === colorwayId)!;
  const setBackground = useUi((s) => s.setBackground);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const addToCart = useCart((s) => s.add);

  // Start on the first size that isn't sold out.
  const firstAvailable =
    product.sizes.find((s) => !colorway.soldOutSizes.includes(s)) ?? null;
  const [size, setSize] = useState<Size | null>(firstAvailable);
  const [chartOpen, setChartOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sold out entirely: has sizes, but every one is sold out.
  const soldOut = product.sizes.length > 0 && firstAvailable === null;

  // Turn the page this colour while the product is shown.
  useEffect(() => {
    setBackground(colorway.background);
  }, [colorway.background, setBackground]);

  // Start each product at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Watch which picture is in the middle of the screen, to highlight its thumbnail.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActiveImage(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    imageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll smoothly to a picture when its thumbnail is clicked.
  function showImage(index: number) {
    imageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  // Put the chosen item in the cart and open the cart so the customer sees it.
  function handleAdd() {
    addToCart({ slug: product.slug, colorwayId: colorway.id, size });
    setCartOpen(true);
  }

  return (
    <main className="relative pb-24 lg:pb-0">
      {/* The stacked pictures, one screen-height each. On wide screens the right side
          is kept free for the details card (420px wide + gaps), so pictures are centred
          in the space to its left and never slide underneath the card. */}
      <div className="flex flex-col items-center pt-20 lg:pt-0 lg:pr-[468px]">
        {colorway.images.map((src, index) => (
          <div
            key={src}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            data-index={index}
            className="flex min-h-[60dvh] w-full items-center justify-center px-6 lg:min-h-dvh"
          >
            <img
              src={src}
              alt={`${product.name} in ${colorway.name}, ${["front", "back", "close-up"][index] ?? "view"}`}
              className="max-h-[58dvh] w-full max-w-[520px] object-contain lg:max-h-[64dvh]"
            />
          </div>
        ))}
      </div>

      {/* Thumbnails: fixed bottom-left on wide screens. */}
      <div className="glass fixed bottom-6 left-6 z-10 hidden gap-1 rounded-xl p-1.5 lg:flex">
        {colorway.images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => showImage(index)}
            aria-label={`Show picture ${index + 1}`}
            aria-current={activeImage === index}
            className={`size-16 rounded-lg border p-1 transition-colors ${
              activeImage === index
                ? "border-current bg-white/20"
                : "border-transparent"
            }`}
          >
            <img src={src} alt="" className="size-full object-contain" />
          </button>
        ))}
      </div>

      {/* Details card and add-to-cart: fixed bottom-right on wide screens,
          and in the normal page flow (after the pictures) on phones. */}
      <aside className="z-10 px-4 pb-6 lg:fixed lg:right-6 lg:bottom-6 lg:w-[420px] lg:px-0 lg:pb-0">
        <div className="glass rounded-2xl p-5">
          {/* Name and description. */}
          <h1 className="text-[1.75rem] leading-tight font-bold uppercase [font-stretch:118%]">
            {product.name}
          </h1>
          <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] leading-snug opacity-90">
            {product.description}
          </p>

          <hr className="my-5 border-current/30" />

          {/* Colour choice: the label shows the chosen colour's name. */}
          <fieldset>
            <legend className="font-mono text-[0.9375rem] uppercase">
              Colour&nbsp;&nbsp;[&nbsp;{colorway.name}&nbsp;]
            </legend>
            <div className="mt-2 flex gap-2.5">
              {product.colorways.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onPickColour(c.id)}
                  aria-label={c.name}
                  aria-pressed={c.id === colorway.id}
                  className={`size-7 rounded-full border-2 ${
                    c.id === colorway.id ? "border-current" : "border-white/40"
                  }`}
                  style={{ background: c.swatch }}
                />
              ))}
            </div>
          </fieldset>

          {/* Size choice: sold-out sizes are crossed out and can't be picked. */}
          {product.sizes.length > 0 && (
            <fieldset className="mt-5">
              <legend className="font-mono text-[0.9375rem] uppercase">
                Size&nbsp;&nbsp;[&nbsp;{size ?? "Sold out"}&nbsp;]
              </legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes.map((s) => {
                  const out = colorway.soldOutSizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={out}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      aria-label={out ? `${s}, sold out` : s}
                      className={`min-w-10 rounded-md border px-2 py-1 font-mono text-[0.8125rem] ${
                        size === s
                          ? "border-white bg-white text-ink"
                          : "border-current/40 hover:border-current"
                      } ${out ? "line-through opacity-45" : ""}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <hr className="my-5 border-current/30" />

          {/* Stock status and the size chart link. */}
          <div className="flex items-center justify-between font-mono text-[0.8125rem] uppercase">
            <span className="bg-white px-1.5 py-0.5 text-ink">
              {soldOut ? "Sold out" : "Ready to ship"}
            </span>
            {product.sizeChart && (
              <button
                type="button"
                onClick={() => setChartOpen(true)}
                className="underline-offset-4 hover:underline"
              >
                Size chart
              </button>
            )}
          </div>
        </div>

        {/* Add to cart bar, with the price on the right. On phones it stays pinned to the
            bottom of the screen so it's always in reach while scrolling the pictures. */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className="fixed inset-x-4 bottom-4 z-20 flex lg:static lg:mt-3 lg:w-full items-center justify-between rounded-2xl bg-white px-5 py-5 text-lg font-semibold text-ink uppercase shadow-lg [font-stretch:110%] hover:bg-white/90 disabled:opacity-60"
        >
          <span>{soldOut ? "Sold out" : "Add to cart"}</span>
          <span>{formatPrice(product.price)}</span>
        </button>
      </aside>

      {/* The size chart pop-up. */}
      {chartOpen && (
        <SizeChart product={product} onClose={() => setChartOpen(false)} />
      )}
    </main>
  );
}
