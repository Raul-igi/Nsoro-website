// Product catalogue, using Nsoro's real campaign photos (from Media/NSORO LRES 2).
// The pictures are real; the product NAMES, PRICES, SIZES and SIZE CHARTS are still
// TEMPLATE values until the real ones are supplied. Later this list will come from the
// Django backend, managed in the admin portal.

// A size label, e.g. "M" for clothes or "EU 42" for shoes.
export type Size = string;

// One colour version of a product: its own pictures and its own page background.
export interface Colorway {
  id: string;
  name: string;
  swatch: string; // the little colour dot shown on the product card
  background: string; // the colour the whole page turns when this item is shown
  images: string[]; // pictures in the order they appear on the product page
  soldOutSizes: Size[];
}

// A row of the size chart, e.g. "Chest width" with one value per size.
export interface SizeChartRow {
  label: string;
  values: string[];
}

// A product as the shop sees it.
export interface Product {
  slug: string; // used in the page address, e.g. /product/denim-suit
  name: string;
  description: string;
  price: number;
  sizes: Size[]; // empty list means one size only
  colorways: Colorway[];
  sizeChart?: SizeChartRow[];
}

// Where the background-free cut-outs and the full campaign photos live (in /public).
const cutout = (id: string) => `/products/cutouts/${id}.webp`;
const photo = (id: string) => `/lookbook/${id}.webp`;

// The catalogue itself.
export const PRODUCTS: Product[] = [
  {
    slug: "denim-suit",
    name: "Denim suit", // TEMPLATE name
    description:
      "Double-breasted denim blazer with matching tailored shorts, sold as a set.", // TEMPLATE
    price: 240, // TEMPLATE price
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colorways: [
      {
        id: "denim",
        name: "Denim",
        swatch: "#3b5f86",
        background: "#2f5a7a",
        // Front and back cut-outs, the walking shot, then a close campaign photo.
        images: [
          cutout("ED241552"),
          cutout("ED241613"),
          cutout("ED241633"),
          photo("ED241658"),
        ],
        soldOutSizes: ["XXL"],
      },
    ],
    // TEMPLATE measurements.
    sizeChart: [
      {
        label: "Blazer chest",
        values: ["52 cm", "55 cm", "58 cm", "61 cm", "64 cm", "67 cm"],
      },
      {
        label: "Blazer length",
        values: ["72 cm", "74 cm", "76 cm", "78 cm", "80 cm", "82 cm"],
      },
      {
        label: "Shorts waist",
        values: ["72 cm", "76 cm", "80 cm", "84 cm", "88 cm", "92 cm"],
      },
    ],
  },
  {
    slug: "suede-desert-boots",
    name: "Suede desert boots", // TEMPLATE name
    description:
      "Mustard suede ankle boots with a chunky crepe-style sole and contrast laces.", // TEMPLATE
    price: 130, // TEMPLATE price
    sizes: ["EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    colorways: [
      {
        id: "mustard",
        name: "Mustard",
        swatch: "#d4a017",
        background: "#6b5212",
        images: [cutout("ED241682"), cutout("ED241683"), cutout("ED241573")],
        soldOutSizes: ["EU 39"],
      },
    ],
    // TEMPLATE measurements.
    sizeChart: [
      { label: "UK size", values: ["6", "6.5", "7.5", "8", "9", "10", "10.5"] },
      {
        label: "Foot length",
        values: [
          "24.5 cm",
          "25.2 cm",
          "26 cm",
          "26.7 cm",
          "27.4 cm",
          "28.1 cm",
          "28.8 cm",
        ],
      },
    ],
  },
];

// The page colour used before the visitor points at anything: deep denim.
export const DEFAULT_BACKGROUND = "#2f5a7a";

// Find a product by the slug in the page address.
export function findProduct(slug: string | undefined) {
  return PRODUCTS.find((p) => p.slug === slug);
}

// What floats on the homepage: one entry per cut-out picture. Several pictures can
// point to the same product, and each has its own page colour, picked from the photo
// (sky, denim, grass, the yellow tote, the gold rhino...).
export interface HomeItem {
  id: string;
  product: Product;
  colorway: Colorway;
  image: string;
  background: string;
}

// Helper to build a homepage entry from a product slug, a picture and a colour.
function homeItem(
  slug: string,
  pictureId: string,
  background: string,
): HomeItem {
  const product = findProduct(slug)!;
  return {
    id: pictureId,
    product,
    colorway: product.colorways[0],
    image: cutout(pictureId),
    background,
  };
}

// The homepage items, in the order they appear (left to right, top to bottom).
export const HOME_ITEMS: HomeItem[] = [
  homeItem("denim-suit", "ED241552", "#2f5a7a"), // denim
  homeItem("suede-desert-boots", "ED241682", "#6b5212"), // mustard suede
  homeItem("denim-suit", "ED241613", "#4f7a3e"), // hillside grass
  homeItem("denim-suit", "ED241633", "#b5a127"), // yellow tote
  homeItem("suede-desert-boots", "ED241573", "#8a6a2a"), // gold rhino
  homeItem("denim-suit", "ED241547", "#5d93b8"), // open sky
  homeItem("suede-desert-boots", "ED241683", "#35502f"), // cactus green
  homeItem("denim-suit", "ED241702", "#7fa3bf"), // pale sky
  homeItem("denim-suit", "ED241686", "#3f6a4a"), // far hills
];
