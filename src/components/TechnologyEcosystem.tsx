/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties } from "react";
import {
  technologies,
  technologyCategoryLabels,
  technologyCategoryOrder,
} from "@/data/technologyStack";

export default function TechnologyEcosystem() {
  return (
    <div className="technology-stage">
      <header className="technology-heading">
        <div>
          <p className="scene-label"><span>03</span>TECH STACK / TOOLKIT</p>
          <h2>Tools for<br /><em>shipping.</em></h2>
        </div>
        <p className="technology-positioning">
          A focused, production-ready stack for building software across every layer.
        </p>
      </header>

      <div className="ecosystem-map" aria-label="Technology stack">
        {technologyCategoryOrder.map((category, categoryIndex) => {
          const items = technologies.filter((item) => item.category === category);
          return (
            <section
              className="technology-group"
              style={{ "--group-index": categoryIndex } as CSSProperties}
              key={category}
              aria-labelledby={`category-${category}`}
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
