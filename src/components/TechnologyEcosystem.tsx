/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  technologies,
  technologyCategoryLabels,
  technologyCategoryOrder,
} from "@/data/technologyStack";

export default function TechnologyEcosystem() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="technology-stage">
      <motion.header
        className="technology-heading"
        initial={reducedMotion ? false : { opacity: 0, y: 26 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          <p className="scene-label"><span>03</span>TECH STACK / TOOLKIT</p>
          <h2 id="stack-title">Tools for<br /><em>shipping.</em></h2>
        </div>
        <p className="technology-positioning">
          A focused, production-ready stack for building software across every layer.
        </p>
      </motion.header>

      <div className="ecosystem-map" aria-label="Technology stack">
        {technologyCategoryOrder.map((category, categoryIndex) => {
          const items = technologies.filter((item) => item.category === category);
          return (
            <motion.section
              className="technology-group"
              style={{ "--group-index": categoryIndex } as CSSProperties}
              key={category}
              aria-labelledby={`category-${category}`}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.54, delay: categoryIndex * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <header>
                <span>0{categoryIndex + 1}</span>
                <h3 id={`category-${category}`}>{technologyCategoryLabels[category]}</h3>
              </header>
              <ul className="technology-list">
                {items.map((item) => (
                  <li key={item.id}>
                    {item.icon ? (
                      <svg className="technology-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon} /></svg>
                    ) : (
                      <img className="technology-icon technology-icon--image" src={item.logoUrl} alt="" />
                    )}
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
