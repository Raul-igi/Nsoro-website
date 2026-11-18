// Entry point: this file starts the React app and attaches it to the page.
// (React Query, for loading data from the Django backend, will be added back here
// once the site actually loads products from the API. It was removed until then so
// visitors don't download code that isn't used.)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";

// Render the app inside the #root element from index.html.
// - StrictMode warns about common mistakes during development.
// - BrowserRouter enables page URLs like /shop or /checkout.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
