"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Button,
  buttonVariants,
  cn,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  NavigationMenu,
  NavigationMenuItem,
} from "@skylab-kulubu/skylcn-ui";

const TOP_THRESHOLD = 40;

// Sections of the landing page (Teams.jsx, Onboarding.jsx)
const SECTIONS = [
  { label: "Ekipler", href: "#ekipler" },
  { label: "Katıl", href: "#katil" },
];

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

function PhoneMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // The trigger hides at md; close the drawer if the window widens past it while open
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => { if (e.matches) setOpen(false); };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <Drawer open={open} onOpenChange={setOpen} side="right">
      <DrawerTrigger render={<Button variant="ghost" size="icon" aria-label="Menüyü aç" />}>
        <Menu />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>SKY LAB Ar-Ge</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-1">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              onClick={close}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "justify-start")}
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/stant"
            onClick={close}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-3 justify-between")}
          >
            Stant Görünümü
            <ChevronRight />
          </Link>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default function Header({ scrollRef }) {
  const atTop = useIsAtTop(scrollRef);

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

        <div className="hidden md:flex items-center gap-2">
          <NavigationMenu aria-label="Sayfa bölümleri">
            {SECTIONS.map((s) => (
              <NavigationMenuItem key={s.href} label={s.label} href={s.href} />
            ))}
          </NavigationMenu>
          <Link href="/stant" className={cn(buttonVariants(), "group")}>
            Stant Görünümü
            <ChevronRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="md:hidden">
          <PhoneMenu />
        </div>
      </div>
    </motion.header>
  );
}