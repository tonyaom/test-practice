# Design Brief

## Tone & Purpose
Clean, focused learning interface. Minimalist clarity with subtle depth. Builds confidence in test-takers through refined, approachable design — think quality university assessment platform, not trendy startup.

## Palette (OKLCH)
| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary | `0.56 0.14 285` | `0.7 0.15 285` | Calm blue-violet; productive focus. CTA buttons, active states. |
| Accent | `0.62 0.16 172` | `0.68 0.14 172` | Teal-green; success, progress, question highlight. |
| Destructive | `0.6 0.13 25` | `0.65 0.12 25` | Muted coral; errors without alarm. |
| Secondary | `0.88 0.05 42` | `0.3 0.03 42` | Warm neutral gray; sidebar, secondary actions. |
| Muted | `0.92 0.02 270` | `0.25 0.02 270` | Subtle backgrounds, disabled states. |

## Typography
| Role | Font | Usage |
|------|------|-------|
| Display | Plus Jakarta Sans | Page headings, modal titles, question stems |
| Body | Nunito | Body text, labels, form inputs, feedback |
| Mono | JetBrains Mono | Code-based questions, LaTeX input (math editor) |

## Structural Zones
- **Header**: Off-white bar (light) / dark slate (dark). Subtle `border-b`. Logo, user menu, breadcrumb.
- **Sidebar** (Admin): Muted background. Primary color for active nav item. Clear affordance.
- **Main Content**: Light warm background (light) / deep charcoal (dark).
- **Question Cards**: White/card-colored with `shadow-card` (subtle elevation via border + soft shadow).
- **Buttons**: Primary (solid blue-violet), Secondary (light muted bg, dark text), Accent (teal).
- **Stats Cards** (Admin): Card background with large bold stat value (accent color for key metrics), small label above, optional subtext below.
- **Explanation Cards**: Muted background with accent left border, teal label, subtle reveal animation on display.
- **Review Cards**: Elevated card containers with question badge (correct/incorrect indicator), answer rows with visual feedback icons.

## Component Patterns
- **Question Card**: Question type icon + title + media (if present) + answer options. Type-specific styling for MC/multi/text/drag-drop. Bookmark icon toggle (top-right, star outline/filled).
- **Progress Bar**: Teal accent color. Positioned above question to show position in test.
- **Section Progress Bar**: Horizontal bar per section (0.5rem height, teal fill, muted background), updates live during test.
- **Timer Display**: JetBrains Mono, 1.75rem, accent teal, tabular-nums for digit alignment (MM:SS format).
- **Question Count Badge**: Pill shape (rounded-full), accent background, white text, 0.75rem font, positioned top-right of section cards.
- **Streak Badge**: Horizontal pill (0.5rem border-radius), accent background 10%, accent text, fire icon + number, 0.875rem.
- **Bookmark Toggle**: 2rem square, light border, teal accent on hover/checked state.
- **Input Fields**: Light border, focus ring in primary color, placeholder text in muted-foreground.
- **Toggle/Checkbox**: Custom accent color (teal) on checked state.
- **Stat Card**: Large value (accent color), small uppercased label, optional growth indicator.
- **Math Editor Modal**: Two-column layout with LaTeX input (monospace textarea) on left, live KaTeX preview on right. Symbol palette grid below input with 4-column layout.
- **Answer Explanations**: Teal-bordered explanation card below answer options, displayed with `explanation-reveal` animation.
- **Review Mode**: Prev/next navigation buttons, question badge (✓ or ✗), answer indicators with visual feedback.
- **Test History Table**: Minimal tabular layout with Date | Test Name | Score | Time columns. Score and Time in monospace. Row hover with subtle muted background. Fade-in on load.

## Motion & Interaction
- **Transitions**: `transition-smooth` (0.3s) for state changes, `transition-fast` (0.15s) for micro-interactions.
- **Page/Question Transitions**: `animate-slide-in-up` + `animate-fade-in` for question reveal.
- **Button Hover**: Slight opacity increase, no scale; text color shift if secondary action.
- **Explanation Reveal**: `animate-explanation-reveal` (0.4s cubic-bezier) for smooth top-slide entrance.
- **Modal Entrance**: Elevated shadow, subtle scale via transform.

## Elevation Hierarchy
- `shadow-subtle`: Form inputs, disabled elements.
- `shadow-card`: Question cards, modal backgrounds.
- `shadow-elevated`: Popovers, dropdowns, highlights, math editor modal.

## Spacing & Density
- Cards: 20px padding (light breathing room).
- Sections: 24px gap between major areas.
- Form inputs: 12px vertical, 16px horizontal padding.
- Modal content: 1.5rem padding, 2-column grid for math editor.
- Mobile-first breakpoints; expand to 2xl at 1400px.

## Dark Mode
Intentional, not inverted. Background `0.14`, cards `0.18`, text `0.93`. Reduced chroma on colors to prevent eye strain. Primary color lifts to `0.7` for visibility. All tokens tested for AA+ contrast.

## New Features (Follow-up Build)

### Timer Display
- Positioned in header during test-taking. JetBrains Mono, 1.75rem, accent teal. Format: MM:SS (elapsed time). Persisted to localStorage.

### Question Bookmarking
- Star icon on question cards (top-right). Outline/filled states; teal accent on hover. Bookmarked questions accordion in results/review. Persisted to localStorage.

### Study Streak Tracker
- Fire icon + badge in header (teal accent). Resets at midnight if no completed test. Persisted with daily timestamp check.

### Question Count Badges
- Pill badge per section (e.g., '5Q'). Accent background, monospace font, top-right position.

### Section Progress Bars
- Horizontal bar per section (0.5rem, teal fill). Shows X/Y answered. Updates live during test.

### Completed Tests History
- New /tests/history page with tabular layout. Date | Test Name | Score (X/Y) | Time (MM:SS). Monospace font for scores/times. Row hover + fade-in on load.

## Signature Detail
Question type icons (inline or badge) next to each question. Subtle visual distinction between MC single-select (radio), multi-select (checkboxes), text (keyboard icon), drag-drop (arrows). Reinforces question type before user reads prompt. Admin dashboard stat cards with accent-colored large metrics. Math editor modal with organized symbol palette and live preview. Answer explanations with accent left border and teal label. Study streak tracker with fire icon in header for daily motivation. Timer display in monospace font for precision. Bookmark icons for personalized question curation. Test history table for accountability and review.
