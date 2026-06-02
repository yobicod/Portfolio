## Why

Bot responses in the portfolio chatbot are rendered as plain text bubbles — dense multi-line strings typed out character by character — making structured information like career history nearly impossible to scan. Adding rich message types lets the bot surface timeline, list, and contact data as visually structured components that are immediately readable.

## What Changes

- Introduce a `RichMessage` content model alongside the existing plain-text `Message` type, supporting `type` variants: `"text"`, `"timeline"`, `"list"`, `"contact"`
- Add structured data constants for Experience (timeline entries with date, role, company, bullets) and Contact topics
- Update `bot.service.ts` to return typed `RichBotResponse` objects for structured topics (Experience, Contact) while keeping plain text for others
- Render `timeline` messages as visual stacked cards with date badge, role/company header, and bullet points — no character-by-character typing for rich content
- Render `list` messages as spaced rows with icon prefix (used for Contact)
- Keep all existing quick-reply, chat logic, and plain-text bubble behavior unchanged

## Capabilities

### New Capabilities
- `rich-message-display`: Structured message content type system and visual rendering components inside the chatbot — covers the `RichMessage` type model, rich bubble renderer, and timeline/list/contact card layouts

### Modified Capabilities
<!-- No existing spec-level requirements change — this adds new rendering capability without modifying any specified behavior -->

## Impact

- `src/types/chat.types.ts` — add `RichMessage`, `TimelineEntry`, `ContactEntry`, `RichBotResponse` types
- `src/constants/answer.ts` — add structured `EXPERIENCE_TIMELINE` and `CONTACT_ITEMS` data objects
- `src/services/bot.service.ts` — update `handleBotAnswer` to return `RichBotResponse` for Experience and Contact topics
- `src/components/Chatbox.tsx` — update message state, `processBotReply`, and message rendering to handle rich content; no logic changes to input/send/quick-reply
- No new dependencies required (uses existing MUI + Tailwind token system)
