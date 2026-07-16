import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Nav from "../components/marketing/Nav.jsx";
import Logo from "../components/Logo.jsx";
import HeroCarousel from "../components/marketing/HeroCarousel.jsx";
import { FACE_SHAPES, FACE_OUTLINES } from "../data/faceShapes.jsx";
import {
  IconArrowRight, IconUpload, IconSearch, IconGlasses, IconFace,
  IconPalette, IconRuler, IconShield, IconSparkle, IconCheck,
} from "../components/Icons.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  { n: 1, Icon: IconUpload, title: "Upload a photo", body: "Drop in a clear, front-facing photo — or use your camera. It's processed entirely in your browser; nothing is uploaded." },
  { n: 2, Icon: IconSearch, title: "We read your features", body: "Face-mapping measures your shape, symmetry, proportions and skin tone from 68 facial landmarks." },
  { n: 3, Icon: IconGlasses, title: "Get matched frames", body: "Receive frame shapes, colors and sizing tuned to your face — plus a clean, printable report." },
];

const FEATURES = [
  { Icon: IconFace, title: "Face Shape", body: "Shape classification with probabilities, characteristics and full facial proportions." },
  { Icon: IconPalette, title: "Feature Analysis", body: "Eyes, brows, lips and nose — each measured and rated from real geometry." },
  { Icon: IconRuler, title: "Frame Matching", body: "DBL, frame size, shapes and colors — the exact specs to shop with confidence." },
];

const GALLERY = [
  { src: "/assets/frame-3.jpg", name: "Round Metal", tag: "Refined" },
  { src: "/assets/frame-1.jpg", name: "Browline", tag: "Structured" },
  { src: "/assets/frame-7.jpg", name: "Wayfarer", tag: "Classic" },
  { src: "/assets/frame-5.jpg", name: "Cat-Eye", tag: "Statement" },
  { src: "/assets/frame-2.jpg", name: "Round Acetate", tag: "Soft" },
  { src: "/assets/frame-4.jpg", name: "Clubmaster", tag: "Everyday" },
];

const QUOTES = [
  { q: "I finally understand why some frames never suited me. The shape match was spot on.", a: "Amelia R.", r: "Oval face" },
  { q: "The report told me my exact bridge size. Shopping online stopped being a gamble.", a: "David K.", r: "Square face" },
  { q: "Beautiful, fast, and it never sent my photo anywhere. Exactly what I wanted.", a: "Priya N.", r: "Heart face" },
];

