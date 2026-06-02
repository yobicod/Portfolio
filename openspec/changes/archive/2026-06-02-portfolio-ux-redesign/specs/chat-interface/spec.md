## ADDED Requirements

### Requirement: Chat panel fills available vertical space
The message scroll area SHALL use `flex-1` sizing so it expands to fill all vertical space not consumed by the chat header, quick replies, and input bar — rather than a fixed pixel height.

#### Scenario: Long responses do not over-scroll a tiny box
- **WHEN** the bot returns a timeline with 4 entries or a tech-stack with 7 categories
- **THEN** the message area SHALL display all content within the available panel height, with smooth scrolling if content exceeds that height

#### Scenario: Minimum height on very small screens
- **WHEN** the viewport is in landscape mobile orientation
- **THEN** the message area SHALL have a minimum height of 200 px to remain usable

### Requirement: Chat header with identity and labeled refresh
The chat panel SHALL include a header bar that displays a bot identity label ("Visal's Bot") with a status indicator, and a labeled "New chat" button that resets the conversation.

#### Scenario: Header is always visible
- **WHEN** the chat panel is rendered
- **THEN** the header bar SHALL be pinned at the top of the panel and SHALL NOT scroll with messages

#### Scenario: New chat button is discoverable
- **WHEN** a user wants to reset the conversation
- **THEN** the "New chat" button in the header SHALL be visible with a text label (not icon-only) and SHALL reset messages to the initial greeting on click

### Requirement: Quick replies pinned inside chat panel
The quick-reply suggestion chips SHALL be rendered inside the chat panel, between the message list and the input bar, rather than outside the panel in the page layout.

#### Scenario: Chips are contextually placed
- **WHEN** the chat panel renders
- **THEN** quick-reply chips SHALL appear directly above the text input, making their function (send a message) visually obvious

#### Scenario: Horizontal scroll on mobile
- **WHEN** the viewport is below md breakpoint
- **THEN** quick-reply chips SHALL render in a single horizontal scrollable row without wrapping, preventing them from taking up multiple lines of vertical space

### Requirement: Inline typing indicator bubble
While the bot is generating a response, the system SHALL display an animated three-dot bubble as a bot message in the message list. The text input SHALL remain mounted and disabled (not replaced) during this state.

#### Scenario: No layout shift during typing
- **WHEN** the bot begins typing
- **THEN** the text input field SHALL remain in place (disabled), and a dot-pulse animation bubble SHALL appear in the message list as the bot's pending response

#### Scenario: Typing bubble is removed on response
- **WHEN** the bot response is ready
- **THEN** the typing bubble SHALL be replaced by the actual bot message with no visible jump or layout shift

### Requirement: Inviting greeting message
The initial bot message SHALL invite the user to interact by describing what they can ask about, rather than only greeting them.

#### Scenario: First-time visitor understands what to do
- **WHEN** the page first loads
- **THEN** the bot's opening message SHALL include a prompt such as "Ask me about my experience, tech stack, or projects" to guide interaction

### Requirement: Celebrate easter egg via chat
The confetti/audio celebration feature SHALL be triggered only when the user types a message containing "celebrate" or "congrats" (case-insensitive) in the chat input. The feature SHALL NOT be exposed as a button in the hero section.

#### Scenario: Easter egg triggers on keyword
- **WHEN** the user sends a message containing "celebrate" or "congrats"
- **THEN** the celebration effect (confetti + audio) SHALL activate and the bot SHALL respond with a celebratory message

#### Scenario: No celebrate button in hero
- **WHEN** the hero section is rendered
- **THEN** no celebrate button SHALL be present in the hero panel
