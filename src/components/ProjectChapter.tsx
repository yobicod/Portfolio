"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type PointerEvent, useCallback } from "react";
import SystemNarrativeVisual from "@/components/SystemNarrativeVisual";
import type { Project } from "@/types/portfolio";

export default function ProjectChapter({ project, featured = false }: { project: Project; featured?: boolean }) {
  const reducedMotion = useReducedMotion();
  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spotlight-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    event.currentTarget.style.setProperty("--spotlight-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  }, [reducedMotion]);
  return (
    <motion.article
      className={featured ? "project-chapter project-chapter--featured" : "project-chapter"}
      id={project.id}
      tabIndex={0}
      onPointerMove={handlePointerMove}
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -6%" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <SystemNarrativeVisual project={project} />
      <div className="project-copy">
        <span className="project-index">CASE {project.number} · {project.category}</span>
        <h3>{project.title}</h3>
        <p className="project-statement">{project.problem}</p>
        <p>{project.description}</p>
        <dl className="project-evidence">
          <div><dt>Responsibility</dt><dd>{project.responsibility}</dd></div>
          <div><dt>System</dt><dd>{project.systemApproach}</dd></div>
          <div><dt>Impact</dt><dd>{project.impact}</dd></div>
        </dl>
        <div className="project-stack" aria-label={`${project.title} technologies`}>
          {project.stack.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </motion.article>
  );
}
