import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Verre Optics — Vite config. Base is relative so the built site works on any
// static host / subpath. face-api models & imagery live in /public.
export default defineConfig({
  // Root-absolute base so /models and /assets resolve correctly on every route
  // (BrowserRouter serves the app from "/"). For subpath hosting, change this
  // and the code uses import.meta.env.BASE_URL for the model path.
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1500, // face-api/tfjs bundle is large by nature
  },
});
