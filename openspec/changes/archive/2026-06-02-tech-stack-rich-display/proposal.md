## Why

The "Tech stack" quick reply currently returns a plain "Coming soon…" placeholder, leaving the most technically interesting section of the portfolio completely empty. Visitors (recruiters, engineers) land on this chatbot expecting to learn what Visal can do — a rich, scannable tech-stack display turns that answer into a visual statement rather than a missed opportunity.

## What Changes

- Add a new `tech-stack` rich message type to the discriminated-union type system (`TechStackMessage` carrying categorized `TechCategory[]` entries)
- Add `TechCategory` and `TechStackMessage` interfaces to `src/types/chat.types.ts`
- Add `TECH_STACK_CATEGORIES` constant to `src/constants/answer.ts` using data from `wiki/me.md` (7 categories: Languages, Frontend, Backend, Data & AI, Databases, Infrastructure & DevOps, Tools)
- Update `bot.service.ts` to return a `TechStackMessage` for the `"Tech stack"` topic key
- Create a `TechStackBubble` section inside `RichBubble.tsx` that renders each category as a labeled group with pill-style technology badges
- UX goal: scannable at a glance, beautiful pill tags, category labels, no horizontal overflow on mobile

## Capabilities

### New Capabilities

- `tech-stack-display`: Rich categorized tech-stack renderer — category header + pill badge grid per technology, rendered instantly (no typing animation)

### Modified Capabilities

- `rich-message-display`: Extends the existing `RichMessage` discriminated union with a new `"tech-stack"` variant

## Impact

- `src/types/chat.types.ts` — new interfaces `TechCategory`, `TechStackMessage`; `RichMessage` union extended
- `src/constants/answer.ts` — new `TECH_STACK_CATEGORIES` export
- `src/services/bot.service.ts` — `"Tech stack"` topic key now returns `TechStackMessage`
- `src/components/RichBubble.tsx` — new `TechStackSection` sub-component + dispatch branch in `RichBubble`
- No new dependencies required
