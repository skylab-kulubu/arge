"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Hash, ChevronRight, UserPlus, Sparkles, Trophy, ArrowRight, Users2 } from "lucide-react";
import { TEAMS, TONE, STATUS } from "@/data/teams";
import { useScrollContainer } from "./utils";

const PIN_VH_PER_TAB = 60;

const pad = (n) => String(n).padStart(2, "0");
const isRecruiting = (t) => Boolean(t.recruiting && t.applyUrl);
const isExternal = (url) => typeof url === "string" && /^https?:\/\//i.test(url);

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
  const recruiting = isRecruiting(team);
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
          {recruiting && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
              style={{ boxShadow: "0 0 6px rgba(110,231,183,0.7)" }}
              aria-label="alım açık"
            />
          )}
        </span>
        <span className="font-mono text-[10px] text-neutral-600 truncate mt-0.5">
          {recruiting ? "alım açık" : "alım kapalı"}
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

      {/* Mobile: inline compact */}
      <div className="flex md:hidden items-center gap-2 min-w-0">
        <div className="flex -space-x-2 shrink-0">
          {leads.map((l) => (
            <span
              key={l.initials}
              className="flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] font-mono text-[9px] font-bold"
              style={{ borderColor: tone.ring, color: tone.icon, background: tone.chip }}
            >
              {l.initials}
            </span>
          ))}
        </div>
        <span className="text-[12.5px] text-neutral-200 truncate">
          {leads.map((l) => l.name).join(" & ")}
        </span>
      </div>

      {/* Desktop: vertical list */}
      <div className="hidden md:flex flex-col gap-1.5">
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

