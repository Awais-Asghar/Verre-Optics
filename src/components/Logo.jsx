// Verre Optics wordmark + glasses monogram. Theme-aware via currentColor.
export default function Logo({ light = false, size = 20 }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-serif font-bold ${light ? "text-ink-fg" : "text-fg"}`}
      style={{ fontSize: size }}
    >
      <svg viewBox="0 0 32 32" width={size + 8} height={size + 8} fill="none" aria-hidden="true" className="text-accent">
        <circle cx="10" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="22" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
        <path d="M18 14Q20 12 22 14" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      <span>
        <span className="text-accent">Verre</span> Optics
      </span>
    </span>
  );
}