export default function Landing() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero] > *", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.1 });
        gsap.from("[data-hero-img]", { scale: 1.06, opacity: 0, duration: 1.2, ease: "power2.out" });
        gsap.to("[data-hero-img]", {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
        });

        // Reveal groups
        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, { y: 28, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });

        // Staggered grids
        gsap.utils.toArray("[data-stagger]").forEach((grid) => {
          gsap.from(grid.children, {
            y: 22, opacity: 0, scale: 0.94, duration: 0.5, ease: "back.out(1.4)",
            stagger: { each: 0.07, from: "start" },
            scrollTrigger: { trigger: grid, start: "top 82%" },
          });
        });

        // Timeline: draw the vertical connector line top→bottom on scroll
        gsap.fromTo(
          "[data-timeline-fill]",
          { scaleY: 0 },
          {
            scaleY: 1, ease: "none", transformOrigin: "top",
            scrollTrigger: { trigger: "[data-timeline]", start: "top 60%", end: "bottom 75%", scrub: true },
          }
        );
        gsap.utils.toArray("[data-step]").forEach((el) => {
          gsap.from(el, { opacity: 0, x: -16, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%" } });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero] > *, [data-hero-img], [data-reveal], [data-stagger] > *, [data-step]", { opacity: 1, y: 0, x: 0, scale: 1 });
        gsap.set("[data-timeline-fill]", { scaleY: 1, transformOrigin: "top" });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="bg-surface">
      <Nav />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="mx-auto grid max-w-editorial items-center gap-10 px-6 pb-16 md:grid-cols-2 md:gap-14 md:pb-24">
          <div data-hero>
            <p className="eyebrow mb-5">Personal Eyewear Styling</p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.04] tracking-tightest text-fg sm:text-6xl">
              Find the frames<br />made for <span className="italic text-accent">your</span> face.
            </h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted">
              Upload one photo — or use your camera. Verre Optics reads your face shape, features and skin
              tone, then recommends the exact frame shapes, colors and sizes that suit you. All in your browser.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/try" className="btn-accent">Analyze my face <IconArrowRight size={16} /></Link>
              <a href="#how" className="btn-outline">See how it works</a>
            </div>
            <div className="mt-7 flex items-center gap-2 text-[13px] font-medium text-muted">
              <IconShield size={16} className="text-accent" />
              Private by design — your photo never leaves your device.
            </div>
          </div>

          <HeroCarousel />
        </div>
      </section>

      {/* ── HOW IT WORKS (animated vertical timeline) ── */}
      <section id="how" className="border-y border-line bg-surface2 py-20 md:py-28">
        <div className="mx-auto max-w-editorial px-6">
          <div data-reveal className="mb-14 max-w-xl">
            <p className="eyebrow mb-3">The process</p>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Three steps to your perfect fit</h2>
          </div>

          <div data-timeline className="relative mx-auto max-w-2xl pl-0">
            {/* connector track + animated fill */}
            <div className="absolute bottom-8 left-7 top-8 w-[2px] -translate-x-1/2 rounded bg-line" />
            <div data-timeline-fill className="absolute bottom-8 left-7 top-8 w-[2px] -translate-x-1/2 rounded bg-accent" style={{ transformOrigin: "top" }} />

            {STEPS.map((s) => (
              <div data-step key={s.n} className="relative flex gap-6 pb-12 last:pb-0">
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent bg-surface2 text-accent shadow-soft">
                  <s.Icon size={22} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-fg">{s.n}</span>
                </div>
                <div className="pt-1">
                  <h3 className="mb-1.5 font-serif text-xl font-bold text-fg">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28">
        <div className="mx-auto max-w-editorial px-6">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
            <div data-reveal>
              <p className="eyebrow mb-3">What you'll learn</p>
              <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">A full read of your features</h2>
            </div>
            <p data-reveal className="text-[15px] leading-relaxed text-muted md:pb-1">
              Every recommendation is backed by real measurement — face shape probabilities, symmetry,
              proportions and per-feature ratings drawn from 68 facial landmarks.
            </p>
          </div>
          <div data-stagger className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-7 transition-shadow duration-300 hover:shadow-lift">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-accent">
                  <f.Icon size={22} />
                </span>
                <h3 className="mb-2 font-serif text-xl font-bold text-fg">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FACE SHAPE GUIDE ── */}
      <section id="guide" className="border-y border-line bg-surface2 py-20 md:py-28">
        <div className="mx-auto max-w-editorial px-6">
          <div data-reveal className="mb-14 max-w-2xl">
            <p className="eyebrow mb-3">The guide</p>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Know your face shape</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Six shapes, one for everyone. Here's how to recognise each — and the frame styles that
              flatter it. Not sure which is yours? Verre Optics works it out from a single photo.
            </p>
          </div>

          <div data-stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FACE_SHAPES.map((s) => (
              <article key={s.key} className="card flex flex-col p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-16 w-14 flex-shrink-0 text-accent">{FACE_OUTLINES[s.key]}</div>
                  <h3 className="font-serif text-2xl font-bold text-fg">{s.name}</h3>
                </div>
                <p className="mb-4 text-[14px] leading-relaxed text-muted">{s.blurb}</p>
                <ul className="mb-5 space-y-1.5">
                  {s.traits.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-[13px] text-fg">
                      <IconCheck size={15} className="mt-0.5 flex-shrink-0 text-accent" /> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto border-t border-line pt-4">
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Best frames</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.best.map((b) => (
                      <span key={b} className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-medium text-accent">{b}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FRAME GALLERY (real photos) ── */}
      <section id="gallery" className="bg-ink py-20 text-ink-fg md:py-28">
        <div className="mx-auto max-w-editorial px-6">
          <div data-reveal className="mb-14 max-w-xl">
            <p className="eyebrow mb-3">The frames</p>
            <h2 className="text-3xl font-bold tracking-tight text-ink-fg sm:text-4xl">Every shape, styled to suit</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              From structured browlines to soft rounds — Verre Optics points you to the silhouettes that flatter your face.
            </p>
          </div>
          <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((g) => (
              <figure key={g.name} className="group relative overflow-hidden rounded-2xl border border-ink-line">
                <img
                  src={g.src} alt={`${g.name} eyewear`} width="600" height="450" loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-serif text-lg font-bold text-white">{g.name}</div>
                  <div className="text-xs uppercase tracking-editorial text-accent">{g.tag}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-editorial px-6">
          <div data-reveal className="mb-14 text-center">
            <p className="eyebrow mb-3">Loved by careful shoppers</p>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Confidence, before you checkout</h2>
          </div>
          <div data-stagger className="grid gap-6 md:grid-cols-3">
            {QUOTES.map((t, i) => (
              <figure key={i} className="card flex flex-col p-7">
                <span className="mb-4 font-serif text-5xl leading-none text-accent">&ldquo;</span>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-fg">{t.q}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-4">
                  <div className="text-sm font-bold text-fg">{t.a}</div>
                  <div className="text-xs text-muted">{t.r}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-24">
        <div data-reveal className="mx-auto max-w-editorial overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center md:py-20">
          <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
            <IconSparkle size={26} />
          </span>
          <h2 className="mx-auto max-w-2xl font-serif text-3xl font-extrabold leading-tight text-ink-fg sm:text-5xl">
            Your perfect frames are one photo away.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] text-ink-muted">
            Free, private and instant. No account, no uploads, no guesswork.
          </p>
          <Link to="/try" className="btn-accent mt-9">Analyze my face <IconArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-line py-14">
        <div className="mx-auto max-w-editorial px-6 text-center">
          {/* Real logo lockup, swapped by theme */}
          <img src="/assets/logo-light.png" alt="Verre Optics" className="mx-auto mb-6 block h-20 w-auto dark:hidden" />
          <img src="/assets/logo-dark.png" alt="Verre Optics" className="mx-auto mb-6 hidden h-20 w-auto dark:block" />
          <p className="text-xs text-muted">Client-side analysis · Measurements are estimates, not medical or optical advice.</p>
        </div>
      </footer>
    </div>
  );
}
