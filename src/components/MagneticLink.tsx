"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useCallback, useRef } from "react";
import { useSound } from "@/components/SoundProvider";

type MagneticLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  rel?: string;
  strength?: number;
  target?: string;
};

/** Adds a restrained pointer response to the primary calls to action. */
export default function MagneticLink({ children, strength = 7, ...props }: MagneticLinkProps) {
  const reducedMotion = useReducedMotion();
  const { playEffect } = useSound();
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || event.pointerType === "touch" || !linkRef.current) return;
    const bounds = linkRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    linkRef.current.style.setProperty("--magnetic-x", `${x * strength}px`);
    linkRef.current.style.setProperty("--magnetic-y", `${y * strength}px`);
  }, [reducedMotion, strength]);

  const handlePointerLeave = useCallback(() => {
    linkRef.current?.style.setProperty("--magnetic-x", "0px");
    linkRef.current?.style.setProperty("--magnetic-y", "0px");
  }, []);

  return (
    <motion.a
      {...props}
      ref={linkRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => playEffect("action")}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
    >
      {children}
    </motion.a>
  );
}
