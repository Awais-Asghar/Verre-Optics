// FrameFit — client-side skin-tone estimation.
//
// Replaces the Vision-API skin read. Method: sample skin patches (cheeks +
// nose bridge) from the uploaded photo, reject shadow/glare/hair outliers,
// average the RGB, convert to CIE-Lab, and classify by the Individual
// Typology Angle (ITA) — the dermatology-standard measure of skin lightness.
// Olive is detected separately as an undertone (hue), not a lightness band.

// ── sRGB → linear ──
function toLinear(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// ── RGB → CIE-Lab (D65) ──
function rgbToLab(r, g, b) {
  const R = toLinear(r), G = toLinear(g), B = toLinear(b);
  // linear RGB → XYZ
  let x = R * 0.4124 + G * 0.3576 + B * 0.1805;
  let y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  let z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  // normalize by D65 white point
  x /= 0.95047; y /= 1.0; z /= 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fx = f(x), fy = f(y), fz = f(z);
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

// Sample a square patch of pixels around (cx, cy) and return valid RGB samples.
function samplePatch(data, w, h, cx, cy, radius) {
  const out = [];
  for (let y = cy - radius; y <= cy + radius; y += 2) {
    for (let x = cx - radius; x <= cx + radius; x += 2) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = (Math.round(y) * w + Math.round(x)) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a < 200) continue;
      const sum = r + g + b;
      if (sum < 90 || sum > 720) continue; // reject deep shadow / blown highlight
      // Skin heuristic: red dominant, not grey, not blue-cast.
      if (r < g || r < b - 8) continue;
      out.push([r, g, b]);
    }
  }
  return out;
}

/**
 * @param {HTMLImageElement|HTMLCanvasElement} img  natural-resolution source
 * @param {Array<{x:number,y:number}>} pts          68 landmarks in image px
 * @returns {{ tone:string, ita:number, lab:{L,a,b}, rgb:number[] }}
 */
export function analyzeSkinTone(img, pts) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;

  const lerp = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  // Sample the central, most reliably-lit skin: under the eyes and beside the
  // nose. Outer jaw points are avoided — they often land on hair or the
  // shadowed side of a face, which biases the tone too dark.
  const centers = [
    lerp(pts[41], pts[31], 0.5),  // under subject-right eye
    lerp(pts[46], pts[35], 0.5),  // under subject-left eye
    lerp(pts[31], pts[2], 0.35),  // right cheek (near nose)
    lerp(pts[35], pts[14], 0.35), // left cheek (near nose)
    pts[29],                      // upper nose bridge
    pts[28],                      // nose bridge
  ];

  // Radius scales with face size so patches stay on-skin.
  const faceW = Math.hypot(pts[16].x - pts[0].x, pts[16].y - pts[0].y);
  const radius = Math.max(4, Math.round(faceW * 0.025));

  let samples = [];
  for (const c of centers) {
    samples = samples.concat(samplePatch(pixels, w, h, c.x, c.y, radius));
  }

  if (samples.length < 12) {
    // Not enough clean skin pixels — safe neutral default.
    return { tone: "medium", ita: 30, lab: { L: 60, a: 12, b: 18 }, rgb: [200, 160, 130] };
  }

  // Shadow-robust selection: skin in shadow reads darker than the true tone,
  // so rank by luminance, drop the darkest 40% (shadow) and brightest 8%
  // (specular glare), then average the well-lit middle band.
  const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
  const ranked = [...samples].sort((a, b) => lum(a) - lum(b));
  const lo = Math.floor(ranked.length * 0.4);
  const hi = Math.ceil(ranked.length * 0.92);
  const band = ranked.slice(lo, hi);
  const avg = (i) => band.reduce((s, p) => s + p[i], 0) / band.length;
  const r = avg(0), g = avg(1), b = avg(2);

  const lab = rgbToLab(r, g, b);
  const ita = (Math.atan2(lab.L - 50, lab.b) * 180) / Math.PI;
  const hue = (Math.atan2(lab.b, lab.a) * 180) / Math.PI; // higher = yellower

  let tone;
  if (ita > 55) tone = "fair";
  else if (ita > 41) tone = "light";
  else if (ita > 28) tone = "medium";
  else if (ita > 12) tone = "tan";
  else tone = "dark";

  // Olive: mid lightness with a strong yellow-green undertone.
  if ((tone === "medium" || tone === "tan") && hue > 58 && lab.a < 16) {
    tone = "olive";
  }

  return { tone, ita: Math.round(ita), lab, rgb: [r, g, b] };
}
