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
        {visualKind === "operations" && (
          <div className="narrative-hotspot">
            <i className="narrative-hotspot__ring" />
            <i className="narrative-hotspot__arrow narrative-hotspot__arrow--left" />
            <i className="narrative-hotspot__arrow narrative-hotspot__arrow--right" />
          </div>
        )}
        {visualKind === "cloud" && (
          <div className="maintenance-flow">
            <i className="maintenance-flow__request" />
            <i className="maintenance-flow__orbit" />
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
