# Tasks: UI/UX Consistency Fix for air.dev Style

## Overview

This document outlines the implementation tasks for fixing UI/UX inconsistencies across the KulPik application. The tasks are organized by phase, with each phase building on the previous one to ensure a systematic approach to implementing the consistent design system.

## Phase 1: Design System Foundation

### 1.1 Establish Design Tokens

- [ ] **Task 1.1.1**: Define CSS variables for color palette in `web/src/app/globals.css`
  - [ ] Define primary color: `#14b8a6` (teal)
  - [ ] Define secondary color: `#a1a1aa` (gray)
  - [ ] Define accent color: `#14b8a6` (teal)
  - [ ] Define background colors: `#0a0a0a` (primary), `#141414` (surface), `#1a1a1a` (raised)
  - [ ] Define border colors: `rgba(255, 255, 255, 0.06)` (default), `rgba(255, 255, 255, 0.1)` (hover)
  - [ ] Define text colors: `#ffffff` (primary), `#a1a1aa` (secondary), `#71717a` (muted)

- [ ] **Task 1.1.2**: Define CSS variables for spacing system
  - [ ] Define spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px
  - [ ] Define section padding: `6rem` (96px)
  - [ ] Define container padding: `1rem` (16px) mobile, `lg:px-8` (32px) desktop
  - [ ] Define component spacing: `gap-3` (12px), `gap-4` (16px), `gap-5` (20px), `gap-6` (24px)

- [ ] **Task 1.1.3**: Define CSS variables for typography
  - [ ] Define font family: `'Inter', system-ui, -apple-system, sans-serif`
  - [ ] Define font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
  - [ ] Define line heights: 1.5 (tight), 1.6 (normal), 2 (loose)
  - [ ] Define letter spacing: normal, `0.01em` (tighter), `0.02em` (tighter), `0.1em` (wider)

- [ ] **Task 1.1.4**: Define CSS variables for transitions
  - [ ] Define transition durations: 150ms (fast), 200ms (base), 300ms (slow)
  - [ ] Define easing functions: `ease` (default), `ease-in-out` (smooth)
  - [ ] Define transition properties: all, background-color, border-color, color, opacity, transform, box-shadow

### 1.2 Standardize Utility Classes

- [ ] **Task 1.2.1**: Create unified card utility classes
  - [ ] Define `.card` class with default styling
  - [ ] Define `.card-elevated` class with shadow
  - [ ] Define `.card-hover` class with hover effects
  - [ ] Define `.card-glass` class with backdrop blur

- [ ] **Task 1.2.2**: Create unified button utility classes
  - [ ] Define `.btn-primary` class with primary styling
  - [ ] Define `.btn-secondary` class with secondary styling
  - [ ] Define `.btn-ghost` class with ghost styling
  - [ ] Define `.btn-outline` class with outline styling

- [ ] **Task 1.2.3**: Create unified typography utility classes
  - [ ] Define `.text-gradient` class for gradient text
  - [ ] Define `.text-gradient-blue` class for blue gradient text
  - [ ] Define `.glass` class for glassmorphism effect
  - [ ] Define `.glass-subtle` class for subtle glassmorphism

- [ ] **Task 1.2.4**: Create section utility classes
  - [ ] Define `.section` class with consistent padding
  - [ ] Define `.section-header` class for section headers
  - [ ] Define `.section-label` class for section labels
  - [ ] Define `.section-title` class for section titles

## Phase 2: Component Updates

### 2.1 Button Component Updates

- [ ] **Task 2.1.1**: Update `web/src/components/ui/Button.tsx` to use design tokens
  - [ ] Replace hardcoded colors with CSS variables
  - [ ] Standardize variant definitions
  - [ ] Apply consistent shadow and transition effects
  - [ ] Update focus states to use design token colors

- [ ] **Task 2.1.2**: Update button sizes to use consistent spacing
  - [ ] Define sm size: `px-3 py-1.5 text-xs gap-1.5`
  - [ ] Define md size: `px-4 py-2.5 text-sm gap-2`
  - [ ] Define lg size: `px-6 py-3 text-base gap-2.5`
  - [ ] Define xl size: `px-8 py-4 text-lg gap-3`

- [ ] **Task 2.1.3**: Update button variants to use design tokens
  - [ ] Primary: `bg-primary-600`, `hover:bg-primary-700`, `shadow-lg`
  - [ ] Secondary: `bg-dark-700`, `border border-dark-600`, `hover:bg-dark-600`
  - [ ] Ghost: `text-dark-200`, `hover:text-white`, `hover:bg-dark-700`
  - [ ] Outline: `bg-transparent`, `border border-primary-500/50`, `hover:bg-primary-500/10`

