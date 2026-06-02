## Why

Tech stack pills currently show plain text names — no visual differentiation between technologies. Adding per-technology icons (SVG logos via `simple-icons` or inline Unicode/emoji equivalents) gives each badge instant visual recognition, making the section scannable at a glance and more impressive to visitors.

## What Changes

- Add an `icon` optional field to `TechCategory.items` — change item type from `string` to `{ name: string; icon?: string }` — **BREAKING** for the `TechCategory` type and all consumers
- Add icon mappings for all ~40 technologies in `TECH_STACK_CATEGORIES` using `simple-icons` SVG data (installed as a dependency)
- Update `TechStackSection` renderer in `RichBubble.tsx` to render a small icon `<img>` or inline `<svg>` to the left of each badge label
- Icon colour inherits from the badge accent (brand or signal) via CSS `fill` + `filter` so icons stay visually consistent without separate colour maps

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `tech-stack-display`: The `TechCategory` data model changes — items become `{ name: string; icon?: string }` objects instead of plain strings. The visual renderer requirement extends to include an icon element per badge.

## Impact

- `src/types/chat.types.ts` — `TechCategory.items` type changes from `string[]` to `TechItem[]` (new interface `{ name: string; icon?: string }`)
- `src/constants/answer.ts` — `TECH_STACK_CATEGORIES` items rewritten as objects with `name` + `icon` fields; icon values are base64 SVG data URIs sourced from `simple-icons`
- `src/components/RichBubble.tsx` — `TechStackSection` updated to render icon + name in each pill
- `package.json` — add `simple-icons` as a dependency (provides typed SVG path data for 3000+ tech brands, MIT licensed)
- No API, routing, or layout changes
