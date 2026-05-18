"use client";

import { useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, Monitor } from "lucide-react";
import Background from "../components/Background";
import Header from "./components/Header";
import Teams from "./components/Teams";

function useAmbience() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const logo = document.getElementById("stantHeroLogo");
    let raf = 0;
    let pending = null;
    const flush = () => {
      raf = 0;
      if (!pending) return;
      document.documentElement.style.setProperty("--mx", pending.mx + "px");
      document.documentElement.style.setProperty("--my", pending.my + "px");
      if (logo) {
        logo.style.setProperty("--lx", pending.dx + "px");
        logo.style.setProperty("--ly", pending.dy + "px");
      }
      pending = null;
    };
    const onMove = (e) => {
      pending = {
        mx: e.clientX,
        my: e.clientY,
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
}

export default function StantPage() {
  useAmbience();

  return (
    <main className="stant-root sl-root relative bg-neutral-950 text-white selection:bg-skylab-500 selection:text-neutral-900 font-sans">
      <Script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js" strategy="afterInteractive"/>

      <Background />
      <div className="bg-spotlight" aria-hidden />

      <div id="stantHeroLogo" className="hero-logo hero-logo--stant" aria-hidden>
        <img src="/skylab.svg" alt="" className="w-full h-full block" />
      </div>

      <div className="relative z-10 h-screen w-screen flex flex-col items-center justify-center px-6 lg:hidden">
        <div className="max-w-md w-full flex flex-col items-center text-center gap-5">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl border"
            style={{
              borderColor: "rgba(224,200,229,0.34)",
              background: "rgba(224,200,229,0.10)",
              color: "rgb(224,200,229)",
            }}
          >
            <Monitor size={26} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-skylab-500">
              Stant Görünümü
            </span>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight leading-[1.15]">
              Bu kısım büyük ekranlar için optimize edilmiştir.
            </h1>
            <p className="text-neutral-400 text-[13.5px] leading-[1.7] max-w-sm mx-auto mt-1">
              Ar-Ge stant ekranı 1024px ve üzeri çözünürlüklerde tasarlandı. Daha rahat bir
              deneyim için ana sayfaya geçebilir veya cihazını büyük ekrana bağlayabilirsin.
            </p>
          </div>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition-colors font-medium text-[13px] text-neutral-200 hover:text-white mt-2"
          >
            <ArrowLeft
              size={14}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 h-screen w-screen hidden lg:flex flex-col">
        <Header />
        <Teams />
      </div>
    </main>
  );
}