### 2.2 Card Component Updates

- [ ] **Task 2.2.1**: Update `web/src/components/ui/Card.tsx` to use design tokens
  - [ ] Replace hardcoded colors with CSS variables
  - [ ] Standardize variant definitions
  - [ ] Apply consistent border and shadow effects
  - [ ] Update hover states to use design token colors

- [ ] **Task 2.2.2**: Update card variants to use design tokens
  - [ ] Default: `bg-dark-800`, `border border-dark-600`
  - [ ] Elevated: `bg-dark-800`, `border border-dark-600`, `shadow-xl shadow-black/20`
  - [ ] Bordered: `bg-transparent`, `border border-dark-500`
  - [ ] Glass: `bg-dark-800/50`, `backdrop-blur-xl`, `border border-dark-600/50`
  - [ ] Gradient: `bg-gradient-to-br from-dark-700 to-dark-800`, `border border-dark-600`

- [ ] **Task 2.2.3**: Update card padding to use consistent spacing
  - [ ] None: `p-0`
  - [ ] Small: `p-4`
  - [ ] Medium: `p-6`
  - [ ] Large: `p-8`

### 2.3 Laptop Card Component Updates

- [ ] **Task 2.3.1**: Update `web/src/components/laptop/LaptopCard.tsx` to use design tokens
  - [ ] Replace hardcoded border colors with `border-dark-600`
  - [ ] Standardize hover effects to use design token colors
  - [ ] Apply consistent spacing and padding
  - [ ] Update brand colors to use design token palette

- [ ] **Task 2.3.2**: Update laptop card layout to use consistent spacing
  - [ ] Image section: `h-40 sm:h-44`
  - [ ] Content padding: `p-5`
  - [ ] Spec pills: `gap-1.5`
  - [ ] CTA buttons: `gap-2`

- [ ] **Task 2.3.3**: Update laptop card styling to use unified theme
  - [ ] Border: `border-dark-600`
  - [ ] Hover border: `border-primary-500/50`
  - [ ] Hover shadow: `shadow-xl shadow-primary-600/5`
  - [ ] Background: `bg-dark-800`

## Phase 3: Page Updates

### 3.1 Home Page Updates

- [ ] **Task 3.1.1**: Update `web/src/app/page.tsx` background to use unified theme
  - [ ] Replace inconsistent gradients with unified dark theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply subtle radial gradients for visual interest
  - [ ] Use consistent accent colors (blue-500/600)

- [ ] **Task 3.1.2**: Update home page sections to use consistent spacing
  - [ ] Hero section: `py-20 lg:py-28`
  - [ ] Features section: `py-24`
  - [ ] Jurusan section: `py-24`
  - [ ] How it works section: `py-24`
  - [ ] CTA section: `py-24`

- [ ] **Task 3.1.3**: Update home page components to use unified styling
  - [ ] Features cards: `border-dark-600`, `bg-dark-800`, `hover:border-blue-500/30`
  - [ ] Jurusan cards: `border-blue-500/40`, `bg-gradient-to-br`, `hover:shadow-2xl`
  - [ ] CTA section: `bg-gradient-to-br from-blue-600 to-purple-700`

### 3.2 Search Page Updates

- [ ] **Task 3.2.1**: Update `web/src/app/search/page.tsx` background to use unified theme
  - [ ] Replace inconsistent background with unified dark theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply subtle radial gradients for visual interest
  - [ ] Use consistent accent colors (primary-500/600)

- [ ] **Task 3.2.2**: Update search page components to use unified styling
  - [ ] Filter sidebar: `border-dark-600`, `bg-dark-800`, `p-6`
  - [ ] Laptop cards: `border-dark-600`, `bg-dark-800`, `hover:border-primary-500/50`
  - [ ] Input fields: `border-dark-600`, `bg-dark-800`, `focus:border-primary-500`

- [ ] **Task 3.2.3**: Update search page layout to use consistent spacing
  - [ ] Hero section: `py-10`
  - [ ] Main content: `py-8`
  - [ ] Filter sidebar: `w-72`
  - [ ] Component gaps: `gap-6`, `gap-8`

### 3.3 Jurusan Page Updates

- [ ] **Task 3.3.1**: Update `web/src/app/jurusan/page.tsx` to use unified theme
  - [ ] Replace purple/pink gradients with unified blue theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply consistent accent colors (blue-500/600)
  - [ ] Use consistent border colors (blue-500/40)

