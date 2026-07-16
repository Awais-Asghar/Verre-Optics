# Verre Optics — Project Guide

Private, in-browser eyewear recommender. Upload a photo (or use the camera) → it reads
face shape, features and skin tone → recommends frame shapes, colors, sizes + a printable
report. All client-side; no server, no API keys, no uploads.

## Stack
- **Vite + React 18 + Tailwind 3** — Emerald & Ink theme, light/dark via `[data-theme]` CSS vars
- **@vladmandic/face-api** — 68-landmark detection (models in `public/models/`)
- **GSAP + ScrollTrigger** — hero + curved timeline; reveals use IntersectionObserver
- **react-router-dom** — `/` landing, `/try` app

## Structure
```
src/
  App.jsx              routes (lazy) + branded Suspense splash
  main.jsx             BrowserRouter, theme boot
  index.css            Tailwind + theme tokens (@media print → light)
  pages/               Landing.jsx, TryApp.jsx (upload→analyze→recommend→report)
  lib/                 faceAnalysis.js, skinTone.js (ITA), recommend.js, theme.js
  components/          marketing/, app/ (Webcam, ResultsTabs), ui/, Icons, Logo mark
public/  models/ (face-api weights) · assets/ (frames, heroes, logo)
```
Analysis is geometry-based (deterministic), not AI — ratings are labeled as such.

## Develop
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # -> dist/
npm run preview   # preview the production build
```

## Deploy (Vercel or Netlify)
The app uses client-side routing, so a **SPA fallback** is required (already configured):
- **Vercel** — `vercel.json` rewrites all paths to `/index.html`. Import the repo; framework
  auto-detected as Vite (build `npm run build`, output `dist`). Nothing else to set.
- **Netlify** — `netlify.toml` sets build `npm run build` / publish `dist` + SPA redirect.
  `public/_redirects` also covers manual `dist` drag-and-drop deploys.

Both serve from the domain root (`vite.config.js` base `/`); `/models` and `/assets` resolve
correctly. First analyze call downloads the face-api models (~a few MB) once.

## Notes
- Best results: clear, front-facing photo, even lighting.
- Report follows the theme on screen but always prints as a clean white sheet.
- License: **proprietary, all rights reserved** (see `LICENSE`). Bundled Unsplash photos
  and face-api model weights carry their own third-party terms.
