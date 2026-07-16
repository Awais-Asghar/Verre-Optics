import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Route-level code splitting: face-api / TensorFlow only load on /try.
const Landing = lazy(() => import("./pages/Landing.jsx"));
const TryApp = lazy(() => import("./pages/TryApp.jsx"));

function Fallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-surface">
      <img src="/assets/logo-light.png" alt="Verre Optics" className="h-24 w-auto animate-pulse dark:hidden" />
      <img src="/assets/logo-dark.png" alt="Verre Optics" className="hidden h-24 w-auto animate-pulse dark:block" />
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-surface3 border-t-accent" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/try" element={<TryApp />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
    </>
  );
}
