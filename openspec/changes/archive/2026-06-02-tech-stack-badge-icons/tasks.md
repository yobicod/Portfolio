## 1. Dependency

- [x] 1.1 Install `simple-icons` npm package (`pnpm add simple-icons`)

## 2. Type Changes

- [x] 2.1 Add `TechItem` interface (`{ name: string; icon?: string }`) to `src/types/chat.types.ts`
- [x] 2.2 Change `TechCategory.items` from `string[]` to `TechItem[]` in `src/types/chat.types.ts`

## 3. Data — Icon Mappings

- [x] 3.1 Update `TECH_STACK_CATEGORIES` in `src/constants/answer.ts`: rewrite each item from a plain string to a `TechItem` object (`{ name, icon }`) using the SVG path string from `simple-icons` (`si<Name>.path`)
- [x] 3.2 Add icon entries for **Languages**: TypeScript, JavaScript, Python, Go, Bash (SQL has no simple-icons entry — omit icon)
- [x] 3.3 Add icon entries for **Frontend**: React, Next.js, Svelte, Tailwind CSS, Bootstrap, Redux, Zustand (Bulma has no entry — omit)
- [x] 3.4 Add icon entries for **Backend**: Node.js, NestJS, Express, FastAPI, Flask, Gin (Hono, Fiber, Pydantic AI have no entries — omit)
- [x] 3.5 Add icon entries for **Data & AI**: PyTorch, TensorFlow, scikit-learn, Pandas, OpenCV (Pydantic AI — omit)
- [x] 3.6 Add icon entries for **Databases**: PostgreSQL, MongoDB, MySQL, Redis, MariaDB, Elasticsearch
- [x] 3.7 Add icon entries for **Infrastructure & DevOps**: Docker, Kubernetes, AWS, Google Cloud, Microsoft Azure, Terraform, Nginx, Jenkins, Grafana
- [x] 3.8 Add icon entries for **Tools**: Git, Postman, Figma, Puppeteer, RabbitMQ

## 4. Renderer

- [x] 4.1 Update `TechStackSection` in `src/components/RichBubble.tsx` to accept `TechItem[]` and render an inline `<svg>` icon (12×12, `fill="currentColor"`, `shrink-0`, `mr-1`) before the name when `item.icon` is present
- [x] 4.2 Ensure badges without an `icon` value render name-only with no layout shift

## 5. Validation

- [x] 5.1 Run `pnpm run build` — confirm zero type errors and clean build output
- [x] 5.2 Visually verify icons appear in the tech stack panel in the dev browser
