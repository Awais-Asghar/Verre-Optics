// Verre Optics — the tabbed analysis view (Shape / Score / Eyes / Brows / Lips / Nose).
// Structure ported from original framefit.jsx renderTabContent; restyled + SVG icons.
import {
  RatingBar, ProbBar, PropBar, Stat, CharRow, ScoreRing, SectionTitle,
} from "../ui/AnalysisWidgets.jsx";
import { cap, titleCase } from "../../lib/recommend.js";
import { IconFace, IconStar, IconEye, IconBrow, IconLips, IconNose } from "../Icons.jsx";

export const TABS = [
  { id: "shape", Icon: IconFace, label: "Shape" },
  { id: "score", Icon: IconStar, label: "Score" },
  { id: "eyes", Icon: IconEye, label: "Eyes" },
  { id: "brows", Icon: IconBrow, label: "Brows" },
  { id: "lips", Icon: IconLips, label: "Lips" },
  { id: "nose", Icon: IconNose, label: "Nose" },
];

function FeatureHeader({ Icon, title, desc }) {
  return (
    <div className="mb-5 card p-5">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon size={24} />
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-fg">{title}</div>
          <div className="text-[13px] leading-snug text-muted">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function TwoCol({ children }) {
  return <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}
function Panel({ children }) {
  return <div className="card p-4">{children}</div>;
}

export default function ResultsTabs({ tab, R, shapeRec }) {
  if (tab === "shape") {
    const sp = R.shape_probabilities || {};
    const sc = R.shape_characteristics || {};
    const m = R.measurements || {};
    const p = R.proportions || {};
    return (
      <div>
        <FeatureHeader Icon={IconFace} title={<>Face Shape : <span className="text-accent">{cap(R.face_shape)}</span></>} desc={shapeRec.desc} />

        <TwoCol>
          <div>
            <SectionTitle>Characteristics</SectionTitle>
            <Panel>
              {Object.entries(sc).map(([k, v]) => <CharRow key={k} label={titleCase(k)} value={v} />)}
            </Panel>
          </div>
          <div>
            <SectionTitle>All Shape Probabilities</SectionTitle>
            <Panel>
              {Object.entries(sp).sort((a, b) => b[1] - a[1]).map(([k, v], i) => <ProbBar key={k} label={cap(k)} value={v} top={i === 0} />)}
            </Panel>
          </div>
        </TwoCol>

        <div className="mb-5">
          <SectionTitle>Style Recommendations</SectionTitle>
          <Panel>
            {(R.style_tips || []).map((tip, i, arr) => (
              <div key={i} className={`flex items-center gap-2.5 py-2 ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                <span className="text-[13px] text-fg">{tip}</span>
              </div>
            ))}
          </Panel>
        </div>

        <SectionTitle>Facial Measurements</SectionTitle>
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {Object.entries(m).map(([k, v]) => <Stat key={k} label={titleCase(k)} value={`${v}px`} />)}
        </div>

        <SectionTitle>Facial Proportions</SectionTitle>
        <div className="mb-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {Object.entries(p).map(([k, v]) => <PropBar key={k} label={titleCase(k)} value={v} />)}
        </div>
      </div>
    );
  }

  if (tab === "score") {
    const s = R.score || {};
    return (
      <div>
        <div className="mb-5 card p-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 font-serif text-base font-bold text-fg">
            <IconStar size={18} className="text-accent" /> Overall Facial Score
          </div>
          <div className="mb-5 flex justify-center"><ScoreRing score={s.overall || 0} /></div>
          <div className="flex justify-center gap-8">
            <div>
              <div className="text-xs text-muted">Overall Rating</div>
              <div className="font-serif text-2xl font-extrabold text-accent">{s.rating || 0}/10</div>
              <div className="relative mx-auto mt-1.5 h-1.5 w-[120px] rounded-full" style={{ background: "linear-gradient(to right,#D2604F,#C9A24B,#3F9E7C)" }}>
                <div className="absolute h-2 w-2 -translate-x-1/2 rounded-full border-2 border-fg bg-surface2" style={{ left: `${((s.rating || 0) / 10) * 100}%`, top: -1 }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted">Symmetry Score</div>
              <div className="font-serif text-2xl font-extrabold text-fg">{s.symmetry || 0}%</div>
            </div>
          </div>
        </div>

        <SectionTitle>Feature Ratings</SectionTitle>
        <Panel>
          <RatingBar label="Eyebrows" value={R.brows?.ratings?.overall || 0} />
          <RatingBar label="Eyes" value={R.eyes?.ratings?.overall || 0} />
          <RatingBar label="Lips" value={R.lips?.ratings?.overall || 0} />
          <RatingBar label="Nose" value={R.nose?.ratings?.overall || 0} />
        </Panel>
        <p className="mt-3 text-center text-[11px] italic text-muted">
          Scores are derived from facial geometry & symmetry — a guide, not a judgment.
        </p>
      </div>
    );
  }

  // Generic feature tabs (eyes / brows / lips / nose)
  const featureConfig = {
    eyes: { Icon: IconEye, title: "Eye Analysis", data: R.eyes, chars: ["shape", "size", "spacing", "symmetry"],
      desc: (e) => `${e.size} ${e.shape?.toLowerCase()}-shaped eyes with ${e.spacing?.toLowerCase()} spacing.` },
    brows: { Icon: IconBrow, title: "Eyebrow Analysis", data: R.brows, chars: ["arch", "shape", "spacing", "symmetry", "thickness"],
      desc: (b) => `${b.thickness} ${b.arch?.toLowerCase()} with ${b.spacing?.toLowerCase()}.` },
    lips: { Icon: IconLips, title: "Lip Analysis", data: R.lips, chars: ["cupid_bow", "shape", "symmetry", "thickness", "width"],
      desc: (l) => `${l.width} ${l.thickness?.toLowerCase()} lips with ${l.shape?.toLowerCase()} shape.` },
    nose: { Icon: IconNose, title: "Nose Analysis", data: R.nose, chars: ["bridge", "length", "proportion", "shape", "width"],
      desc: (n) => `${n.width} ${n.length?.toLowerCase()} nose with ${n.bridge}.` },
  };

  const cfg = featureConfig[tab];
  if (!cfg) return null;
  const d = cfg.data || {};
  return (
    <div>
      <FeatureHeader Icon={cfg.Icon} title={cfg.title} desc={cfg.desc(d)} />
      <TwoCol>
        <div>
          <SectionTitle>Characteristics</SectionTitle>
          <Panel>
            {cfg.chars.map((k) => <CharRow key={k} label={titleCase(k)} value={d[k]} />)}
          </Panel>
        </div>
        <div>
          <SectionTitle>Measurements</SectionTitle>
          <Panel>
            {Object.entries(d.measurements || {}).map(([k, v]) => <CharRow key={k} label={titleCase(k)} value={v} />)}
          </Panel>
        </div>
      </TwoCol>
      <SectionTitle>Ratings</SectionTitle>
      <Panel>
        {Object.entries(d.ratings || {}).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => (
          <RatingBar key={k} label={cap(k)} value={v} />
        ))}
      </Panel>
    </div>
  );
}
