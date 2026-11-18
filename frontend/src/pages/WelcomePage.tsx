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
        // The most important picture on the page: download it before anything else.
        fetchPriority="high"
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
        {/* The headline in the Pinyon Script handwriting font. Script letters look
            small next to block capitals, so it is set larger, with each word capitalised. */}
        <h1 className="font-script max-w-[14ch] text-[3.6rem] leading-[1.05] font-normal drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-[5.6rem] lg:max-w-[20ch] lg:text-[7rem]">
          Gorillas Must Be Aliens
        </h1>

        {/* Discover: goes to the shop page with all the floating products. It uses the
            shared black button style (btn-black in index.css); only its size and
            spacing are set here. */}
        <Link to="/shop" className="btn-black mt-8 w-full max-w-[320px]">
          Discover
        </Link>
      </div>
    </main>
  );
}
