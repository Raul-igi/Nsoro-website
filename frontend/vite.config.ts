/// <reference types="vitest/config" />
// Vite configuration: controls how the React site is built and served in development.
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Plugins: React support (JSX, fast refresh) and Tailwind CSS styling.
  plugins: [react(), tailwindcss()],

  // Dev server: any request starting with /api is forwarded to the Django
  // backend on port 8000, so the frontend can call it without CORS issues.
  server: {
    // Allow the ngrok public URL to access the Vite development server.
    allowedHosts: ["antler-plausible-resume.ngrok-free.dev"],
    proxy: {
      "/api": "http://localhost:8000",
    },
  },

  // Tests (Vitest): run in a simulated browser (jsdom) and load our
  // shared setup file before each test file.
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
