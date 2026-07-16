// FrameFit — client-side face analysis engine.
//
// Replaces analyzeWithVision(). Uses @vladmandic/face-api (maintained face-api.js
// fork) to detect a single face and 68 landmarks, then derives the SAME result
// shape the UI consumes — purely from geometry + the ITA skin-tone module.
//
// NOTE ON RATINGS: the 0–10 feature ratings and symmetry are deterministic
// geometry heuristics (proportion adherence + left/right mirror symmetry), not
// AI aesthetic judgments. The UI labels the panel as geometry-based.

import * as faceapi from "@vladmandic/face-api";
import { analyzeSkinTone } from "./skinTone.js";
import { SHAPE_MAP } from "./recommend.js";

const MODEL_URL = (import.meta.env.BASE_URL || "/") + "models";
let modelsReady = null;

export function loadModels(onProgress) {
  if (modelsReady) return modelsReady;
  modelsReady = (async () => {
    onProgress?.("Loading face models");
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  })();
  return modelsReady;
}

// ── geometry helpers ──
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const r1 = (v) => Math.round(v * 10) / 10;

// classify a scalar into buckets given ordered [threshold,label] pairs
function bucket(value, pairs, fallback) {
  for (const [t, label] of pairs) if (value <= t) return label;
  return fallback;
}

// Sharpness of the corner at b formed by a-b-c: 0 = smooth/straight, 1 = ~90° bend.
// Used to tell an angular (square) jaw from a soft (round) one.
function cornerSharpness(a, b, c) {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const cos = (v1.x * v2.x + v1.y * v2.y) / ((Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y)) || 1);
  const ang = (Math.acos(clamp(cos, -1, 1)) * 180) / Math.PI; // ~180 smooth, ~90 sharp
  return clamp((180 - ang) / 90, 0, 1);
}

/**
 * Run detection + geometry analysis on an image element.
 * @param {HTMLImageElement} img
 * @param {(step:string)=>void} onProgress
 * @returns result object identical in shape to the original Vision output
 */
