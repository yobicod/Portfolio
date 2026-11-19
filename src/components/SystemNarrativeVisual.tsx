import { useTranslation } from "@/i18n/I18nProvider";
import type { Dictionary } from "@/i18n";

type Project = Dictionary["work"]["projects"][number];

/** An orbital diagram of a project: the steps circle the idea that holds the system together. */
export default function SystemNarrativeVisual({ project }: { project: Project }) {
  const { t } = useTranslation();
  const visualKind = project.visualKind as keyof typeof t.work.visuals;
  const visual = t.work.visuals[visualKind];

  return (
    <figure className={`orbit orbit--${project.visualKind}`} aria-label={`${project.title} — ${t.work.visualCaption}`}>
      <div className="orbit-plane" aria-hidden="true">
        <i className="orbit-ring orbit-ring--inner" />
        <i className="orbit-ring orbit-ring--outer" />
      </div>
      <div className="orbit-core" aria-hidden="true"><span>{visual.core}</span></div>
      {visual.nodes.map((node, index) => (
        <div className="orbit-node" data-node={index + 1} key={node} aria-hidden="true">
          <span>0{index + 1}</span>
          <strong>{node}</strong>
        </div>
      ))}
    </figure>
  );
}
