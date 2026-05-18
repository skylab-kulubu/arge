"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const TOP_THRESHOLD = 40;

const textVariants = {
  initial: { y: 0, opacity: 1, transition: { duration: 0.25, ease: "easeIn" } },
  hover: { y: -20, opacity: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const iconVariants = {
  initial: { y: 20, opacity: 0, transition: { duration: 0.25, ease: "easeOut" } },
  hover: { y: 0, opacity: 1, transition: { duration: 0.25, ease: "easeIn", delay: 0.05 } },
};

function useIsAtTop(scrollRef) {
  const [atTop, setAtTop] = useState(true);
  useEffect(() => {
    const node = scrollRef?.current;
    const target = node ?? (typeof window !== "undefined" ? window : null);
    if (!target) return;
    const read = () => {
      const y = node ? node.scrollTop : window.scrollY;
      setAtTop(y <= TOP_THRESHOLD);
    };
    read();
    target.addEventListener("scroll", read, { passive: true });
    return () => target.removeEventListener("scroll", read);
  }, [scrollRef]);
  return atTop;
}

function ContextTag({ show }) {
  return (
    <motion.span
      initial={false}
      animate={show ? "show" : "hide"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      variants={{
        show: { opacity: 1, x: 0, maxWidth: 120, marginLeft: 4 },
        hide: { opacity: 0, x: -8, maxWidth: 0, marginLeft: 0 },
      }}
      className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-600 overflow-hidden whitespace-nowrap"
    >
      <span aria-hidden>|</span>
      <span>AR-GE</span>
    </motion.span>
  );
}

export default function Header({ scrollRef }) {
  const atTop = useIsAtTop(scrollRef);
  const router = useRouter();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-between w-full pl-3 pr-2 py-1.5 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <Link href="/" className="flex items-center group">
          <img src="/skylab.svg" alt="Skylab Logo"
            className="h-7 w-7 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-skylab-500/80 font-bold ml-2.5 -mt-0.5 text-[17px] tracking-wide">
            SKY LAB
          </span>
          <ContextTag show={atTop} />
        </Link>

        <motion.button onClick={() => router.push('/stant')} initial="initial" whileHover="hover"
          className={`min-w-24 h-8 relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-neutral-100 transition-colors hover:border-pink-100/40 hover:bg-pink-100/30 hover:text-pink-100`}
        >
          <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <motion.span variants={textVariants} className="block whitespace-nowrap">
              Stant Görünümü
            </motion.span>

            <motion.span variants={iconVariants} className="absolute inset-0 flex items-center justify-center">
              <ChevronRight size={16} />
            </motion.span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
}