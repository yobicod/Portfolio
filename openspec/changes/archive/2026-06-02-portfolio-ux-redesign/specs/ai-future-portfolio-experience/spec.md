## MODIFIED Requirements

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
