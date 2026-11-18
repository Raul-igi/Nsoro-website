// Shared screen state that several parts of the page need:
// the background colour and whether the cart or menu is open.
import { create } from "zustand";
import { DEFAULT_BACKGROUND } from "../data/products";

interface UiState {
  background: string;
  cartOpen: boolean;
  menuOpen: boolean;
  setBackground: (colour: string) => void;
  setCartOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

// Opening the cart closes the menu and the other way round, so only one shows at a time.
export const useUi = create<UiState>()((set) => ({
  background: DEFAULT_BACKGROUND,
  cartOpen: false,
  menuOpen: false,
  setBackground: (background) => set({ background }),
  setCartOpen: (cartOpen) =>
    set(cartOpen ? { cartOpen, menuOpen: false } : { cartOpen }),
  setMenuOpen: (menuOpen) =>
    set(menuOpen ? { menuOpen, cartOpen: false } : { menuOpen }),
}));
