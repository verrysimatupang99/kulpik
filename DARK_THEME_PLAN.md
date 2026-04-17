# KulPik Dark Theme Redesign
> Reference: the3key.com — adapted with dark/black theme

## Design Analysis (the3key.com)

### Key Design Patterns:
1. **Navigation**: Clean sticky header, logo left, nav center, CTAs right
2. **Hero**: Large bold heading, subtitle, dual CTA buttons
3. **Features**: 3-column grid with icons + headings + descriptions
4. **Audience Cards**: Grid of cards for different user types
5. **Services**: Card grid with icons, headings, descriptions
6. **Process Steps**: Numbered steps with clear progression
7. **Why Choose Us**: Feature highlights with icons
8. **Footer**: CTA section + multi-column links + social

### Typography:
- Large headings (text-4xl to text-6xl)
- Clear hierarchy: H1 > H2 > H3 > body
- Clean sans-serif font

### Spacing:
- Generous padding (py-16 to py-28)
- Consistent gaps (gap-4 to gap-8)
- Max-width containers (max-w-7xl)

---

## Dark Theme Color Palette

### Backgrounds:
- Primary bg: `#0a0a0a` (near black)
- Card bg: `#141414` (dark gray)
- Hover bg: `#1a1a1a` (slightly lighter)
- Input bg: `#1e1e1e`

### Text:
- Primary text: `#ffffff` (white)
- Secondary text: `#a1a1aa` (gray-400)
- Muted text: `#71717a` (gray-500)

### Accent (keep primary blue):
- Primary: `#3b82f6` (blue-500)
- Primary hover: `#2563eb` (blue-600)
- Primary subtle: `#1e3a8a` with opacity

### Borders:
- Border: `#27272a` (zinc-800)
- Border hover: `#3f3f46` (zinc-700)

### Status:
- Success: `#22c55e` (green-500)
- Warning: `#eab308` (yellow-500)
- Danger: `#ef4444` (red-500)

---

## Tailwind Config Changes

```typescript
// tailwind.config.ts
colors: {
  dark: {
    50: '#fafafa',
    100: '#e4e4e7',
    200: '#a1a1aa',
    300: '#71717a',
    400: '#52525b',
    500: '#3f3f46',
    600: '#27272a',
    700: '#1a1a1a',
    800: '#141414',
    900: '#0a0a0a',
    950: '#050505',
  }
}
```

---

## Page-by-Page Redesign Plan

### 1. Global (globals.css)
- Dark background on body
- Light text default
- Scrollbar styling for dark theme
- Selection color

### 2. Layout (layout.tsx)
- Dark background wrapper
- Updated Header with dark theme
- Updated Footer with dark theme

### 3. Header Component
- Transparent/dark background
- Sticky with backdrop blur
- Logo light version
- Nav links in light gray
- CTA button: blue bg

### 4. Home Page (page.tsx)
**Hero Section:**
- Dark gradient bg (from-dark-900 via-dark-800 to-dark-900)
- Large white heading with accent color highlight
- Subtitle in gray-400
- Two CTAs: Primary blue + outline/ghost

**Features Section (like "We speak your language"):**
- 3-column grid
- Icon + heading + description
- Subtle border cards on dark bg

**Jurusan Section (like "Who it's for"):**
- Grid of cards
- Card: dark-800 bg, subtle border
- Icon, name, description
- Hover: border glow + slight scale

**How It Works (like Process Steps):**
- 4 numbered steps
- Step number badge
- Heading + description
- Connected progression line (optional)

**CTA Section:**
- Gradient bg (blue tones)
- White heading + text
- Primary button

### 5. Search Page
- Dark sidebar filters
- Dark cards for laptop results
- Filter chips with dark theme
- SearchBar with dark input

### 6. Laptop Detail Page
- Dark card layouts
- Spec table with dark rows
- Price comparison with green highlight for cheapest
- Jurusan match with checkmarks

### 7. Jurusan Pages
- Dark cards for specs
- Software badges on dark bg
- CTA section with gradient

### 8. AI Chat Page
- Dark chat container
- User messages: blue bg
- AI messages: dark-700 bg
- Input field: dark bg with border

### 9. Footer
- Dark bg (darker than main)
- Multi-column links
- Social icons
- Copyright

---

## Component Updates

### Cards:
```tsx
// Before
className="rounded-2xl bg-white border border-gray-200"

// After
className="rounded-2xl bg-dark-800 border border-dark-600 hover:border-dark-500 transition-colors"
```

### Buttons:
```tsx
// Primary
className="bg-primary-600 hover:bg-primary-700 text-white"

// Secondary/Outline
className="border border-dark-500 text-dark-100 hover:bg-dark-700"

// Ghost
className="text-dark-200 hover:text-white hover:bg-dark-700"
```

### Inputs:
```tsx
className="bg-dark-700 border border-dark-600 text-white placeholder-dark-300 focus:border-primary-500"
```

### Badges:
```tsx
className="bg-dark-700 text-dark-200 px-2 py-0.5 rounded-full text-xs"
```

---

## Implementation Order

1. Update tailwind.config.ts with dark colors
2. Update globals.css with dark base styles
3. Update Header component
4. Update Footer component
5. Update Home page (hero, features, jurusan, how it works, CTA)
6. Update Search page
7. Update Laptop Detail page
8. Update Jurusan pages
9. Update AI Chat page
10. Update all UI components (cards, badges, inputs)

---

## Animations (Optional Enhancement)

- Fade in on scroll (intersection observer)
- Hover scale on cards (transition-transform)
- Smooth color transitions
- Button press effects
