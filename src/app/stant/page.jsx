"use client";

import { useEffect } from "react";
import Script from "next/script";
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

      <div className="relative z-10 h-screen w-screen flex flex-col">
        <Header />
        <Teams />
      </div>
    </main>
  );
}