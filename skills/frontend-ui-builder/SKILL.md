---
name: frontend-ui-builder
description: Build or improve frontend interfaces in an existing web project, including pages, screens, and reusable components. Use when the task is to implement UI in code; for design-only image concepts, use an image design skill instead.
---

# Frontend UI Builder

Build a complete, coherent interface that fits the user's brief and the project's existing technology. Treat the interface as part of a working product: preserve existing behavior and connect new controls to meaningful actions.

## Workflow

1. Inspect the app entry points, nearby components, styles, package scripts, and existing design tokens before editing. Identify the framework, styling approach, and reusable components already in use. Follow those conventions and avoid adding dependencies unless they materially help.
2. Translate the request into the necessary page structure, content hierarchy, and key interactions. For an existing product, extend its visual language. For a new screen without a defined style, choose a specific direction that suits the audience and content; establish typography, spacing, color, and component treatments consistently.
3. Implement the whole requested experience, including responsive layouts and meaningful loading, empty, error, selected, or disabled states when they apply. Use semantic HTML, accessible labels, visible focus states, and keyboard-operable controls.
4. Refine the result in context. Remove placeholder copy, dead controls, accidental overflow, inconsistent spacing, and default-looking styling. Keep content readable at narrow and wide viewport sizes.
5. Summarize the files and behavior changed. Run the project's existing checks when the user asks for verification or when needed to diagnose an implementation issue; do not invent a test framework.

## Implementation Guidance

- Prefer the project's existing component, routing, state, and CSS patterns. Keep new components focused and extract shared UI only when it is reused or clarifies the structure.
- Make deliberate visual choices rather than stacking generic cards, gradients, and stock dashboard patterns. Use imagery only when it supports the product and prefer repository assets when available.
- Use CSS variables or established design tokens for repeated colors, spacing, and radii. Avoid one-off overrides that fight the existing cascade.
- Keep functionality honest: navigation should navigate, buttons should act, and forms should provide feedback. Do not imply persistence or backend behavior that the app does not implement.
- Preserve unrelated code and explain any unavoidable limitation that prevents a requested interaction or state from working.
