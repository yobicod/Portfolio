export type TechnologyCluster =
  | "frontend"
  | "backend"
  | "ai"
  | "cloud";

export type TechnologyPriority = "primary" | "secondary";

export interface Technology {
  id: string;
  name: string;
  cluster: TechnologyCluster;
  priority: TechnologyPriority;
  icon?: string;
  usage: string;
  relatedProject?: string;
  relations: string[];
}
