## Context

The current portfolio homepage already has an interactive architecture (hero, chat-first interaction, and animated cursor background), but visual styling is inconsistent across typography, color accents, and surface treatments. The change introduces a unified AI-forward aesthetic while preserving existing interaction behavior. Constraints include maintaining usability across desktop/mobile and avoiding regressions in chat interaction clarity.

## Goals / Non-Goals

**Goals:**
- Establish one coherent design token system for color, typography, spacing, depth, and motion.
- Align hero, chat, and background layers under a single future/AI visual language.
- Preserve existing core interaction model while improving visual hierarchy and perceived product quality.
- Ensure responsive behavior keeps readability and interaction quality on small screens.

**Non-Goals:**
- Rewriting conversational logic or bot response behavior.
- Introducing new backend services or API changes.
- Expanding to new pages/routes beyond the homepage scope.

## Decisions

1. Token-first theming approach
- Decision: Define a canonical token layer (global CSS variables plus Tailwind mappings) as the source of truth for the new aesthetic.
- Rationale: Reduces style drift and makes iterative visual refinement safer.
- Alternative considered: Component-local style overrides; rejected because it perpetuates inconsistency.

2. AI-console composition over generic portfolio layout
- Decision: Keep the current one-page structure but style the central experience as an intentional AI interface (identity block + conversational console + ambient layer).
- Rationale: Builds on existing strengths without structural churn.
- Alternative considered: Full layout rewrite with multiple sections; rejected for higher risk and lower short-term clarity.

3. Motion grammar with clear hierarchy
- Decision: Use layered motion classes (ambient background motion, entry transitions, interactive hover/tap feedback) with reduced intensity defaults on mobile.
- Rationale: Preserves futuristic feel without harming usability or performance.
- Alternative considered: Highly animated components everywhere; rejected due to distraction and performance risk.

4. Responsive-first visual constraints
- Decision: Define explicit breakpoints for typography scale, panel density, spacing rhythm, and chat width to maintain legibility.
- Rationale: Aesthetic quality should not collapse on smaller devices.
- Alternative considered: Desktop-first styling with ad hoc mobile fixes; rejected for maintainability concerns.

## Risks / Trade-offs

- [Risk] Visual ambition can reduce readability or contrast in key interaction zones -> Mitigation: Define contrast thresholds and test critical states (input, CTA, message bubbles) against accessibility goals.
- [Risk] Extra motion and effects may degrade performance on low-power devices -> Mitigation: Limit simultaneous animations, tune effect intensity, and provide low-intensity fallbacks.
- [Risk] Theme changes may conflict with existing component libraries/styles -> Mitigation: Isolate token mappings and validate component-level overrides in a small integration pass.
- [Risk] Scope creep from aesthetic work into feature work -> Mitigation: Keep change strictly visual/systemic and defer behavior changes to separate proposals.

## Migration Plan

1. Introduce and validate the token layer without changing behavior.
2. Apply tokens and new visual language to global layout and hero.
3. Restyle chat surfaces and interaction states to match the chosen theme.
4. Tune ambient background/cursor and animation intensity for responsiveness and performance.
5. Verify desktop/mobile quality and regressions before finalizing.

Rollback strategy: revert to prior token definitions and remove component-level theme mappings introduced by this change.

## Open Questions

- Should the final visual direction prioritize a high-contrast "command deck" tone or a softer holographic tone as default?
- Do we want a mono-accent palette or dual-accent palette for semantic signaling?
- Should celebratory UI elements remain in core flow or become optional/secondary interactions?