import { TEAM_PRESENTATION, TEAM_ORDER, FALLBACK_PRESENTATION } from "./presentation.js";

export function deriveInitials(name) {
  const words = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] ?? "" : "";
  return (first + last).toLocaleUpperCase("tr-TR");
}

export function teamFromItem(item) {
  const slug = item.slug;
  const pres = TEAM_PRESENTATION[slug] ?? FALLBACK_PRESENTATION;
  const data = item.data ?? {};
  const leads = Array.isArray(data.leads) ? data.leads.filter(Boolean) : [];

  return {
    id: slug,
    name: pres.name || slug,
    icon: pres.icon,
    tone: pres.tone,
    desc: data.desc ?? "",
    longDesc: data.longDesc ?? "",
    topics: Array.isArray(data.topics) ? data.topics : [],
    stack: Array.isArray(data.stack) ? data.stack : [],
    recruiting: Boolean(data.recruiting),
    recruitingFor: data.recruitingFor ?? "",
    applyUrl: data.applyUrl ?? "",
    leads: leads.map((name) => ({ name, initials: deriveInitials(name) })),
    members: Number(data.memberCount ?? 0),
    works: [], // not in the collection schema yet — section renders empty
  };
}

export function teamsFromItems(items) {
  const bySlug = new Map((items ?? []).map((item) => [item.slug, item]));
  const ordered = [];

  for (const slug of TEAM_ORDER) {
    const item = bySlug.get(slug);
    if (item) {
      ordered.push(teamFromItem(item));
      bySlug.delete(slug);
    }
  }
  for (const item of bySlug.values()) {
    ordered.push(teamFromItem(item));
  }
  return ordered;
}