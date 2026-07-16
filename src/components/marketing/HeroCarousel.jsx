import { useState, useEffect, useCallback } from "react";
import { IconGlasses } from "../Icons.jsx";

// Rotating hero of diverse faces with a manual swap control + dots.
// Crossfades between images; auto-advances unless the user prefers reduced motion.
const SLIDES = [
  { src: "/assets/hero-3.jpg", alt: "Smiling person wearing round eyeglasses" },
  { src: "/assets/hero-2.jpg", alt: "Person wearing white-framed eyeglasses" },
  { src: "/assets/hero-1.jpg", alt: "Person wearing aviator eyeglasses" },
  { src: "/assets/hero-4.jpg", alt: "Person wearing rectangular eyeglasses" },
  { src: "/assets/hero-5.jpg", alt: "Person wearing round eyeglasses" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const go = useCallback((d) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 4200);
    return () => clearInterval(t);
  }, [n]);

  return (
    <div data-hero-img className="relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-lift">
        {SLIDES.map((s, idx) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width="800"
            height="1000"
            loading={idx === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: idx === i ? 1 : 0 }}
            aria-hidden={idx === i ? undefined : true}
          />
        ))}

        {/* Swap controls */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous face"
          className="group absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-ink-fg backdrop-blur-sm transition hover:bg-ink/70"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next face"
          className="group absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-ink-fg backdrop-blur-sm transition hover:bg-ink/70"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Show face ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${idx === i ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"}`}
            />
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-line bg-surface2 px-5 py-4 shadow-lift sm:block">
        <div className="flex items-center gap-3">
          <span className="text-accent"><IconGlasses size={26} /></span>
          <div>
            <div className="font-serif text-lg font-bold text-fg">Every face</div>
            <div className="text-xs text-muted">has its perfect frame</div>
          </div>
        </div>
      </div>
    </div>
  );
}
