// ColorField: the full-screen colour background. Whenever the chosen colour changes
// (hovering a product, opening a product page), it works out a lighter and darker
// partner colour and picks white or ink text so everything stays readable.
import { useEffect, useState } from "react";
import { useUi } from "../store/ui";
import { luminance, shade } from "../lib/color";

export function ColorField() {
  const background = useUi((s) => s.background);
  // The colour fade is switched off for the first moment after the page loads, so a
  // product page opens straight in its own colour instead of fading from the default.
  const [fade, setFade] = useState(false);

  // Turn the fade on shortly after the page first appears.
  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 400);
    return () => clearTimeout(timer);
  }, []);

  // Write the colours onto the page root so every element (glass, text) can use them.
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--bg", background);
    root.setProperty("--bg-light", shade(background, 0.38));
    root.setProperty("--bg-dark", shade(background, -0.55));
    // Very light colours (e.g. chalk) get dark text; everything else gets white text.
    root.setProperty(
      "--fg",
      luminance(background) > 0.6 ? "#1d2024" : "#ffffff",
    );
  }, [background]);

  return (
    <div
      className={`color-field ${fade ? "" : "color-field--instant"}`}
      aria-hidden="true"
    />
  );
}
