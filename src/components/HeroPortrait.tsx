"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { type PointerEvent, useCallback } from "react";
import { useTranslation } from "@/i18n/I18nProvider";

/** The photo, tilting in 3D with the pointer, with glass chips floating at different depths. */
export default function HeroPortrait() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 16, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 16, mass: 0.5 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-18, 18]);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5)));
    pointerY.set(Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5)));
  }, [pointerX, pointerY, reducedMotion]);

  const chips = [
    { label: t.hero.focus, value: t.hero.focusValue },
    { label: t.hero.craft, value: t.hero.craftValue },
    { label: t.hero.base, value: t.hero.baseValue },
  ];

  return (
    <div
      className="portrait-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
    >
      <motion.div
        className="portrait"
        style={{ rotateX, rotateY }}
        initial={reducedMotion ? false : { opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="portrait-glow" aria-hidden="true" />
        <div className="portrait-face">
          <Image className="portrait-photo" src="/visal.png" alt={t.desk.photo} width={1254} height={1254} priority sizes="(max-width: 760px) 240px, 340px" />
        </div>
        <dl className="portrait-chips">
          {chips.map((chip, index) => (
            <div className="chip" data-chip={index + 1} key={chip.label}><dt>{chip.label}</dt><dd>{chip.value}</dd></div>
          ))}
        </dl>
        <span className="chip chip--accent" data-chip="4">{t.desk.sticker}</span>
      </motion.div>
    </div>
  );
}
