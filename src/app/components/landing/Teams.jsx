"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, ChevronRight, UserPlus, Sparkles, Trophy, ArrowRight, Users2 } from "lucide-react";
import { TEAMS, TONE, STATUS } from "@/data/teams";

const pad = (n) => String(n).padStart(2, "0");

function RecruitingChip({ recruiting, compact = false }) {
  if (recruiting) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] rounded-full border ${
          compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
        }`}
        style={{ borderColor: "rgba(110,231,183,0.4)", color: "rgb(167,243,208)" }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-70" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-300" />
        </span>
        alım açık
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] rounded-full border border-neutral-700 text-neutral-500 ${
        compact ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
      alım kapalı
    </span>
  );
}

function TeamTab({ team, index, isActive, onClick }) {
  const tt = TONE[team.tone];
  const Icon = team.icon;
  return (
    <button role="tab" aria-selected={isActive} onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border text-left transition-colors lg:flex-1 lg:min-h-14.5 ${
        isActive
          ? "border-transparent"
          : "border-white/8 bg-white/1.5 hover:border-white/15 hover:bg-white/[0.035]"
      }`}
      style={isActive ? { borderColor: tt.ring, background: tt.soft } : undefined}
    >
      {isActive && (
        <motion.span
          layoutId="teams-tab-bar"
          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
          style={{ background: tt.icon, boxShadow: `0 0 12px ${tt.glow}` }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="font-mono text-[10px] text-neutral-600 w-5 shrink-0">{pad(index + 1)}</span>
      <span
        className="flex items-center justify-center w-9 h-9 rounded-md border shrink-0 transition-colors"
        style={
          isActive
            ? { borderColor: tt.ring, color: tt.icon, background: tt.chip }
            : { borderColor: "rgba(255,255,255,0.08)", color: "rgb(180,180,190)", background: "rgba(255,255,255,0.02)" }
        }
      >
        <Icon size={15} strokeWidth={1.7} />
      </span>
      <span className="flex flex-col min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className={`text-[13px] leading-tight truncate ${isActive ? "text-white" : "text-neutral-300"}`}>
            {team.name}
          </span>
          {team.recruiting && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(110,231,183,0.7)" }}
              aria-label="alım açık"
            />
          )}
        </span>
        <span className="font-mono text-[10px] text-neutral-600 truncate mt-0.5">
          {team.recruiting ? "alım açık" : "alım kapalı"}
        </span>
      </span>
      <ChevronRight
        size={12}
        strokeWidth={2}
        className={`shrink-0 transition-all ${
          isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
        }`}
        style={{ color: isActive ? tt.icon : undefined }}
      />
    </button>
  );
}

