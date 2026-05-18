"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export const ScrollContainerContext = createContext(null);
export function useScrollContainer() {
  return useContext(ScrollContainerContext);
}

export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let pending = null;
    const flush = () => {
      raf = 0;
      if (!pending) return;
      document.documentElement.style.setProperty("--mx", pending.x + "px");
      document.documentElement.style.setProperty("--my", pending.y + "px");
      pending = null;
    };
    const onMove = (e) => {
      pending = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return <div className="bg-spotlight" aria-hidden />;
}

export function useReveal(scrollRef) {
  useEffect(() => {
    const root = scrollRef?.current ?? null;
    const nodes = document.querySelectorAll("[data-reveal], [data-stagger]");
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            io.unobserve(entry.target);
          }
        }
      },
      { root, threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [scrollRef]);
}

export function useShouldAnimate(ref) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const node = ref?.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref]);
  return active;
}

export function Magnetic({ children, strength = 0.25 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "translate3d(0,0,0)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <span ref={ref} className="inline-block transition-transform duration-300 ease-out">
      {children}
    </span>
  );
}