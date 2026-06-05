---
name: portfolio-aesthetic
description: Use when upgrading this Visal Suwanarat Next.js portfolio UI, especially visual polish, responsive layout, Tailwind styling, chat portfolio interactions, dark theme balance, and aesthetic consistency.
metadata:
  short-description: Polish Visal's interactive portfolio UI
---

# Portfolio Aesthetic

Use this skill for visual upgrades to this portfolio.

## Workflow

1. Preserve the chat-first identity. The bot, avatar reactions, quick replies, and rich bubbles are the main product surface.
2. Keep the page immediately useful. First viewport should show Visal, role, primary links, and the interactive chat without a marketing-style landing page.
3. Prefer high-impact polish in existing files before adding new dependencies:
   - `src/app/globals.css` for palette, surface tokens, scrollbars, and shared utilities.
   - `src/app/page.tsx` for responsive shell and spacing.
   - `src/components/Hero.tsx` for personal signal, links, status, and avatar framing.
   - `src/components/Chatbox.tsx` and `src/components/RichBubble.tsx` for chat density and visual hierarchy.
4. Use a balanced dark palette. Avoid making the UI only cyan/blue; add restrained warm or green accents where useful.
5. Keep component corners disciplined: panels around 20-24px, cards/bubbles around 14-18px, controls around 12-14px.
6. Do not add explanatory help text about how the UI works. Let labels and controls be self-evident.
7. Validate with `npm run build` or the closest available check, then run the dev server and inspect the app visually when frontend layout changes are made.

## Design Checks

- Mobile header is compact and does not crowd the chat.
- Desktop hero feels intentional, not like an isolated card next to a card.
- Text has enough contrast against glass surfaces.
- Quick replies fit without layout shift and remain tappable.
- Chat bubbles have clear role contrast.
- Background texture supports the content and does not dominate it.
