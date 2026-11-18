// WelcomePage: the first thing visitors see. One full-screen campaign photo, the
// campaign headline across the lower part, and a Discover button that leads into
// the shop (the floating products page). Inspired by Media/Inspo pictures/update 1.
import { Link } from "react-router";

// The welcome photo (from Media/NSORO LRES 2) and its description for screen readers.
const PHOTO = "/lookbook/ED241652.webp";
const PHOTO_ALT =
  "Model in the Nsoro denim suit and orange shirt standing among cactus plants";

export function WelcomePage() {
  return (
    <main className="relative h-dvh min-h-[560px] w-full overflow-hidden bg-ink text-white">
      {/* The photo fills the whole screen. It's cropped to fit; the focus point keeps
          the model's face and suit in view on wide and narrow screens. */}
      <img
        src={PHOTO}
        alt={PHOTO_ALT}
        className="absolute inset-0 size-full object-cover object-[50%_30%]"
      />

      {/* A soft dark fade at the top (behind the header) and the bottom (behind the
          headline), so white text stays readable on any part of the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35)_0%,transparent_22%,transparent_52%,rgb(0_0_0/0.55)_100%)]"
      />

      {/* Headline and button, centred near the bottom of the screen. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-14 text-center sm:pb-16">
        <h1 className="max-w-[16ch] text-[2.6rem] leading-[0.95] font-semibold uppercase [font-stretch:112%] sm:text-[4.2rem] lg:max-w-[20ch] lg:text-[5.2rem]">
          Gorillas must be aliens
        </h1>

        {/* Discover: goes to the shop page with all the floating products. */}
        <Link
          to="/shop"
          className="mt-8 flex h-14 w-full max-w-[320px] items-center justify-center bg-black text-sm font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-white hover:text-black"
        >
          Discover
        </Link>
      </div>
    </main>
  );
}
