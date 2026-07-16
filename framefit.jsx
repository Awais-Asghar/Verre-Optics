import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  navy: "#162032", navyLight: "#1E2D45", amber: "#D4952A", amberLight: "#F0C76E",
  cream: "#FAF8F4", surface: "#FFFFFF", text: "#1A1A2E", muted: "#6B7085",
  teal: "#2A9D8F", green: "#28a745", border: "#E2E0DC", cardBg: "#F5F3EF",
  red: "#dc3545", yellow: "#D4952A",
};

const SHAPE_MAP = {
  oval: { frames: ["Rectangular", "Square", "Aviator", "Wayfarer"], desc: "Your balanced proportions suit most frame styles. Angular shapes add definition." },
  round: { frames: ["Rectangular", "Square", "Geometric", "Angular"], desc: "Angular frames add contrast and structure to soft, curved features." },
  square: { frames: ["Round", "Oval", "Rimless", "Thin Metal"], desc: "Curved frames soften strong jawlines and angular features." },
  heart: { frames: ["Bottom-heavy", "Round", "Light-colored", "Rimless"], desc: "Frames wider at the bottom balance a broader forehead and narrow chin." },
  oblong: { frames: ["Oversized", "Decorative", "Deep Frames", "Wraparound"], desc: "Deeper frames with decorative details shorten and add width to the face." },
  diamond: { frames: ["Oval", "Rimless", "Cat-eye", "Semi-rimless"], desc: "Frames that highlight the brow line complement your defined cheekbones." },
};

const TONE_MAP = {
  fair: { colors: ["Silver", "Pastel Blue", "Blush Pink", "Light Tortoise", "Lavender"], palette: ["#C0C0C0", "#A8C8E8", "#E8B4B8", "#C4956A", "#B8A9D4"] },
  light: { colors: ["Rose Gold", "Soft Brown", "Burgundy", "Mauve", "Pewter"], palette: ["#B76E79", "#8B6D5C", "#722F37", "#915F6D", "#96A1A8"] },
  medium: { colors: ["Gold", "Honey", "Olive Green", "Classic Tortoise", "Warm Red"], palette: ["#D4A94C", "#C8993F", "#6B7F3A", "#8B5E3C", "#B33A3A"] },
  olive: { colors: ["Warm Gold", "Rich Brown", "Warm Red", "Bronze", "Forest Green"], palette: ["#C5962D", "#654321", "#A52A2A", "#CD7F32", "#2D5A27"] },
  tan: { colors: ["Dark Tortoise", "Gold", "Warm Copper", "Deep Teal", "Amber"], palette: ["#5C3A1E", "#C5962D", "#B87333", "#1A6B5E", "#CF8A2E"] },
  dark: { colors: ["Bright Gold", "Silver", "White", "Jewel Red", "Royal Blue"], palette: ["#D4A94C", "#C0C0C0", "#F5F5F5", "#9B111E", "#002FA7"] },
};

const FRAME_ICONS = {
  Rectangular: <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><rect x="2" y="4" width="30" height="28" rx="3"/><rect x="48" y="4" width="30" height="28" rx="3"/><line x1="32" y1="18" x2="48" y2="18"/></svg>,
  Square: <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><rect x="2" y="2" width="32" height="32" rx="2"/><rect x="46" y="2" width="32" height="32" rx="2"/><line x1="34" y1="18" x2="46" y2="18"/></svg>,
  Round: <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><circle cx="18" cy="18" r="15"/><circle cx="62" cy="18" r="15"/><line x1="33" y1="18" x2="47" y2="18"/></svg>,
  Aviator: <svg viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><path d="M2 10Q2 2 17 2h2Q34 2 34 14v12Q34 38 20 38h-6Q2 38 2 26Z"/><path d="M46 10Q46 2 61 2h2Q78 2 78 14v12Q78 38 64 38h-6Q46 38 46 26Z"/><line x1="34" y1="14" x2="46" y2="14"/></svg>,
  Oval: <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><ellipse cx="18" cy="18" rx="16" ry="14"/><ellipse cx="62" cy="18" rx="16" ry="14"/><line x1="34" y1="18" x2="46" y2="18"/></svg>,
  "Cat-eye": <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><path d="M2 20Q2 34 18 34h2Q34 34 34 20V14Q34 2 28 2H6Q2 6 2 14Z"/><path d="M46 20Q46 34 62 34h2Q78 34 78 20V14Q78 2 72 2H50Q46 6 46 14Z"/><line x1="34" y1="20" x2="46" y2="20"/></svg>,
};
const defIcon = <svg viewBox="0 0 80 36" fill="none" stroke="currentColor" strokeWidth="2" style={{width:56}}><rect x="2" y="4" width="30" height="28" rx="8"/><rect x="48" y="4" width="30" height="28" rx="8"/><line x1="32" y1="18" x2="48" y2="18"/></svg>;

