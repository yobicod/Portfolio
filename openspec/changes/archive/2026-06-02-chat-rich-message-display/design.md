## Context

The chatbot in the portfolio site currently renders all bot responses as plain-text chat bubbles typed out character by character. This works for short prose answers (`About me`, `Project`) but breaks down for structured data — the `Experience` response is a multi-line string array where each job entry is a `\n`-separated blob, and `Contact` is a flat list of emoji-prefixed strings. These are hard to visually parse in a bubble format.

The current `Message` type is `{ role: "user" | "bot", text: string }`. All rendering logic in `Chatbox.tsx` assumes `text` is a raw string and appends it character by character via a typing interval. There is no concept of structured content.

## Goals / Non-Goals

**Goals:**
- Introduce a `RichMessage` union type that extends the current message model with typed content variants (`text`, `timeline`, `list`, `contact`)
- Add a `TimelineEntry` data structure for experience items (date range, role, company, bullet points)
- Render `timeline` messages as stacked visual cards — no character typing, displayed instantly
- Render `list`/`contact` messages as spaced rows with icon prefix
- Keep all existing plain-text bubble behavior, quick-reply chips, input, send, and audio logic fully intact

**Non-Goals:**
- Rewriting chat logic or conversation flow
- Adding real-time streaming or server-side data fetching
- Typing animation for rich content (instant display only)
- Markdown parsing / generic markdown renderer
- Adding new topics or changing which quick replies exist

## Decisions

**D1 — Union type over generic rich content model**

`RichMessage = PlainMessage | TimelineMessage | ListMessage` rather than a single `{ type, content: unknown }`.

Rationale: TypeScript discriminated unions give exhaustive narrowing in the renderer with no runtime casting. Adding a new type later is a one-line union extension.

Alternative considered: A JSON schema-style `{ type: string, payload: Record<string, unknown> }` — rejected because it loses type safety at the render site.

**D2 — Rich messages displayed instantly, no character-by-character typing**

Timeline cards and list rows appear fully rendered in one render cycle, not typed out.

Rationale: Character typing is designed for prose — it creates the illusion of the bot "thinking". For structured data like a timeline, it adds latency with no readability benefit and complicates the interval logic (which operates on a flat string).

Alternative considered: Convert structured data to a flat string and type it — rejected because formatting (dates, bullets) gets scrambled during partial reveal.

**D3 — Structured data lives in `constants/answer.ts`, not inlined in service**

`EXPERIENCE_TIMELINE: TimelineEntry[]` and `CONTACT_ITEMS: ContactEntry[]` are defined as typed constants alongside existing answer constants.

Rationale: Keeps data co-located with other content, easy to update without touching service logic.

**D4 — Bot service returns `RichBotResponse = PlainBotResponse | RichMessage`**

`bot.service.ts` returns a `RichBotResponse` for structured topics and `string | string[]` for prose topics, identical to today.

Rationale: Minimal blast radius — only the `processBotReply` handler in `Chatbox.tsx` needs updating to branch on response type. All other chat logic (input, send, quick reply) is untouched.

**D5 — Render rich messages in a separate React component `RichBubble`**

A new `RichBubble` component handles the visual rendering of timeline/list/contact types. `PlainBubble` handles the existing text rendering. `Chatbox` selects between them based on message type.

Rationale: Keeps the rendering path clean without adding conditionals inside the existing bubble JSX.

## Risks / Trade-offs

- [Risk] `processBotReply` currently expects `string | string[]` — adding a third branch could introduce bugs if not narrowed carefully → Mitigation: use `instanceof` / discriminant `type` field check before any array spread
- [Risk] Rich messages have no typing audio/animation — might feel inconsistent with plain text responses → Mitigation: acceptable UX trade-off; rich content renders instantly after the "Typing..." placeholder clears, matching user expectation for structured data
- [Risk] Timeline card layout may overflow on narrow mobile viewports → Mitigation: use responsive Tailwind classes and test at 390px

## Open Questions

- None — scope is well-defined and contained within existing component boundaries.
