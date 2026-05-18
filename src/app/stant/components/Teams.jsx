"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { TEAMS } from "@/data/teams";
import TeamLogoTile from "./TeamLogoTile";
import Showcase from "./Showcase";

const AUTO_INTERVAL_MS = 8000;
const isRecruiting = (t) => Boolean(t.recruiting && t.applyUrl);

export default function Teams() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState("forward");
  const [auto, setAuto] = useState(false);
  const stripRef = useRef(null);

  const team = TEAMS[idx];
  const openCount = useMemo(() => TEAMS.filter(isRecruiting).length, []);

  const goTo = useCallback((next) => {
    setIdx((prev) => {
      if (next === prev) return prev;
      const total = TEAMS.length;
      const delta = (((next - prev) % total) + total) % total;
      setDir(delta <= total / 2 ? "forward" : "backward");
      return next;
    });
  }, []);

  const go = useCallback((delta) => {
    setIdx((prev) => {
      const total = TEAMS.length;
      setDir(delta >= 0 ? "forward" : "backward");
      return (prev + delta + total) % total;
    });
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10) - 1;
        if (n < TEAMS.length) goTo(n);
      } else if (e.key.toLowerCase() === "p") {
        setAuto((a) => !a);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goTo]);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => go(1), AUTO_INTERVAL_MS);
    return () => clearInterval(t);
  }, [auto, go]);

  useEffect(() => {
    const node = stripRef.current?.querySelector(`[data-tile="${idx}"]`);
    if (!node || !stripRef.current) return;
    const c = stripRef.current;
    const r = node.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    if (r.left < cr.left + 8 || r.right > cr.right - 8) {
      c.scrollTo({ left: node.offsetLeft - 12, behavior: "smooth" });
    }
  }, [idx]);

  return (
    <div className="relative flex-1 min-h-0 flex flex-col px-6 xl:px-10 pb-6 xl:pb-8 gap-4 xl:gap-5">
      {/* ─── LOGO STRIP + NAV ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div
          ref={stripRef}
          role="tablist"
          aria-label="Ekipler"
          className="flex-1 min-w-0 flex items-stretch gap-2 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {TEAMS.map((t, i) => (
            <div key={t.id} data-tile={i} className="contents">
              <TeamLogoTile team={t} index={i} isActive={i === idx} onClick={() => goTo(i)} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-3 ml-1 border-l border-white/8 self-stretch">
          <button
            onClick={() => setAuto((a) => !a)}
            title={auto ? "Otomatik döngüyü durdur (P)" : "Otomatik döngü (P)"}
            className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-colors ${
              auto
                ? "border-skylab-500/40 text-skylab-500 bg-skylab-500/10"
                : "border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5"
            }`}
          >
            {auto ? <Pause size={14} strokeWidth={2} /> : <Play size={14} strokeWidth={2} />}
          </button>
          <button
            onClick={() => go(-1)}
            title="Önceki (←)"
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={2} />
          </button>
          <button
            onClick={() => go(1)}
            title="Sonraki (→)"
            className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors"
          >
            <ArrowRight size={15} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ─── SHOWCASE ─────────────────────────────────────────────── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <Showcase team={team} dir={dir} />
      </div>

      {/* ─── STATUS BAR ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 font-mono text-[10.5px] text-neutral-600 tracking-[0.06em] uppercase">
        <span>SKY LAB · AR-GE STANT</span>
        <span className="h-3 w-px bg-neutral-800" />
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-70"
              style={{ background: "rgb(110,231,183)" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: "rgb(110,231,183)" }}
            />
          </span>
          <span>
            <span className="text-neutral-300">{openCount}</span> ekip alım yapıyor
          </span>
        </span>
        <span className="ml-auto hidden md:flex items-center gap-3 normal-case tracking-normal">
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9.5px]">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9.5px]">→</kbd>
          <span>ekipler arası geçiş</span>
          <span className="text-neutral-700">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9.5px]">1-9</kbd>
          <span>direkt seç</span>
          <span className="text-neutral-700">·</span>
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9.5px]">P</kbd>
          <span>oto. döngü</span>
          <span className="h-3 w-px bg-neutral-800 mx-1" />
          <span className="text-neutral-600">developed by</span>
          <a
            href="https://github.com/fatiihnaz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-skylab-500 transition-colors"
          >
            Fatih Naz
          </a>
        </span>
      </div>
    </div>
  );
}
