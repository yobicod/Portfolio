## 1. Types & Data Layer

- [x] 1.1 Add `"typing"` to the `RichMessage` union type in `src/types/chat.types.ts`
- [x] 1.2 Add celebrate keyword detection to `botService.answer()` — return a special `{ type: "celebrate" }` rich message when input contains "celebrate" or "congrats" (case-insensitive)
- [x] 1.3 Update `GREETING_MESSAGE` in `src/constants/answer.ts` to `"Hey! Ask me about my experience, tech stack, or projects 👋"`

## 2. Page Layout (page.tsx)

- [x] 2.1 Replace the centered flex-column wrapper with a CSS Grid: single column on mobile, `grid-cols-[38%_60%]` with `gap-x` at `md+`
- [x] 2.2 Make the left grid cell `sticky top-0 h-screen flex items-center` on desktop, full-width stacked on mobile
- [x] 2.3 Make the right grid cell `h-screen flex flex-col` on desktop, `flex-1` on mobile
- [x] 2.4 Remove the `<Stack>` of quick-reply chips from `page.tsx` (they move into Chatbox)

## 3. Hero Component (Hero.tsx)

- [x] 3.1 Add a responsive variant: on mobile render a compact horizontal strip (small avatar + name + links in a row)
- [x] 3.2 On desktop, remove the `ai-panel` glass card wrapper — hero content renders directly in the left column
- [x] 3.3 Remove the celebrate button (`🥳 Celebrate on my promotion 🎉`) from the hero entirely
- [x] 3.4 Keep the floating avatar animation on desktop but reduce avatar size slightly for the left column proportions

## 4. Chatbox Component (Chatbox.tsx)

- [x] 4.1 Add a chat header bar at the top of the panel: "● Visal's Bot" label on the left, "New chat" labeled button on the right
- [x] 4.2 Replace `h-64 / h-72` fixed heights on the message scroll area with `flex-1 min-h-[200px] overflow-y-auto`
- [x] 4.3 Move quick-reply chips inside Chatbox, pinned between the message list and input — single horizontal scroll row (`overflow-x-auto flex-nowrap`) on mobile, wrap on desktop
- [x] 4.4 Remove the floating MUI `IconButton` refresh (replaced by header's "New chat" button)
- [x] 4.5 Replace the typing-indicator logic: instead of swapping `<TextField>` for a `<div>`, push a `{ role: "bot", type: "typing" }` message into the list when typing starts and remove it when the response arrives; keep `<TextField>` mounted and disabled
- [x] 4.6 Handle the `"celebrate"` rich message type: when received, trigger the celebrate effect and play audio (wire up existing `Celebrate` component + audio logic)
- [x] 4.7 Handle the `"typing"` message type in the render loop — display a dot-pulse animation bubble

## 5. RichBubble Component (RichBubble.tsx)

- [x] 5.1 Add a `"typing"` branch that renders a three-dot pulse animation (CSS keyframe or Framer Motion) inside the standard bot bubble container
- [x] 5.2 Ensure existing `timeline`, `tech-stack`, and `contact` rich types are unaffected

## 6. Styles (globals.css / Tailwind)

- [x] 6.1 Add `.dot-pulse` keyframe animation for the three-dot typing indicator if not using Framer Motion
- [x] 6.2 Add any new utility classes required by the chat header bar
- [x] 6.3 Verify no horizontal overflow is introduced at 320 px viewport width

## 7. QA & Polish

- [ ] 7.1 Test desktop layout (md+): hero sticky, chat scrolls independently, no page-level scroll
- [ ] 7.2 Test mobile layout: compact hero strip renders, chat fills remaining viewport
- [ ] 7.3 Test celebrate easter egg: typing "celebrate" in chat triggers confetti + audio
- [ ] 7.4 Test typing indicator: dot-bubble appears and disappears without layout shift
- [ ] 7.5 Test "New chat" button: resets conversation to updated greeting message
- [ ] 7.6 Test quick replies: chips trigger correct bot responses from new position inside chat panel
- [ ] 7.7 Test rich messages (timeline, tech-stack) in the new flex-1 scroll area — confirm no excessive inner scrolling
