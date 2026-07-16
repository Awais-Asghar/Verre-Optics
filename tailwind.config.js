/** @type {import('tailwindcss').Config} */
// Verre Optics — Emerald & Ink theme.
// Colors are semantic tokens backed by CSS variables (RGB channels) so the same
// class names adapt to light/dark via [data-theme] on <html>. Alpha modifiers
// (bg-accent/10 etc.) work because vars are "R G B" channels.
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: withAlpha("--surface"),
        surface2: withAlpha("--surface-2"),
        surface3: withAlpha("--surface-3"),
        fg: withAlpha("--fg"),
        muted: withAlpha("--muted"),
        accent: {
          DEFAULT: withAlpha("--accent"),
          soft: withAlpha("--accent-soft"),
          strong: withAlpha("--accent-strong"),
          fg: withAlpha("--accent-fg"),
        },
        line: withAlpha("--line"),
        // Always-dark panels (gallery, CTA) — dark in both themes
        ink: {
          DEFAULT: withAlpha("--ink"),
          fg: withAlpha("--ink-fg"),
          muted: withAlpha("--ink-muted"),
          line: withAlpha("--ink-line"),
        },
        // semantic status (bars)
        success: "#3F9E7C",
        danger: "#D2604F",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        editorial: "0.18em",
      },
      maxWidth: { editorial: "1200px" },
      boxShadow: {
        soft: "0 2px 20px rgb(var(--shadow) / 0.06)",
        lift: "0 12px 40px rgb(var(--shadow) / 0.12)",
        accent: "0 8px 30px rgb(var(--accent) / 0.28)",
      },
      keyframes: {
        spin: { to: { transform: "rotate(360deg)" } },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
        "fade-up": "fade-up 0.6s ease forwards",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