function Leads({ leads, tone }) {
  const isPair = leads.length > 1;
  return (
    <div className="shrink-0 flex flex-col gap-1.5 md:items-end">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-neutral-500">
        Ekip {isPair ? "Liderleri" : "Lideri"}
      </span>
      <div className="flex flex-col gap-1.5">
        {leads.map((l) => (
          <div key={l.initials} className="flex items-center gap-2 min-w-0">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full border font-mono text-[10px] font-bold shrink-0"
              style={{ borderColor: tone.ring, color: tone.icon, background: tone.chip }}
            >
              {l.initials}
            </span>
            <span className="text-[13px] text-neutral-200 truncate">{l.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS[status];
  if (!s) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] lowercase px-1.5 py-0.5 rounded-full border shrink-0"
      style={{ borderColor: s.ring, background: s.bg, color: s.color }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}

function TeamPanel({ team, num }) {
  const tone = TONE[team.tone];
  const Icon = team.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.3, 1] }}
      className="relative h-full rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-sm overflow-hidden flex flex-col"
      id={team.id}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(70% 55% at 88% 0%, ${tone.glow}, transparent 65%)` }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${tone.icon} 50%, transparent)`, opacity: 0.5 }}
      />

      <header className="relative shrink-0 px-6 md:px-8 pt-7 pb-6 border-b border-white/6">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500">
            {num} · EKİP
          </span>
          {team.topics?.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-[0.16em] uppercase text-neutral-500 before:content-['·'] before:mr-3 before:text-neutral-700"
            >
              {t}
            </span>
          ))}
          <span className="h-px flex-1 bg-neutral-800 min-w-8" />
          <RecruitingChip recruiting={team.recruiting} />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-6">
          <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-xl border shrink-0"
              style={{ borderColor: tone.ring, background: tone.chip, color: tone.icon }}
            >
              <Icon size={24} strokeWidth={1.4} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-3xl md:text-[34px] font-bold tracking-tight leading-[1.05]">
                {team.name}
              </h3>
              <p className="mt-2.5 text-neutral-300 text-[14.5px] leading-[1.55] max-w-[58ch]">
                {team.desc}
              </p>
            </div>
          </div>

          <Leads leads={team.leads} tone={tone} />
        </div>
      </header>

      <div className="relative flex-1 flex flex-col gap-5 px-6 md:px-8 py-6 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-x-8 gap-y-5 flex-1 min-h-0">
          <section className="flex flex-col gap-5 min-w-0">
            <div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-3">
                <Sparkles size={10} strokeWidth={2} style={{ color: tone.icon }} />
                Ekip anlatıyor
              </span>
              <p className="text-neutral-200 text-[14px] leading-[1.7]">{team.longDesc}</p>
            </div>

            <div className="flex flex-col min-w-0 mt-auto">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-3">
              <UserPlus size={10} strokeWidth={2} style={{ color: tone.icon }} />
              Aradığımız profil
            </span>
            <div
              className="relative rounded-lg border overflow-hidden flex-1 flex flex-col"
              style={{
                borderColor: team.recruiting ? tone.ring : "rgba(255,255,255,0.08)",
                background: team.recruiting ? tone.soft : "rgba(255,255,255,0.02)",
              }}
            >
              <div
                className="flex items-center justify-between px-3 py-1.5 border-b"
                style={{
                  borderColor: team.recruiting ? tone.ring : "rgba(255,255,255,0.06)",
                  background: team.recruiting ? tone.chip : "transparent",
                }}
              >
                <span
                  className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-semibold"
                  style={{ color: team.recruiting ? tone.icon : "rgb(115,115,115)" }}
                >
                  {team.recruiting ? "Açık Pozisyon" : "Alım Kapalı"}
                </span>
                {team.recruiting ? (
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-70"
                      style={{ background: tone.icon }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ background: tone.icon, boxShadow: `0 0 6px ${tone.glow}` }}
                    />
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                )}
              </div>

              <div className="flex-1 flex flex-col p-3 gap-3">
                <p className="text-neutral-300 text-[12.5px] leading-[1.65]">
                  {team.recruitingFor}
                </p>

                <div className="mt-auto">
                  {team.recruiting ? (
                    <a
                      href="#katil"
                      className="group/cta flex items-stretch rounded-md border overflow-hidden"
                      style={{ borderColor: tone.ring }}
                    >
                      <span
                        className="flex-1 flex items-center justify-center py-2 px-3.5 font-medium text-[12.5px] tracking-tight"
                        style={{ background: tone.chip, color: tone.icon }}
                      >
                        Ekibe Başvur
                      </span>
                      <span
                        className="relative flex items-center justify-center border-l overflow-hidden w-10"
                        style={{
                          background: tone.soft,
                          borderColor: tone.ring,
                          color: tone.icon,
                        }}
                      >
                        <ArrowRight
                          size={14}
                          strokeWidth={2}
                          className="absolute transition-all duration-300 ease-out group-hover/cta:translate-x-5 group-hover/cta:opacity-0"
                        />
                        <ArrowRight
                          size={14}
                          strokeWidth={2}
                          className="absolute -translate-x-5 opacity-0 transition-all duration-300 ease-out group-hover/cta:translate-x-0 group-hover/cta:opacity-100"
                        />
                      </span>
                    </a>
                  ) : (
                    <p className="text-[11.5px] text-neutral-500 italic leading-[1.6] pt-2 border-t border-white/6">
                      Bu dönem yeni üye alımı yapılmıyor.
                    </p>
                  )}
                </div>
              </div>
            </div>
            </div>
          </section>

          <section className="flex flex-col min-w-0">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-3">
              <Trophy size={10} strokeWidth={2} style={{ color: tone.icon }} />
              Öne çıkan işler
            </span>
            <ul className="flex flex-col">
              {team.works.map((w, i) => (
                <li
                  key={w.title}
                  className="group/work flex items-start gap-3 py-2 border-b border-white/4 last:border-b-0"
                >
                  <span className="font-mono text-[10px] tabular-nums text-neutral-600 w-5 shrink-0 pt-0.5 group-hover/work:text-neutral-400 transition-colors">
                    {pad(i + 1)}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] text-neutral-200 leading-[1.4] group-hover/work:text-white transition-colors">
                        {w.title}
                      </span>
                      <StatusPill status={w.status} />
                    </div>
                    {w.note && (
                      <span className="text-[11.5px] text-neutral-500 leading-normal">
                        {w.note}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-white/6 pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500 shrink-0">
              Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {team.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-1 rounded-md border"
                  style={{ borderColor: tone.ring, background: tone.soft, color: tone.icon }}
                >
                  <Hash size={9} strokeWidth={2} />
                  {s}
                </span>
              ))}
            </div>
          </div>

          <span className="hidden sm:block h-7 w-px bg-neutral-800 shrink-0" />

          <div className="flex items-center gap-2 shrink-0">
            <Users2 size={13} strokeWidth={1.8} className="text-neutral-500" />
            <span className="font-mono text-[12px] text-neutral-400">
              {team.members} üye
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Teams() {
  const [activeId, setActiveId] = useState(TEAMS[0].id);
  const activeIndex = Math.max(0, TEAMS.findIndex((t) => t.id === activeId));
  const active = TEAMS[activeIndex];
  const openCount = TEAMS.filter((t) => t.recruiting).length;

  return (
    <section className="px-5 md:px-10 py-24 md:py-32" id="ekipler">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-10">
          <span className="text-skylab-500 font-mono text-xs">./ekipler</span>
          <div className="flex-1 h-px bg-linear-to-r from-neutral-800 from-80% to-transparent" />
          <span className="hidden sm:inline font-mono text-[10px] text-neutral-600 tracking-[0.16em] uppercase">
            {openCount} ekip alım yapıyor
          </span>
        </div>

        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-5xl">
          <div className="max-w-3xl">
            <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.05]">
              Her ekibin kendi sahası.
            </h2>
            <p className="text-neutral-500 text-sm md:text-[15px] leading-[1.7]">
              Yapay zekadan siber güvenliğe kadar 9 farklı çalışma alanını inceleyin. Ekiplerin vizyonunu, kullandıkları teknoloji yığınlarını ve kilit projelerini keşfederek hedeflerinize en uygun ekibi bulun.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-6 lg:h-180 lg:items-stretch">
          <aside
            role="tablist"
            aria-label="Ekipler"
            className="flex flex-col gap-1.5 lg:h-full"
          >
            {TEAMS.map((t, i) => (
              <TeamTab
                key={t.id}
                team={t}
                index={i}
                isActive={t.id === activeId}
                onClick={() => setActiveId(t.id)}
              />
            ))}
          </aside>

          <div className="min-w-0 lg:h-full relative">
            <AnimatePresence mode="wait">
              <TeamPanel key={active.id} team={active} num={pad(activeIndex + 1)} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
