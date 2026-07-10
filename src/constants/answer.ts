import type {
  TimelineEntry,
  ContactEntry,
  TechCategory,
  TechItem,
} from "@/types/chat.types";
import {
  siTypescript,
  siJavascript,
  siPython,
  siGo,
  siGnubash,
  siReact,
  siNextdotjs,
  siSvelte,
  siTailwindcss,
  siBootstrap,
  siBulma,
  siRedux,
  siNodedotjs,
  siNestjs,
  siExpress,
  siHono,
  siFastapi,
  siFlask,
  siGin,
  siPytorch,
  siTensorflow,
  siScikitlearn,
  siPandas,
  siOpencv,
  siPostgresql,
  siMongodb,
  siMysql,
  siRedis,
  siMariadb,
  siElasticsearch,
  siDocker,
  siKubernetes,
  siGooglecloud,
  siTerraform,
  siNginx,
  siJenkins,
  siGrafana,
  siGit,
  siPostman,
  siFigma,
  siPuppeteer,
  siRabbitmq,
} from "simple-icons";
export const ABOUT_ME_ANSWER = `Heyy, I’m Visal (aka yobicod), an IT graduate from KMITL with a passion for software development. I started coding at 15 and have been hooked ever since — building projects, solving problems, and exploring new technologies.

💡 I love creating practical, impactful solutions and thrive in fast-moving environments. Whether it's full-stack development or diving into AI, I'm all about learning, growing, and building cool stuff.

🚀 I’m currently looking for exciting opportunities to collaborate, innovate, and make meaningful contributions in tech. Let’s connect!

`;

export const EXPERIENCE = `💼 Experience
Apr 2024 – Present
Junior Full Stack Engineer — Amity Solutions
• Developed a Gen-AI Knowledge Base chatbot using LLMs to provide intelligent, real-time responses for customer support and internal information retrieval.

Nov 2023 – Mar 2024
Full Stack Engineer (Freelance Contract) — Amity Solutions
• Built a web application for internal management using microservices architecture.
• Worked across the full stack to deliver scalable, high-performance solutions enhancing operational workflows.

Jun 2023 – Oct 2023
Full Stack Engineer (Internship) — Amity Solutions
• Contributed to web app development, chatbot integration, and AWS infrastructure deployment using Serverless Framework and Terraform.

Oct 2020 – Feb 2023
Freelance Software Engineer — KMITL Projects
• Developed cloud-based maintenance system, ride-sharing platform, and booking system for King Mongkut's Institute of Technology Ladkrabang (KMITL).

`;

export const EXPERIENCE_LIST = [
  "June 2025 – Present\nFull Stack Engineer — Amity Solutions\n• Developed a Gen-AI Knowledge Base chatbot using LLMs to provide intelligent, real-time responses for customer support and internal information retrieval.\n",
  "Apr 2024 – May 2025\nJunior Full Stack Engineer — Amity Solutions\n• Developed a Gen-AI Knowledge Base chatbot using LLMs to provide intelligent, real-time responses for customer support and internal information retrieval.\n",
  "Jun 2023 – Oct 2023\nFull Stack Engineer (Internship) — Amity Solutions\n• Contributed to web app development, chatbot integration, and AWS infrastructure deployment using Serverless Framework and Terraform.",
  "Oct 2020 – Feb 2023\nFreelance Software Engineer — KMITL Projects\n• Developed cloud-based maintenance system, ride-sharing platform, and booking system for King Mongkut's Institute of Technology Ladkrabang (KMITL).",
];
export const CONTACT_LIST = [
  `📞 phone : +66 6583862xx`,
  `💌 gmail : yobicod.4u@gmail.com`,
];

export const TYPING_ON = [
  "Typing",
  500,
  "Typing.",
  500,
  "Typing..",
  500,
  "Typing...",
  500,
  "Typing....",
  500,
];

export const GREETING_MESSAGE = `hello world`;

