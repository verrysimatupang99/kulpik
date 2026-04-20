# KulPik Perfection Plan — Strategic Segments
> Goal: Sempurnakan yang sudah ada sebelum tambah fitur baru
> Method: Delegasi ke Goose CLI, satu segmen per session

---

## Current State Analysis

### ✅ What Works:
- Dark theme (all pages)
- Backend API (15+ endpoints)
- Puter.js integration
- Rate limiting & caching
- Database (22 jurusan, 54 laptops)
- All pages exist (Home, Search, Detail, Jurusan, AI, Compare, About)

### ⚠️ What Needs Perfection:
- UI/UX quality (user reported "looks bad")
- Puter.js WebSocket errors
- Mobile responsiveness untested
- Accessibility incomplete
- Code consistency
- Error handling
- Loading states
- Empty states

---

## SEGMENT 1: UI/UX Hero & Home Page
**Goal:** Home page harus impressive dan professional

### Tasks:
1. **Hero Section Enhancement**
   - Improve typography hierarchy
   - Better gradient/background
   - Animated elements (subtle)
   - Better CTA button design
   - Stats badge improvement

2. **Feature Cards Improvement**
   - Better card design with icons
   - Hover animations
   - Consistent spacing

3. **Jurusan Section**
   - Better card grid layout
   - Hover effects
   - Loading shimmer

4. **How It Works**
   - Better step visualization
   - Connected line between steps

5. **CTA Section**
   - More impactful design
   - Better contrast

**Files:** `src/app/page.tsx`, `src/app/globals.css`

---

## SEGMENT 2: UI/UX Search & Filter
**Goal:** Search experience harus smooth dan intuitive

### Tasks:
1. **Search Bar Enhancement**
   - Better visual design
   - Autocomplete dropdown styling
   - Clear button
   - Loading indicator

2. **Filter Sidebar**
   - Better organized sections
   - Active filter highlight
   - Clear all button
   - Collapse/expand

3. **Filter Chips**
   - Better styling
   - Animation on remove
   - Count indicator

4. **Results Grid**
   - Better card layout
   - Loading skeleton
   - Empty state
   - No results state

5. **Sort Dropdown**
   - Better styling
   - Custom dropdown

**Files:** `src/app/search/page.tsx`, `src/components/ui/SearchBar.tsx`, `src/components/ui/FilterChip.tsx`

---

## SEGMENT 3: UI/UX Laptop Card & Detail
**Goal:** Laptop cards harus menarik dan informatif

### Tasks:
1. **LaptopCard Enhancement**
   - Better image placeholder
   - Price highlight
   - Spec pills improvement
   - Hover animation
   - Compare button

2. **Laptop Detail Page**
   - Better layout
   - Spec table design
   - Price comparison visual
   - Jurusan match section
   - Share button
   - Breadcrumb

3. **Loading States**
   - Skeleton for cards
   - Skeleton for detail page

4. **Error States**
   - 404 page
   - API error handling

**Files:** `src/components/laptop/LaptopCard.tsx`, `src/app/laptop/[id]/page.tsx`

---

## SEGMENT 4: UI/UX AI Chat & Jurusan
**Goal:** AI Chat dan Jurusan pages harus functional dan menarik

### Tasks:
1. **AI Chat Page**
   - Better chat bubble design
   - Typing indicator
   - Model selector styling
   - Quick prompts design
   - Welcome message
   - Error handling

2. **Jurusan Index Page**
   - Better grid layout
   - Search/filter
   - Card design

3. **Jurusan Detail Page**
   - Better hero section
   - Specs display
   - Software badges
   - CTA section

4. **Compare Page**
   - Side-by-side layout
   - Highlight differences
   - Winner indicators

**Files:** `src/app/ai/page.tsx`, `src/app/jurusan/page.tsx`, `src/app/jurusan/[slug]/page.tsx`, `src/app/compare/page.tsx`

---

## SEGMENT 5: Responsive & Mobile
**Goal:** Perfect mobile experience

### Tasks:
1. **Test All Pages di Mobile**
   - Home (320px - 768px)
   - Search (filter collapse, results grid)
   - Detail (stack layout)
   - AI Chat (full screen chat)
   - Jurusan (card grid)

2. **Fix Mobile Issues**
   - Navigation hamburger
   - Touch targets (min 44px)
   - Font sizes
   - Spacing
   - Images

3. **Mobile-specific Features**
   - Bottom sheet for filters
   - Swipe gestures
   - Pull to refresh

**Files:** All page files, `src/components/layout/Header.tsx`

---

## SEGMENT 6: Accessibility & Performance
**Goal:** WCAG compliant dan fast

### Tasks:
1. **Accessibility Audit**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast
   - Focus states

2. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Bundle size
   - Lighthouse score

3. **SEO**
   - Meta tags
   - Open Graph
   - Structured data
   - Sitemap

**Files:** All files

---

## SEGMENT 7: Code Quality & Consistency
**Goal:** Clean, maintainable code

### Tasks:
1. **Code Review**
   - Remove console.logs
   - Fix TypeScript any types
   - Consistent naming
   - Remove unused code

2. **Component Consistency**
   - Unified button styles
   - Unified card styles
   - Unified spacing
   - Unified colors

3. **Error Handling**
   - Try-catch everywhere
   - User-friendly errors
   - Loading states
   - Retry mechanisms

4. **Documentation**
   - Component docs
   - API docs
   - Setup guide

**Files:** All files

---

## Execution Order

```
Phase 1 (Visual Impact):
  Segment 1: Hero & Home     ← Start here
  Segment 2: Search & Filter
  Segment 3: Cards & Detail

Phase 2 (Functionality):
  Segment 4: AI Chat & Jurusan
  Segment 5: Responsive & Mobile

Phase 3 (Quality):
  Segment 6: Accessibility & Performance
  Segment 7: Code Quality
```

---

## Goose CLI Execution Pattern

```bash
# Per segment, jalankan Goose dengan task spesifik:

goose run --name segment-1-hero --max-turns 30 -t '
Read src/app/page.tsx
Improve the hero section:
1. Better typography
2. Animated gradient background
3. Better CTA buttons
4. Stats badge with glow effect
...
'

# Setiap segment = 1 session Goose
# Review hasil sebelum lanjut ke segment berikutnya
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 80 |
| Lighthouse Accessibility | > 90 |
| Mobile Responsive | All pages |
| Console Errors | 0 |
| TypeScript Errors | 0 |
| Visual Quality | Professional |
