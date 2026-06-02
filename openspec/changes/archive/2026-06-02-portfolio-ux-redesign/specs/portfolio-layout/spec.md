## ADDED Requirements

### Requirement: Two-column desktop layout
On desktop viewports (md and above), the page SHALL render in a two-column CSS Grid layout with the hero panel in the left column (~38% width, sticky, full viewport height) and the chat panel in the right column (~60% width, full viewport height with independent scroll).

#### Scenario: Desktop renders side-by-side
- **WHEN** the viewport width is 768 px or wider
- **THEN** the hero column and chat column SHALL appear side-by-side, each filling the full viewport height without page-level vertical scroll

#### Scenario: Left column is sticky
- **WHEN** the chat panel content extends beyond the viewport height on desktop
- **THEN** the hero column SHALL remain fixed in place while the chat panel scrolls independently

### Requirement: Compact mobile hero strip
On mobile viewports (below md), the hero SHALL collapse into a compact horizontal strip containing a small avatar, name, role tag, and links in a single row, occupying minimal vertical space above the chat panel.

#### Scenario: Mobile hero is compact
- **WHEN** the viewport width is below 768 px
- **THEN** the hero SHALL render as a horizontal strip with avatar ≤ 48 px, name inline, and links in a row — taking no more than ~80 px of vertical space

#### Scenario: Chat fills remaining mobile viewport
- **WHEN** the mobile hero strip is rendered
- **THEN** the chat panel SHALL occupy all remaining vertical space below the hero strip

### Requirement: No horizontal overflow
The layout SHALL NOT introduce horizontal scrollbars or clipped content at any viewport width.

#### Scenario: No overflow on any device
- **WHEN** the page is rendered on any viewport from 320 px to 2560 px wide
- **THEN** no element SHALL overflow the horizontal viewport boundary
