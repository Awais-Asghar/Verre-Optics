import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { Dots, Stat } from "../components/ui/AnalysisWidgets.jsx";
import ResultsTabs, { TABS } from "../components/app/ResultsTabs.jsx";
import { SHAPE_MAP, TONE_MAP, getFrameSize, cap } from "../lib/recommend.js";
import { FRAME_ICONS, defIcon } from "../components/FrameIcons.jsx";
import { analyzeFace } from "../lib/faceAnalysis.js";
import Webcam from "../components/app/Webcam.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import {
  IconArrowLeft, IconUpload, IconSparkle, IconGlasses, IconPrint, IconArrowRight,
  IconCamera, IconImage, IconCheck,
} from "../components/Icons.jsx";

// Maps analysis step labels to a progress percentage for the progress bar.
const STEP_PCT = {
  "Loading face models": 18,
  "Detecting face & landmarks": 48,
  "Measuring geometry": 72,
  "Reading skin tone": 88,
  "Generating recommendations": 96,
};

// Dark top bar used across the app flow. Theme toggle is always present.
function AppBar({ left, right }) {
  return (
    <div className="bg-ink px-6 py-4">
      <div className="mx-auto flex max-w-[720px] items-center justify-between">
        <div className="flex items-center gap-3">{left}</div>
        <div className="flex items-center gap-3">
          {right}
          <ThemeToggle onDark />
        </div>
      </div>
    </div>
  );
}

function BackLink({ onClick, to, children }) {
  const cls = "flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent";
  return to ? (
    <Link to={to} className={cls}><IconArrowLeft size={16} />{children}</Link>
  ) : (
    <button onClick={onClick} className={cls}><IconArrowLeft size={16} />{children}</button>
  );
}

