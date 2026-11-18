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
