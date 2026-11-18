// Header: floats over the top of every shop page.
// Left: the logo pill, then a small pill with the cart count, account and menu buttons.
// When the "+" is pressed the pill stretches to show the menu links.
// Right: the currency in brackets.
import { Link } from "react-router";
import { CURRENCY, MENU_LINKS } from "../config/store";
import { countItems, useCart } from "../store/cart";
import { useUi } from "../store/ui";
import { CloseIcon, PersonIcon, PlusIcon } from "./icons";

export function Header() {
  const count = useCart((s) => countItems(s.lines));
  const { menuOpen, setMenuOpen, cartOpen, setCartOpen } = useUi();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-6">
      {/* Left group: logo and the menu pill sit side by side. */}
      <div className="pointer-events-auto relative flex min-w-0 items-center gap-1.5">
        {/* Logo pill: always takes you back to the shop. */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="glass flex h-11 items-center rounded-full px-5 sm:h-12 sm:px-7"
          aria-label="Nsoro, back to the shop"
        >
          <span className="logo-mark block h-5 w-32 sm:h-7 sm:w-44" />
        </Link>

        {/* Menu pill: cart count, account, then the links when the menu is open. */}
        <nav
          aria-label="Main"
          className="glass flex h-11 items-center gap-1 rounded-full px-1.5 sm:h-12 sm:px-2"
        >
          {/* Cart count bubble: opens and closes the cart. */}
          <button
            type="button"
            onClick={() => setCartOpen(!cartOpen)}
            aria-expanded={cartOpen}
            aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
            className="grid size-8 place-items-center rounded-full border border-current/70 font-mono text-sm"
          >
            {count}
          </button>

          {/* Account link. Customer accounts aren't built yet; the page says so. */}
          <Link
            to="/account"
            aria-label="Account"
            className="grid size-8 place-items-center rounded-full"
          >
            <PersonIcon />
          </Link>

          {/* Menu links on wider screens: they appear inside the pill itself. */}
          {menuOpen && (
            <MenuList
              onPick={() => setMenuOpen(false)}
              className="hidden items-center gap-4 px-2 text-[0.9375rem] sm:flex"
            />
          )}

          {/* Plus / cross button: opens or closes the menu. */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-8 place-items-center rounded-full"
          >
            {menuOpen ? <CloseIcon /> : <PlusIcon />}
          </button>
        </nav>

        {/* Menu links on phones: there's no room in the pill, so they drop down below it. */}
        {menuOpen && (
          <MenuList
            onPick={() => setMenuOpen(false)}
            className="glass absolute top-full left-0 mt-2 flex w-56 flex-col gap-3 rounded-3xl p-5 text-lg sm:hidden"
          />
        )}
      </div>

      {/* Currency label on the right. A currency switcher can go here later. */}
      <p className="pointer-events-auto hidden pt-3 font-mono text-sm tracking-wide sm:block">
        [&nbsp;&nbsp;{CURRENCY}&nbsp;&nbsp;]
      </p>
    </header>
  );
}

// MenuList: the list of menu links, shared by the wide-screen and phone layouts.
// `onPick` closes the menu after a link is chosen.
function MenuList({
  className,
  onPick,
}: {
  className: string;
  onPick: () => void;
}) {
  return (
    <ul className={`font-semibold uppercase [font-stretch:110%] ${className}`}>
      {MENU_LINKS.map((link) => (
        <li key={link.label}>
          {/* Outside links (Instagram) open in a new tab; shop pages stay in this one. */}
          {"external" in link ? (
            <a
              href={link.to}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-70"
            >
              {link.label}
            </a>
          ) : (
            <Link to={link.to} onClick={onPick} className="hover:opacity-70">
              {link.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
