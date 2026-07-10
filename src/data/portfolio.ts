import type { ExperienceEntry, Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    id: "gen-ai-knowledge-system",
    number: "01",
    title: "Gen-AI Knowledge System",
    category: "INTELLIGENT SYSTEM",
    problem: "Turning fragmented knowledge into dependable answers.",
    description: "A production knowledge engine designed for accurate, real-time customer and internal support.",
    responsibility: "Product architecture · Full-stack delivery · AI integration",
    systemApproach: "Trusted sources move through retrieval and grounding before a guarded model response reaches the user.",
    impact: "Faster access to trusted operational knowledge",
    stack: ["LLM", "RAG", "TypeScript", "Python"],
    visualKind: "knowledge",
  },
  {
    id: "operations-platform",
    number: "02",
    title: "Operations Platform",
    category: "PRODUCT ENGINEERING",
    problem: "Making complex workflows feel calm and obvious.",
    description: "A microservice-based workspace that connects internal management and operational workflows.",
    responsibility: "System design · Frontend engineering · Backend services",
    systemApproach: "A shared workspace coordinates service boundaries, queued work, and operational state without exposing that complexity to teams.",
    impact: "One clearer workflow across operational teams",
    stack: ["Next.js", "Node.js", "PostgreSQL"],
    visualKind: "operations",
  },
  {
    id: "cloud-maintenance-suite",
    number: "03",
    title: "Cloud Maintenance Suite",
    category: "CLOUD PLATFORM",
    problem: "Connecting teams, assets, and field work.",
    description: "A cloud-native product that brings maintenance data and field operations into one system.",
    responsibility: "Interface design · Cloud architecture · Infrastructure",
    systemApproach: "Field activity and asset records synchronize through a cloud core so every team works from the same operational state.",
    impact: "A shared source of truth for maintenance work",
    stack: ["React", "AWS", "Terraform"],
    visualKind: "cloud",
  },
];

export const experience: ExperienceEntry[] = [
  { date: "2025 — NOW", role: "Full Stack Engineer", company: "Amity Solutions", description: "Building production AI products and high-trust software systems." },
  { date: "2024 — 2025", role: "Junior Full Stack Engineer", company: "Amity Solutions", description: "Shipped a Gen-AI knowledge base for customer and internal support." },
  { date: "2023", role: "Full Stack Engineer · Intern", company: "Amity Solutions", description: "Built product features, chatbot integrations, and cloud infrastructure." },
  { date: "2020 — 2023", role: "Freelance Software Engineer", company: "KMITL Projects", description: "Created maintenance, ride-sharing, and booking platforms." },
];
