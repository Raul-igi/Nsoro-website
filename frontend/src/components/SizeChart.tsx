// SizeChart: the frosted pop-up with a product's measurements per size.
import { useEffect } from "react";
import type { Product } from "../data/products";
import { CloseIcon } from "./icons";

interface Props {
  product: Product;
  onClose: () => void;
}

export function SizeChart({ product, onClose }: Props) {
  // Close with the Escape key.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Nothing to show if this product has no chart (e.g. one-size items).
  if (!product.sizeChart) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center p-4">
      {/* Frosted layer over the page; clicking it closes the chart. */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The chart card. */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} size chart`}
        className="glass relative w-full max-w-3xl rounded-2xl p-5 sm:p-8"
      >
        {/* Title and close button. */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase [font-stretch:115%]">
            {product.name}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close size chart">
            <CloseIcon />
          </button>
        </div>

        {/* The table scrolls sideways on narrow phones instead of squashing. */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm uppercase">
            {/* Size names across the top. */}
            <thead>
              <tr>
                <td className="border-0" />
                {product.sizes.map((size) => (
                  <th
                    key={size}
                    scope="col"
                    className="border border-current/50 px-3 py-3 font-medium"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            {/* One row per measurement. */}
            <tbody>
              {product.sizeChart.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="border border-current/50 px-3 py-3 text-left font-medium"
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, i) => (
                    <td
                      key={i}
                      className="border border-current/50 px-3 py-3 text-center whitespace-nowrap"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm opacity-80">
          Measurements are taken with the garment lying flat.
        </p>
      </section>
    </div>
  );
}
