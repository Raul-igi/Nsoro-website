// Header: sits across the top of every shop page (layout from the "update 1" inspo).
// Left: the hamburger button that slides the menu in from the left.
// Centre: the Nsoro logo, which goes back to the welcome page.
// Right: the account icon and the bag with the number of items in the cart.
import { useEffect } from "react";
import { Link } from "react-router";
import { CURRENCY, MENU_LINKS } from "../config/store";
import { countItems, useCart } from "../store/cart";
import { useUi } from "../store/ui";
import { BagIcon, CloseIcon, MenuIcon, PersonIcon } from "./icons";

// Shared look for the round icon buttons. The faint shadow keeps the white icons
// readable on top of photos and light colours.
const iconButton =
  "grid size-10 place-items-center rounded-full drop-shadow-[0_1px_4px_rgb(0_0_0/0.3)] hover:opacity-75";

export function Header() {
  const count = useCart((s) => countItems(s.lines));
  const { menuOpen, setMenuOpen, cartOpen, setCartOpen } = useUi();

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center px-3 py-3 sm:px-6 sm:py-5">
        {/* Left: hamburger menu button. */}
        <div className="pointer-events-auto flex">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label="Open menu"
            className={iconButton}
          >
            <MenuIcon />
          </button>
        </div>

        {/* Centre: the logo, linking to the welcome page. The shadow sits on the link
            because the logo shape itself is cut out with a mask, which would hide it. */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          aria-label="Nsoro home"
          className="pointer-events-auto drop-shadow-[0_1px_6px_rgb(0_0_0/0.25)]"
        >
          <span className="logo-mark block h-5 w-28 sm:h-7 sm:w-40" />
        </Link>

        {/* Right: account and cart. */}
        <div className="pointer-events-auto flex justify-end gap-1">
          {/* Account link. Customer accounts aren't built yet; the page says so. */}
          <Link to="/account" aria-label="Account" className={iconButton}>
            <PersonIcon />
          </Link>

          {/* Bag with the item count: opens and closes the cart. */}
          <button
            type="button"
            onClick={() => setCartOpen(!cartOpen)}
            aria-expanded={cartOpen}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className={`${iconButton} relative`}
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 grid size-4.5 place-items-center rounded-full bg-white font-mono text-[0.625rem] font-medium text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <MenuDrawer />
    </>
  );
}

// MenuDrawer: the menu panel that slides in from the left when the hamburger is
// pressed. It stays in the page while closed (so it can slide), but is hidden from
// keyboard and screen readers until opened.
function MenuDrawer() {
  const { menuOpen, setMenuOpen } = useUi();
  const close = () => setMenuOpen(false);

  // Close the menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      {/* Dimmed layer over the page while the menu is open; clicking it closes the menu. */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* The sliding panel itself. */}
      <nav
        id="site-menu"
        aria-label="Main"
        inert={!menuOpen}
        className={`glass-solid fixed inset-y-0 left-0 z-50 flex w-[min(340px,86vw)] flex-col p-6 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button. */}
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="grid size-10 place-items-center self-start rounded-full hover:bg-ink/10"
        >
          <CloseIcon />
        </button>

        {/* The links, large and stacked. */}
        <ul className="mt-8 flex flex-col gap-4 text-2xl font-semibold uppercase [font-stretch:115%]">
          {MENU_LINKS.map((link) => (
            <li key={link.label}>
              {/* Outside links (Instagram) open in a new tab; shop pages stay in this one. */}
              {"external" in link ? (
                <a
                  href={link.to}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:opacity-60"
                >
                  {link.label}
                </a>
              ) : (
                <Link to={link.to} onClick={close} className="hover:opacity-60">
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Currency at the bottom of the menu. A currency switcher can go here later. */}
        <p className="mt-auto font-mono text-sm text-slate">
          Prices in {CURRENCY}
        </p>
      </nav>
    </>
  );
}
