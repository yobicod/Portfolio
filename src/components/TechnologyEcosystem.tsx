/* eslint-disable @next/next/no-img-element */
"use client";

import MotionReveal from "@/components/MotionReveal";
import { technologies, technologyCategoryOrder } from "@/data/technologyStack";
import { useTranslation } from "@/i18n/I18nProvider";
import type { Technology } from "@/types/technology";

function TechnologyIcon({ item }: { item: Technology }) {
  return item.icon
    ? <svg className="technology-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon} /></svg>
    : <img className="technology-icon" src={item.logoUrl} alt="" />;
}

function Marquee({ items, reverse = false }: { items: Technology[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "marquee marquee--reverse" : "marquee"}>
      <div className="marquee-track">
        {[...items, ...items].map((item, index) => (
          <span key={`${item.id}-${index}`}><TechnologyIcon item={item} />{item.name}</span>
        ))}
      </div>
    </div>
  );
}

export default function TechnologyEcosystem() {
  const { t } = useTranslation();
  const half = Math.ceil(technologies.length / 2);

  return (
    <>
      <MotionReveal className="section-head container">
        <p className="eyebrow">{t.stack.label}</p>
        <h2 id="stack-title">{t.stack.title} <em>{t.stack.titleEmphasis}</em></h2>
        <p>{t.stack.description}</p>
      </MotionReveal>

      <div className="marquees" aria-hidden="true">
        <Marquee items={technologies.slice(0, half)} />
        <Marquee items={technologies.slice(half)} reverse />
      </div>

      <div className="technology-grid container" aria-label={t.stack.ariaLabel}>
        {technologyCategoryOrder.map((category, categoryIndex) => (
          <MotionReveal className="technology-group" key={category} delay={categoryIndex * 0.07}>
            <section aria-labelledby={`category-${category}`}>
              <h3 id={`category-${category}`}>{t.stack.categories[category]}</h3>
              <ul className="technology-list">
                {technologies.filter((item) => item.category === category).map((item) => (
                  <li key={item.id}><TechnologyIcon item={item} /><span>{item.name}</span></li>
                ))}
              </ul>
            </section>
          </MotionReveal>
        ))}
      </div>
    </>
  );
}
