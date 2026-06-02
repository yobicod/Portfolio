## 1. Type System

- [x] 1.1 Add `TimelineEntry` and `ContactEntry` interfaces to `src/types/chat.types.ts`
- [x] 1.2 Add `TimelineMessage`, `ContactMessage`, and `PlainMessage` discriminated union types
- [x] 1.3 Export `RichMessage` union type and update `BotResponse` to `RichBotResponse = RichMessage | string | string[]`

## 2. Structured Data Constants

- [x] 2.1 Add `EXPERIENCE_TIMELINE: TimelineEntry[]` to `src/constants/answer.ts` using the existing `EXPERIENCE_LIST` data, split into structured fields (`dateRange`, `role`, `company`, `bullets`)
- [x] 2.2 Add `CONTACT_ITEMS: ContactEntry[]` to `src/constants/answer.ts` using the existing `CONTACT_LIST` data, split into `icon` and `value` fields

## 3. Bot Service Update

- [x] 3.1 Update `bot.service.ts` to import `RichBotResponse`, `EXPERIENCE_TIMELINE`, and `CONTACT_ITEMS`
- [x] 3.2 Return a `TimelineMessage` object for the `"Experience"` topic key
- [x] 3.3 Return a `ContactMessage` object for the `"Contact"` topic key
- [x] 3.4 Ensure all other topics continue to return `string | string[]` unchanged

## 4. Rich Bubble Renderer

- [x] 4.1 Create `src/components/RichBubble.tsx` with a `TimelineCard` sub-component rendering `dateRange` badge, `role`/`company` header, and `bullets` list using existing CSS token classes
- [x] 4.2 Add `ContactRow` sub-component inside `RichBubble.tsx` rendering `icon` and `value` side by side
- [x] 4.3 Export a `RichBubble` component that accepts a `RichMessage` prop and delegates to the correct layout based on `type`
- [x] 4.4 Validate no horizontal overflow on 390px viewport for timeline cards and contact rows

## 5. Chatbox Integration

- [x] 5.1 Update `Message` state in `Chatbox.tsx` to use `RichMessage | PlainMessage` union
- [x] 5.2 Update `processBotReply` to detect `RichMessage` responses (by `type` discriminant) and push them directly to state without character-by-character typing
- [x] 5.3 Update the message render loop to use `RichBubble` for rich messages and existing plain bubble JSX for text messages
- [x] 5.4 Confirm input, send, quick-reply chips, and refresh button behavior is unchanged after integration

## 6. Quality Validation

- [x] 6.1 Verify Experience quick reply renders a timeline with all job entries (4 cards)
- [x] 6.2 Verify Contact quick reply renders contact rows with icon + value
- [x] 6.3 Verify About me, Project, Tech stack quick replies still render as plain text with typing animation
- [x] 6.4 Run `npm run lint` with no warnings or errors
- [x] 6.5 Run `npm run build` successfully
