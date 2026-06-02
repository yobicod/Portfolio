## Why

The portfolio currently presents as a bio card with a chat widget bolted on the side — the chat is the most differentiated feature but lives in a cramped, disconnected secondary position. Quick reply chips float in visual no-man's-land between the hero and the chatbox, the chat scroll area is a fixed 256 px (too small for rich timeline and tech-stack responses), and a first-time visitor has no guidance that the chat is interactive. The layout needs to be reorganised so the chat is co-equal with the hero introduction.

## What Changes

- **Side-by-side layout on desktop (md+):** Hero panel on the left (sticky, ~38% width), chat panel on the right (~60% width), both filling the full viewport height.
- **Compact mobile hero:** Name, role tags, and links collapse into a single horizontal row above the chat on small screens.
- **Quick replies move inside the chat panel:** Pinned as "Suggested" chips directly above the input bar; horizontally scrollable on mobile.
- **Chat height becomes flex-1:** Fills all remaining vertical space instead of a fixed `h-64`/`h-72`, giving rich messages (timeline, tech-stack) room to breathe.
- **Typing indicator becomes an inline dot-bubble:** A three-dot animated bubble inside the message list replaces the approach of swapping out the TextField entirely, eliminating layout shift.
- **Chat header bar added:** Shows bot identity ("Visal's Bot") and a labeled "New chat" button that replaces the hidden icon-only refresh button.
- **Greeting message updated:** Changed to invite interaction — *"Hey! Ask me about my experience, tech stack, or projects 👋"*
- **Celebrate easter egg:** The confetti/audio trigger moves from a prominent hero button to a hidden chat command — typing "celebrate" or "congrats" triggers it.

## Capabilities

### New Capabilities

- `portfolio-layout`: Side-by-side desktop layout with compact mobile hero; overall page composition and responsive breakpoint behaviour.
- `chat-interface`: Chat panel with flex-height message area, inline dot-bubble typing indicator, header bar with identity + labeled refresh, and suggested chips pinned inside the panel.

### Modified Capabilities

- `ai-future-portfolio-experience`: Visual composition of the hero section changes (size, position, content order) as part of the layout overhaul.

## Impact

- `src/app/page.tsx` — layout restructure (side-by-side grid)
- `src/components/Hero.tsx` — compact/vertical variant; remove celebrate button
- `src/components/Chatbox.tsx` — flex-height, header bar, inline typing bubble, chips relocated inside, easter-egg celebrate trigger
- `src/app/globals.css` — any new utility classes needed for the new layout
- No new dependencies required; no API or data changes
