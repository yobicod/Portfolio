## MODIFIED Requirements

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
