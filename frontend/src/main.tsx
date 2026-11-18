// Entry point: this file starts the React app and attaches it to the page.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";

// One shared React Query client: it fetches and caches data from the backend.
const queryClient = new QueryClient();

// Render the app inside the #root element from index.html.
// - StrictMode warns about common mistakes during development.
// - QueryClientProvider lets any component load data from the API.
// - BrowserRouter enables page URLs like /shop or /cart.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
