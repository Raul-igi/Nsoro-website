// App: decides which page to show for each address (URL).
// Shop pages share the coloured background, the floating header and the cart;
// the checkout page has its own calm, light layout.
import { Outlet, Route, Routes } from "react-router";
import { CartPanel } from "./components/CartPanel";
import { ColorField } from "./components/ColorField";
import { Header } from "./components/Header";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import {
  AccountPage,
  ContactPage,
  NotFoundPage,
  PoliciesPage,
} from "./pages/InfoPage";
import { ProductPage } from "./pages/ProductPage";

// The frame around every shop page: background, header, cart, then the page itself.
function ShopLayout() {
  return (
    <>
      <ColorField />
      <Header />
      <CartPanel />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Pages inside the shop frame. */}
      <Route element={<ShopLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Checkout stands on its own. */}
      <Route path="checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;
