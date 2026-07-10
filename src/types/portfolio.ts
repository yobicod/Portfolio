export type ProjectVisualKind = "knowledge" | "operations" | "cloud";

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  problem: string;
  description: string;
  responsibility: string;
  systemApproach: string;
  impact: string;
  stack: string[];
  visualKind: ProjectVisualKind;
}

export interface ExperienceEntry {
  date: string;
  role: string;
  company: string;
  description: string;
}
