import SystemNarrativeVisual from "@/components/SystemNarrativeVisual";
import type { Project } from "@/types/portfolio";

export default function ProjectChapter({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <article className={featured ? "project-chapter project-chapter--featured reveal" : "project-chapter reveal"} id={project.id}>
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
    </article>
  );
}
