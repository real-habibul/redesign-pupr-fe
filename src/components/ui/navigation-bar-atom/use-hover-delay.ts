"use client";
import { useRef, useState } from "react";

export function useHoverDelay(delay = 300) {
  const [idx, setIdx] = useState<number | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const over = (i: number) => { if (t.current) clearTimeout(t.current); setIdx(i); };
  const out  = () => { if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setIdx(null), delay); };

  return { hoveredIndex: idx, onEnter: over, onLeave: out };
}
