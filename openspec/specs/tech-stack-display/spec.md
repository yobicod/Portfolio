## ADDED Requirements

### Requirement: Tech Stack Categorized Data Model

The system SHALL support a `TechItem` data type (`{ name: string; icon?: string }`) and a `TechCategory` data type (`{ label: string; items: TechItem[] }`), replacing the previous `items: string[]` shape. The `TechStackMessage` discriminated-union variant (`type: "tech-stack"`, `entries: TechCategory[]`) is part of the `RichMessage` union in `src/types/chat.types.ts`.

#### Scenario: Tech stack message carries categorized entries with icon data

- **WHEN** the bot responds to a Tech stack query
- **THEN** the response MUST be a `TechStackMessage` containing an array of `TechCategory` objects, each with a `label` string and an `items` array of `TechItem` objects (`{ name: string; icon?: string }`)

#### Scenario: All seven categories are present

- **WHEN** the `TECH_STACK_CATEGORIES` constant is used
- **THEN** it MUST contain exactly these category labels: Languages, Frontend, Backend, Data & AI, Databases, Infrastructure & DevOps, Tools — matching the data in `wiki/me.md`

### Requirement: Tech Stack Visual Renderer

The system SHALL render `tech-stack` type messages as a vertical list of labeled category sections. Each section MUST display its label as a heading and its items as pill-style badge elements. Each badge MUST display an inline SVG icon to the left of the technology name when an icon is available. Badges without an icon MUST render the name only, with no visual regression. The renderer MUST NOT use character-by-character typing animation.

#### Scenario: Category labels are displayed as section headings

- **WHEN** a `TechStackMessage` is rendered in the chat
- **THEN** each `TechCategory.label` MUST appear as a distinct visible heading above its badge group

#### Scenario: Technology items render as pill badges with icons

- **WHEN** a `TechStackMessage` is rendered in the chat and a `TechItem` has an `icon` value
- **THEN** the badge MUST display a 12×12px inline SVG icon to the left of the name, tinted to match the badge accent colour via `fill="currentColor"`

#### Scenario: Technology items without icons render as text-only badges

- **WHEN** a `TechStackMessage` is rendered in the chat and a `TechItem` has no `icon` value
- **THEN** the badge MUST render the `name` only, with the same pill shape and accent colour as icon-bearing badges

#### Scenario: Badges wrap on narrow viewports

- **WHEN** the chat is viewed at 390px viewport width or narrower
- **THEN** pill badges MUST wrap onto multiple lines and MUST NOT cause horizontal overflow; icons MUST NOT be squished

#### Scenario: Tech stack renders instantly without typing animation

- **WHEN** a `TechStackMessage` arrives in the message list
- **THEN** all category sections and badges MUST be visible immediately without a typing interval delay

### Requirement: Tech Stack Bot Response

The system SHALL return a `TechStackMessage` (not a plain string) when the bot receives the "Tech stack" topic query.

#### Scenario: Tech stack quick reply returns rich message

- **WHEN** the user selects the "Tech stack" quick reply
- **THEN** `bot.service.ts` MUST return a `TechStackMessage` object, not the placeholder string "Tech stack information, Coming soon…"