function Dots() {
  const [d, setD] = useState("");
  useEffect(() => { const i = setInterval(() => setD(p => p.length >= 3 ? "" : p + "."), 400); return () => clearInterval(i); }, []);
  return <span style={{ display: "inline-block", width: 20 }}>{d}</span>;
}

// Rating bar component
function RatingBar({ label, value, max = 10, color }) {
  const pct = (value / max) * 100;
  const barColor = color || (value >= 8 ? C.green : C.amber);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: C.text }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: barColor }}>{value}/{max}</span>
      </div>
      <div style={{ height: 8, background: "#E8E6E2", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// Probability bar
function ProbBar({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, width: 70, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 10, background: "#E8E6E2", borderRadius: 5, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: C.amber, borderRadius: 5, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.amber, width: 40, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

// Proportion bar
function PropBar({ label, value }) {
  return (
    <div style={{ background: C.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "#E8E6E2", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(value, 100)}%`, background: C.amber, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// Stat card
function Stat({ label, value }) {
  return (
    <div style={{ background: C.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}`, textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{value}</div>
    </div>
  );
}

// Characteristic row
function CharRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{value}</span>
    </div>
  );
}

// Score ring
function ScoreRing({ score }) {
  const r = 54, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg viewBox="0 0 120 120" style={{ width: 130, height: 130, transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E8E6E2" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={C.amber} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 36, fontWeight: 800, color: C.navy }}>{score}</span>
      </div>
    </div>
  );
}

// Tab button
function TabBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
      background: active ? C.amber : "transparent", color: active ? "#fff" : C.muted,
      display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", transition: "all 0.2s",
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span> {label}
    </button>
  );
}

// ─── Vision API call ───
async function analyzeWithVision(base64) {
  const data64 = base64.includes(",") ? base64.split(",")[1] : base64;
  const mt = base64.includes("image/png") ? "image/png" : "image/jpeg";
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mt, data: data64 } },
          { type: "text", text: `You are an expert facial analysis AI. Analyze this face photo comprehensively.

Respond with ONLY a JSON object (no markdown, no backticks, no explanation):

{
  "face_detected": true/false,
  "face_shape": "oval"|"round"|"square"|"heart"|"oblong"|"diamond",
  "skin_tone": "fair"|"light"|"medium"|"olive"|"tan"|"dark",
  "dbl_mm": number (14-24, nose bridge width estimate),
  "face_width_category": "narrow"|"medium"|"wide",
  "face_width_mm": number (120-160),
  "confidence": "high"|"medium"|"low",
  "shape_probabilities": {"oval":0,"round":0,"square":0,"heart":0,"oblong":0,"diamond":0},
  "shape_characteristics": {"apple_cheeks":"Prominent"|"Moderate"|"Flat","cheekbone":"High"|"Medium"|"Low","chin":"Pointed"|"Round"|"Square"|"V-shaped","temple":"Narrow"|"Normal"|"Wide"},
  "style_tips": ["tip1","tip2","tip3"],
  "measurements": {"eye_span":0,"face_height":0,"face_width":0,"forehead_width":0,"interocular_distance":0,"jaw_width":0,"mouth_width":0,"nose_length":0,"nose_width":0},
  "proportions": {"eye_spacing_ratio":0,"face_ratio":0,"forehead_ratio":0,"jaw_width_ratio":0,"mouth_width_ratio":0,"nose_length_ratio":0,"nose_width_ratio":0},
  "score": {"overall":0,"rating":0,"symmetry":0},
  "eyes": {"shape":"Almond"|"Round"|"Hooded"|"Monolid"|"Upturned"|"Downturned","size":"Small"|"Medium"|"Large","spacing":"Close"|"Average"|"Wide","symmetry":"Symmetric"|"Slightly Asymmetric"|"Asymmetric","measurements":{"aspect_ratio":0,"avg_height":0,"avg_width":0,"distance":0,"left_width":0,"right_width":0},"ratings":{"overall":0,"shape":0,"size":0,"spacing":0,"symmetry":0}},
  "brows": {"arch":"Straight"|"Soft Arch"|"High Arch"|"S-shaped","shape":"Proportional"|"Thick"|"Thin","spacing":"Close"|"Good spacing"|"Wide","symmetry":"Symmetric"|"Slightly Asymmetric"|"Asymmetric","thickness":"Very Thin"|"Thin"|"Medium"|"Thick"|"Very Thick","measurements":{"height":0,"left_length":0,"length":0,"right_length":0,"spacing":0},"ratings":{"arch":0,"overall":0,"spacing":0,"thickness":0}},
  "lips": {"cupid_bow":"Subtle"|"Defined"|"Pronounced","shape":"Balanced"|"Top-heavy"|"Bottom-heavy","symmetry":"Symmetric"|"Slightly Asymmetric"|"Asymmetric","thickness":"Thin"|"Medium"|"Full"|"Very Full","width":"Narrow"|"Medium"|"Wide","measurements":{"height":0,"lower_height":0,"upper_height":0,"upper_lower_ratio":0,"width":0,"width_ratio":0},"ratings":{"cupid_bow":0,"overall":0,"proportion":0,"shape":0,"thickness":0,"width":0}},
  "nose": {"bridge":"Low"|"Medium"|"High bridge","length":"Short"|"Medium"|"Long","proportion":"Proportional"|"Disproportioned","shape":"Straight"|"Curved"|"Bumpy"|"Upturned","width":"Narrow"|"Medium"|"Wide","measurements":{"bridge_height":0,"bridge_width":0,"length":0,"width":0,"width_ratio":0},"ratings":{"bridge":0,"length":0,"overall":0,"proportion":0,"width":0}}
}

Rules:
- shape_probabilities must sum to 100. Assign realistic probabilities.
- All measurements in approximate pixel-proportional values (estimate realistically).
- All ratings are 0-10 scale with one decimal.
- score.overall is 0-100, rating is 0-10, symmetry is 0-100%.
- Be accurate and consistent with the face in the image.
- Respond with ONLY the JSON.` },
        ],
      }],
    }),
  });
  const data = await resp.json();
  const text = (data.content?.[0]?.text || "").trim().replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(text);
}

