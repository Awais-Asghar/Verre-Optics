// Verre Optics — presentational analysis widgets (theme-aware tokens).
import { useState, useEffect } from "react";

export function Dots() {
  const [d, setD] = useState("");
  useEffect(() => {
    const i = setInterval(() => setD((p) => (p.length >= 3 ? "" : p + ".")), 400);
    return () => clearInterval(i);
  }, []);
  return <span className="inline-block w-5 text-left">{d}</span>;
}

export function RatingBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  const color = value >= 8 ? "rgb(var(--accent))" : value >= 6 ? "rgb(var(--accent-strong))" : "#D2604F";
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between">
        <span className="text-[13px] text-fg">{label}</span>
        <span className="text-[13px] font-bold" style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface3">
        <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function ProbBar({ label, value, top = false }) {
  return (
    <div className="mb-2 flex items-center gap-2.5">
      <span className={`w-[70px] flex-shrink-0 text-[13px] font-semibold ${top ? "text-accent" : "text-fg"}`}>{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface3">
        <div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out" style={{ width: `${value}%`, opacity: top ? 1 : 0.55 }} />
      </div>
      <span className="w-10 text-right text-[13px] font-bold text-accent">{value}%</span>
    </div>
  );
}

export function PropBar({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
      <div className="mb-1.5 flex justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-sm font-bold text-fg">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface3">
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface2 px-4 py-3 text-center">
      <div className="mb-1 text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className="text-base font-bold text-fg">{value}</div>
    </div>
  );
}

export function CharRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-line py-2 last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="text-[13px] font-bold text-fg">{value}</span>
    </div>
  );
}

export function ScoreRing({ score }) {
  const r = 54, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  return (
    <div className="relative h-[130px] w-[130px]">
      <svg viewBox="0 0 120 120" className="h-[130px] w-[130px] -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(var(--surface-3))" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none" stroke="rgb(var(--accent))" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-4xl font-extrabold text-fg">{score}</span>
      </div>
    </div>
  );
}

export function SectionTitle({ children }) {
  return <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">{children}</h4>;
}
