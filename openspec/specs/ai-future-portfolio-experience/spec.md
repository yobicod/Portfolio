## ADDED Requirements

### Requirement: Unified AI-Future Design Token System

The system SHALL provide a single design token system for the homepage experience, including background, surface, text, accent, spacing, typography, and motion tokens that are consistently reused by hero, chat, and ambient layers.

#### Scenario: Tokens are the canonical source of style values

- **WHEN** a visual style is applied to homepage components
- **THEN** the style value MUST be sourced from the shared token system rather than ad hoc component-local constants

#### Scenario: Tokens support responsive readability

- **WHEN** the homepage is rendered on small and large viewports
- **THEN** typography and spacing tokens MUST preserve legibility and interaction clarity at each breakpoint

### Requirement: Cohesive AI Interface Visual Language

The homepage SHALL present a coherent future/AI visual identity across hero content, conversational UI, and background layers.

#### Scenario: Hero and chat use shared visual language

- **WHEN** users view the homepage
- **THEN** hero links, call-to-action elements, chat surfaces, and message states MUST use a consistent palette, typography hierarchy, and elevation model

#### Scenario: Ambient effects support instead of overpowering content

- **WHEN** background and cursor effects are active
- **THEN** foreground content MUST remain visually dominant and text/content readability MUST not be reduced

### Requirement: Motion Hierarchy and Performance Safety

The system SHALL define a motion hierarchy that separates ambient, entry, and interaction feedback animations with bounded intensity.

#### Scenario: Motion hierarchy is predictable

- **WHEN** the page loads and users interact with components
- **THEN** ambient motion MUST run continuously at low prominence, entry motion MUST complete promptly, and interaction motion MUST provide immediate feedback

#### Scenario: Performance-safe fallback behavior

- **WHEN** rendering conditions are constrained by device capability or viewport constraints
- **THEN** motion intensity and effect density MUST degrade gracefully without breaking layout or interaction

### Requirement: Brand-Consistent Responsive Experience

The homepage SHALL retain its AI-forward brand identity across desktop and mobile. On desktop (md+), the hero occupies the left column of a two-column layout; the hero card wrapper (ai-panel) is removed in the desktop view so the left column breathes without double-bordered glass surfaces. On mobile, the hero collapses to a compact strip. The layout SHALL NOT introduce horizontal overflow or inaccessible controls at any viewport size.

#### Scenario: Primary interaction remains accessible on mobile

- **WHEN** users access the homepage on mobile viewport sizes
- **THEN** the compact hero strip and chat panel MUST remain fully visible, tappable, and visually coherent without overlap conflicts

#### Scenario: Desktop maintains premium presentation

- **WHEN** users access the homepage on desktop viewport sizes
- **THEN** the two-column layout, left sticky hero, and right chat panel MUST communicate a premium AI-focused aesthetic with a single, dominant glass surface (the chat panel)

#### Scenario: Hero card wrapper absent on desktop

- **WHEN** the viewport is md or wider
- **THEN** the hero content SHALL render without the ai-panel glass card border, presenting directly against the grid background