export async function analyzeFace(img, onProgress) {
  await loadModels(onProgress);
  onProgress?.("Detecting face & landmarks");

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 512,
    scoreThreshold: 0.4,
  });
  const det = await faceapi
    .detectSingleFace(img, options)
    .withFaceLandmarks();

  if (!det) return { face_detected: false };

  onProgress?.("Measuring geometry");
  const pts = det.landmarks.positions; // 68 points in image px
  const box = det.detection.box;

  // ── Core spans ──
  const jawW = dist(pts[0], pts[16]);          // full face width (temple to temple-ish)
  const cheekW = dist(pts[1], pts[15]);        // cheekbone width
  const jawAngleW = dist(pts[4], pts[12]);     // lower jaw width
  const browR = mid(pts[19], pts[24]);
  const browLineW = dist(pts[17], pts[26]);    // forehead / brow width
  const chin = pts[8];
  const browMid = mid(pts[21], pts[22]);
  // face length: chin up through brow, extended for the (un-landmarked) forehead
  const faceLen = dist(chin, browMid) * 1.35;

  // ── DBL / bridge + mm scale (from average interpupillary distance ≈ 63mm) ──
  const rightPupil = mid(pts[36], pts[39]);
  const leftPupil = mid(pts[42], pts[45]);
  const ipdPx = dist(rightPupil, leftPupil);
  const mmPerPx = 63 / ipdPx;
  const bridgePx = dist(pts[39], pts[42]);     // inner eye corners
  const dbl_mm = clamp(Math.round(bridgePx * mmPerPx), 14, 24);
  const face_width_mm = Math.round(jawW * mmPerPx);
  const face_width_category = bucket(face_width_mm, [[130, "narrow"], [145, "medium"]], "wide");

  // ── Face-shape classification: feature vector vs prototypes, softmax probs ──
  // Features normalized against cheekbone width so absolute scale cancels out.
  const jawTaper = jawAngleW / cheekW;
  const cheekDominance = cheekW / Math.max(browLineW, jawAngleW);
  const feat = {
    lw: faceLen / cheekW,          // length / cheek width
    fw: browLineW / cheekW,        // forehead / cheek
    jw: jawAngleW / cheekW,        // jaw / cheek
    ang: (cornerSharpness(pts[2], pts[4], pts[6]) + cornerSharpness(pts[14], pts[12], pts[10])) / 2,
  };
  const PROTO = {
    oval:    { lw: 1.50, fw: 0.90, jw: 0.75, ang: 0.35 },
    round:   { lw: 1.15, fw: 0.90, jw: 0.86, ang: 0.18 },
    square:  { lw: 1.20, fw: 0.94, jw: 0.94, ang: 0.70 },
    oblong:  { lw: 1.72, fw: 0.93, jw: 0.90, ang: 0.45 },
    heart:   { lw: 1.42, fw: 1.03, jw: 0.72, ang: 0.30 },
    diamond: { lw: 1.46, fw: 0.80, jw: 0.74, ang: 0.55 },
  };
  const W = { lw: 1.3, fw: 2.6, jw: 2.3, ang: 0.9 }; // forehead/jaw ratios discriminate most
  const T = 0.045; // softmax temperature — smaller = more decisive
  const dist = {};
  const exps = {};
  let zsum = 0;
  for (const [k, p] of Object.entries(PROTO)) {
    const d =
      W.lw * (feat.lw - p.lw) ** 2 +
      W.fw * (feat.fw - p.fw) ** 2 +
      W.jw * (feat.jw - p.jw) ** 2 +
      W.ang * (feat.ang - p.ang) ** 2;
    dist[k] = d;
    exps[k] = Math.exp(-d / T);
    zsum += exps[k];
  }
  const shape_probabilities = {};
  for (const k of Object.keys(PROTO)) shape_probabilities[k] = Math.round((exps[k] / zsum) * 100);
  fixTo100(shape_probabilities);
  const face_shape = Object.entries(dist).sort((a, b) => a[1] - b[1])[0][0];

  // ── Shape characteristics ──
  const shape_characteristics = {
    apple_cheeks: bucket(cheekDominance, [[1.02, "Flat"], [1.12, "Moderate"]], "Prominent"),
    cheekbone: bucket(cheekW / jawW, [[0.9, "Low"], [0.97, "Medium"]], "High"),
    chin: chinShape(pts),
    temple: bucket(browLineW / cheekW, [[0.86, "Narrow"], [1.0, "Normal"]], "Wide"),
  };

  // ── Symmetry (mirror landmarks about the facial midline) ──
  const symmetry = computeSymmetry(pts);

  // ── Per-feature blocks ──
  const eyes = analyzeEyes(pts, mmPerPx, symmetry);
  const brows = analyzeBrows(pts, symmetry);
  const lips = analyzeLips(pts, symmetry);
  const nose = analyzeNose(pts, faceLen);

  // ── Overall score (blend of symmetry + feature ratings) ──
  const featureAvg =
    (eyes.ratings.overall + brows.ratings.overall + lips.ratings.overall + nose.ratings.overall) / 4;
  const overall = Math.round(clamp(symmetry * 0.5 + featureAvg * 5, 40, 98));

  // ── Measurements & proportions (image-proportional px + ratios) ──
  const measurements = {
    eye_span: Math.round(dist(pts[36], pts[45])),
    face_height: Math.round(faceLen),
    face_width: Math.round(jawW),
    forehead_width: Math.round(browLineW),
    interocular_distance: Math.round(bridgePx),
    jaw_width: Math.round(jawAngleW),
    mouth_width: Math.round(dist(pts[48], pts[54])),
    nose_length: Math.round(dist(pts[27], pts[33])),
    nose_width: Math.round(dist(pts[31], pts[35])),
  };
  const proportions = {
    eye_spacing_ratio: pct(bridgePx / dist(pts[36], pts[39])), // ideal ≈ 1 eye-width
    face_ratio: pct(faceLen / jawW / 1.5),
    forehead_ratio: pct(browLineW / jawW),
    jaw_width_ratio: pct(jawAngleW / jawW),
    mouth_width_ratio: pct(dist(pts[48], pts[54]) / ipdPx),
    nose_length_ratio: pct(dist(pts[27], pts[33]) / faceLen / 0.33),
    nose_width_ratio: pct(dist(pts[31], pts[35]) / dist(pts[36], pts[45])),
  };

  // ── Skin tone (ITA) ──
  onProgress?.("Reading skin tone");
  const { tone: skin_tone } = analyzeSkinTone(img, pts);

  // ── Style tips (templated from shape + tone) ──
  const rec = SHAPE_MAP[face_shape] || SHAPE_MAP.oval;
  const style_tips = [
    rec.desc,
    `Lead with ${rec.frames[0].toLowerCase()} frames — the strongest match for a ${face_shape} face.`,
    `Your ${skin_tone} skin tone pairs best with warm and complementary frame colors.`,
  ];

  return {
    face_detected: true,
    face_shape,
    skin_tone,
    dbl_mm,
    face_width_category,
    face_width_mm,
    confidence: det.detection.score > 0.7 ? "high" : det.detection.score > 0.5 ? "medium" : "low",
    shape_probabilities,
    shape_characteristics,
    style_tips,
    measurements,
    proportions,
    score: { overall, rating: r1(overall / 10), symmetry: Math.round(symmetry) },
    eyes,
    brows,
    lips,
    nose,
    // debug/preview extras (not required by UI)
    _box: { x: box.x, y: box.y, width: box.width, height: box.height },
  };
}

