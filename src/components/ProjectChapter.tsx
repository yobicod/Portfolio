"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type PointerEvent, useCallback } from "react";
import SystemNarrativeVisual from "@/components/SystemNarrativeVisual";
import { useTranslation } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

type Project = Dictionary["work"]["projects"][number];

export default function ProjectChapter({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--spotlight-x", `${x * 100}%`);
    card.style.setProperty("--spotlight-y", `${y * 100}%`);
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
  }, [reducedMotion]);

  const handlePointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <motion.div
      className="project"
      id={project.id}
      initial={reducedMotion ? false : { opacity: 0, y: 60, scale: 0.96 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -6%" }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <article
        className={`project-card project-card--${project.visualKind}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="project-copy">
          <span className="project-index">{t.work.caseLabel} {project.number} · {project.category}</span>
          <h3>{project.title}</h3>
          <p className="project-statement">{project.problem}</p>
          <p>{project.description}</p>
          <p className="project-impact"><span>{t.work.impact}</span>{project.impact}</p>
          <details className="project-disclosure">
            <summary>{t.work.inspect}<span aria-hidden="true">+</span></summary>
            <dl className="project-evidence">
              <div><dt>{t.work.responsibility}</dt><dd>{project.responsibility}</dd></div>
              <div><dt>{t.work.system}</dt><dd>{project.systemApproach}</dd></div>
            </dl>
          </details>
          <ul className="project-stack" aria-label={`${project.title} ${t.work.technologies}`}>
            {project.stack.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <SystemNarrativeVisual project={project} />
      </article>
    </motion.div>
  );
}
