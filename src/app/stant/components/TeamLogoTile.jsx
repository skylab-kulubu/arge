"use client";

import { TONE } from "@/data/teams";

const pad = (n) => String(n).padStart(2, "0");
const isRecruiting = (t) => Boolean(t.recruiting && t.applyUrl);

export default function TeamLogoTile({ team, index, isActive, onClick }) {
  const tone = TONE.skylab;
  const Icon = team.icon;
  const recruiting = isRecruiting(team);

  return (
    <button
      onClick={onClick}
      aria-selected={isActive}
      role="tab"
      className={`group relative flex items-center gap-2.5 rounded-xl border h-11 pl-1.5 pr-3 text-left transition-all overflow-hidden shrink-0 ${
        isActive
          ? ""
          : "border-white/8 bg-white/2 hover:border-white/15 hover:bg-white/4"
      }`}
      style={
        isActive
          ? {
              borderColor: tone.ring,
              background: tone.soft,
              boxShadow: `inset 0 0 0 1px ${tone.ring}, 0 0 24px -8px ${tone.glow}`,
            }
          : undefined
      }
    >
      {isActive && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-4 right-0 h-12 w-16 rounded-full blur-2xl"
          style={{ background: tone.glow }}
        />
      )}

      <span
        className="flex items-center justify-center w-8 h-8 rounded-lg border shrink-0 transition-colors"
        style={
          isActive
            ? { borderColor: tone.ring, background: tone.chip, color: tone.icon }
            : {
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                color: "rgb(180,180,190)",
              }
        }
      >
        <Icon size={15} strokeWidth={1.7} />
      </span>

      <span className="flex flex-col leading-none min-w-0">
        <span
          className={`text-[12.5px] font-semibold truncate ${
            isActive ? "text-white" : "text-neutral-300 group-hover:text-white"
          }`}
        >
          {team.name}
        </span>
        <span
          className="font-mono text-[9px] tracking-[0.22em] uppercase mt-1"
          style={{ color: isActive ? tone.icon : "rgb(115,115,115)" }}
        >
          {pad(index + 1)}
        </span>
      </span>

      {recruiting && (
        <span className="relative flex h-1.5 w-1.5 ml-0.5 shrink-0" title="alım açık">
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-60"
            style={{ background: "rgb(110,231,183)" }}
          />
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ background: "rgb(110,231,183)" }}
          />
        </span>
      )}
    </button>
  );
}