// ─────────────────────────────────────────────────────────────
// feature analyzers
// ─────────────────────────────────────────────────────────────
function pct(ratio) {
  return Math.round(clamp(ratio, 0, 1.5) * 100);
}

function fixTo100(obj) {
  const keys = Object.keys(obj);
  let sum = keys.reduce((s, k) => s + obj[k], 0);
  const top = keys.sort((a, b) => obj[b] - obj[a])[0];
  obj[top] += 100 - sum;
}

function chinShape(pts) {
  const width = dist(pts[6], pts[10]);        // chin base width
  const drop = dist(pts[8], mid(pts[6], pts[10]));
  const ratio = drop / width;
  if (ratio > 0.6) return "Pointed";
  if (ratio > 0.42) return "V-shaped";
  if (width / dist(pts[4], pts[12]) > 0.62) return "Square";
  return "Round";
}

function computeSymmetry(pts) {
  // midline = line through nose bridge (27) and chin (8)
  const top = pts[27], bot = pts[8];
  const axis = { x: bot.x - top.x, y: bot.y - top.y };
  const axisLen = Math.hypot(axis.x, axis.y) || 1;
  const nx = -axis.y / axisLen, ny = axis.x / axisLen; // unit normal
  const signedDist = (p) => (p.x - top.x) * nx + (p.y - top.y) * ny;
  // mirror pairs across the midline
  const pairs = [
    [0, 16], [1, 15], [2, 14], [3, 13], [4, 12], [5, 11], [6, 10],
    [17, 26], [18, 25], [19, 24], [20, 23], [21, 22],
    [36, 45], [39, 42], [31, 35], [48, 54], [50, 52],
  ];
  const faceW = dist(pts[0], pts[16]) || 1;
  let err = 0;
  for (const [l, r] of pairs) {
    err += Math.abs(Math.abs(signedDist(pts[l])) - Math.abs(signedDist(pts[r])));
  }
  const avgErr = err / pairs.length / faceW; // normalized asymmetry
  return clamp(100 - avgErr * 320, 60, 99);
}

function symLabel(sym) {
  return sym > 90 ? "Symmetric" : sym > 78 ? "Slightly Asymmetric" : "Asymmetric";
}

function ratingFrom(idealCloseness, symmetry) {
  // idealCloseness 0..1 (1 = perfect proportion); blend with symmetry
  return r1(clamp(idealCloseness * 6.5 + (symmetry / 100) * 3.5, 4.5, 9.8));
}

function analyzeEyes(pts, mmPerPx, symmetry) {
  const rW = dist(pts[36], pts[39]);
  const lW = dist(pts[42], pts[45]);
  const rH = dist(mid(pts[37], pts[38]), mid(pts[40], pts[41]));
  const lH = dist(mid(pts[43], pts[44]), mid(pts[46], pts[47]));
  const avgW = (rW + lW) / 2;
  const avgH = (rH + lH) / 2;
  const spacing = dist(pts[39], pts[42]); // inner corner gap
  const aspect = avgH / avgW;

  const spacingRatio = spacing / avgW; // ~1 = ideal
  const size = bucket(avgW / dist(pts[0], pts[16]), [[0.2, "Small"], [0.24, "Medium"]], "Large");
  const spacingLabel = bucket(spacingRatio, [[0.85, "Close"], [1.15, "Average"]], "Wide");
  const shape =
    aspect > 0.45 ? "Round" : aspect < 0.3 ? "Hooded" : "Almond";

  return {
    shape,
    size,
    spacing: spacingLabel,
    symmetry: symLabel(symmetry),
    measurements: {
      aspect_ratio: r1(aspect),
      avg_height: Math.round(avgH),
      avg_width: Math.round(avgW),
      distance: Math.round(spacing),
      left_width: Math.round(lW),
      right_width: Math.round(rW),
    },
    ratings: {
      overall: ratingFrom(1 - Math.abs(spacingRatio - 1), symmetry),
      shape: ratingFrom(1 - Math.abs(aspect - 0.38) * 2, symmetry),
      size: ratingFrom(1 - Math.abs(avgW / dist(pts[0], pts[16]) - 0.22) * 4, symmetry),
      spacing: ratingFrom(1 - Math.abs(spacingRatio - 1), symmetry),
      symmetry: r1(clamp(symmetry / 10, 4.5, 9.9)),
    },
  };
}

