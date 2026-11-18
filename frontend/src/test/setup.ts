// Test setup: adds extra checks like `toBeInTheDocument()` to every test.
import "@testing-library/jest-dom/vitest";

// The simulated browser used in tests (jsdom) lacks a few real-browser features
// our pages use. These stand-ins do nothing, which is all the tests need.

// Used by the product page to highlight the thumbnail of the picture in view.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver =
  NoopIntersectionObserver as unknown as typeof IntersectionObserver;

// Used to jump to the top of the page and to scroll to a picture.
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};

// Used to ask "is this a touch screen?" (see src/lib/useMediaQuery.ts).
// Tests act like a computer with a mouse unless a test sets
// `globalThis.__touchScreen = true` to act like a phone.
declare global {
  var __touchScreen: boolean | undefined;
}
window.matchMedia = ((query: string) => ({
  matches: Boolean(globalThis.__touchScreen),
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
})) as unknown as typeof window.matchMedia;
