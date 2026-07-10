import type { Technology, TechnologyCategory } from "@/types/technology";
import {
  siDocker,
  siElasticsearch,
  siExpress,
  siFastapi,
  siGithubactions,
  siGin,
  siGo,
  siHono,
  siJavascript,
  siKubernetes,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRedis,
  siRedux,
  siTailwindcss,
  siTerraform,
  siTypescript,
  siVuedotjs,
} from "simple-icons/icons";

export const technologyCategoryLabels: Record<TechnologyCategory, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  cloudDevOps: "Cloud & DevOps",
};

export const technologyCategoryOrder: TechnologyCategory[] = [
  "languages",
  "frontend",
  "backend",
  "databases",
  "cloudDevOps",
];

const tech = (
  id: string,
  name: string,
  category: TechnologyCategory,
  icon?: { path: string },
  logoUrl?: string,
): Technology => ({
  id,
  name,
  category,
  ...(icon ? { icon: icon.path } : {}),
  ...(logoUrl ? { logoUrl } : {}),
});

export const technologies: Technology[] = [
  tech("typescript", "TypeScript", "languages", siTypescript),
  tech("javascript", "JavaScript", "languages", siJavascript),
  tech("python", "Python", "languages", siPython),
  tech("go", "Go", "languages", siGo),

  tech("react", "React", "frontend", siReact),
  tech("nextjs", "Next.js", "frontend", siNextdotjs),
  tech("tailwind-css", "Tailwind CSS", "frontend", siTailwindcss),
  tech("redux", "Redux", "frontend", siRedux),
  tech("vuejs", "Vue.js", "frontend", siVuedotjs),

  tech("nestjs", "NestJS", "backend", siNestjs),
  tech("nodejs", "Node.js", "backend", siNodedotjs),
  tech("express", "Express", "backend", siExpress),
  tech("fastapi", "FastAPI", "backend", siFastapi),
  tech("hono", "Hono", "backend", siHono),
  tech("gin", "Gin", "backend", siGin),

  tech("postgresql", "PostgreSQL", "databases", siPostgresql),
  tech("redis", "Redis", "databases", siRedis),
  tech("mysql", "MySQL", "databases", siMysql),
  tech("mongodb", "MongoDB", "databases", siMongodb),
  tech("elasticsearch", "Elasticsearch", "databases", siElasticsearch),

  tech("docker", "Docker", "cloudDevOps", siDocker),
  tech("aws", "AWS", "cloudDevOps", undefined, "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg"),
  tech("github-actions", "GitHub Actions", "cloudDevOps", siGithubactions),
  tech("terraform", "Terraform", "cloudDevOps", siTerraform),
  tech("kubernetes", "Kubernetes", "cloudDevOps", siKubernetes),
  tech("azure", "Azure", "cloudDevOps", undefined, "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg"),
];
