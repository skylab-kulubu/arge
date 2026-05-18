"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="relative z-10 shrink-0 px-6 xl:px-10 pt-6 xl:pt-8 pb-4 flex items-center justify-between gap-6">
      <Link href="/" className="group inline-flex items-center gap-4">
        <img src="/skylab.svg" alt="Skylab"
          className="h-14 w-14 xl:h-16 xl:w-16 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
          style={{ filter: "drop-shadow(0 0 24px rgba(224,200,229,0.25))" }}
        />
        <div className="flex flex-col leading-none">
          <span className="text-skylab-500 font-bold text-[26px] xl:text-[30px] tracking-[0.02em]">
            SKY LAB
          </span>
          <span className="text-white/95 text-[12px] xl:text-[13px] font-medium tracking-[0.02em] mt-2">
            Bilgisayar Bilimleri Kulübü
          </span>
        </div>
      </Link>

      <Link
        href="/"
        className="group inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition-colors font-medium text-[12px] text-neutral-300 hover:text-white"
      >
        <span>Site Görünümü</span>
        <ArrowUpRight
          size={14}
          strokeWidth={2}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </header>
  );
}
