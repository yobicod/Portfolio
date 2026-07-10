/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  technologies,
  technologyCategoryOrder,
} from "@/data/technologyStack";
import { useTranslation } from "@/i18n/I18nProvider";

export default function TechnologyEcosystem() {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
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
          <p className="scene-label"><span>03</span>{t.stack.label}</p>
          <h2 id="stack-title">{t.stack.title}<br /><em>{t.stack.titleEmphasis}</em></h2>
        </div>
        <p className="technology-positioning">
          {t.stack.description}
        </p>
      </motion.header>

      <div className="ecosystem-map" aria-label={t.stack.ariaLabel}>
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
                <h3 id={`category-${category}`}>{t.stack.categories[category]}</h3>
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
