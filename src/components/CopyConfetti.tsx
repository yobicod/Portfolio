"use client";

import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const CELEBRATE_FOR_MS = 3600;

/** A short burst of confetti. `celebration` is a counter; each increase triggers one burst. */
export default function CopyConfetti({ celebration }: { celebration: number }) {
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!celebration) return;
    setViewport({ width: window.innerWidth, height: window.innerHeight });
    const timer = window.setTimeout(() => setViewport(null), CELEBRATE_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  if (!viewport) return null;
  return (
    <div className="confetti" aria-hidden="true">
      <Confetti width={viewport.width} height={viewport.height} recycle={false} numberOfPieces={220} gravity={0.28} colors={["#0071e3", "#7d5cff", "#ff5fa2", "#ff9f43", "#30d158"]} />
    </div>
  );
}
