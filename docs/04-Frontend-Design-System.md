# PlacementPilot AI — Frontend Design System

**Document ID:** PP-FE-001  
**Version:** 1.0.0  
**Status:** Canonical UI/UX Design Specification

---

# Table of Contents

1. Design Philosophy
2. Brand Identity
3. Layout & Grid
4. Spacing System
5. Typography
6. Color System
7. Component Standards
8. Forms
9. Tables
10. Charts
11. Feedback States
12. Responsive Design
13. Dark Mode
14. Motion
15. Accessibility
16. Component Naming

---

# 1. Design Philosophy

PlacementPilot AI should feel like a modern productivity SaaS rather than a college project.

Core principles:

- Clean over flashy
- Consistency over novelty
- Fast interactions
- Accessibility first
- AI should enhance, not distract

---

# 2. Brand Identity

Keywords:

- Professional
- Trustworthy
- Minimal
- Intelligent
- Student-focused

Rounded corners: 12px

Card elevation: subtle only.

---

# 3. Layout & Grid

Max content width:

- 1440px desktop

Container padding:

- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

Use a 12-column responsive grid.

---

# 4. Spacing System

Base unit: **8px**

Allowed spacing:

- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48
- 64
- 80
- 96

Avoid arbitrary spacing values.

---

# 5. Typography

Primary Font:

- Inter

Fallback:

- system-ui

Scale

| Element | Size |
|---------|------|
|Display|48px|
|H1|36px|
|H2|30px|
|H3|24px|
|H4|20px|
|Body|16px|
|Small|14px|
|Caption|12px|

Line height: 1.5

---

# 6. Color System

Primary

- Blue 600

Success

- Green

Warning

- Amber

Danger

- Red

Neutral palette

50 → 900

Never hardcode colors in components.

Use semantic tokens:

- primary
- secondary
- surface
- border
- muted
- success
- warning
- error

---

# 7. Component Standards

## Buttons

Variants

- Primary
- Secondary
- Outline
- Ghost
- Danger

States

- Default
- Hover
- Active
- Disabled
- Loading

---

## Cards

Consistent:

- padding
- border radius
- shadow
- spacing

Cards never contain page-level logic.

---

## Inputs

All inputs include

- label
- placeholder
- helper text
- validation message
- disabled state

---

## Dialogs

Every dialog supports

- keyboard escape
- focus trap
- accessible labels

---

## Navigation

Sidebar:

- collapsible
- keyboard accessible

Top navigation:

- notifications
- profile
- theme toggle

---

# 8. Forms

Use:

- React Hook Form
- Zod

Validation

- client
- server

Error messages remain human-readable.

---

# 9. Tables

Features

- Pagination
- Sorting
- Search
- Empty state
- Loading skeleton
- Responsive scrolling

---

# 10. Charts

Library:

Recharts

Rules

- Consistent legends
- Accessible colors
- Responsive sizing
- Tooltips enabled

---

# 11. Feedback States

Every page must define:

Loading

- Skeletons

Empty

- Helpful illustration/message

Error

- Retry action

Success

- Toast notification

---

# 12. Responsive Design

Breakpoints

- Mobile
- Tablet
- Laptop
- Desktop

No horizontal scrolling unless data tables require it.

Mobile-first implementation.

---

# 13. Dark Mode

Requirements

- Semantic color tokens
- No duplicated components
- WCAG-compliant contrast
- Theme persisted

---

# 14. Motion

Library

Framer Motion

Duration

150–300ms

Animate

- dialogs
- page transitions
- cards
- dropdowns

Avoid excessive animations.

---

# 15. Accessibility

Minimum WCAG AA.

Checklist

- Keyboard navigation
- Focus indicators
- ARIA labels
- Contrast compliance
- Screen reader support
- Reduced motion respected

---

# 16. Component Naming

Examples

- ResumeCard
- JobCard
- InterviewPanel
- DashboardStats
- EmptyState
- LoadingSkeleton
- ErrorBoundary

Avoid names like:

- Card2
- NewButton
- TempTable

# End of Document
