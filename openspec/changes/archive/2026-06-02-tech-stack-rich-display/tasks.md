## 1. Type System

- [x] 1.1 Add `TechCategory` interface (`{ label: string; items: string[] }`) to `src/types/chat.types.ts`
- [x] 1.2 Add `TechStackMessage` interface (`{ role: MessageRole; type: "tech-stack"; entries: TechCategory[] }`) to `src/types/chat.types.ts`
- [x] 1.3 Extend `RichMessage` union type to include `TechStackMessage`

## 2. Structured Data Constants

- [x] 2.1 Add `TECH_STACK_CATEGORIES: TechCategory[]` to `src/constants/answer.ts` with all 7 categories from `wiki/me.md`: Languages, Frontend, Backend, Data & AI, Databases, Infrastructure & DevOps, Tools — each with its full `items` array

## 3. Bot Service Update

- [x] 3.1 Import `TechCategory`, `TECH_STACK_CATEGORIES` in `bot.service.ts`
- [x] 3.2 Create a `TECH_STACK_RESPONSE: TechStackMessage` constant in `bot.service.ts`
- [x] 3.3 Replace the `"Tech stack"` topic value (`"Tech stack information, Coming soon…"`) with `TECH_STACK_RESPONSE`

## 4. Rich Bubble Renderer

- [x] 4.1 Add a `TechStackSection` sub-component inside `RichBubble.tsx` that receives a `TechCategory` prop and renders: category label as a small heading, items as a `flex-wrap` row of pill `<span>` badges using `--color-brand` / `--color-signal` alternating accent (10% opacity background, coloured border and text)
- [x] 4.2 Add dispatch branch in the `RichBubble` component for `message.type === "tech-stack"` that renders a vertical stack of `TechStackSection` components, one per category
- [x] 4.3 Verify no horizontal overflow at 390px viewport width — badges must wrap, not scroll

## 5. Quality Validation

- [x] 5.1 Verify "Tech stack" quick reply renders all 7 category sections with correct technology pill badges
- [x] 5.2 Verify tech stack message renders instantly (no typing animation delay)
- [x] 5.3 Verify About me, Experience, Contact quick replies still render correctly and are unaffected
- [x] 5.4 Run `npm run lint` with no warnings or errors
- [x] 5.5 Run `npm run build` successfully
