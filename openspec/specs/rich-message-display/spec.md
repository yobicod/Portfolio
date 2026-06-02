## ADDED Requirements

### Requirement: Rich Message Content Type System

The system SHALL support a typed message content model (`RichMessage`) that extends plain-text messages with structured variants: `timeline`, `list`, `contact`, and `tech-stack`. Each variant carries typed data instead of a raw string.

#### Scenario: Timeline messages carry structured entry data

- **WHEN** the bot responds to an Experience query
- **THEN** the response MUST be a `TimelineMessage` containing an array of `TimelineEntry` objects, each with `dateRange`, `role`, `company`, and `bullets` fields

#### Scenario: Contact messages carry structured row data

- **WHEN** the bot responds to a Contact query
- **THEN** the response MUST be a `ContactMessage` containing an array of `ContactEntry` objects, each with `icon` and `value` fields

#### Scenario: Tech stack messages carry categorized badge data

- **WHEN** the bot responds to a Tech stack query
- **THEN** the response MUST be a `TechStackMessage` containing an array of `TechCategory` objects, each with `label` and `items` fields

#### Scenario: Prose topics remain plain text

- **WHEN** the bot responds to About me, Project, or unknown queries
- **THEN** the response MUST remain a plain string (or array of strings) and follow the existing plain-text typing animation path

### Requirement: Timeline Visual Renderer

The system SHALL render `timeline` type messages as a vertically stacked set of visual cards. Each card MUST display the date range as a badge, the role and company as a header, and the bullet points as an indented list. Cards MUST NOT use character-by-character typing animation.

#### Scenario: Timeline cards display all entry fields

- **WHEN** a `TimelineMessage` is rendered in the chat
- **THEN** each `TimelineEntry` MUST appear as a distinct card showing `dateRange`, `role`, `company`, and all `bullets`

#### Scenario: Timeline renders instantly without typing animation

- **WHEN** a `TimelineMessage` arrives in the message list
- **THEN** all cards MUST be visible immediately without a typing interval delay

#### Scenario: Timeline cards are readable on mobile

- **WHEN** the chat is viewed at a viewport width of 390px or narrower
- **THEN** timeline cards MUST not overflow horizontally and all text MUST remain legible

### Requirement: List / Contact Visual Renderer

The system SHALL render `contact` type messages as a spaced vertical list of rows. Each row MUST display an icon and a value string. Rows MUST appear instantly without typing animation.

#### Scenario: Contact items display icon and value

- **WHEN** a `ContactMessage` is rendered in the chat
- **THEN** each `ContactEntry` MUST appear as a row with its `icon` and `value` side by side

#### Scenario: Contact rows are readable at all viewport sizes

- **WHEN** the chat is viewed at any supported viewport
- **THEN** contact rows MUST remain fully visible without horizontal overflow

### Requirement: Backward-Compatible Plain Text Bubble

The system SHALL preserve all existing plain-text bubble behavior. Messages with `type: "text"` or legacy string messages MUST continue to use the character-by-character typing animation and existing bubble style.

#### Scenario: Existing plain text messages are unaffected

- **WHEN** the bot responds with a plain string (About me, Project, Tech stack, default)
- **THEN** the message MUST render in the existing text bubble with typing animation, exactly as before

#### Scenario: Chat input, send, quick reply, and refresh are unaffected

- **WHEN** a rich message is present in the conversation
- **THEN** all interaction controls (input field, send button, quick-reply chips, refresh button) MUST function identically to their current behavior
