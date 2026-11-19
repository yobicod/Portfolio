"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type MotionRevealProps = {
  as?: "div" | "li" | "article";
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** A small, shared entrance treatment: content rises and sharpens as it enters the viewport. */
export default function MotionReveal({ as = "div", children, className, delay = 0, y = 32 }: MotionRevealProps) {
  const reducedMotion = useReducedMotion();
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8%" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Component>
  );
}
