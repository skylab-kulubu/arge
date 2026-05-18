"use client";

import { useRef } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Spotlight, useReveal, ScrollContainerContext } from "./components/landing/utils";
import Hero from "./components/landing/Hero";
import Teams from "./components/landing/Teams";
import Onboarding from "./components/landing/Onboarding";

export default function Page() {
  const scrollRef = useRef(null);
  useReveal(scrollRef);

  return (
    <ScrollContainerContext.Provider value={scrollRef}>
      <main
        ref={scrollRef}
        className="sl-root relative h-screen overflow-y-auto overflow-x-hidden scroll-smooth scrollbar scrollbar-gutter-both bg-neutral-950 text-white selection:bg-skylab-500 selection:text-neutral-900 font-sans"
      >
        <Background />
        <Spotlight />

        <div className="relative z-10">
          <Header scrollRef={scrollRef} />
          <Hero />
          <Teams />
          <Onboarding />
          <Footer />
        </div>
      </main>
    </ScrollContainerContext.Provider>
  );
}