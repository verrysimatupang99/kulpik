# Design Document

## Overview

This document outlines the technical design for implementing deployment readiness fixes for the KulPik platform. The fixes address 9 critical issues identified before production deployment.

## Architecture

### Error Boundaries

**Component Structure:**
```
web/src/components/ui/
├── ErrorBoundary.tsx          # Base error boundary component
└── ErrorFallback.tsx          # Reusable error fallback UI
```

**Implementation Details:**
- Create a base `ErrorBoundary` component using React's error boundary pattern
- Create a reusable `ErrorFallback` component with retry functionality
- Wrap each user-facing page with the error boundary
- Use Next.js App Router error handling for server-side errors

**Files to Modify:**
- `web/src/app/ai/page.tsx` - Wrap with ErrorBoundary
- `web/src/app/compare/page.tsx` - Wrap with ErrorBoundary
- `web/src/app/jurusan/page.tsx` - Wrap with ErrorBoundary
- `web/src/app/search/page.tsx` - Wrap with ErrorBoundary
- `web/src/app/laptop/[id]/page.tsx` - Wrap with ErrorBoundary

### Loading States

**Component Structure:**
```
web/src/components/ui/
├── LoadingSkeleton.tsx        # Already exists, verify completeness
└── LoadingState.tsx           # New: unified loading state component
```

**Implementation Details:**
- Verify existing `LoadingSkeleton` component covers all use cases
- Create a `LoadingState` component for page-level loading indicators
- Use Next.js loading.tsx files for automatic loading state management

**Files to Create/Verify:**
- `web/src/app/ai/loading.tsx` - Already exists, verify implementation
- `web/src/app/compare/loading.tsx` - Already exists, verify implementation
- `web/src/app/jurusan/loading.tsx` - Already exists, verify implementation
- `web/src/app/search/loading.tsx` - Already exists, verify implementation

### SEO Metadata

**Component Structure:**
```
web/src/components/layout/
└── SeoMetadata.tsx            # New: SEO metadata component
```

**Implementation Details:**
- Create a `SeoMetadata` component using Next.js Metadata API
- Define default metadata in the root layout
- Override metadata on a per-page basis when needed

**Files to Modify:**
- `web/src/app/layout.tsx` - Add metadata export

### Robots.txt

**Implementation Details:**
- Create a static `robots.txt` file in the public directory
- Configure Next.js to serve the file at the root path

**Files to Create:**
- `web/public/robots.txt` - Already exists, verify content

### Sitemap

**Implementation Details:**
- Create a dynamic sitemap using Next.js Metadata API
- Fetch all public pages from Supabase
- Generate sitemap.xml with proper XML structure

**Files to Modify:**
- `web/src/app/sitemap.ts` - Already exists, verify implementation

### Console.log Removal

**Implementation Details:**
- Search all source files in `web/src` for console statements
- Remove or replace with proper logging library
- Add ESLint rule to prevent future console statements

**Files to Scan:**
- All files in `web/src/**/*.{ts,tsx,js,jsx}`

### Public Assets Directory

**Implementation Details:**
- Verify `web/public` directory exists
- Organize assets into logical subdirectories
- Update all asset references to use correct paths

**Directory Structure:**
```
web/public/
├── images/
├── icons/
├── favicon/
└── robots.txt
```

### 404 Page

**Component Structure:**
```
web/src/components/ui/
└── NotFound.tsx               # New: 404 page component
```

**Implementation Details:**
- Create a `NotFound` component with helpful navigation
- Use Next.js not-found.tsx for automatic 404 handling

**Files to Modify:**
- `web/src/app/not-found.tsx` - Already exists, verify implementation

### Unused Code Removal

**Implementation Details:**
- Identify and delete `nanogpt.ts` file
- Search for any references to nanogpt.ts
- Remove import statements

**Files to Check:**
- `web/src/lib/nanogpt.ts` - Delete if exists
- Search for imports of nanogpt.ts across codebase

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Data**: Supabase with pgvector

## Implementation Steps

1. Create base error boundary and fallback components
2. Wrap all user-facing pages with error boundaries
3. Verify loading state components exist and are functional
4. Enhance SEO metadata in layout.tsx
5. Verify robots.txt content
6. Verify sitemap implementation
7. Remove all console.log statements from source code
8. Organize public assets directory
9. Verify 404 page implementation
10. Delete nanogpt.ts and remove references

## Testing Strategy

- Unit tests for error boundary components
- Integration tests for loading states
- E2E tests for navigation and error scenarios
- Linting to prevent console.log statements
- Build verification to ensure all files are properly served
