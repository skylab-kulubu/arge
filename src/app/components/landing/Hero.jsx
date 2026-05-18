"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SkylabLogo from "../SkylabLogo";
import { Magnetic } from "./utils";
import { TEAMS, TONE } from "@/data/teams";

const pad = (n) => String(n).padStart(2, "0");

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

function TeamsGrid() {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm overflow-hidden shadow-[0_24px_64px_-32px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/6 bg-white/1.5">
        <div className="h-2 w-2 rounded-full bg-white/15" />
        <div className="h-2 w-2 rounded-full bg-white/15" />
        <div className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-[10px] text-neutral-500 tracking-wider lowercase">ekipler.index</span>
        <span className="ml-auto font-mono text-[10px] text-neutral-700">{TEAMS.length} alan</span>
      </div>
      <div className="p-3 grid grid-cols-3 gap-2">
        {TEAMS.map((t, i) => {
          const Icon = t.icon;
          const tone = TONE[t.tone];
          return (
            <motion.a
              key={t.id}
              href={`#${t.id}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.05, duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
              className="group relative flex flex-col items-start gap-2 rounded-lg border border-white/8 bg-white/2 px-3 py-3 hover:bg-white/4 transition-colors"
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-md border"
                  style={{ borderColor: tone.ring, background: tone.chip, color: tone.icon }}
                >
                  <Icon size={13} strokeWidth={1.7} />
                </div>
                {t.recruiting && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 6px rgba(110,231,183,0.7)" }}
                    aria-label="alım açık"
                  />
                )}
              </div>
              <div className="min-w-0 w-full">
                <div className="text-[12px] text-neutral-100 leading-tight truncate">{t.name}</div>
                <div className="font-mono text-[9.5px] text-neutral-600 mt-0.5">{pad(i + 1)}</div>
              </div>
              <span
                className="pointer-events-none absolute inset-0 rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: tone.ring }}
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}

export default function Hero() {
  const logoRef = useRef(null);

  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let pending = null;
    const flush = () => {
      raf = 0;
      if (!pending) return;
      el.style.setProperty("--lx", pending.dx + "px");
      el.style.setProperty("--ly", pending.dy + "px");
      pending = null;
    };
    const onMove = (e) => {
      pending = {
        dx: (e.clientX / window.innerWidth - 0.5) * -20,
        dy: (e.clientY / window.innerHeight - 0.5) * -14,
      };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const totalMembers = TEAMS.reduce((sum, t) => sum + (t.members || 0), 0);

  return (
    <section className="relative px-5 md:px-10 pt-28 md:pt-32 pb-24 min-h-screen flex items-center overflow-x-clip">
      <div
        className="hero-logo hero-logo--bloom"
        ref={logoRef}
        aria-hidden
        style={{ "--fill-0": "#e0c8e5" }}
      >
        <SkylabLogo />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center"
        >
          <div className="min-w-0">
            <motion.div variants={item} className="flex items-baseline gap-4 mb-8">
              <span className="text-skylab-500 font-mono text-xs">./arge</span>
              <div className="flex-1 h-px bg-linear-to-r from-neutral-800 from-80% to-transparent" />
              <span className="hidden sm:inline font-mono text-[10px] text-neutral-600 tracking-[0.16em] uppercase">
                SKY LAB
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-white mb-6 -mr-3 text-[clamp(2.4rem,4.2vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            >
              Dokuz ekip,
              <br />
              <span className="text-neutral-600">tek ekosistem.</span>
            </motion.h1>

            <motion.p variants={item} className="text-neutral-500 max-w-md text-[15px] leading-[1.7] mb-10">
              Yapay zekadan blockchain'e, oyun geliştirmeden siber güvenliğe... Farklı yetkinliklere sahip Ar-Ge ekipleri kendi sahalarında uzmanlaşır, SKY LAB vizyonuyla ortak geleceği kodlar.
            </motion.p>

            <motion.div variants={item} className="flex items-center gap-2 sm:gap-4 mb-12">
              <Magnetic strength={0.25}>
                <a href="#ekipler" className="group inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-xl font-medium text-xs sm:text-sm hover:text-white hover:border-skylab-500/50 hover:bg-neutral-800 transition-all duration-300 hover:shadow-[0_0_20px_rgba(224,200,229,0.15)]">
                  <span>Ekipleri keşfet</span>
                  <ArrowDown
                    strokeWidth={2}
                    className="w-4 h-4 transition-all duration-300 group-hover:translate-y-1 group-hover:text-skylab-500"
                  />
                </a>
              </Magnetic>

              <a href="https://forms.yildizskylab.com/" className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-neutral-400 font-medium text-[11px] sm:text-xs hover:text-white transition-colors duration-300"
              >
                <span>Aramıza katıl</span>
                <ArrowUpRight
                  strokeWidth={2}
                  className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-6 font-mono text-[11px] text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-bold leading-none">{TEAMS.length}</span>
                <span>ekip</span>
              </div>
              <div className="w-px h-6 bg-neutral-800" />
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-bold leading-none">{totalMembers}</span>
                <span>üye</span>
              </div>
              <div className="w-px h-6 bg-neutral-800" />
              <div className="flex items-center gap-2">
                <span className="text-white text-lg font-bold leading-none">Tek</span>
                <span>topluluk</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="relative min-w-0">
            <TeamsGrid />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