export default function TryApp() {
  const [screen, setScreen] = useState("method");
  const [imageUrl, setImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [tab, setTab] = useState("shape");
  const [subScreen, setSubScreen] = useState("analysis");
  const fileRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) { setError("Please upload a valid image."); return; }
    setError(null);
    setImageUrl(URL.createObjectURL(file));
    setScreen("preview");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const runAnalysis = async () => {
    setScreen("analyzing"); setError(null); setProgress(6);
    const onProgress = (s) => { setStep(s); setProgress((p) => Math.max(p, STEP_PCT[s] ?? p)); };
    try {
      // Load the image at natural resolution for landmark-accurate analysis.
      const img = await loadImage(imageUrl);
      const a = await analyzeFace(img, onProgress);
      if (!a.face_detected) {
        setError("No face detected. Use a clear, front-facing photo with your face centered.");
        setScreen("preview");
        return;
      }
      setStep("Generating recommendations"); setProgress(100);
      setResults({ ...a, frameSize: getFrameSize(a.face_width_category, a.face_width_mm) });
      setTab("shape");
      setSubScreen("analysis");
      // brief beat so the bar visibly completes
      await new Promise((r) => setTimeout(r, 350));
      setScreen("results");
    } catch (e) {
      console.error(e);
      setError("Analysis failed: " + e.message);
      setScreen("preview");
    }
  };

  const reset = () => {
    setScreen("method"); setImageUrl(null); setResults(null); setError(null); setSubScreen("analysis"); setProgress(0);
  };

  const hiddenInput = (
    <input ref={fileRef} type="file" accept="image/*" className="hidden"
      onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
  );

  // ── METHOD CHOOSER ──
  if (screen === "method") {
    const advUpload = ["Best quality control", "Use any front-facing photo", "JPG, PNG or WebP"];
    const advCamera = ["Take a photo right now", "On-screen framing guide", "Nothing is recorded"];
    return (
      <div className="min-h-screen bg-surface">
        <AppBar left={<Link to="/"><Logo light /></Link>} right={<Link to="/" className="text-sm font-semibold text-accent hover:text-accent-strong">Home</Link>} />
        <div className="mx-auto max-w-[880px] px-6">
          <div className="pt-12 text-center sm:pt-16">
            <p className="eyebrow mb-3">In-browser · Private</p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tightest text-fg sm:text-4xl">Choose your method</h1>
            <p className="mx-auto mb-10 max-w-md text-[15px] leading-relaxed text-muted">
              Pick how you'd like to provide your photo. Either way, everything runs on your device — your image never leaves your browser.
            </p>
          </div>

          <div className="grid gap-5 pb-10 md:grid-cols-2">
            {/* Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`group flex cursor-pointer flex-col rounded-2xl border p-7 transition-all ${
                dragOver ? "border-accent bg-accent/5" : "border-line bg-surface2 hover:shadow-lift"
              }`}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                <IconImage size={26} />
              </div>
              <h2 className="mb-1 font-serif text-xl font-bold text-fg">Upload Photo</h2>
              <p className="mb-4 text-[14px] text-muted">Choose an existing photo from your device.</p>
              <ul className="mb-6 space-y-2">
                {advUpload.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[13px] text-fg">
                    <IconCheck size={15} className="flex-shrink-0 text-accent" /> {a}
                  </li>
                ))}
              </ul>
              <div className="btn-accent mt-auto w-full"><IconUpload size={16} /> Choose File</div>
              <p className="mt-2 text-center text-[11px] text-muted">or drag &amp; drop here</p>
              {hiddenInput}
            </div>

            {/* Camera */}
            <div
              onClick={() => { setError(null); setScreen("camera"); }}
              className="group flex cursor-pointer flex-col rounded-2xl border border-line bg-surface2 p-7 transition-all hover:shadow-lift"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                <IconCamera size={26} />
              </div>
              <h2 className="mb-1 font-serif text-xl font-bold text-fg">Use Camera</h2>
              <p className="mb-4 text-[14px] text-muted">Take a new photo with your device camera.</p>
              <ul className="mb-6 space-y-2">
                {advCamera.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-[13px] text-fg">
                    <IconCheck size={15} className="flex-shrink-0 text-accent" /> {a}
                  </li>
                ))}
              </ul>
              <div className="btn-ink mt-auto w-full"><IconCamera size={16} /> Open Camera</div>
              <p className="mt-2 text-center text-[11px] text-muted">Front or rear camera</p>
            </div>
          </div>
          {error && <p className="pb-8 text-center text-sm text-danger">{error}</p>}
        </div>
      </div>
    );
  }

  // ── CAMERA ──
  if (screen === "camera") {
    return (
      <div className="min-h-screen bg-surface">
        <AppBar left={<Logo light size={17} />} />
        <Webcam onCapture={(file) => handleFile(file)} onCancel={() => setScreen("method")} />
      </div>
    );
  }

  // ── PREVIEW ──
  if (screen === "preview") {
    return (
      <div className="min-h-screen bg-surface">
        <AppBar left={<><BackLink onClick={reset}>Back</BackLink><Logo light size={17} /></>} />
        <div className="mx-auto max-w-[600px] px-6 py-6">
          <div className="mb-5 overflow-hidden rounded-2xl border border-line bg-surface3">
            <img src={imageUrl} alt="Your uploaded photo" className="block h-auto w-full" />
          </div>
          {error && <p className="mb-3 text-center text-sm text-danger">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => fileRef.current?.click()} className="btn-outline flex-1">Change Photo</button>
            <button onClick={runAnalysis} className="btn-accent flex-[2]"><IconSparkle size={16} /> Analyze My Face</button>
          </div>
          {hiddenInput}
          <p className="mt-4 text-center text-xs text-muted">For best results, use a front-facing photo with even lighting.</p>
        </div>
      </div>
    );
  }

  // ── ANALYZING (scan animation + progress bar) ──
  if (screen === "analyzing") {
    return (
      <div className="min-h-screen bg-surface">
        <AppBar left={<Logo light size={17} />} />
        <div className="mx-auto max-w-[440px] px-6 py-10 text-center">
          <div className="relative mx-auto mb-8 aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-line">
            {imageUrl && <img src={imageUrl} alt="Analyzing" className="h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-ink/25" />
            <div className="scan-line" />
            {/* corner brackets */}
            {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "left-3 bottom-3 border-l-2 border-b-2", "right-3 bottom-3 border-r-2 border-b-2"].map((c) => (
              <span key={c} className={`absolute h-6 w-6 rounded-[3px] border-accent ${c}`} />
            ))}
          </div>

          <h2 className="mb-2 font-serif text-2xl font-bold text-fg">Analyzing your face</h2>
          <p className="mb-5 text-sm text-muted">{step}<Dots /></p>

          <div className="mx-auto h-2 w-full max-w-[280px] overflow-hidden rounded-full bg-surface3">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs font-semibold text-accent">{progress}%</div>
          <p className="mt-4 text-xs text-muted">First run loads the model — this may take a few seconds.</p>
        </div>
      </div>
    );
  }

  // ── RESULTS + sub-screens ──
  if (screen === "results" && results) {
    const R = results;
    const shapeRec = SHAPE_MAP[R.face_shape] || SHAPE_MAP.oval;
    const toneRec = TONE_MAP[R.skin_tone] || TONE_MAP.medium;
    const fs = R.frameSize;

    // ---- RECOMMENDATIONS ----
    if (subScreen === "recommendations") {
      return (
        <div className="min-h-screen bg-surface">
          <AppBar
            left={<><BackLink onClick={() => setSubScreen("analysis")}>Analysis</BackLink><Logo light size={17} /></>}
            right={<button onClick={() => setSubScreen("report")} className="rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white hover:bg-accent-strong">View Report</button>}
          />
          <div className="mx-auto max-w-[700px] px-6 py-5">
            <div className="mb-5 overflow-hidden rounded-2xl border border-line bg-surface3">
              <img src={imageUrl} alt="Your face" className="block h-auto w-full" />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2.5">
              <Stat label="Face Shape" value={cap(R.face_shape)} />
              <Stat label="Skin Tone" value={cap(R.skin_tone)} />
              <Stat label="DBL (Bridge)" value={`~${R.dbl_mm}mm`} />
              <Stat label="Face Width" value={`${fs.size} (~${R.face_width_mm}mm)`} />
            </div>

            <h3 className="mb-1.5 font-serif text-xl font-bold text-fg">Recommended Frame Shapes</h3>
            <p className="mb-3 text-[13px] leading-snug text-muted">{shapeRec.desc}</p>
            <div className="mb-6 grid grid-cols-2 gap-2.5">
              {shapeRec.frames.map((f, i) => (
                <div key={i} className={`relative rounded-xl border bg-surface2 p-4 text-center ${i === 0 ? "border-accent" : "border-line"}`}>
                  {i === 0 && <span className="absolute right-2 top-2 rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white">TOP PICK</span>}
                  <div className="mb-2 flex justify-center text-fg">{FRAME_ICONS[f] || defIcon}</div>
                  <div className="text-[13px] font-bold text-fg">{f}</div>
                </div>
              ))}
            </div>

            <h3 className="mb-1.5 font-serif text-xl font-bold text-fg">Recommended Frame Colors</h3>
            <p className="mb-3 text-[13px] text-muted">Colors for your {R.skin_tone} skin tone.</p>
            <div className="mb-6 flex flex-wrap gap-2.5">
              {toneRec.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface2 px-4 py-3">
                  <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: toneRec.palette[i] }} />
                  <span className="text-[13px] font-semibold text-fg">{c}</span>
                </div>
              ))}
            </div>

            <h3 className="mb-3 font-serif text-xl font-bold text-fg">Sizing Specifications</h3>
            <div className="mb-6 card p-5">
              <div className="mb-4 flex justify-between border-b border-line pb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase text-muted">Frame Size</div>
                  <div className="font-serif text-lg font-bold text-fg">{fs.size}</div>
                  <div className="text-xs text-muted">{fs.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold uppercase text-muted">DBL Range</div>
                  <div className="font-serif text-lg font-bold text-fg">~{R.dbl_mm}mm</div>
                  <div className="text-xs text-muted">Bridge distance</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                Look for frames labeled "{fs.size}" with a bridge near {R.dbl_mm}mm — the middle number in size notation (e.g. 52-{R.dbl_mm}-140).
              </p>
            </div>

            <button onClick={() => setSubScreen("report")} className="btn-ink mb-8 w-full">
              Generate Full Report <IconArrowRight size={16} />
            </button>
          </div>
        </div>
      );
    }

    // ---- REPORT ---- (always light: it's a print document)
    if (subScreen === "report") {
      return (
        <div data-theme="light" className="min-h-screen bg-white">
          <AppBar
            left={<BackLink onClick={() => setSubScreen("recommendations")}>Back</BackLink>}
            right={<button onClick={() => window.print()} className="no-print flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white hover:bg-accent-strong"><IconPrint size={15} /> Print / Save PDF</button>}
          />
          <div className="mx-auto max-w-[700px] px-6 py-8">
            <div className="mb-7 border-b-2 border-ink pb-5 text-center">
              <div className="font-serif text-2xl font-extrabold text-fg">Frame<span className="text-accent">Fit</span> Report</div>
              <div className="text-[13px] text-muted">Personalized Eyewear Recommendation · {new Date().toLocaleDateString()}</div>
            </div>

            <div className="mx-auto mb-6 max-w-[250px] overflow-hidden rounded-xl border border-line">
              <img src={imageUrl} alt="Your face" className="block h-auto w-full" />
            </div>

            <div className="mb-7 grid grid-cols-4 gap-2.5">
              {[
                { l: "Face Shape", v: cap(R.face_shape) }, { l: "Skin Tone", v: cap(R.skin_tone) },
                { l: "DBL", v: `~${R.dbl_mm}mm` }, { l: "Frame Size", v: fs.size },
              ].map((x, i) => (
                <div key={i} className="rounded-xl bg-surface3 px-1.5 py-3.5 text-center">
                  <div className="mb-1 text-[10px] font-bold uppercase text-muted">{x.l}</div>
                  <div className="font-serif text-[15px] font-extrabold text-fg">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="mb-1.5 font-serif text-[15px] font-bold text-fg">Frame Shapes</h3>
              <p className="mb-2.5 text-[13px] text-muted">For your <strong>{R.face_shape}</strong> face: {shapeRec.desc}</p>
              <div className="flex flex-wrap gap-2">
                {shapeRec.frames.map((f, i) => (
                  <span key={i} className={`rounded-full px-4 py-2 text-[13px] font-semibold ${i === 0 ? "bg-ink text-fg-fg" : "bg-surface3 text-fg"}`}>
                    {f}{i === 0 ? " ★" : ""}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-1.5 font-serif text-[15px] font-bold text-fg">Frame Colors</h3>
              <div className="mt-2.5 flex flex-wrap gap-3">
                {toneRec.colors.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-[22px] w-[22px] rounded-full border-2 border-white shadow" style={{ background: toneRec.palette[i] }} />
                    <span className="text-[13px] font-semibold">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-serif text-[15px] font-bold text-fg">Shopping Tips</h3>
              <div className="space-y-2 text-[13px] leading-relaxed text-fg">
                <p><strong>Try before you buy:</strong> Always try frames on to check comfort and coverage.</p>
                <p><strong>Check the bridge:</strong> Your DBL of ~{R.dbl_mm}mm means the bridge should sit flush without pinching.</p>
                <p><strong>Frame width:</strong> Frames should be roughly ~{R.face_width_mm}mm wide.</p>
                <p><strong>Visit an optician:</strong> For precise measurements, have a professional measure your PD and bridge fit.</p>
              </div>
            </div>

            <div className="border-t border-line pt-5 text-center">
              <Logo size={15} />
              <div className="mt-1 text-[11px] text-muted">Client-side eyewear analysis · Measurements are estimates</div>
            </div>
          </div>
        </div>
      );
    }

    // ---- MAIN ANALYSIS (tabs) ----
    return (
      <div className="min-h-screen bg-surface">
        <AppBar
          left={<><BackLink onClick={reset}>New</BackLink><Logo light size={17} /></>}
          right={<button onClick={() => setSubScreen("recommendations")} className="flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-bold text-white hover:bg-accent-strong"><IconGlasses size={16} /> Recommendations</button>}
        />
        <div className="mx-auto max-w-[700px] px-6 pt-4">
          <div className="mb-4 overflow-hidden rounded-2xl border border-line bg-surface3">
            <img src={imageUrl} alt="Your face" className="block h-auto w-full" />
          </div>
        </div>
        <div className="mx-auto max-w-[700px] px-6">
          <div className="mb-1 flex gap-1 overflow-x-auto pb-4">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-semibold transition-all ${
                    active ? "bg-accent text-white" : "text-muted hover:bg-surface3"
                  }`}>
                  <t.Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
          <div className="pb-10">
            <ResultsTabs tab={tab} R={R} shapeRec={shapeRec} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Load an <img> from a URL, resolving once decoded.
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
