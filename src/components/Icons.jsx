// FrameFit — inline SVG icons (Lucide-style, stroke=currentColor).
// Replaces emoji icons per the pre-delivery checklist (no emojis as icons).

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const S = ({ children, size = 20, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...p}>
    {children}
  </svg>
);

export const IconFace = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" /><path d="M9 10h.01M15 10h.01" /></S>
);
export const IconStar = (p) => (
  <S {...p}><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9L12 3z" /></S>
);
export const IconEye = (p) => (
  <S {...p}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.5" /></S>
);
export const IconBrow = (p) => (
  <S {...p}><path d="M3 9c3-2.5 6-2.5 9 0" /><path d="M13 9c2.5-2 5-2 7.5 0" /></S>
);
export const IconLips = (p) => (
  <S {...p}><path d="M3 12c2-2 4-2 5-1s2 1 4 1 3 0 4-1 3-1 5 1" /><path d="M3 12c2 3 5 4.5 9 4.5S19 15 21 12" /></S>
);
export const IconNose = (p) => (
  <S {...p}><path d="M12 4v7c0 1.5-.8 2.5-2 3" /><path d="M12 14c1.2.5 2 1.5 2 3" /><path d="M8 17c1.2 1 2.8 1 4 0" /></S>
);
export const IconUpload = (p) => (
  <S {...p}><path d="M12 15V4" /><path d="M8 8l4-4 4 4" /><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></S>
);
export const IconSparkle = (p) => (
  <S {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" /><path d="M19 15l.7 1.7L21.5 17l-1.8.7L19 19l-.7-1.7L16.5 17l1.8-.3L19 15z" /></S>
);
export const IconSearch = (p) => (
  <S {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></S>
);
export const IconPalette = (p) => (
  <S {...p}><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.9 2-2 0-.6-.2-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H16a5 5 0 0 0 5-5c0-3.6-4-6.5-9-6.5z" /><circle cx="7.5" cy="12" r="1" /><circle cx="10" cy="8" r="1" /><circle cx="15" cy="8" r="1" /></S>
);
export const IconRuler = (p) => (
  <S {...p}><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 7v3M11 7v4M15 7v3M19 7v4" /></S>
);
export const IconGlasses = (p) => (
  <S {...p}><circle cx="6" cy="14" r="3.2" /><circle cx="18" cy="14" r="3.2" /><path d="M9.2 14h5.6" /><path d="M3 11l1.5-2M21 11l-1.5-2" /></S>
);
export const IconCheck = (p) => (
  <S {...p}><path d="M4 12l5 5L20 6" /></S>
);
export const IconArrowRight = (p) => (
  <S {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></S>
);
export const IconPrint = (p) => (
  <S {...p}><path d="M6 9V3h12v6" /><rect x="6" y="13" width="12" height="8" /><path d="M6 17H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" /></S>
);
export const IconShield = (p) => (
  <S {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></S>
);
export const IconArrowLeft = (p) => (
  <S {...p}><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></S>
);
export const IconCamera = (p) => (
  <S {...p}><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.5" /></S>
);
export const IconRefresh = (p) => (
  <S {...p}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v5h-5" /></S>
);
export const IconImage = (p) => (
  <S {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 17l4.5-4 4 3.5L16 13l4 4" /></S>
);
