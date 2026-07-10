/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type PointerEvent, useCallback } from "react";

const PORTRAIT_SRC = "/visal.png";

export default function SignaturePortrait() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 85, damping: 18, mass: 0.45 });
  const springY = useSpring(pointerY, { stiffness: 85, damping: 18, mass: 0.45 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const translateX = useTransform(springX, [-0.5, 0.5], [-9, 9]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-7, 7]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }, [pointerX, pointerY]);

  return (
    <motion.div
      className="portrait-artwork"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      initial={{ opacity: 0, scale: 0.9, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.05, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Interactive portrait of Visal Suwanarat"
    >
      <div className="portrait-artwork__aura" aria-hidden="true" />
      <div className="portrait-artwork__orbital portrait-artwork__orbital--one" aria-hidden="true" />
      <div className="portrait-artwork__orbital portrait-artwork__orbital--two" aria-hidden="true" />
      <div className="portrait-artwork__grain" aria-hidden="true" />

      <motion.div className="portrait-artwork__echo" style={{ x: translateX, y: translateY }} aria-hidden="true">
        <img src={PORTRAIT_SRC} alt="" />
      </motion.div>
      <motion.div className="portrait-artwork__portrait" style={{ x: translateX, y: translateY }}>
        <img src={PORTRAIT_SRC} alt="Visal Suwanarat" />
      </motion.div>

      <svg className="portrait-artwork__frame" viewBox="0 0 560 640" aria-hidden="true">
        <path d="M76 130 150 58h256l78 76M44 225v-60l32-35M45 411v90l64 78h110M436 579h48l32-34v-98M482 134l34 35v76" />
        <path className="portrait-artwork__frame-dash" d="M55 389 19 354V205M504 407l37-32V227" />
        <circle cx="76" cy="130" r="4" /><circle cx="482" cy="134" r="4" />
        <circle cx="109" cy="579" r="4" /><circle cx="436" cy="579" r="4" />
      </svg>

      <span className="portrait-artwork__tag portrait-artwork__tag--top">VSL / 2026</span>
      <span className="portrait-artwork__tag portrait-artwork__tag--right">SYSTEM<br />THINKING</span>
      <span className="portrait-artwork__tag portrait-artwork__tag--bottom">BKK · TH</span>
      <span className="portrait-artwork__signal portrait-artwork__signal--one" aria-hidden="true" />
      <span className="portrait-artwork__signal portrait-artwork__signal--two" aria-hidden="true" />
    </motion.div>
  );
}
