"use client";

import type { CSSProperties } from "react";
import {
  technologies,
  technologyClusterDescriptions,
  technologyClusterLabels,
  technologyClusterOrder,
} from "@/data/technologyStack";

const fallbackMarks: Record<string, string> = {
  aws: "AWS",
  openai: "AI",
  rag: "RAG",
  agents: "AG",
};

export default function TechnologyEcosystem() {
  return (
    <div className="technology-stage">
      <header className="technology-heading">
        <div>
          <p className="scene-label"><span>03</span>CORE TECHNOLOGY STACK</p>
          <h2>Full-stack.<br /><em>AI-native.</em></h2>
        </div>
        <div className="technology-positioning">
          <p>Modern web applications, intelligent automation, and production-ready cloud systems.</p>
          <ul aria-label="Engineering specializations">
            <li>Full-Stack Engineering</li>
            <li>AI &amp; Automation</li>
            <li>Production Systems</li>
          </ul>
        </div>
      </header>

      <div className="ecosystem-map" aria-label="Technology ecosystem">
        <svg className="ecosystem-connections" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          <path d="M250 140 C420 140 425 140 500 280" />
          <path d="M750 140 C580 140 575 140 500 280" />
          <path d="M250 420 C420 420 425 420 500 280" />
          <path d="M750 420 C580 420 575 420 500 280" />
        </svg>

        {technologyClusterOrder.map((cluster, clusterIndex) => {
          const items = technologies.filter((item) => item.cluster === cluster);
          return (
            <section
              className="technology-group"
              data-cluster={cluster}
              style={{ "--group-index": clusterIndex } as CSSProperties}
              key={cluster}
              aria-labelledby={`cluster-${cluster}`}
            >
              <header>
                <span>0{clusterIndex + 1}</span>
                <div>
                  <h3 id={`cluster-${cluster}`}>{technologyClusterLabels[cluster]}</h3>
                  <p>{technologyClusterDescriptions[cluster]}</p>
                </div>
              </header>
              <ul className="technology-list">
                {items.map((item) => (
                  <li data-priority={item.priority} key={item.id}>
                    <span className="technology-icon" aria-hidden="true">
                      {item.icon ? <svg viewBox="0 0 24 24"><path d={item.icon} /></svg> : <b>{fallbackMarks[item.id]}</b>}
                    </span>
                    <strong>{item.name}</strong>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <span className="ecosystem-core" aria-hidden="true">SYSTEM / 04</span>
      </div>
    </div>
  );
}
