// App: decides which page to show for each address (URL).
// Shop pages (welcome, shop, products, lookbook...) share the coloured background,
// the header and the cart;
// the checkout page has its own calm, light layout.
import { Outlet, Route, Routes } from "react-router";
import { CartPanel } from "./components/CartPanel";
import { ColorField } from "./components/ColorField";
import { Header } from "./components/Header";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { LookbookPage } from "./pages/LookbookPage";
import {
  AccountPage,
  ContactPage,
  NotFoundPage,
  PoliciesPage,
} from "./pages/InfoPage";
import { ProductPage } from "./pages/ProductPage";
import { WelcomePage } from "./pages/WelcomePage";

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
        {/* "/" is the welcome photo; "/shop" shows all the floating products. */}
        <Route index element={<WelcomePage />} />
        <Route path="shop" element={<HomePage />} />
        <Route path="product/:slug" element={<ProductPage />} />
        <Route path="lookbook" element={<LookbookPage />} />
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
