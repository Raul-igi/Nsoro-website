// ColorField: the full-screen colour background. Whenever the chosen colour changes
// (hovering a product, opening a product page), it works out a lighter and darker
// partner colour and picks white or ink text so everything stays readable.
import { useEffect } from "react";
import { useUi } from "../store/ui";
import { luminance, shade } from "../lib/color";

export function ColorField() {
  const background = useUi((s) => s.background);

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

  return <div className="color-field" aria-hidden="true" />;
}
