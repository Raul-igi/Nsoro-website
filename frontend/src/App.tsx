// App: decides which page to show for each address (URL).
// Shop pages (welcome, shop, products, lookbook...) share the coloured background,
// the header and the cart; the checkout page has its own calm, light layout.
//
// Speed: only the welcome page is part of the first download. Every other page is a
// separate small file that's fetched when it's first visited (React "lazy" loading),
// so visitors don't download code for pages they never open. Once the welcome page
// has finished loading and the browser is idle, the shop and product pages are
// fetched quietly in the background, so tapping "Discover" still feels instant.
import { lazy, Suspense, useEffect } from "react";
import { Outlet, Route, Routes } from "react-router";
import { CartPanel } from "./components/CartPanel";
import { ColorField } from "./components/ColorField";
import { Header } from "./components/Header";
import { WelcomePage } from "./pages/WelcomePage";

// Where each on-demand page's code lives. Kept as functions so the same file can be
// fetched early (see below) and then reused by React.
const loadShop = () => import("./pages/HomePage");
const loadProduct = () => import("./pages/ProductPage");
const loadInfo = () => import("./pages/InfoPage");

// The on-demand pages. (React's lazy loading expects a "default" page, so pages that
// are exported by name are mapped to one here.)
const HomePage = lazy(() => loadShop().then((m) => ({ default: m.HomePage })));
const ProductPage = lazy(() =>
  loadProduct().then((m) => ({ default: m.ProductPage })),
);
const LookbookPage = lazy(() =>
  import("./pages/LookbookPage").then((m) => ({ default: m.LookbookPage })),
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })),
);
const ContactPage = lazy(() =>
  loadInfo().then((m) => ({ default: m.ContactPage })),
);
const PoliciesPage = lazy(() =>
  loadInfo().then((m) => ({ default: m.PoliciesPage })),
);
const AccountPage = lazy(() =>
  loadInfo().then((m) => ({ default: m.AccountPage })),
);
const NotFoundPage = lazy(() =>
  loadInfo().then((m) => ({ default: m.NotFoundPage })),
);

// After the first page is ready and the browser has nothing else to do, quietly fetch
// the pages visitors usually open next (shop and product), so they open instantly.
function usePrefetchNextPages() {
  useEffect(() => {
    const prefetch = () => {
      loadShop();
      loadProduct();
    };
    // Safari doesn't have requestIdleCallback, so it waits a couple of seconds instead.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(prefetch, 2000);
    return () => clearTimeout(timer);
  }, []);
}

// The frame around every shop page: background, header, cart, then the page itself.
// While an on-demand page is still downloading (a split second), the coloured
// background and header stay on screen instead of a blank page.
function ShopLayout() {
  return (
    <>
      <ColorField />
      <Header />
      <CartPanel />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
}

function App() {
  usePrefetchNextPages();

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

      {/* Checkout stands on its own (its own light page, no shop frame). */}
      <Route
        path="checkout"
        element={
          <Suspense fallback={null}>
            <CheckoutPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
