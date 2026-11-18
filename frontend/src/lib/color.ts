// Small colour helpers used to build the page background from one product colour.

// Convert "#rrggbb" into its red, green and blue numbers (0–255).
function toRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Convert red, green and blue numbers back into "#rrggbb".
function toHex(rgb: number[]) {
  return (
    "#" + rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")
  );
}

// Mix a colour toward white (amount > 0) or black (amount < 0). amount goes from -1 to 1.
export function shade(hex: string, amount: number) {
  const rgb = toRgb(hex).map((c) =>
    amount < 0 ? c * (1 + amount) : c + (255 - c) * amount,
  );
  return toHex(rgb);
}

// How bright a colour looks to the eye, from 0 (black) to 1 (white).
export function luminance(hex: string) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
