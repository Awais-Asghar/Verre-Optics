// Verre Optics — recommendation mapping logic.
// Ported from the original framefit.jsx (SHAPE_MAP / TONE_MAP / getFrameSize).

export const SHAPE_MAP = {
  oval: {
    frames: ["Rectangular", "Square", "Aviator", "Wayfarer"],
    desc: "Your balanced proportions suit most frame styles. Angular shapes add definition.",
  },
  round: {
    frames: ["Rectangular", "Square", "Geometric", "Angular"],
    desc: "Angular frames add contrast and structure to soft, curved features.",
  },
  square: {
    frames: ["Round", "Oval", "Rimless", "Thin Metal"],
    desc: "Curved frames soften strong jawlines and angular features.",
  },
  heart: {
    frames: ["Bottom-heavy", "Round", "Light-colored", "Rimless"],
    desc: "Frames wider at the bottom balance a broader forehead and narrow chin.",
  },
  oblong: {
    frames: ["Oversized", "Decorative", "Deep Frames", "Wraparound"],
    desc: "Deeper frames with decorative details shorten and add width to the face.",
  },
  diamond: {
    frames: ["Oval", "Rimless", "Cat-eye", "Semi-rimless"],
    desc: "Frames that highlight the brow line complement your defined cheekbones.",
  },
};

export const TONE_MAP = {
  fair: {
    colors: ["Silver", "Pastel Blue", "Blush Pink", "Light Tortoise", "Lavender"],
    palette: ["#C0C0C0", "#A8C8E8", "#E8B4B8", "#C4956A", "#B8A9D4"],
  },
  light: {
    colors: ["Rose Gold", "Soft Brown", "Burgundy", "Mauve", "Pewter"],
    palette: ["#B76E79", "#8B6D5C", "#722F37", "#915F6D", "#96A1A8"],
  },
  medium: {
    colors: ["Gold", "Honey", "Olive Green", "Classic Tortoise", "Warm Red"],
    palette: ["#D4A94C", "#C8993F", "#6B7F3A", "#8B5E3C", "#B33A3A"],
  },
  olive: {
    colors: ["Warm Gold", "Rich Brown", "Warm Red", "Bronze", "Forest Green"],
    palette: ["#C5962D", "#654321", "#A52A2A", "#CD7F32", "#2D5A27"],
  },
  tan: {
    colors: ["Dark Tortoise", "Gold", "Warm Copper", "Deep Teal", "Amber"],
    palette: ["#5C3A1E", "#C5962D", "#B87333", "#1A6B5E", "#CF8A2E"],
  },
  dark: {
    colors: ["Bright Gold", "Silver", "White", "Jewel Red", "Royal Blue"],
    palette: ["#D4A94C", "#C0C0C0", "#F5F5F5", "#9B111E", "#002FA7"],
  },
};

export function getFrameSize(cat, w) {
  if (cat === "narrow") return { size: "Narrow", desc: `Small frames (~${w}mm)` };
  if (cat === "wide") return { size: "Wide", desc: `Large frames (~${w}mm)` };
  return { size: "Medium", desc: `Standard frames (~${w}mm)` };
}

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

export const titleCase = (k) =>
  k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
