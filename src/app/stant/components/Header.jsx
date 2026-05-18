"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="relative z-10 shrink-0 px-4 md:px-6 xl:px-10 pt-4 md:pt-6 xl:pt-8 short-820:pt-4 short-700:pt-3 pb-3 md:pb-4 short-700:pb-2.5 flex items-center justify-between gap-4 md:gap-6">
      <Link href="/" className="group inline-flex items-center gap-3 md:gap-4">
        <img src="/skylab.svg" alt="Skylab"
          className="h-11 w-11 md:h-14 md:w-14 xl:h-16 xl:w-16 short-700:h-12 short-700:w-12 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
          style={{ filter: "drop-shadow(0 0 24px rgba(224,200,229,0.25))" }}
        />
        <div className="flex flex-col leading-none">
          <span className="text-skylab-500 font-bold text-[20px] md:text-[26px] xl:text-[30px] short-700:text-[24px] tracking-[0.02em]">
            SKY LAB
          </span>
          <span className="text-white/95 text-[11px] md:text-[12px] xl:text-[13px] font-medium tracking-[0.02em] mt-1.5 md:mt-2">
            Bilgisayar Bilimleri Kulübü
          </span>
        </div>
      </Link>

      <Link href="/" className="group inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition-colors font-medium text-[12px] text-neutral-300 hover:text-white">
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
