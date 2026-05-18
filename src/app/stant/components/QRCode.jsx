"use client";

import { useEffect, useState } from "react";

function buildQrSvg(value, color) {
  if (typeof window === "undefined" || !window.qrcode) return "";
  const qr = window.qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  const cells = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) cells.push(`<rect x="${c}" y="${r}" width="1" height="1"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" fill="${color}">${cells.join("")}</svg>`;
}

export default function QRCode({ value, size = 104, color = "rgb(224,200,229)", bg = "transparent" }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    const tryBuild = () => {
      if (cancelled) return;
      if (window.qrcode) setSvg(buildQrSvg(value, color));
      else setTimeout(tryBuild, 50);
    };
    tryBuild();
    return () => {
      cancelled = true;
    };
  }, [value, color]);

  return (
    <div
      style={{ width: size, height: size, background: bg }}
      className="qr-svg shrink-0"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
