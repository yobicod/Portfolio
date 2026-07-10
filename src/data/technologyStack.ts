import {
  siCloudflare,
  siDocker,
  siLangchain,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siReact,
  siTypescript,
  siVercel,
} from "simple-icons/icons";
import type { Technology, TechnologyCluster } from "@/types/technology";

export const technologyClusterLabels: Record<TechnologyCluster, string> = {
  frontend: "Frontend",
  backend: "Backend",
  cloud: "Cloud",
  ai: "AI & Automation",
};

export const technologyClusterDescriptions: Record<TechnologyCluster, string> = {
  frontend: "Modern product interfaces",
  backend: "Services, APIs, and data",
  cloud: "Production delivery and edge",
  ai: "Intelligent workflows and agents",
};

export const technologyClusterOrder: TechnologyCluster[] = ["frontend", "backend", "cloud", "ai"];

const tech = (
  id: string,
  name: string,
  cluster: TechnologyCluster,
  priority: Technology["priority"],
  icon: { path: string } | undefined,
  usage: string,
  relatedProject: string | undefined,
  relations: string[],
): Technology => ({ id, name, cluster, priority, ...(icon ? { icon: icon.path } : {}), usage, relatedProject, relations });

export const technologies: Technology[] = [
  tech("react", "React", "frontend", "primary", siReact, "Composable interfaces for complex product workflows.", "Operations Platform", ["nextjs", "typescript", "nodejs"]),
  tech("nextjs", "Next.js", "frontend", "primary", siNextdotjs, "Production web applications with strong rendering and server boundaries.", "Operations Platform", ["react", "typescript", "vercel"]),
  tech("typescript", "TypeScript", "frontend", "primary", siTypescript, "A reliable shared language across interfaces and services.", "Operations Platform", ["react", "nextjs", "nodejs"]),

  tech("nodejs", "Node.js", "backend", "primary", siNodedotjs, "APIs, integrations, automation jobs, and real-time workflows.", "Operations Platform", ["typescript", "nestjs", "postgresql", "docker"]),
  tech("nestjs", "NestJS", "backend", "primary", siNestjs, "Modular architecture for maintainable production services.", "Operations Platform", ["nodejs", "postgresql", "docker"]),
  tech("postgresql", "PostgreSQL", "backend", "primary", siPostgresql, "Dependable relational data, schemas, and transactions.", "Operations Platform", ["nestjs", "nodejs"]),

  tech("aws", "AWS", "cloud", "primary", undefined, "Scalable infrastructure for production services and data workloads.", "Cloud Maintenance Suite", ["docker", "cloudflare"]),
  tech("docker", "Docker", "cloud", "primary", siDocker, "Repeatable environments from development through production.", "Cloud Maintenance Suite", ["aws", "nodejs"]),
  tech("cloudflare", "Cloudflare", "cloud", "secondary", siCloudflare, "Security and application delivery at the network edge.", "Cloud Maintenance Suite", ["aws", "vercel"]),
  tech("vercel", "Vercel", "cloud", "secondary", siVercel, "Focused deployment and observability for modern web applications.", "Operations Platform", ["nextjs", "cloudflare"]),

  tech("openai", "OpenAI", "ai", "primary", undefined, "Language intelligence integrated into useful, guarded products.", "Gen-AI Knowledge System", ["langchain", "rag", "agents"]),
  tech("langchain", "LangChain", "ai", "primary", siLangchain, "Orchestration for retrieval, model calls, tools, and evaluation.", "Gen-AI Knowledge System", ["openai", "rag", "agents"]),
  tech("rag", "RAG", "ai", "primary", undefined, "Grounded generation built on trusted, retrievable knowledge.", "Gen-AI Knowledge System", ["openai", "langchain"]),
  tech("agents", "AI Agents", "ai", "primary", undefined, "Tool-using workflows that automate multi-step operational work.", "Gen-AI Knowledge System", ["openai", "langchain"]),
];