function WorksList({ works, tone }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const measure = () => {
      const header = section.querySelector("[data-header]");
      const items = [...section.querySelectorAll("li")];
      if (!items.length) return;

      items.forEach((item) => (item.style.display = "flex"));
      const available = section.clientHeight - (header?.offsetHeight ?? 0);
      let used = 0;
      let n = 0;
      for (const item of items) {
        used += item.offsetHeight;
        if (used <= available) n++;
        else break;
      }
      items.forEach((item, i) => {
        item.style.display = i < n ? "" : "none";
      });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(section);
    measure();
    return () => ro.disconnect();
  }, [works]);

  return (
    <section ref={sectionRef} className="hidden md:flex flex-col min-w-0">
      <span
        data-header
        className="flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-2 sm:mb-3"
      >
        <Trophy size={10} strokeWidth={2} style={{ color: tone.icon }} />
        Öne çıkan işler
      </span>
      <ul className="flex flex-col">
        {works.map((w, i) => (
          <li
            key={w.title}
            className="group/work flex items-start gap-2.5 sm:gap-3 py-1.5 sm:py-2 border-b border-white/4 last:border-b-0"
          >
            <span className="font-mono text-[9.5px] sm:text-[10px] tabular-nums text-neutral-600 w-4 sm:w-5 shrink-0 pt-0.5 group-hover/work:text-neutral-400 transition-colors">
              {pad(i + 1)}
            </span>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5 sm:gap-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[12px] sm:text-[12.5px] md:text-[13px] text-neutral-200 leading-[1.4] group-hover/work:text-white transition-colors">
                  {w.title}
                </span>
                <StatusPill status={w.status} />
              </div>
              {w.note && (
                <span className="hidden sm:block text-[11.5px] text-neutral-500 leading-normal">
                  {w.note}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApplyButton({ team, tone, recruiting, external }) {
  if (!recruiting) {
    return (
      <p className="text-[11.5px] text-neutral-500 italic leading-[1.6] pt-2 border-t border-white/6">
        Bu dönem yeni üye alımı yapılmıyor.
      </p>
    );
  }
  return (
    <a
      href={team.applyUrl}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
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
        style={{ background: tone.soft, borderColor: tone.ring, color: tone.icon }}
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
  );
}

function RecruitingBox({ team, tone, recruiting, external }) {
  const ref = useRef(null);
  const [minimal, setMinimal] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const measure = () => {
      const parentH = parent.clientHeight;
      let used = 0;
      let sib = el.previousElementSibling;
      while (sib) {
        used += sib.offsetHeight;
        sib = sib.previousElementSibling;
      }
      const gap = 20;
      const available = parentH - used - gap;
      setMinimal(available < 130);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    if (el.previousElementSibling) ro.observe(el.previousElementSibling);
    measure();
    return () => ro.disconnect();
  }, [team]);

  if (minimal) {
    return (
      <div ref={ref} className="hidden md:block min-w-0 mt-auto shrink-0">
        <ApplyButton team={team} tone={tone} recruiting={recruiting} external={external} />
      </div>
    );
  }

  return (
    <div ref={ref} className="hidden md:flex flex-col min-w-0 flex-1 min-h-0">
      <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-3 shrink-0">
        <UserPlus size={10} strokeWidth={2} style={{ color: tone.icon }} />
        Aradığımız profil
      </span>
      <div
        className="relative rounded-lg border overflow-hidden flex-1 flex flex-col min-h-0"
        style={{
          borderColor: recruiting ? tone.ring : "rgba(255,255,255,0.08)",
          background: recruiting ? tone.soft : "rgba(255,255,255,0.02)",
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
          style={{
            borderColor: recruiting ? tone.ring : "rgba(255,255,255,0.06)",
            background: recruiting ? tone.chip : "transparent",
          }}
        >
          <span
            className="font-mono text-[9.5px] tracking-[0.22em] uppercase font-semibold"
            style={{ color: recruiting ? tone.icon : "rgb(115,115,115)" }}
          >
            {recruiting ? "Açık Pozisyon" : "Alım Kapalı"}
          </span>
          {recruiting ? (
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

        <div className="flex-1 flex flex-col p-3 gap-3 min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden">
            <p className="text-neutral-300 text-[12.5px] leading-[1.65] line-clamp-3">
              {team.recruitingFor}
            </p>
          </div>
          <div className="shrink-0">
            <ApplyButton team={team} tone={tone} recruiting={recruiting} external={external} />
          </div>
        </div>
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
  const recruiting = isRecruiting(team);
  const external = isExternal(team.applyUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute inset-0 rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur-sm overflow-hidden flex flex-col"
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

      <header className="relative shrink-0 px-4 sm:px-6 md:px-8 pt-5 pb-4 md:pt-7 md:pb-6 border-b border-white/6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
          <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-neutral-500">
            {num} · EKİP
          </span>
          {team.topics?.map((t, i) => (
            <span
              key={t}
              className={`font-mono text-[9.5px] sm:text-[10px] tracking-[0.16em] uppercase text-neutral-500 before:content-['·'] before:mr-2 sm:before:mr-3 before:text-neutral-700 ${
                i > 0 ? "hidden sm:inline" : ""
              }`}
            >
              {t}
            </span>
          ))}
          <span className="h-px flex-1 bg-neutral-800 min-w-4 sm:min-w-8" />
          <RecruitingChip recruiting={recruiting} />
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6">
          <div className="flex items-start gap-3 sm:gap-4 md:gap-5 flex-1 min-w-0">
            <div
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl border shrink-0"
              style={{ borderColor: tone.ring, background: tone.chip, color: tone.icon }}
            >
              <Icon size={20} strokeWidth={1.4} className="sm:hidden" />
              <Icon size={24} strokeWidth={1.4} className="hidden sm:block" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-[22px] sm:text-2xl md:text-3xl lg:text-[34px] font-bold tracking-tight leading-[1.05]">
                {team.name}
              </h3>
              <p className="mt-2 sm:mt-2.5 text-neutral-300 text-[12.5px] sm:text-[13.5px] md:text-[14.5px] leading-normal sm:leading-[1.55] max-w-[58ch]">
                {team.desc}
              </p>
            </div>
          </div>

          <Leads leads={team.leads} tone={tone} />
        </div>
      </header>

      <div className="relative flex-1 flex flex-col gap-4 sm:gap-5 px-4 sm:px-6 md:px-8 py-4 sm:py-6 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-x-6 lg:gap-x-8 gap-y-4 sm:gap-y-5 flex-1 min-h-0">
          <section className="flex flex-col gap-4 sm:gap-5 min-w-0 min-h-0">
            <div className="shrink-0">
              <span className="flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-neutral-500 mb-2 sm:mb-3">
                <Sparkles size={10} strokeWidth={2} style={{ color: tone.icon }} />
                Ekip anlatıyor
              </span>
              <p className="text-neutral-200 text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-[1.6] sm:leading-[1.7] line-clamp-3 md:line-clamp-4 xl:line-clamp-none">{team.longDesc}</p>
            </div>

            <RecruitingBox team={team} tone={tone} recruiting={recruiting} external={external} />
          </section>

          <WorksList works={team.works} tone={tone} />
        </div>

        <div className="border-t border-white/6 pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1.5 sm:gap-y-2">
            <span className="font-mono text-[9.5px] sm:text-[10px] tracking-[0.18em] uppercase text-neutral-500 shrink-0">
              Stack
            </span>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {team.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border"
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
            <span className="font-mono text-[11px] sm:text-[12px] text-neutral-400">
              {team.members} üye
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Teams() {
  const scrollContainer = useScrollContainer();
  const pinRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const openCount = TEAMS.filter(isRecruiting).length;
  const active = TEAMS[activeIndex];

  const { scrollYProgress } = useScroll({
    container: scrollContainer ?? undefined,
    target: pinRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        TEAMS.length - 1,
        Math.max(0, Math.floor(v * TEAMS.length))
      );
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    });
    return () => unsub();
  }, [scrollYProgress]);

  const scrollToIndex = useCallback(
    (i) => {
      const container = scrollContainer?.current;
      const pin = pinRef.current;
      if (!container || !pin) {
        setActiveIndex(i);
        return;
      }
      const pinRect = pin.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const pinTopInContainer =
        container.scrollTop + pinRect.top - containerRect.top;
      const usableHeight = pin.offsetHeight - container.clientHeight;
      const target =
        pinTopInContainer + ((i + 0.5) / TEAMS.length) * usableHeight;
      container.scrollTo({ top: target, behavior: "smooth" });
    },
    [scrollContainer]
  );

  useEffect(() => {
    const handler = () => {
      const id =
        typeof window !== "undefined" ? window.location.hash.slice(1) : "";
      if (!id) return;
      const idx = TEAMS.findIndex((t) => t.id === id);
      if (idx >= 0) scrollToIndex(idx);
    };
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [scrollToIndex]);

  const handleTabClick = scrollToIndex;

  return (
    <section id="ekipler" className="relative">
      <div className="px-5 md:px-10 pt-24 md:pt-32 pb-10 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-skylab-500 font-mono text-xs">./ekipler</span>
            <div className="flex-1 h-px bg-linear-to-r from-neutral-800 from-80% to-transparent" />
            <span className="hidden sm:inline font-mono text-[10px] text-neutral-600 tracking-[0.16em] uppercase">
              {openCount} ekip alım yapıyor
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-5xl">
            <div className="max-w-3xl">
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.05]">
                Her ekibin kendi sahası.
              </h2>
              <p className="text-neutral-500 text-sm md:text-[15px] leading-[1.7]">
                Yapay zekadan siber güvenliğe kadar 9 farklı çalışma alanını inceleyin. Ekiplerin vizyonunu, kullandıkları teknoloji yığınlarını ve kilit projelerini keşfederek hedeflerinize en uygun ekibi bulun.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={pinRef}
        className="relative pb-24 md:pb-32"
        style={{ "--pin-h": `${TEAMS.length * PIN_VH_PER_TAB}vh` }}
      >
        <div className="h-(--pin-h)">
          <div className="sticky top-20 h-[calc(100dvh-5rem)] flex items-center px-5 md:px-10">
            <div className="max-w-6xl mx-auto w-full h-[calc(100dvh-9rem)] lg:h-160 flex flex-col lg:block">
              <div className="flex lg:hidden items-center gap-3 shrink-0 -mt-8 mb-1">
                <span className="font-mono text-[9.5px] uppercase text-neutral-500 shrink-0">
                  {pad(activeIndex + 1)} / {pad(TEAMS.length)}
                </span>
                <div className="flex gap-1 flex-1">
                  {TEAMS.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => handleTabClick(i)}
                      aria-label={t.name}
                      className="flex-1 py-1 flex items-center"
                    >
                      <span
                        className="w-full h-0.5 rounded-full transition-all duration-300"
                        style={{
                          background: i === activeIndex
                            ? TONE[active.tone].icon
                            : "rgba(255,255,255,0.15)",
                        }}
                      />
                    </button>
                  ))}
                </div>
                <span lang="en" className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-neutral-500 shrink-0">
                  {active.name}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] grid-rows-1 gap-4 lg:gap-6 flex-1 min-h-0 lg:h-full lg:items-stretch">
                <aside
                  role="tablist"
                  aria-label="Ekipler"
                  className="hidden lg:flex flex-col gap-1.5 lg:h-full"
                >
                  {TEAMS.map((t, i) => (
                    <TeamTab
                      key={t.id}
                      team={t}
                      index={i}
                      isActive={i === activeIndex}
                      onClick={() => handleTabClick(i)}
                    />
                  ))}
                </aside>

                <div className="min-w-0 h-full relative">
                  <AnimatePresence initial={false}>
                    <TeamPanel
                      key={active.id}
                      team={active}
                      num={pad(activeIndex + 1)}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}