export const EXPERIENCE_TIMELINE: TimelineEntry[] = [
  {
    dateRange: "June 2025 – Present",
    role: "Full Stack Engineer",
    company: "Amity Solutions",
    bullets: [
      "Developed a Gen-AI Knowledge Base chatbot using LLMs to provide intelligent, real-time responses for customer support and internal information retrieval.",
    ],
  },
  {
    dateRange: "Apr 2024 – May 2025",
    role: "Junior Full Stack Engineer",
    company: "Amity Solutions",
    bullets: [
      "Developed a Gen-AI Knowledge Base chatbot using LLMs to provide intelligent, real-time responses for customer support and internal information retrieval.",
    ],
  },
  {
    dateRange: "Jun 2023 – Oct 2023",
    role: "Full Stack Engineer (Internship)",
    company: "Amity Solutions",
    bullets: [
      "Contributed to web app development, chatbot integration, and AWS infrastructure deployment using Serverless Framework and Terraform.",
    ],
  },
  {
    dateRange: "Oct 2020 – Feb 2023",
    role: "Freelance Software Engineer",
    company: "KMITL Projects",
    bullets: [
      "Developed cloud-based maintenance system, ride-sharing platform, and booking system for King Mongkut's Institute of Technology Ladkrabang (KMITL).",
    ],
  },
];

export const CONTACT_ITEMS: ContactEntry[] = [
  { icon: "📞", value: "phone : +66 6583862xx" },
  { icon: "💌", value: "gmail : yobicod.4u@gmail.com" },
];

// Source: wiki/me.md — all 7 tech categories
// Icons sourced from simple-icons (MIT). Missing entries use text-only badges.
const i = (name: string, icon?: { path: string }): TechItem => ({
  name,
  ...(icon ? { icon: icon.path } : {}),
});

export const TECH_STACK_CATEGORIES: TechCategory[] = [
  {
    label: "Languages",
    items: [
      i("TypeScript", siTypescript),
      i("JavaScript", siJavascript),
      i("Python", siPython),
      i("Go", siGo),
      i("SQL"),
      i("Bash", siGnubash),
    ],
  },
  {
    label: "Frontend",
    items: [
      i("React", siReact),
      i("Next.js", siNextdotjs),
      i("Svelte", siSvelte),
      i("Tailwind CSS", siTailwindcss),
      i("Bootstrap", siBootstrap),
      i("Bulma", siBulma),
      i("Redux", siRedux),
      i("Zustand"),
    ],
  },
  {
    label: "Backend",
    items: [
      i("Node.js", siNodedotjs),
      i("NestJS", siNestjs),
      i("Express", siExpress),
      i("Hono", siHono),
      i("FastAPI", siFastapi),
      i("Flask", siFlask),
      i("Gin", siGin),
      i("Fiber"),
    ],
  },
  {
    label: "Data & AI",
    items: [
      i("PyTorch", siPytorch),
      i("TensorFlow", siTensorflow),
      i("scikit-learn", siScikitlearn),
      i("Pandas", siPandas),
      i("OpenCV", siOpencv),
      i("Pydantic AI"),
    ],
  },
  {
    label: "Databases",
    items: [
      i("PostgreSQL", siPostgresql),
      i("MongoDB", siMongodb),
      i("MySQL", siMysql),
      i("Redis", siRedis),
      i("MariaDB", siMariadb),
      i("Elasticsearch", siElasticsearch),
      i("Cosmos"),
    ],
  },
  {
    label: "Infrastructure & DevOps",
    items: [
      i("Docker", siDocker),
      i("Kubernetes", siKubernetes),
      i("AWS"),
      i("GCP", siGooglecloud),
      i("Azure"),
      i("Terraform", siTerraform),
      i("Nginx", siNginx),
      i("Jenkins", siJenkins),
      i("Grafana", siGrafana),
    ],
  },
  {
    label: "Tools",
    items: [
      i("Git", siGit),
      i("Postman", siPostman),
      i("Figma", siFigma),
      i("Puppeteer", siPuppeteer),
      i("RabbitMQ", siRabbitmq),
    ],
  },
];
