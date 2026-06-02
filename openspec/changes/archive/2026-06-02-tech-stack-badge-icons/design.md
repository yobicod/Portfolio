## Context

Tech stack badges currently render plain monospace text names inside coloured pill shapes. The `TechCategory` type uses `items: string[]`. This change upgrades each item to `{ name: string; icon?: string }` to carry an optional SVG icon alongside the label, sourced from the `simple-icons` npm package (MIT, 3000+ brands).

The renderer (`TechStackSection` in `RichBubble.tsx`) needs a small icon element inserted to the left of the label inside each badge. Icon colour must match the badge accent without a separate colour map.

## Goals / Non-Goals

**Goals:**

- Define `TechItem = { name: string; icon?: string }` and update `TechCategory.items` to `TechItem[]`
- Source per-technology SVG path data from `simple-icons` at build time; store as inline SVG strings in `TECH_STACK_CATEGORIES`
- Render a 12×12px inline SVG icon in each badge, tinted to match the badge accent via CSS `currentColor`
- Badges without an icon (optional field) degrade gracefully — name only, no broken image

**Non-Goals:**

- Animated icons or hover effects
- Dynamic icon fetching at runtime (icons are embedded at build time)
- Icon support for non-tech-stack message types (Timeline, Contact)

## Decisions

**Decision 1: `simple-icons` for SVG data, not CDN `<img>` tags**
`simple-icons` provides typed, versioned SVG path data (`si.svg` property) for each brand. Inlining the SVG path removes network requests, eliminates CORS issues, and allows `currentColor` tinting. CDN img tags can't be tinted to match the brand/signal palette.

**Decision 2: Store icon SVG path string in `TechItem.icon`, not component-level import**
Keeping icon data in the constant (`answer.ts`) keeps `RichBubble.tsx` a pure renderer with no icon library coupling. The constant is the only place that knows about `simple-icons`.

**Decision 3: `icon?: string` is optional (not required)**
A handful of niche tools (e.g., Bulma, Hono, Fiber, Pydantic AI) may not have `simple-icons` entries. Making it optional means the badge degrades to text-only rather than breaking. A `?? null` guard in the renderer handles the absent case.

**Decision 4: Tint via `fill="currentColor"` + inherit from parent `color` style**
The parent badge `<span>` already has `text-[var(--color-brand)]` or `text-[var(--color-signal)]`. An inline `<svg fill="currentColor">` picks up that colour automatically — no additional style prop needed.

**Decision 5: Icon size 12×12px (`w-3 h-3`), `shrink-0` to prevent squish on wrap**
At `text-[11px]` badge size, 12px icons sit at cap-height. `shrink-0` prevents the icon from being squished when badges wrap on narrow viewports.

## Risks / Trade-offs

- [simple-icons version drift] → Mitigation: pin `simple-icons` in `package.json` devDependencies; icon data is extracted at constant-definition time, not at runtime
- [Missing icons for some tools] → Mitigation: `icon?` optional field; renderer renders name-only badge with no visual regression
- [SVG path strings in constants file make it verbose] → Mitigation: accept the verbosity — it's a one-time authoring cost and keeps the renderer clean
- [Icon colour may be hard to read at low opacity] → Mitigation: icons use `currentColor` which matches the badge text colour — same readability guarantee as the text

## Open Questions

- None — icon sourcing strategy, tinting approach, and fallback behaviour are all resolved.
