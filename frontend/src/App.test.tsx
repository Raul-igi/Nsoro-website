// Tests for the shop's main journeys: browsing, choosing a product, the cart, checkout.
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "./App";
import { HOME_ITEMS } from "./data/products";
import { countItems, subtotal, useCart } from "./store/cart";
import { useUi } from "./store/ui";

// Show the app at a given address, as if the visitor typed it in.
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

// Start every test with an empty cart and everything closed.
beforeEach(() => {
  useCart.getState().clear();
  useUi.setState({ cartOpen: false, menuOpen: false });
});

describe("welcome page", () => {
  // The welcome page shows the campaign headline and a Discover button into the shop.
  it("shows the headline and links Discover to the shop", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { name: "Gorillas Must Be Aliens" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Discover" })).toHaveAttribute(
      "href",
      "/shop",
    );
  });

  // The hamburger opens the menu, which lists the shop pages.
  it("opens the menu from the hamburger button", async () => {
    renderAt("/");
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("navigation", { name: "Main" });
    expect(
      within(menu).getByRole("link", { name: "Lookbook" }),
    ).toBeInTheDocument();
  });
});

describe("shop page", () => {
  // There should be one floating link per homepage picture.
  it("shows every homepage picture as a product link", () => {
    renderAt("/shop");
    const links = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("href")?.startsWith("/product/"));
    expect(links).toHaveLength(HOME_ITEMS.length);
  });

  // Pointing at an item turns the page that item's colour.
  it("changes the background colour on hover", async () => {
    renderAt("/shop");
    const item = HOME_ITEMS[1];
    const link = screen
      .getAllByRole("link")
      .filter((l) => l.getAttribute("href")?.startsWith("/product/"))[1];
    await userEvent.hover(link);
    expect(useUi.getState().background).toBe(item.background);
  });
});

describe("shop page on a touch screen", () => {
  // Act like a phone for these tests, then go back to a mouse computer afterwards.
  beforeEach(() => {
    globalThis.__touchScreen = true;
  });
  afterEach(() => {
    globalThis.__touchScreen = false;
  });

  // Phones get one product per screen, a position counter, and the first
  // product's colour straight away (there's no mouse to hover with).
  it("shows products one at a time and colours the page by the first one", () => {
    renderAt("/shop");
    expect(screen.getByText(`1 / ${HOME_ITEMS.length}`)).toBeInTheDocument();
    expect(useUi.getState().background).toBe(HOME_ITEMS[0].background);
  });
});

describe("product page", () => {
  // Adding to cart puts the chosen size in the cart and opens the cart panel.
  it("adds the chosen size to the cart", async () => {
    renderAt("/product/suede-desert-boots");
    // EU 39 is sold out, so it can't be chosen and EU 40 is picked to start.
    expect(
      screen.getByRole("button", { name: "EU 39, sold out" }),
    ).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "EU 42" }));
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    const cart = screen.getByRole("dialog", { name: "Cart" });
    expect(within(cart).getByText("Size: EU 42")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cart, 1 item" }),
    ).toBeInTheDocument();
  });

  // A bad product link explains itself instead of showing a blank page.
  it("handles a product that does not exist", () => {
    renderAt("/product/nothing-here");
    expect(
      screen.getByRole("heading", { name: "This product isn't available" }),
    ).toBeInTheDocument();
  });
});

describe("lookbook", () => {
  // All 15 campaign photos appear on the lookbook page.
  it("shows every campaign photo", () => {
    renderAt("/lookbook");
    expect(screen.getAllByRole("button", { name: /^Open photo/ })).toHaveLength(
      15,
    );
  });
});

describe("cart maths", () => {
  // Adding the same item twice raises its quantity rather than adding a new line.
  it("counts items and adds up the subtotal", () => {
    const { add } = useCart.getState();
    add({ slug: "denim-suit", colorwayId: "denim", size: "M" });
    add({ slug: "denim-suit", colorwayId: "denim", size: "M" });
    add({ slug: "suede-desert-boots", colorwayId: "mustard", size: "EU 42" });
    const { lines } = useCart.getState();
    expect(lines).toHaveLength(2);
    expect(countItems(lines)).toBe(3);
    expect(subtotal(lines)).toBe(240 * 2 + 130);
  });
});

describe("checkout", () => {
  // With an empty cart, checkout points people back to the shop.
  it("shows an empty state with no items", () => {
    renderAt("/checkout");
    expect(
      screen.getByRole("heading", { name: "Your cart is empty" }),
    ).toBeInTheDocument();
  });
});
