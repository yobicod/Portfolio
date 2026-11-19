"use client";

import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function Word({ children, className, progress, range }: { children: string; className?: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span className={className} style={{ opacity }}>{children} </motion.span>;
}

/** A statement whose words light up one by one as the reader scrolls through it. */
export default function ScrollWords({ text, emphasis, className }: { text: string; emphasis?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = [
    ...text.split(" ").map((word) => ({ word, emphasised: false })),
    ...(emphasis ? emphasis.split(" ").map((word) => ({ word, emphasised: true })) : []),
  ];

  if (reducedMotion) {
    return <p className={className}>{text} {emphasis && <span className="gradient-text">{emphasis}</span>}</p>;
  }

  return (
    <p className={className} ref={ref}>
      {words.map(({ word, emphasised }, index) => (
        <Word
          key={`${word}-${index}`}
          className={emphasised ? "gradient-text" : undefined}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}
