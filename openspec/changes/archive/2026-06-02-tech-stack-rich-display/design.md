## Context

The chatbot currently has 5 quick-reply topics. Four are now implemented with rich renderers (About me uses typing animation, Experience uses `TimelineMessage`, Contact uses `ContactMessage`). The "Tech stack" topic returns a static `"Tech stack information, Coming soon…"` string — the only remaining placeholder.

The existing rich-message architecture uses a discriminated union (`RichMessage`) dispatched in `RichBubble.tsx`. Adding a new variant follows the same pattern established by `TimelineMessage` and `ContactMessage`.

Tech stack data source: `wiki/me.md` — 7 categories, ~40 technologies total.

## Goals / Non-Goals

**Goals:**

- Add a `tech-stack` variant to the `RichMessage` union with typed `TechCategory[]` data
- Render each category as a labeled section with pill-style badge grid
- Instant render (no typing animation) matching existing rich message UX
- Mobile-safe: no horizontal overflow on 390px viewport; badges wrap naturally
- Visually consistent with existing bubble design tokens (`--color-brand`, `--color-signal`, `--foreground-muted`, etc.)

**Non-Goals:**

- Linking badges to external URLs or filtering/searching tech stack
- Animated entrance per badge (performance risk on low-end devices)
- Adding a new color per category (keep palette unified)

## Decisions

**Decision 1: New `tech-stack` discriminant, not a generic `grid` type**
Rationale: A named variant (`type: "tech-stack"`) is self-documenting and keeps type narrowing explicit. A generic `grid` type would require consumers to know the data shape at runtime — against the discriminated-union contract already established.

**Decision 2: `TechCategory[]` as the data shape (not a flat tag list)**
Each category (`{ label: string; items: string[] }`) maps 1:1 to the wiki structure. A flat list would lose grouping information and make the renderer more complex.

**Decision 3: Pill badges, not plain comma-separated text**
Pills (`<span>` tags with rounded border + brand tint) are scannable at a glance and visually separate from prose — critical for this type of list. Alternatives considered: plain `code` tags (too monochrome), chips with icons (overkill for tech names).

**Decision 4: Colour accent alternates per category using `--color-brand` / `--color-signal`**
Two-colour alternation (cyan brand / lime signal) gives visual rhythm across the 7 category groups without introducing new CSS variables.

**Decision 5: Inline sub-component inside `RichBubble.tsx`**
Keeps all rich renderer sub-components co-located (same pattern as `TimelineCard`, `ContactRow`). No new file needed.

## Risks / Trade-offs

- [Many badges wrap onto many lines on small screens] → Mitigation: `flex-wrap` on the badge container; test at 390px
- [Pill color alternation may look busy] → Mitigation: keep pill background at ~10% opacity tint, only border/text carries the accent
- [wiki/me.md data could drift from constants] → Mitigation: source `TECH_STACK_CATEGORIES` directly from `wiki/me.md` content at implementation time; note in code comment

## Open Questions

- None — data, design tokens, and pattern are all established.