function analyzeBrows(pts, symmetry) {
  const rLen = dist(pts[17], pts[21]);
  const lLen = dist(pts[22], pts[26]);
  const spacing = dist(pts[21], pts[22]);
  const rArch = dist(pts[19], mid(pts[17], pts[21]));
  const height = dist(mid(pts[19], pts[24]), mid(pts[37], pts[44]));
  const avgLen = (rLen + lLen) / 2;
  const archRatio = rArch / rLen;

  const thickness = bucket(height / avgLen, [[0.28, "Thin"], [0.42, "Medium"]], "Thick");
  const arch = bucket(archRatio, [[0.12, "Straight"], [0.22, "Soft Arch"]], "High Arch");
  const spacingLabel = bucket(spacing / avgLen, [[0.35, "Close"], [0.6, "Good spacing"]], "Wide");

  return {
    arch,
    shape: thickness === "Thick" ? "Thick" : thickness === "Thin" ? "Thin" : "Proportional",
    spacing: spacingLabel,
    symmetry: symLabel(symmetry),
    thickness,
    measurements: {
      height: Math.round(height),
      left_length: Math.round(lLen),
      length: Math.round(avgLen),
      right_length: Math.round(rLen),
      spacing: Math.round(spacing),
    },
    ratings: {
      arch: ratingFrom(1 - Math.abs(archRatio - 0.18) * 3, symmetry),
      overall: ratingFrom(1 - Math.abs(spacing / avgLen - 0.45), symmetry),
      spacing: ratingFrom(1 - Math.abs(spacing / avgLen - 0.45), symmetry),
      thickness: ratingFrom(1 - Math.abs(height / avgLen - 0.35) * 2, symmetry),
    },
  };
}

function analyzeLips(pts, symmetry) {
  const width = dist(pts[48], pts[54]);
  const upper = dist(mid(pts[50], pts[52]), mid(pts[61], pts[63]));
  const lower = dist(mid(pts[65], pts[67]), mid(pts[56], pts[58]));
  const height = dist(pts[51], pts[57]);
  const ul = upper / Math.max(lower, 1);
  const faceW = dist(pts[0], pts[16]);

  const thickness = bucket(height / faceW, [[0.09, "Thin"], [0.14, "Medium"]], "Full");
  const widthLabel = bucket(width / faceW, [[0.34, "Narrow"], [0.42, "Medium"]], "Wide");
  const shape = ul > 0.85 ? "Top-heavy" : ul < 0.6 ? "Bottom-heavy" : "Balanced";

  return {
    cupid_bow: bucket(dist(pts[50], pts[52]) / width, [[0.18, "Subtle"], [0.28, "Defined"]], "Pronounced"),
    shape,
    symmetry: symLabel(symmetry),
    thickness,
    width: widthLabel,
    measurements: {
      height: Math.round(height),
      lower_height: Math.round(lower),
      upper_height: Math.round(upper),
      upper_lower_ratio: r1(ul),
      width: Math.round(width),
      width_ratio: r1(width / faceW),
    },
    ratings: {
      cupid_bow: ratingFrom(0.8, symmetry),
      overall: ratingFrom(1 - Math.abs(ul - 0.72), symmetry),
      proportion: ratingFrom(1 - Math.abs(ul - 0.72), symmetry),
      shape: ratingFrom(shape === "Balanced" ? 1 : 0.7, symmetry),
      thickness: ratingFrom(1 - Math.abs(height / faceW - 0.12) * 4, symmetry),
      width: ratingFrom(1 - Math.abs(width / faceW - 0.38) * 3, symmetry),
    },
  };
}

function analyzeNose(pts, faceLen) {
  const width = dist(pts[31], pts[35]);
  const length = dist(pts[27], pts[33]);
  const bridgeW = dist(pts[39], pts[42]);
  const eyeSpan = dist(pts[36], pts[45]);
  const lenRatio = length / faceLen;

  const widthLabel = bucket(width / eyeSpan, [[0.32, "Narrow"], [0.42, "Medium"]], "Wide");
  const lengthLabel = bucket(lenRatio, [[0.28, "Short"], [0.36, "Medium"]], "Long");
  const bridge = bucket(bridgeW / width, [[0.55, "Low"], [0.8, "Medium"]], "High bridge");

  return {
    bridge,
    length: lengthLabel,
    proportion: Math.abs(lenRatio - 0.33) < 0.06 ? "Proportional" : "Disproportioned",
    shape: "Straight",
    width: widthLabel,
    measurements: {
      bridge_height: Math.round(length * 0.6),
      bridge_width: Math.round(bridgeW),
      length: Math.round(length),
      width: Math.round(width),
      width_ratio: r1(width / eyeSpan),
    },
    ratings: {
      bridge: ratingFrom(0.8, 90),
      length: ratingFrom(1 - Math.abs(lenRatio - 0.33) * 4, 90),
      overall: ratingFrom(1 - Math.abs(width / eyeSpan - 0.37) * 3, 90),
      proportion: ratingFrom(1 - Math.abs(lenRatio - 0.33) * 4, 90),
      width: ratingFrom(1 - Math.abs(width / eyeSpan - 0.37) * 3, 90),
    },
  };
}