- [ ] **Task 3.3.2**: Update jurusan page components to use unified styling
  - [ ] Category cards: `border-blue-500/40`, `bg-gradient-to-br`, `hover:shadow-2xl`
  - [ ] Jurusan cards: `border-dark-600`, `bg-dark-800`, `hover:border-dark-500`
  - [ ] CTA section: `bg-primary-600`, `text-white`

- [ ] **Task 3.3.3**: Update jurusan page layout to use consistent spacing
  - [ ] Hero section: `py-16`
  - [ ] Categories section: `py-12`
  - [ ] Component gaps: `gap-4`, `gap-5`, `gap-10`

### 3.4 Jurusan Detail Page Updates

- [ ] **Task 3.4.1**: Update `web/src/app/jurusan/[slug]/page.tsx` to use unified theme
  - [ ] Replace inconsistent gradients with unified theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply consistent accent colors (blue-500/600)
  - [ ] Use consistent border colors (blue-500/20)

- [ ] **Task 3.4.2**: Update jurusan detail page components to use unified styling
  - [ ] Spec cards: `border-blue-500/20`, `bg-blue-500/5`, `hover:border-blue-500/40`
  - [ ] Software tags: `border-dark-500`, `bg-dark-700`, `hover:border-primary-500/50`
  - [ ] Tips cards: `border-dark-600`, `bg-dark-800`, `hover:border-dark-500`

- [ ] **Task 3.4.3**: Update jurusan detail page layout to use consistent spacing
  - [ ] Hero section: `py-12`
  - [ ] Specs section: `py-10`
  - [ ] Software section: `py-10`
  - [ ] Tips section: `py-10`
  - [ ] CTA section: `py-10`

### 3.5 Compare Page Updates

- [ ] **Task 3.5.1**: Update `web/src/app/compare/page.tsx` to use unified theme
  - [ ] Replace purple/pink/blue gradients with unified theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply consistent accent colors (purple-500/600)
  - [ ] Use consistent border colors (purple-500/30)

- [ ] **Task 3.5.2**: Update compare page components to use unified styling
  - [ ] Comparison table: `border-dark-600`, `bg-dark-800`
  - [ ] Laptop cards: `border-dark-600`, `bg-dark-800`, `hover:border-dark-500`
  - [ ] Input fields: `border-dark-600`, `bg-dark-800`, `focus:border-purple-500`

- [ ] **Task 3.5.3**: Update compare page layout to use consistent spacing
  - [ ] Hero section: `py-16`
  - [ ] Main content: `py-12`
  - [ ] Component gaps: `gap-4`, `gap-5`, `gap-8`

### 3.6 AI Page Updates

- [ ] **Task 3.6.1**: Update `web/src/app/ai/page.tsx` to use unified theme
  - [ ] Replace inconsistent styling with unified theme
  - [ ] Use `bg-dark-950` as base background
  - [ ] Apply consistent accent colors (primary-500/600)
  - [ ] Use consistent border colors (dark-600)

- [ ] **Task 3.6.2**: Update AI page components to use unified styling
  - [ ] Message bubbles: `bg-dark-700`, `rounded-2xl`, `rounded-bl-sm`
  - [ ] Input fields: `border-dark-600`, `bg-dark-800`, `focus:ring-primary-500/50`
  - [ ] Quick prompts: `border-dark-600`, `bg-dark-800`, `hover:border-primary-500`

- [ ] **Task 3.6.3**: Update AI page layout to use consistent spacing
  - [ ] Header section: `py-6`
  - [ ] Messages container: `pb-4`
  - [ ] Input area: `p-2`
  - [ ] Component gaps: `gap-2`, `gap-3`, `gap-4`

## Phase 4: Landing Component Updates

### 4.1 Hero Component Updates

- [ ] **Task 4.1.1**: Update `web/src/components/landing/Hero.tsx` to use unified theme
  - [ ] Replace inconsistent gradients with unified dark theme
  - [ ] Use consistent accent colors (accent-400/500/600)
  - [ ] Apply consistent border colors (edge, surface, surface-overlay)

- [ ] **Task 4.1.2**: Update hero component layout to use consistent spacing
  - [ ] Hero section: `py-20 lg:py-28`
  - [ ] Content padding: `px-6 lg:px-8`
  - [ ] Component gaps: `gap-6`, `gap-8`, `gap-14`