function getFrameSize(cat, w) {
  if (cat === "narrow") return { size: "Narrow", desc: `Small frames (~${w}mm)` };
  if (cat === "wide") return { size: "Wide", desc: `Large frames (~${w}mm)` };
  return { size: "Medium", desc: `Standard frames (~${w}mm)` };
}

export default function FrameFit() {
  const [screen, setScreen] = useState("landing");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState("shape");
  const [subScreen, setSubScreen] = useState("analysis"); // analysis | recommendations | report
  const fileRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) { setError("Please upload a valid image."); return; }
    setError(null);
    setImageUrl(URL.createObjectURL(file));
    const r = new FileReader();
    r.onload = e => setImageBase64(e.target.result);
    r.readAsDataURL(file);
    setScreen("preview");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const runAnalysis = async () => {
    setScreen("analyzing"); setError(null);
    try {
      setStep("Sending photo to AI");
      await new Promise(r => setTimeout(r, 200));
      setStep("Analyzing face shape & features");
      const a = await analyzeWithVision(imageBase64);
      if (!a.face_detected) { setError("No face detected. Use a clear, front-facing photo."); setScreen("preview"); return; }
      setStep("Generating recommendations");
      await new Promise(r => setTimeout(r, 300));
      setResults({ ...a, frameSize: getFrameSize(a.face_width_category, a.face_width_mm) });
      setTab("shape");
      setSubScreen("analysis");
      setScreen("results");
    } catch (e) {
      console.error(e);
      setError("Analysis failed: " + e.message);
      setScreen("preview");
    }
  };

  const reset = () => { setScreen("landing"); setImageUrl(null); setImageBase64(null); setResults(null); setError(null); };
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : "";

  // ─── LANDING ───
  if (screen === "landing") {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "20px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 10 }}>
            <svg viewBox="0 0 32 32" fill="none" style={{ width: 28 }}><circle cx="10" cy="16" r="8" stroke={C.amber} strokeWidth="2.5"/><circle cx="22" cy="16" r="8" stroke={C.amber} strokeWidth="2.5"/><path d="M18 14Q20 12 22 14" stroke={C.amber} strokeWidth="2" fill="none"/></svg>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Frame<span style={{ color: C.amberLight }}>Fit</span></span>
          </div>
        </div>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.navy, margin: "0 0 12px", letterSpacing: "-0.03em" }}>Find your perfect frames</h1>
            <p style={{ fontSize: 16, color: C.muted, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.5 }}>
              Upload a face photo. Our AI analyzes your features and recommends frames shaped, sized, and colored for you.
            </p>
            <div onClick={() => fileRef.current?.click()} onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              style={{ border: `2px dashed ${dragOver ? C.amber : C.border}`, borderRadius: 16, padding: "48px 24px", cursor: "pointer", background: dragOver ? `${C.amber}0A` : C.surface, transition: "all 0.2s", marginBottom: 24 }}>
              <svg viewBox="0 0 48 48" fill="none" style={{ width: 48, margin: "0 auto 16px", display: "block" }}><rect x="4" y="8" width="40" height="32" rx="4" stroke={C.muted} strokeWidth="2"/><circle cx="16" cy="20" r="4" stroke={C.amber} strokeWidth="2"/><path d="M4 32L16 22 26 30 34 24 44 32" stroke={C.teal} strokeWidth="2" fill="none"/></svg>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Tap to upload your photo</p>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>or drag and drop here</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
            </div>
            {error && <p style={{ color: C.red, fontSize: 14 }}>{error}</p>}
            <p style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>✓ AI-powered analysis ready — no setup needed</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, paddingBottom: 48 }}>
            {[
              { icon: "🔍", title: "Face Shape", desc: "Shape, probabilities, characteristics & proportions" },
              { icon: "🎨", title: "Feature Analysis", desc: "Eyes, brows, lips, nose — detailed ratings" },
              { icon: "📏", title: "Frame Matching", desc: "DBL, frame size, shape & color recommendations" },
            ].map((f, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 12, padding: "20px 14px", textAlign: "center", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── PREVIEW ───
  if (screen === "preview") {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={reset} style={{ background: "none", border: "none", color: C.amberLight, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back</button>
          <span style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Frame<span style={{ color: C.amberLight }}>Fit</span></span>
        </div>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 20, background: C.cardBg }}>
            <img src={imageUrl} alt="Photo" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
          {error && <p style={{ color: C.red, fontSize: 14, marginBottom: 12, textAlign: "center" }}>{error}</p>}
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: 14, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer" }}>Change Photo</button>
            <button onClick={runAnalysis} style={{ flex: 2, padding: 14, borderRadius: 10, border: "none", background: C.amber, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✨ Analyze My Face</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 16 }}>For best results, use a front-facing photo with even lighting</p>
        </div>
      </div>
    );
  }

  // ─── ANALYZING ───
  if (screen === "analyzing") {
    return (
      <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Inter',system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 24px", border: `4px solid ${C.border}`, borderTopColor: C.amber, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: "0 0 8px" }}>Analyzing your face</h2>
          <p style={{ fontSize: 14, color: C.muted, margin: "0 0 4px" }}>{step}<Dots /></p>
          <p style={{ fontSize: 12, color: C.muted }}>This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ───
  if (screen === "results" && results) {
    const R = results;
    const shapeRec = SHAPE_MAP[R.face_shape] || SHAPE_MAP.oval;
    const toneRec = TONE_MAP[R.skin_tone] || TONE_MAP.medium;
    const fs = R.frameSize;

    const TABS = [
      { id: "shape", icon: "👤", label: "Shape" },
      { id: "score", icon: "⭐", label: "Score" },
      { id: "eyes", icon: "👁", label: "Eyes" },
      { id: "brows", icon: "🤨", label: "Brows" },
      { id: "lips", icon: "👄", label: "Lips" },
      { id: "nose", icon: "👃", label: "Nose" },
    ];

    const renderTabContent = () => {
      // ── SHAPE TAB ──
      if (tab === "shape") {
        const sp = R.shape_probabilities || {};
        const sc = R.shape_characteristics || {};
        const m = R.measurements || {};
        const p = R.proportions || {};
        return (
          <div>
            {/* Shape result */}
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Face Shape : <span style={{ color: C.amber }}>{cap(R.face_shape)}</span></div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.4, marginTop: 2 }}>{shapeRec.desc}</div>
                </div>
              </div>
            </div>

            {/* Characteristics & Probabilities side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Characteristics</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(sc).map(([k, v]) => <CharRow key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>All Shape Probabilities</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(sp).sort((a, b) => b[1] - a[1]).map(([k, v]) => <ProbBar key={k} label={cap(k)} value={v} />)}
                </div>
              </div>
            </div>

            {/* Style Recommendations */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Style Recommendations</h4>
              <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                {(R.style_tips || []).map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < R.style_tips.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.text }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facial Measurements */}
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Facial Measurements</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              {Object.entries(m).map(([k, v]) => <Stat key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={`${v}px`} />)}
            </div>

            {/* Facial Proportions */}
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Facial Proportions</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
              {Object.entries(p).map(([k, v]) => <PropBar key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
            </div>
          </div>
        );
      }

      // ── SCORE TAB ──
      if (tab === "score") {
        const s = R.score || {};
        const fr = R.eyes?.ratings || {};
        return (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>✨ Overall Facial Score</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <ScoreRing score={s.overall || 0} />
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Overall Rating</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.amber }}>{s.rating || 0}/10</div>
                  <div style={{ height: 6, width: 120, background: "linear-gradient(to right, #dc3545, #ffc107, #28a745)", borderRadius: 3, margin: "6px auto 0" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", border: "2px solid #333", marginTop: -1, marginLeft: `${((s.rating || 0) / 10) * 100}%`, transform: "translateX(-50%)" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Symmetry Score</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{s.symmetry || 0}%</div>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Feature Ratings</h4>
            <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              <RatingBar label="Eyebrows" value={R.brows?.ratings?.overall || 0} />
              <RatingBar label="Eyes" value={R.eyes?.ratings?.overall || 0} />
              <RatingBar label="Lips" value={R.lips?.ratings?.overall || 0} />
              <RatingBar label="Nose" value={R.nose?.ratings?.overall || 0} />
            </div>
          </div>
        );
      }

      // ── EYES TAB ──
      if (tab === "eyes") {
        const e = R.eyes || {};
        return (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👁</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Eye Analysis</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Eyes: {e.size} {e.shape?.toLowerCase()}-shaped eyes with {e.spacing?.toLowerCase()} spacing.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Characteristics</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  <CharRow label="Shape" value={e.shape} /><CharRow label="Size" value={e.size} /><CharRow label="Spacing" value={e.spacing} /><CharRow label="Symmetry" value={e.symmetry} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Measurements</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(e.measurements || {}).map(([k, v]) => <CharRow key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
                </div>
              </div>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Ratings</h4>
            <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              {Object.entries(e.ratings || {}).sort((a,b) => a[0].localeCompare(b[0])).map(([k, v]) => <RatingBar key={k} label={cap(k)} value={v} />)}
            </div>
          </div>
        );
      }

      // ── BROWS TAB ──
      if (tab === "brows") {
        const b = R.brows || {};
        return (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🤨</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Eyebrow Analysis</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Eyebrows: {b.thickness} {b.arch?.toLowerCase()} with {b.spacing?.toLowerCase()}.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Characteristics</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  <CharRow label="Arch" value={b.arch} /><CharRow label="Shape" value={b.shape} /><CharRow label="Spacing" value={b.spacing} /><CharRow label="Symmetry" value={b.symmetry} /><CharRow label="Thickness" value={b.thickness} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Measurements</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(b.measurements || {}).map(([k, v]) => <CharRow key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
                </div>
              </div>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Ratings</h4>
            <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              {Object.entries(b.ratings || {}).sort((a,b) => a[0].localeCompare(b[0])).map(([k, v]) => <RatingBar key={k} label={cap(k)} value={v} />)}
            </div>
          </div>
        );
      }

      // ── LIPS TAB ──
      if (tab === "lips") {
        const l = R.lips || {};
        return (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👄</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Lip Analysis</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Lips: {l.width} {l.thickness?.toLowerCase()} lips with {l.shape?.toLowerCase()} shape.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Characteristics</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  <CharRow label="Cupid Bow" value={l.cupid_bow} /><CharRow label="Shape" value={l.shape} /><CharRow label="Symmetry" value={l.symmetry} /><CharRow label="Thickness" value={l.thickness} /><CharRow label="Width" value={l.width} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Measurements</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(l.measurements || {}).map(([k, v]) => <CharRow key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
                </div>
              </div>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Ratings</h4>
            <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              {Object.entries(l.ratings || {}).sort((a,b) => a[0].localeCompare(b[0])).map(([k, v]) => <RatingBar key={k} label={cap(k)} value={v} />)}
            </div>
          </div>
        );
      }

      // ── NOSE TAB ──
      if (tab === "nose") {
        const n = R.nose || {};
        return (
          <div>
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.cardBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👃</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Nose Analysis</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Nose: {n.width} {n.length?.toLowerCase()} nose with {n.bridge}.</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Characteristics</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  <CharRow label="Bridge" value={n.bridge} /><CharRow label="Length" value={n.length} /><CharRow label="Proportion" value={n.proportion} /><CharRow label="Shape" value={n.shape} /><CharRow label="Width" value={n.width} />
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Measurements</h4>
                <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  {Object.entries(n.measurements || {}).map(([k, v]) => <CharRow key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} value={v} />)}
                </div>
              </div>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: C.amber, margin: "0 0 12px" }}>Ratings</h4>
            <div style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
              {Object.entries(n.ratings || {}).sort((a,b) => a[0].localeCompare(b[0])).map(([k, v]) => <RatingBar key={k} label={cap(k)} value={v} />)}
            </div>
          </div>
        );
      }
      return null;
    };

    // ── Recommendations sub-screen ──
    if (subScreen === "recommendations") {
      return (
        <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Inter',system-ui,sans-serif" }}>
          <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setSubScreen("analysis")} style={{ background: "none", border: "none", color: C.amberLight, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Analysis</button>
              <span style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Frame<span style={{ color: C.amberLight }}>Fit</span></span>
            </div>
            <button onClick={() => setSubScreen("report")} style={{ background: C.amber, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>View Report</button>
          </div>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 24px" }}>
            {/* Photo */}
            <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 20, background: C.cardBg }}>
              <img src={imageUrl} alt="Face" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

            {/* Analysis summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
              <Stat label="◇ FACE SHAPE" value={cap(R.face_shape)} />
              <Stat label="◉ SKIN TONE" value={cap(R.skin_tone)} />
              <Stat label="↔ DBL (BRIDGE)" value={`~${R.dbl_mm}mm`} />
              <Stat label="⬌ FACE WIDTH" value={`${fs.size} (~${R.face_width_mm}mm)`} />
            </div>

            {/* Frame Shapes */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>Recommended Frame Shapes</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 12px", lineHeight: 1.4 }}>{shapeRec.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 24 }}>
              {shapeRec.frames.map((f, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 10, padding: 16, border: `1px solid ${i === 0 ? C.amber : C.border}`, textAlign: "center", position: "relative" }}>
                  {i === 0 && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 700, background: C.amber, color: "#fff", padding: "2px 6px", borderRadius: 4 }}>TOP PICK</span>}
                  <div style={{ color: C.navy, marginBottom: 8 }}>{FRAME_ICONS[f] || defIcon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{f}</div>
                </div>
              ))}
            </div>

            {/* Frame Colors */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>Recommended Frame Colors</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 12px" }}>Colors for your {R.skin_tone} skin tone.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              {toneRec.colors.map((c, i) => (
                <div key={i} style={{ background: C.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: toneRec.palette[i], border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c}</span>
                </div>
              ))}
            </div>

            {/* Sizing */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: "0 0 12px" }}>Sizing Specifications</h3>
            <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>Frame Size</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>{fs.size}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{fs.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>DBL Range</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>~{R.dbl_mm}mm</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Bridge distance</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                Look for frames labeled "{fs.size}" with bridge width near {R.dbl_mm}mm — the middle number in size notation (e.g., 52-{R.dbl_mm}-140).
              </p>
            </div>

            <button onClick={() => setSubScreen("report")} style={{ width: "100%", padding: 16, borderRadius: 12, border: "none", background: C.navy, fontSize: 15, fontWeight: 700, color: "#fff", cursor: "pointer", marginBottom: 32 }}>
              Generate Full Report
            </button>
          </div>
        </div>
      );
    }

    // ── Report sub-screen ──
    if (subScreen === "report") {
      return (
        <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Inter',system-ui,sans-serif" }}>
          <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => setSubScreen("recommendations")} style={{ background: "none", border: "none", color: C.amberLight, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back</button>
            <button onClick={() => window.print()} style={{ background: C.amber, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Print / Save PDF</button>
          </div>
          <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 28, paddingBottom: 20, borderBottom: `2px solid ${C.navy}` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy }}>Frame<span style={{ color: C.amber }}>Fit</span> Report</div>
              <div style={{ fontSize: 13, color: C.muted }}>Personalized Eyewear Recommendation • {new Date().toLocaleDateString()}</div>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, maxWidth: 250, margin: "0 auto 24px" }}>
              <img src={imageUrl} alt="Face" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
              {[{ l: "Face Shape", v: cap(R.face_shape) }, { l: "Skin Tone", v: cap(R.skin_tone) }, { l: "DBL", v: `~${R.dbl_mm}mm` }, { l: "Frame Size", v: fs.size }].map((x, i) => (
                <div key={i} style={{ textAlign: "center", padding: "14px 6px", background: C.cardBg, borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{x.l}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>Frame Shapes</h3>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 10px" }}>For your <strong>{R.face_shape}</strong> face: {shapeRec.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {shapeRec.frames.map((f, i) => <span key={i} style={{ background: i === 0 ? C.navy : C.cardBg, color: i === 0 ? "#fff" : C.text, padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{f}{i === 0 ? " ★" : ""}</span>)}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 6px" }}>Frame Colors</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
                {toneRec.colors.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: toneRec.palette[i], border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: "0 0 12px" }}>Shopping Tips</h3>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7 }}>
                <p style={{ margin: "0 0 8px" }}><strong>Try before you buy:</strong> Always try frames on to check comfort and coverage.</p>
                <p style={{ margin: "0 0 8px" }}><strong>Check the bridge:</strong> Your DBL of ~{R.dbl_mm}mm means the bridge should sit flush without pinching.</p>
                <p style={{ margin: "0 0 8px" }}><strong>Frame width:</strong> Frames should be roughly ~{R.face_width_mm}mm wide.</p>
                <p style={{ margin: 0 }}><strong>Visit an optician:</strong> For precise measurements, have a professional measure your PD and bridge fit.</p>
              </div>
            </div>
            <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Frame<span style={{ color: C.amber }}>Fit</span></div>
              <div style={{ fontSize: 11, color: C.muted }}>AI-Powered Eyewear Recommendations</div>
            </div>
          </div>
        </div>
      );
    }

    // ── Main analysis screen ──
    return (
      <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Inter',system-ui,sans-serif" }}>
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.navyLight})`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={reset} style={{ background: "none", border: "none", color: C.amberLight, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← New</button>
            <span style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Frame<span style={{ color: C.amberLight }}>Fit</span></span>
          </div>
          <button onClick={() => setSubScreen("recommendations")} style={{ background: C.amber, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            🕶 Recommendations
          </button>
        </div>

        {/* Photo */}
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 24px 0" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 16, background: C.cardBg }}>
            <img src={imageUrl} alt="Face" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 16, marginBottom: 4 }}>
            {TABS.map(t => <TabBtn key={t.id} icon={t.icon} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />)}
          </div>

          {/* Tab content */}
          <div style={{ paddingBottom: 32 }}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
