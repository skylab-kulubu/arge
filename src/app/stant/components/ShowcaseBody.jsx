"use client";

import { Fragment } from "react";
import {
  Hash,
  Sparkles,
  Trophy,
  UserPlus,
  Users2,
  ArrowRight,
  ScanLine,
} from "lucide-react";
import { TEAMS, TONE, STATUS } from "@/data/teams";
import QRCode from "./QRCode";

const pad = (n) => String(n).padStart(2, "0");
const isRecruiting = (t) => Boolean(t.recruiting && t.applyUrl);
const dimRing = (ring, alpha = 0.14) =>
  ring.replace(/,\s*[\d.]+\s*\)\s*$/, `, ${alpha})`);

function RecruitingChip({ recruiting }) {
  if (recruiting) {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] rounded-full border text-[10px] px-2 py-0.5"
        style={{ borderColor: "rgba(110,231,183,0.4)", color: "rgb(167,243,208)" }}
      >
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
        alım açık
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.14em] rounded-full border border-neutral-700 text-neutral-500 text-[10px] px-2 py-0.5">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
      alım kapalı
    </span>
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

export default function ShowcaseBody({ team }) {
  const tone = TONE.skylab;
  const Icon = team.icon;
  const recruiting = isRecruiting(team);
  const num = pad(TEAMS.findIndex((t) => t.id === team.id) + 1);

  return (
    <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] min-h-0">
      {/* ─── LEFT: identity + story ─────────────────────────────────── */}
      <section
        className="flex flex-col px-7 xl:px-10 py-7 xl:py-8 min-w-0 border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: dimRing(tone.ring, 0.16) }}
      >
        <div className="flex items-center gap-3 flex-wrap mb-5">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-neutral-500">
            {num} / {pad(TEAMS.length)} · EKİP
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
          <RecruitingChip recruiting={recruiting} />
        </div>

        <div className="flex items-start gap-5">
          <div
            className="flex items-center justify-center w-16 h-16 xl:w-20 xl:h-20 rounded-2xl border shrink-0"
            style={{ borderColor: tone.ring, background: tone.chip, color: tone.icon }}
          >
            <Icon size={32} strokeWidth={1.3} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-[44px] xl:text-[56px] font-bold tracking-tight leading-[0.98]">
              {team.name}
            </h2>
            <p className="mt-3 text-neutral-300 text-[15px] xl:text-[16px] leading-[1.55] max-w-[62ch]">
              {team.desc}
            </p>
          </div>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-neutral-500 flex items-center gap-1.5">
            <Sparkles size={11} strokeWidth={2} style={{ color: tone.icon }} />
            Ekip anlatıyor
          </span>
          <span className="h-px flex-1" style={{ background: dimRing(tone.ring, 0.18) }} />
        </div>

        <p className="text-neutral-200 text-[14.5px] xl:text-[15.5px] leading-[1.75] max-w-[68ch]">
          {team.longDesc}
        </p>

        <div className="mt-auto pt-7 grid grid-cols-[auto_1fr] gap-x-7 gap-y-4 items-start">
          {/* leads */}
          <div className="flex flex-col gap-2 min-w-0">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-neutral-500">
              Ekip {team.leads.length > 1 ? "Liderleri" : "Lideri"}
            </span>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex shrink-0">
                {team.leads.map((l, i) => (
                  <span
                    key={i}
                    className="flex items-center justify-center w-8 h-8 rounded-full border font-mono text-[11px] font-bold"
                    style={{
                      borderColor: tone.ring,
                      color: tone.icon,
                      background: tone.chip,
                      marginLeft: i === 0 ? 0 : -12,
                      zIndex: team.leads.length - i,
                      boxShadow: "0 0 0 2px var(--sl-bg)",
                    }}
                  >
                    {l.initials}
                  </span>
                ))}
              </div>
              <span className="text-[13.5px] text-neutral-100 leading-snug min-w-0">
                {team.leads.map((l, i) => (
                  <Fragment key={i}>
                    {i > 0 && (
                      <span className="mx-1.5" style={{ color: tone.icon }}>
                        &amp;
                      </span>
                    )}
                    {l.name}
                  </Fragment>
                ))}
              </span>
            </div>
          </div>

          {/* stack */}
          <div className="flex flex-col gap-2 min-w-0">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-neutral-500 flex items-center gap-2">
              <span>Stack</span>
              <span className="h-px flex-1" style={{ background: dimRing(tone.ring, 0.16) }} />
              <span className="flex items-center gap-1 text-neutral-500">
                <Users2 size={11} strokeWidth={1.8} />
                <span className="text-neutral-400 normal-case tracking-normal">
                  {team.members} üye
                </span>
              </span>
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
        </div>
      </section>

      {/* ─── RIGHT: works + apply ───────────────────────────────────── */}
      <section className="relative flex flex-col px-6 xl:px-8 py-7 xl:py-8 min-w-0 min-h-0">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-neutral-500 flex items-center gap-1.5">
            <Trophy size={11} strokeWidth={2} style={{ color: tone.icon }} />
            Öne çıkan işler
          </span>
          <span className="h-px flex-1" style={{ background: dimRing(tone.ring, 0.18) }} />
          <span className="font-mono text-[10px] text-neutral-600 tabular-nums">
            {pad(team.works.length)}
          </span>
        </div>

        <ul className="flex flex-col min-h-0 overflow-hidden">
          {team.works.length === 0 && (
            <li
              className="text-neutral-500 text-[13px] italic leading-[1.6] border border-dashed rounded-lg px-4 py-5"
              style={{ borderColor: dimRing(tone.ring, 0.22), background: tone.soft }}
            >
              Bu ekip henüz öne çıkardığı işleri burada listelemiyor — stantta sohbet et, üzerinde
              çalıştıkları işleri anlatsınlar.
            </li>
          )}
          {team.works.map((w, i) => (
            <li
              key={w.title}
              className="group flex items-start gap-3 py-2.5 border-b last:border-b-0"
              style={{ borderColor: dimRing(tone.ring, 0.14) }}
            >
              <span className="font-mono text-[10px] tabular-nums text-neutral-600 w-5 shrink-0 pt-1">
                {pad(i + 1)}
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13.5px] text-neutral-100 leading-[1.35] font-medium">
                    {w.title}
                  </span>
                  <StatusPill status={w.status} />
                </div>
                {w.note && (
                  <span className="text-[12.5px] text-neutral-400 leading-[1.55]">{w.note}</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex-1 min-h-2" />

        <div
          className="mt-5 rounded-xl border overflow-hidden"
          style={{
            borderColor: recruiting ? tone.ring : "rgba(255,255,255,0.08)",
            background: recruiting ? tone.soft : "rgba(255,255,255,0.02)",
          }}
        >
          <div
            className="flex items-center justify-between px-3.5 py-2 border-b"
            style={{
              borderColor: recruiting ? tone.ring : "rgba(255,255,255,0.06)",
              background: recruiting ? tone.chip : "transparent",
            }}
          >
            <span
              className="font-mono text-[10px] tracking-[0.22em] uppercase font-semibold flex items-center gap-1.5"
              style={{ color: recruiting ? tone.icon : "rgb(115,115,115)" }}
            >
              <UserPlus size={11} strokeWidth={2} />
              {recruiting ? "Aradığımız Profil" : "Bu Dönem Alım Kapalı"}
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

          <div className="flex items-stretch">
            <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
              <p className="text-neutral-300 text-[12.5px] leading-[1.6]">{team.recruitingFor}</p>
              <div className="mt-auto">
                {recruiting ? (
                  <a
                    href={team.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/cta flex items-stretch rounded-md border overflow-hidden"
                    style={{ borderColor: tone.ring }}
                  >
                    <span
                      className="flex-1 flex items-center justify-center py-2 px-3.5 font-medium text-[12.5px] tracking-tight"
                      style={{ background: tone.chip, color: tone.icon }}
                    >
                      Ekibe Başvur · skyl.app/{team.id}
                    </span>
                    <span
                      className="relative flex items-center justify-center border-l w-10 shrink-0 overflow-hidden"
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
                ) : (
                  <p className="text-[11.5px] text-neutral-500 italic leading-[1.6]">
                    Yine de selam vermek istersen, ekibe stantta uğra.
                  </p>
                )}
              </div>
            </div>

            {recruiting && (
              <div
                className="shrink-0 flex flex-col items-center justify-center gap-1.5 p-3 border-l"
                style={{ borderColor: tone.ring, background: "rgba(8,7,11,0.45)" }}
              >
                <div className="rounded-md p-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <QRCode value={team.applyUrl} size={104} color={tone.icon} />
                </div>
                <span
                  className="font-mono text-[8.5px] tracking-[0.22em] uppercase flex items-center gap-1"
                  style={{ color: tone.icon }}
                >
                  <ScanLine size={9} strokeWidth={2} />
                  telefonla okut
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