- [ ] **Task 4.1.3**: Update hero component styling to use unified theme
  - [ ] Badge: `bg-accent-500/10`, `border border-accent-500/20`
  - [ ] Preview card: `border border-edge`, `bg-surface-raised`
  - [ ] Chart bars: `bg-gradient-to-t from-accent-700 to-accent-400`

### 4.2 Navbar Component Updates

- [ ] **Task 4.2.1**: Update `web/src/components/landing/Navbar.tsx` to use unified theme
  - [ ] Replace inconsistent styling with unified theme
  - [ ] Use consistent accent colors (accent-400)
  - [ ] Apply consistent border colors (edge, surface-overlay)

- [ ] **Task 4.2.2**: Update navbar layout to use consistent spacing
  - [ ] Navbar height: `h-16`
  - [ ] Container padding: `px-6 lg:px-8`
  - [ ] Component gaps: `gap-8`, `gap-3`

- [ ] **Task 4.2.3**: Update navbar styling to use unified theme
  - [ ] Glass effect: `bg-dark-800/80`, `backdrop-blur-xl`
  - [ ] Mobile dropdown: `bg-surface`
  - [ ] Hover states: `hover:bg-surface-overlay`

## Phase 5: Testing and Verification

### 5.1 Unit Tests

- [ ] **Task 5.1.1**: Test design token values are correctly defined
  - [ ] Test primary color is `#14b8a6`
  - [ ] Test secondary color is `#a1a1aa`
  - [ ] Test background colors are correctly defined
  - [ ] Test spacing values are correctly defined

- [ ] **Task 5.1.2**: Test component styling uses design tokens
  - [ ] Test button variants use correct colors
  - [ ] Test card variants use correct borders and shadows
  - [ ] Test typography classes use correct sizes and weights

- [ ] **Task 5.1.3**: Test responsive behavior
  - [ ] Test mobile breakpoints
  - [ ] Test tablet breakpoints
  - [ ] Test desktop breakpoints

### 5.2 Integration Tests

- [ ] **Task 5.2.1**: Test full user flows
  - [ ] Test home page flow
  - [ ] Test search page flow
  - [ ] Test jurusan page flow
  - [ ] Test compare page flow
  - [ ] Test AI page flow

- [ ] **Task 5.2.2**: Test responsive behavior
  - [ ] Test mobile layout
  - [ ] Test tablet layout
  - [ ] Test desktop layout

- [ ] **Task 5.2.3**: Test accessibility
  - [ ] Test contrast ratios
  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility

### 5.3 Visual Regression Tests

- [ ] **Task 5.3.1**: Take screenshots of all pages
  - [ ] Home page
  - [ ] Search page
  - [ ] Jurusan page
  - [ ] Compare page
  - [ ] AI page

- [ ] **Task 5.3.2**: Compare screenshots before and after fix
  - [ ] Verify visual improvements
  - [ ] Verify no layout shifts
  - [ ] Verify no rendering issues

- [ ] **Task 5.3.3**: Test on different browsers
  - [ ] Test Chrome
  - [ ] Test Firefox
  - [ ] Test Safari
  - [ ] Test Edge

## Phase 6: Documentation and Handoff

### 6.1 Documentation

- [ ] **Task 6.1.1**: Update component documentation
  - [ ] Document button component usage
  - [ ] Document card component usage
  - [ ] Document design token values

- [ ] **Task 6.1.2**: Update style guide
  - [ ] Document color palette
  - [ ] Document spacing system
  - [ ] Document typography hierarchy

- [ ] **Task 6.1.3**: Create migration guide
  - [ ] Document breaking changes
  - [ ] Document new component usage
  - [ ] Document design token migration

### 6.2 Handoff

- [ ] **Task 6.2.1**: Review with design team
  - [ ] Verify design system matches requirements
  - [ ] Address any design feedback
  - [ ] Finalize visual assets

- [ ] **Task 6.2.2**: Review with development team
  - [ ] Verify implementation approach
  - [ ] Address any technical concerns
  - [ ] Finalize code review

- [ ] **Task 6.2.3**: Deploy to production
  - [ ] Deploy to staging environment
  - [ ] Run final tests
  - [ ] Deploy to production

## Notes

- All tasks should be completed in sequential order
- Each task should be tested before moving to the next task
- Design system changes should be made in `globals.css` first
- Component updates should use the design tokens defined in `globals.css`
- All pages should be tested for visual consistency and functionality
- Responsive behavior should be tested on mobile, tablet, and desktop
- Accessibility should be verified for all updated components
