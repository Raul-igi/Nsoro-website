// TEMPLATE product catalogue. Names, prices, colours, pictures and size charts here are
// placeholders so we can see the site working. Later this list will come from the
// Django backend, managed in the admin portal.

// The sizes a garment can come in, smallest to largest.
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

// One colour version of a product: its own pictures and its own page background.
export interface Colorway {
  id: string;
  name: string;
  swatch: string; // the little colour dot shown on the product card
  background: string; // the colour the whole page turns when this item is shown
  images: string[]; // pictures in order: front, back, close-up
  soldOutSizes: Size[];
}

// A row of the size chart, e.g. "Chest width" with one value per size.
export interface SizeChartRow {
  label: string;
  values: string[];
}

// A product as the shop sees it.
export interface Product {
  slug: string; // used in the page address, e.g. /product/studio-hoodie
  name: string;
  description: string;
  price: number;
  sizes: Size[]; // empty list means one size only
  colorways: Colorway[];
  sizeChart?: SizeChartRow[];
}

// Size lists reused by several products.
const APPAREL_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

// Build the three picture paths for a colourway from the template image folder.
function pictures(slug: string, colour: string) {
  const base = `/templates/products/${slug}/${colour}`;
  return [`${base}-front.svg`, `${base}-back.svg`, `${base}-detail.svg`];
}

// Shorthand for making a colourway entry.
function colourway(
  slug: string,
  id: string,
  name: string,
  swatch: string,
  background: string,
  soldOutSizes: Size[] = [],
): Colorway {
  return {
    id,
    name,
    swatch,
    background,
    images: pictures(slug, id),
    soldOutSizes,
  };
}

// The template catalogue itself.
export const PRODUCTS: Product[] = [
  {
    slug: "studio-hoodie",
    name: "Studio hoodie",
    description:
      "Heavyweight brushed-back fleece with a roomy hood and kangaroo pocket.",
    price: 95,
    sizes: APPAREL_SIZES,
    colorways: [
      colourway("studio-hoodie", "sand", "Sand", "#d9c4a1", "#a8906b", ["XXL"]),
      colourway("studio-hoodie", "moss", "Moss", "#5b7046", "#3f5a3a"),
      colourway("studio-hoodie", "ink", "Ink", "#2a2d33", "#3a3d42", [
        "XL",
        "XXL",
      ]),
    ],
    sizeChart: [
      {
        label: "Chest width",
        values: ["56 cm", "59 cm", "62 cm", "65 cm", "68 cm", "71 cm"],
      },
      {
        label: "Body length",
        values: ["64 cm", "66 cm", "68 cm", "70 cm", "72 cm", "74 cm"],
      },
      {
        label: "Sleeve length",
        values: ["60 cm", "61 cm", "62 cm", "63 cm", "64 cm", "65 cm"],
      },
    ],
  },
  {
    slug: "zip-hoodie",
    name: "Zip hoodie",
    description: "Full-zip version of the studio hoodie, cut slightly cropped.",
    price: 105,
    sizes: APPAREL_SIZES,
    colorways: [
      colourway("zip-hoodie", "sky", "Sky", "#9fc4e8", "#6f9fcf"),
      colourway("zip-hoodie", "bone", "Bone", "#e9e3d6", "#9c9586", ["XS"]),
    ],
    sizeChart: [
      {
        label: "Chest width",
        values: ["55 cm", "58 cm", "61 cm", "64 cm", "67 cm", "70 cm"],
      },
      {
        label: "Body length",
        values: ["60 cm", "62 cm", "64 cm", "66 cm", "68 cm", "70 cm"],
      },
      {
        label: "Sleeve length",
        values: ["60 cm", "61 cm", "62 cm", "63 cm", "64 cm", "65 cm"],
      },
    ],
  },
  {
    slug: "easy-sweatpants",
    name: "Easy sweatpants",
    description:
      "Wide straight-leg sweatpants with an elastic waist and back patch pockets.",
    price: 80,
    sizes: APPAREL_SIZES,
    colorways: [
      colourway("easy-sweatpants", "sand", "Sand", "#d9c4a1", "#a8906b"),
      colourway("easy-sweatpants", "ink", "Ink", "#2a2d33", "#3a3d42"),
      colourway("easy-sweatpants", "rose", "Rose", "#e4a6c1", "#c0628f", ["S"]),
      colourway("easy-sweatpants", "lime", "Lime", "#c8db5c", "#7f9a2c"),
    ],
    sizeChart: [
      {
        label: "Waist (relaxed)",
        values: ["68 cm", "72 cm", "76 cm", "80 cm", "84 cm", "88 cm"],
      },
      {
        label: "Inseam",
        values: ["74 cm", "76 cm", "78 cm", "80 cm", "82 cm", "84 cm"],
      },
      {
        label: "Leg opening",
        values: ["24 cm", "25 cm", "26 cm", "27 cm", "28 cm", "29 cm"],
      },
    ],
  },
  {
    slug: "heavy-tee",
    name: "Heavy tee",
    description:
      "Boxy 260 gsm cotton T-shirt with a ribbed neck that keeps its shape.",
    price: 45,
    sizes: APPAREL_SIZES,
    colorways: [
      colourway("heavy-tee", "chalk", "Chalk", "#f2f1ec", "#8d9196"),
      colourway("heavy-tee", "cobalt", "Cobalt", "#3554b4", "#2a4590"),
      colourway("heavy-tee", "rust", "Rust", "#a8532f", "#7e3d24", [
        "XS",
        "XXL",
      ]),
    ],
    sizeChart: [
      {
        label: "Chest width",
        values: ["53 cm", "56 cm", "59 cm", "62 cm", "65 cm", "68 cm"],
      },
      {
        label: "Body length",
        values: ["68 cm", "70 cm", "72 cm", "74 cm", "76 cm", "78 cm"],
      },
    ],
  },
  {
    slug: "six-panel-cap",
    name: "Six-panel cap",
    description:
      "Washed cotton cap with a curved brim and an adjustable strap.",
    price: 35,
    sizes: [],
    colorways: [
      colourway("six-panel-cap", "ink", "Ink", "#2a2d33", "#3a3d42"),
      colourway("six-panel-cap", "moss", "Moss", "#5b7046", "#3f5a3a"),
    ],
  },
  {
    slug: "crew-socks",
    name: "Crew socks, 2 pairs",
    description: "Cushioned cotton-blend crew socks. One size fits most.",
    price: 18,
    sizes: [],
    colorways: [
      colourway("crew-socks", "stone", "Stone", "#babdc2", "#7c828b"),
      colourway("crew-socks", "lilac", "Lilac", "#c5b8e4", "#8b7cb8"),
    ],
  },
];

// The page colour used before the visitor points at anything.
export const DEFAULT_BACKGROUND = "#6f9fcf";

// Find a product by the slug in the page address.
export function findProduct(slug: string | undefined) {
  return PRODUCTS.find((p) => p.slug === slug);
}

// Every colourway as its own item, for the floating homepage layout.
export const HOME_ITEMS = PRODUCTS.flatMap((product) =>
  product.colorways.map((colorway) => ({ product, colorway })),
);
