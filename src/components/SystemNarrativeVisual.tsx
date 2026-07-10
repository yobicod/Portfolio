import type { Project } from "@/types/portfolio";

const knowledgeNodes = ["Sources", "Retrieval", "LLM", "Answer"];
const operationsNodes = ["Intake", "Service", "Queue", "Workspace"];
const cloudNodes = ["Assets", "Field", "Sync", "Teams"];

export default function SystemNarrativeVisual({ project }: { project: Project }) {
  const nodes = project.visualKind === "knowledge"
    ? knowledgeNodes
    : project.visualKind === "operations"
      ? operationsNodes
      : cloudNodes;

  return (
    <figure
      className={`system-narrative system-narrative--${project.visualKind}`}
      aria-label={`${project.title} explanatory system view`}
    >
      <div className="narrative-topline">
        <span>{project.category}</span>
        <span>/{project.number}</span>
      </div>
      <div className="narrative-canvas" aria-hidden="true">
        <div className="narrative-path" />
        {nodes.map((node, index) => (
          <div className="narrative-node" data-node={index + 1} key={node}>
            <span>0{index + 1}</span>
            <strong>{node}</strong>
          </div>
        ))}
        <div className="narrative-core">
          <i />
          <span>{project.visualKind === "knowledge" ? "Grounded context" : project.visualKind === "operations" ? "Shared state" : "Cloud core"}</span>
        </div>
      </div>
      <figcaption>EXPLANATORY SYSTEM VIEW · {project.number}</figcaption>
    </figure>
  );
}
