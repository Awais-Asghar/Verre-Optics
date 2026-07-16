// Verre Optics — SVG frame-shape icons (ported from original framefit.jsx).
// Line-art frames rendered with currentColor so they inherit ink/gold.

export const FRAME_ICONS = {
  Rectangular: (
    <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <rect x="2" y="4" width="30" height="28" rx="3" />
      <rect x="48" y="4" width="30" height="28" rx="3" />
      <line x1="32" y1="18" x2="48" y2="18" />
    </svg>
  ),
  Square: (
    <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <rect x="2" y="2" width="32" height="32" rx="2" />
      <rect x="46" y="2" width="32" height="32" rx="2" />
      <line x1="34" y1="18" x2="46" y2="18" />
    </svg>
  ),
  Round: (
    <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <circle cx="18" cy="18" r="15" />
      <circle cx="62" cy="18" r="15" />
      <line x1="33" y1="18" x2="47" y2="18" />
    </svg>
  ),
  Aviator: (
    <svg viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <path d="M2 10Q2 2 17 2h2Q34 2 34 14v12Q34 38 20 38h-6Q2 38 2 26Z" />
      <path d="M46 10Q46 2 61 2h2Q78 2 78 14v12Q78 38 64 38h-6Q46 38 46 26Z" />
      <line x1="34" y1="14" x2="46" y2="14" />
    </svg>
  ),
  Oval: (
    <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <ellipse cx="18" cy="18" rx="16" ry="14" />
      <ellipse cx="62" cy="18" rx="16" ry="14" />
      <line x1="34" y1="18" x2="46" y2="18" />
    </svg>
  ),
  "Cat-eye": (
    <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
      <path d="M2 20Q2 34 18 34h2Q34 34 34 20V14Q34 2 28 2H6Q2 6 2 14Z" />
      <path d="M46 20Q46 34 62 34h2Q78 34 78 20V14Q78 2 72 2H50Q46 6 46 14Z" />
      <line x1="34" y1="20" x2="46" y2="20" />
    </svg>
  ),
};

export const defIcon = (
  <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 56 }}>
    <rect x="2" y="4" width="30" height="28" rx="8" />
    <rect x="48" y="4" width="30" height="28" rx="8" />
    <line x1="32" y1="18" x2="48" y2="18" />
  </svg>
);
