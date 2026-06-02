## Context

The portfolio is a single Next.js page (`src/app/page.tsx`) that stacks `<Hero>` above `<Chatbox>` in a centered flex column. The hero occupies the top half with a floating avatar, name, links, a type-animation role description, and a "Celebrate" button. The chatbox sits below with quick-reply chips floating between the two panels, a fixed-height (256 px / 288 px) scroll area, and an MUI `IconButton` for refresh that is nearly invisible. The WebGL cursor effect (`CursorBox`) is a full-page overlay at z-10.

## Goals / Non-Goals

**Goals:**
- Reorganise the page into a two-column desktop layout where hero and chat share the viewport equally
- Give the chat panel unlimited vertical space via `flex-1` so rich messages render without excessive scrolling
- Move quick-reply chips inside the chat panel, above the input
- Replace the invisible refresh icon with a labeled "New chat" button in a chat header
- Replace the TextField-swap typing indicator with an inline dot-bubble message
- Update the greeting to be inviting rather than just a greeting
- Hide the Celebrate feature behind an easter-egg chat trigger
- Keep the existing dark cyber-blue design system, MUI components, Framer Motion, and all rich message types untouched

**Non-Goals:**
- Adding new pages or routes
- Changing the bot logic or answer content
- Replacing MUI globally — only the problematic typing-indicator div gets replaced
- Adding new npm dependencies
- Changing fonts, colour tokens, or the cursor WebGL effect

## Decisions

### D1 — CSS Grid for the two-column layout
**Decision:** Use CSS Grid on `page.tsx` (`grid-cols-[38%_60%]` at `md`) rather than Flexbox side-by-side.  
**Why:** Grid allows the left column to be `sticky top-0 h-screen` naturally while the right column scrolls independently, which is the behaviour we want for the hero staying put while chat grows.  
**Alternative considered:** Flex row with `overflow-auto` on right — rejected because sticky positioning inside flex rows is less reliable across browsers.

### D2 — Hero becomes a vertical side panel, not a card
**Decision:** On desktop, the Hero loses the `ai-panel` glass card wrapper and becomes a bare left column with padding. On mobile it collapses to a compact horizontal strip (avatar small, name + links inline).  
**Why:** The card-within-card nesting (`ai-panel` hero inside `ai-panel` page) adds visual noise. On desktop, letting the left column breathe without a border feels lighter.  
**Alternative:** Keep the card on desktop — rejected because two bordered glass cards side-by-side creates visual competition.

### D3 — Chat height via flex-1, not fixed h-64
**Decision:** The message scroll area gets `flex-1 min-h-0` inside a flex column, so it expands to fill whatever space the chat panel offers.  
**Why:** Fixed `h-64` (256 px) forces users to scroll within a tiny area when reading 4-entry timelines or 7-category tech stacks. `flex-1` means the content dictates the scroll, not an arbitrary pixel value.  
**Constraint:** The chat panel must have a defined height for `flex-1` to work — achieved by making the right grid column `h-screen` with `flex flex-col`.

### D4 — Typing indicator as inline dot-bubble, not TextField replacement
**Decision:** Remove the conditional that swaps `<TextField>` for a `<div>` during typing. Instead, push a `{ role: "bot", type: "typing" }` message object into the messages array and render a dot-pulse animation bubble for it. Remove it when the real response arrives.  
**Why:** Swapping the input element causes layout shift and is semantically confusing. An inline bubble is the standard chat UX pattern and requires no element swap.  
**Implementation note:** Add `"typing"` to the `RichMessage` union type and handle it in `RichBubble` (or inline in Chatbox). The `TextField` stays mounted and disabled during typing.

### D5 — Celebrate becomes a chat easter egg
**Decision:** Remove the celebrate button from Hero. Add keyword detection in `botService.answer()` — if the message contains "celebrate" or "congrats" (case-insensitive), trigger the celebrate callback.  
**Why:** The button is prominent but confusing to first-time visitors who don't know about the promotion. Hidden behind a chat command it rewards curiosity and keeps the hero cleaner.  
**Implementation:** Pass an `onCelebrate` callback from Chatbox up is already the wrong direction — instead, export a `celebrateEmitter` (a simple event emitter or a context method) that `botService` can call, or more simply, return a special `{ type: "celebrate" }` rich message type that `Chatbox` handles by calling the celebrate trigger.

### D6 — Quick replies pin inside chat, above input
**Decision:** Move the `<Stack>` of chips from between Hero and Chatbox (in `page.tsx`) into the bottom of the chat panel, sandwiched between the message list and the input form.  
**Why:** Chips trigger bot responses — they belong spatially to the input, not to page navigation. Proximity to the input makes their purpose self-evident.  
**Mobile:** Single horizontal row with `overflow-x-auto` and `flex-nowrap`, no wrapping.

## Risks / Trade-offs

- **[Risk] `flex-1` chat height may be too tall on very short screens (landscape mobile)** → Mitigation: Set a `min-h-[200px]` on the message area and allow the chat panel to scroll on very small viewports rather than squash content.
- **[Risk] Sticky hero column may feel odd on tablets (md breakpoint)** → Mitigation: The `md` breakpoint (768 px) is a reasonable split; the hero content is concise enough to fit at that width. We can tweak the breakpoint to `lg` if needed during implementation.
- **[Risk] Celebrate easter egg is harder to discover** → This is intentional — the hero gains cleaner visual hierarchy. The trade-off is acceptable.
- **[Risk] Adding `"typing"` to the message union type is a minor type-system touch** → Low risk; the change is additive and the existing `RichBubble` switch can handle a new branch cleanly.

## Open Questions

- Should the hero avatar still float/animate on desktop when it's in the left column, or should the animation be toned down since it's always visible?
- On the chat header, should "Visal's Bot" include the avatar image (tiny), or just a status dot + text?
