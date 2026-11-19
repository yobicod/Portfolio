import { useTranslation } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

type Project = Dictionary["work"]["projects"][number];

/** How much of the connecting path is drawn once each step is reached (percent of its length). */
const PATH_PROGRESS = [0, 0, 28.6, 54, 82.7, 100];

/**
 * An orbital diagram of a project: the steps circle the idea that holds the system together.
 * `step` runs from 1 to 5: steps 1–4 light the nodes in order, step 5 lights the core.
 */
export default function SystemNarrativeVisual({ project, step }: { project: Project; step: number }) {
  const { t } = useTranslation();
  const visualKind = project.visualKind as keyof typeof t.work.visuals;
  const visual = t.work.visuals[visualKind];

  return (
    <figure
      className={`orbit orbit--${project.visualKind}`}
      data-step={step}
      aria-label={`${project.title} — ${t.work.visualCaption}: ${visual.nodes.join(" → ")} → ${visual.core}`}
    >
      <div className="orbit-plane" aria-hidden="true">
        <i className="orbit-ring orbit-ring--inner" />
        <i className="orbit-ring orbit-ring--outer" />
      </div>
      <svg className="orbit-path" viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true">
        <path d="M19 13.8 L81 22 L82 77.3 L20 69 L50 46" pathLength={100} style={{ strokeDashoffset: 100 - PATH_PROGRESS[step] }} />
      </svg>
      <i className="orbit-pulse" aria-hidden="true" />
      <div className="orbit-core" aria-hidden="true"><span>{visual.core}</span></div>
      {visual.nodes.map((node, index) => (
        <div
          className="orbit-node"
          data-node={index + 1}
          data-lit={index + 1 <= step || undefined}
          data-current={index + 1 === step || undefined}
          key={node}
          aria-hidden="true"
        >
          <span>0{index + 1}</span>
          <strong>{node}</strong>
        </div>
      ))}
      <div className="orbit-steps" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((dot) => <i key={dot} data-lit={dot <= step || undefined} />)}
      </div>
    </figure>
  );
}
