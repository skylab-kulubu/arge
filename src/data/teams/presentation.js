import {
  Code2, Globe, Shield, Smartphone, Gamepad2, Brain, Link2, Cpu, Users,
} from "lucide-react";

export const TEAM_PRESENTATION = {
  algolab:      { name: "Algolab",      icon: Code2,      tone: "cyan" },
  weblab:       { name: "Weblab",       icon: Globe,      tone: "skylab" },
  skysec:       { name: "Sky-Sec",      icon: Shield,     tone: "emerald" },
  mobilab:      { name: "Mobilab",      icon: Smartphone, tone: "indigo" },
  gamelab:      { name: "Gamelab",      icon: Gamepad2,   tone: "amber" },
  airlab:       { name: "Airlab",       icon: Brain,      tone: "violet" },
  chainlab:     { name: "Chainlab",     icon: Link2,      tone: "orange" },
  skysis:       { name: "Skysis",       icon: Cpu,        tone: "rose" },
  organizasyon: { name: "Organizasyon", icon: Users,      tone: "pink" },
};

export const TEAM_ORDER = [
  "algolab", "weblab", "skysec", "mobilab", "gamelab",
  "airlab", "chainlab", "skysis", "organizasyon",
];


export const FALLBACK_PRESENTATION = { name: "", icon: Users, tone: "skylab" };