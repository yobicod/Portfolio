import { useTranslation } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

type Project = Dictionary["work"]["projects"][number];

export default function SystemNarrativeVisual({ project }: { project: Project }) {
  const { t } = useTranslation();
  const visualKind = project.visualKind as keyof typeof t.work.visuals;
  const visual = t.work.visuals[visualKind];

  return (
    <figure
      className={`system-narrative system-narrative--${project.visualKind}`}
      aria-label={`${project.title} — ${t.work.visualCaption}`}
    >
      <div className="narrative-topline">
        <span>{project.category}</span>
        <span>/{project.number}</span>
      </div>
      <div className="narrative-canvas" aria-hidden="true">
        <div className="narrative-path" />
        {visualKind === "knowledge" && (
          <div className="narrative-flow">
            <i className="narrative-flow__pulse" />
          </div>
        )}
        {visual.nodes.map((node, index) => (
          <div className="narrative-node" data-node={index + 1} key={node}>
            <span>0{index + 1}</span>
            <strong>{node}</strong>
          </div>
        ))}
        <div className="narrative-core">
          <i />
          <span>{visual.core}</span>
        </div>
      </div>
      <figcaption>{t.work.visualCaption} · {project.number}</figcaption>
    </figure>
  );
}
