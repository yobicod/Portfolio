"use client";

import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import SystemNarrativeVisual from "@/components/SystemNarrativeVisual";
import { useTranslation } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

type Project = Dictionary["work"]["projects"][number];

const STEPS = 5;
const AUTO_STEP_MS = 1500;
/** Must match the media query that makes `.project` tall and `.project-pin` sticky in globals.css. */
const PIN_QUERY = "(min-width: 981px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

/**
 * A case study. On large screens the card pins while the reader scrolls, and the scroll
 * walks the diagram through its steps. Elsewhere the diagram plays by itself while in view.
 */
export default function ProjectChapter({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion();
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const inView = useInView(cardRef, { amount: 0.35 });
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState(1);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const query = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (pinned) setStep(Math.min(STEPS, 1 + Math.floor(progress * STEPS)));
  });

  useEffect(() => {
    if (pinned) return;
    if (reducedMotion) { setStep(STEPS); return; }
    if (!inView) return;
    const timer = window.setInterval(() => setStep((current) => (current % STEPS) + 1), AUTO_STEP_MS);
    return () => window.clearInterval(timer);
  }, [inView, pinned, reducedMotion]);

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
    <div className="project" id={project.id} ref={trackRef}>
      <div className="project-pin">
        <motion.div
          className="project-reveal"
          initial={reducedMotion ? false : { opacity: 0, y: 60, scale: 0.96 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16, margin: "0px 0px -6%" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <article
            className={`project-card project-card--${project.visualKind}`}
            ref={cardRef}
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
            <SystemNarrativeVisual project={project} step={step} />
          </article>
        </motion.div>
      </div>
    </div>
  );
}
