export type TechnologyCategory =
  | "languages"
  | "frontend"
  | "backend"
  | "databases"
  | "cloudDevOps";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  icon?: string;
  logoUrl?: string;
}
