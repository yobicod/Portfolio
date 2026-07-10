"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** A small, shared entrance treatment for the portfolio's editorial sections. */
export default function MotionReveal({ children, className, delay = 0, y = 26 }: MotionRevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8%" }}
      transition={{ duration: 0.78, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
