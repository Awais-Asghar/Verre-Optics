// FrameFit — face-shape guide content + stylized outline icons.
// Educational reference (inspired by common face-shape guides). Each entry has a
// short description, key traits, and the frame styles that flatter it.

const outline = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

export const FACE_OUTLINES = {
  oval: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M50 8 C72 8 82 30 82 58 C82 92 68 122 50 122 C32 122 18 92 18 58 C18 30 28 8 50 8Z" />
    </svg>
  ),
  round: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M50 12 C78 12 86 38 86 65 C86 100 70 120 50 120 C30 120 14 100 14 65 C14 38 22 12 50 12Z" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M20 22 C20 14 26 12 34 12 H66 C74 12 80 14 80 22 V88 C80 108 68 118 50 118 C32 118 20 108 20 88Z" />
    </svg>
  ),
  oblong: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M24 14 C24 9 30 8 38 8 H62 C70 8 76 9 76 14 V96 C76 114 64 124 50 124 C36 124 24 114 24 96Z" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M18 26 C18 16 30 12 50 12 C70 12 82 16 82 26 C82 52 74 74 62 92 C56 104 52 120 50 122 C48 120 44 104 38 92 C26 74 18 52 18 26Z" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 100 130" {...outline} width="100%" height="100%">
      <path d="M50 8 C60 8 66 22 72 40 C80 62 86 66 86 70 C86 76 72 96 60 112 C55 118 52 122 50 122 C48 122 45 118 40 112 C28 96 14 76 14 70 C14 66 20 62 28 40 C34 22 40 8 50 8Z" />
    </svg>
  ),
};

export const FACE_SHAPES = [
  {
    key: "oval",
    name: "Oval",
    blurb:
      "Well-balanced and versatile: slightly longer than it is wide, with the cheekbones as the widest point and a jaw that softly narrows to the chin.",
    traits: ["Length slightly greater than width", "Cheekbones the widest point", "Softly tapered jawline"],
    best: ["Rectangular", "Square", "Aviator", "Wayfarer"],
  },
  {
    key: "round",
    name: "Round",
    blurb:
      "Similar width and length with soft, full curves and a gently rounded jaw. Angular frames add welcome contrast and structure.",
    traits: ["Width and length are similar", "Full cheeks, soft contours", "Rounded jawline"],
    best: ["Rectangular", "Square", "Geometric", "Angular"],
  },
  {
    key: "square",
    name: "Square",
    blurb:
      "Defined by structure — forehead, cheekbones and jaw are close in width with a strong, angular jaw. Curves soften the angles.",
    traits: ["Strong, defined jawline", "Similar width forehead to jaw", "Angular facial structure"],
    best: ["Round", "Oval", "Rimless", "Thin Metal"],
  },
  {
    key: "oblong",
    name: "Oblong",
    blurb:
      "Noticeably longer than wide, with fairly straight sides and even width from forehead to jaw. Styling adds visual width.",
    traits: ["Length noticeably greater than width", "Even width top to bottom", "Longer vertical proportions"],
    best: ["Oversized", "Decorative", "Deep Frames", "Wraparound"],
  },
  {
    key: "heart",
    name: "Heart",
    blurb:
      "Wider at the forehead and cheekbones, narrowing to a smaller chin — often with a widow's peak. Balance the upper and lower face.",
    traits: ["Wider forehead and cheekbones", "Narrow, more pointed chin", "Often a widow's peak"],
    best: ["Bottom-heavy", "Round", "Light-colored", "Rimless"],
  },
  {
    key: "diamond",
    name: "Diamond",
    blurb:
      "All about the cheekbones — the widest point — with a narrower forehead and jawline for an angular, sculpted look.",
    traits: ["Cheekbones the widest point", "Narrower forehead and jawline", "Angular, defined structure"],
    best: ["Oval", "Rimless", "Cat-eye", "Semi-rimless"],
  },
];
