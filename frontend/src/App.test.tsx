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

describe("homepage", () => {
  // Every colour of every product should be on the homepage as a link.
  it("shows every product colour", () => {
    renderAt("/");
    for (const { product, colorway } of HOME_ITEMS) {
      expect(
        screen.getByRole("link", {
          name: new RegExp(`${product.name}, ${colorway.name},`),
        }),
      ).toBeInTheDocument();
    }
  });

  // Pointing at an item turns the page that item's colour.
  it("changes the background colour on hover", async () => {
    renderAt("/");
    const { product, colorway } = HOME_ITEMS[0];
    await userEvent.hover(
      screen.getByRole("link", {
        name: new RegExp(`${product.name}, ${colorway.name},`),
      }),
    );
    expect(useUi.getState().background).toBe(colorway.background);
  });
});

describe("product page", () => {
  // Adding to cart puts the chosen size in the cart and opens the cart panel.
  it("adds the chosen size to the cart", async () => {
    renderAt("/product/heavy-tee?color=rust");
    // XS is sold out in rust, so it can't be chosen and S is picked to start.
    expect(screen.getByRole("button", { name: "XS, sold out" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "M" }));
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    const cart = screen.getByRole("dialog", { name: "Cart" });
    expect(within(cart).getByText("Size: M")).toBeInTheDocument();
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

describe("cart maths", () => {
  // Adding the same item twice raises its quantity rather than adding a new line.
  it("counts items and adds up the subtotal", () => {
    const { add } = useCart.getState();
    add({ slug: "heavy-tee", colorwayId: "chalk", size: "M" });
    add({ slug: "heavy-tee", colorwayId: "chalk", size: "M" });
    add({ slug: "crew-socks", colorwayId: "stone", size: null });
    const { lines } = useCart.getState();
    expect(lines).toHaveLength(2);
    expect(countItems(lines)).toBe(3);
    expect(subtotal(lines)).toBe(45 * 2 + 18);
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
