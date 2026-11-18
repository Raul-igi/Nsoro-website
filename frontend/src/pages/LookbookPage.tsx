// LookbookPage: the full Nsoro campaign photos, shown whole (not cut out).
// Photos sit in loose columns of different heights, like an editorial spread.
// Clicking a photo opens it large; the arrows or keyboard move between photos.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CloseIcon } from "../components/icons";
import { useUi } from "../store/ui";

// Every campaign photo, in the order of the shoot. Alt text describes each one.
const PHOTOS = [
  {
    id: "ED241547",
    alt: "Model in the denim suit standing on a rock below a wind turbine",
  },
  {
    id: "ED241552",
    alt: "Model in the denim suit and orange shirt on a grassy hill with wind turbines",
  },
  {
    id: "ED241564",
    alt: "Model leaning forward between two goats on the hillside",
  },
  {
    id: "ED241573",
    alt: "Yellow suede boot resting on a gold rhino figure on a rock",
  },
  { id: "ED241606", alt: "Model holding a gold rhino figure against the sky" },
  {
    id: "ED241613",
    alt: "Back view of the model in the denim suit facing the turbines",
  },
  {
    id: "ED241621",
    alt: "Back of the denim blazer, a gold rhino tucked under one arm",
  },
  { id: "ED241633", alt: "Model walking downhill carrying a yellow tote bag" },
  {
    id: "ED241652",
    alt: "Model in the denim suit standing among cactus plants",
  },
  {
    id: "ED241658",
    alt: "Close portrait in the denim blazer and orange shirt among cacti",
  },
  { id: "ED241669", alt: "Model crouching among cactus plants, hand on hip" },
  { id: "ED241682", alt: "Close-up of a mustard suede desert boot on a rock" },
  { id: "ED241683", alt: "Mustard suede boot stepping through wild plants" },
  {
    id: "ED241686",
    alt: "Model walking away towards a wind turbine under a pale sky",
  },
  { id: "ED241702", alt: "Model striding uphill towards a wind turbine" },
];

export function LookbookPage() {
  const setBackground = useUi((s) => s.setBackground);
  // Which photo is open large (its position in the list), or null when none is.
  const [open, setOpen] = useState<number | null>(null);

  // The lookbook sits on a deep denim colour taken from the suit.
  useEffect(() => {
    setBackground("#24405a");
  }, [setBackground]);

  // Keyboard controls while a photo is open: Escape closes, arrows move.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i! + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => (i! - 1 + PHOTOS.length) % PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <main className="px-4 pt-28 pb-20 sm:px-8 sm:pt-32">
      {/* Title and a short line, with a way back into the shop. */}
      <header className="mb-10 max-w-xl">
        <h1 className="text-4xl font-bold uppercase [font-stretch:125%] sm:text-5xl">
          Lookbook
        </h1>
        <p className="mt-3 text-[0.9375rem] opacity-85">
          The denim suit and suede desert boots, shot on a windy hillside.{" "}
          <Link to="/shop" className="underline underline-offset-4">
            Shop the pieces
          </Link>
        </p>
      </header>

      {/* The photos in 1, 2 or 3 columns depending on screen width. */}
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {PHOTOS.map((p, index) => (
          <li key={p.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="block w-full overflow-hidden rounded-lg"
              aria-label={`Open photo: ${p.alt}`}
            >
              <img
                src={`/lookbook/${p.id}.webp`}
                alt={p.alt}
                loading={index < 3 ? "eager" : "lazy"}
                width={1080}
                height={1350}
                className="h-auto w-full transition-transform duration-500 hover:scale-[1.03] motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* The large view of one photo, over a dark frosted layer. */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={PHOTOS[open].alt}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <img
            src={`/lookbook/${PHOTOS[open].id}.webp`}
            alt={PHOTOS[open].alt}
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Close, previous and next buttons. */}
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close photo"
            className="glass absolute top-4 right-4 grid size-10 place-items-center rounded-full text-white"
          >
            <CloseIcon />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open - 1 + PHOTOS.length) % PHOTOS.length);
            }}
            aria-label="Previous photo"
            className="glass absolute left-4 grid size-10 place-items-center rounded-full text-xl text-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open + 1) % PHOTOS.length);
            }}
            aria-label="Next photo"
            className="glass absolute right-4 grid size-10 place-items-center rounded-full text-xl text-white"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}
