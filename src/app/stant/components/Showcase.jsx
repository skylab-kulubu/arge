"use client";

import { useEffect, useState } from "react";
import { TONE } from "@/data/teams";
import ShowcaseBody from "./ShowcaseBody";

const dimRing = (ring, alpha = 0.14) =>
  ring.replace(/,\s*[\d.]+\s*\)\s*$/, `, ${alpha})`);

export default function Showcase({ team, dir }) {
  const tone = TONE.skylab;
  const [active, setActive] = useState(team);
  const [exiting, setExiting] = useState(null);

  useEffect(() => {
    if (team.id !== active.id) {
      setExiting(active);
      setActive(team);
    }
  }, [team, active]);

  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => setExiting(null), 380);
    return () => clearTimeout(t);
  }, [exiting]);

  return (
    <article
      className="relative h-full rounded-2xl border bg-neutral-950/45 backdrop-blur-md overflow-hidden flex flex-col"
      style={{
        borderColor: tone.ring,
        boxShadow: `0 0 60px -20px ${tone.glow}, inset 0 0 0 1px ${dimRing(tone.ring, 0.08)}`,
      }}
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(50% 60% at 88% 0%, ${tone.glow}, transparent 65%)` }}
      />
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px pointer-events-none z-10"
        style={{
          background: `linear-gradient(90deg, transparent, ${tone.icon} 50%, transparent)`,
          opacity: 0.6,
        }}
      />

      <div className="relative flex-1 min-h-0">
        {exiting && (
          <div key={`exit-${exiting.id}`} data-state="exit" data-dir={dir} className="showcase-content absolute inset-0">
            <ShowcaseBody team={exiting} />
          </div>
        )}
        <div key={`enter-${active.id}`} data-state="enter" data-dir={dir} className="showcase-content absolute inset-0">
          <ShowcaseBody team={active} />
        </div>
      </div>
    </article>
  );
}
