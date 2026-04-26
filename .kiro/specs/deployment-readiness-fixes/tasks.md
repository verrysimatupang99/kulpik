# Implementation Tasks

## Phase 1: Error Boundaries

- [x] 1.1 Create ErrorBoundary.tsx component with error catching logic
- [x] 1.2 Create ErrorFallback.tsx component with user-friendly UI and retry functionality
- [x] 1.3 Wrap web/src/app/ai/page.tsx with ErrorBoundary
- [x] 1.4 Wrap web/src/app/compare/page.tsx with ErrorBoundary
- [x] 1.5 Wrap web/src/app/jurusan/page.tsx with ErrorBoundary
- [x] 1.6 Wrap web/src/app/search/page.tsx with ErrorBoundary
- [x] 1.7 Wrap web/src/app/laptop/[id]/page.tsx with ErrorBoundary
- [x] 1.8 Test error boundary behavior by throwing errors in child components

## Phase 2: Loading States

- [x] 2.1 Verify LoadingSkeleton.tsx component covers all use cases
- [x] 2.2 Verify web/src/app/ai/loading.tsx displays appropriate loading state
- [x] 2.3 Verify web/src/app/compare/loading.tsx displays appropriate loading state
- [x] 2.4 Verify web/src/app/jurusan/loading.tsx displays appropriate loading state
- [x] 2.5 Verify web/src/app/search/loading.tsx displays appropriate loading state

## Phase 3: SEO Metadata

- [x] 3.1 Create SeoMetadata.tsx component using Next.js Metadata API
- [x] 3.2 Add metadata export to web/src/app/layout.tsx with default values
- [x] 3.3 Verify title tag format: "KulPik - Laptop Recommendation for Indonesian Students"
- [x] 3.4 Verify meta description tag with concise platform summary
- [x] 3.5 Verify meta keywords tag with Indonesian academic terms
- [x] 3.6 Verify Open Graph metadata for social media sharing
- [x] 3.7 Verify Twitter Card metadata for Twitter sharing

## Phase 4: Robots.txt

- [x] 4.1 Verify web/public/robots.txt exists
- [x] 4.2 Verify robots.txt allows crawling of all public pages
- [x] 4.3 Verify robots.txt disallows crawling of API endpoints
- [x] 4.4 Verify robots.txt references sitemap location

## Phase 5: Sitemap

- [x] 5.1 Verify web/src/app/sitemap.ts implementation
- [x] 5.2 Verify sitemap includes all public pages: home, about, AI, search, jurusan list, laptop details
- [x] 5.3 Verify sitemap includes last modified date for each page
- [x] 5.4 Verify sitemap includes priority and change frequency for each page

## Phase 6: Console.log Removal

- [x] 6.1 Search all files in web/src for console.log statements
- [x] 6.2 Search all files in web/src for console.error statements used for debugging
- [x] 6.3 Search all files in web/src for console.warn statements used for debugging
- [x] 6.4 Remove or replace all identified console statements
- [x] 6.5 Add ESLint rule to prevent future console statements in production

## Phase 7: Public Assets Directory

- [x] 7.1 Verify web/public directory exists
- [x] 7.2 Create subdirectories: images/, icons/, favicon/
- [x] 7.3 Move existing assets to appropriate subdirectories
- [x] 7.4 Update all asset references to use correct paths

## Phase 8: 404 Page

- [x] 8.1 Verify web/src/app/not-found.tsx implementation
- [x] 8.2 Verify 404 page includes search bar
- [x] 8.3 Verify 404 page includes links to major site sections
- [x] 8.4 Verify 404 page includes link back to home page

## Phase 9: Unused Code Removal

- [x] 9.1 Locate nanogpt.ts file in codebase
- [x] 9.2 Delete nanogpt.ts file
- [x] 9.3 Search for any imports of nanogpt.ts across codebase
- [x] 9.4 Remove all import statements referencing nanogpt.ts

## Verification Tasks

- [x] 10.1 Run build and verify no errors
- [x] 10.2 Run linter and verify no console statements remain
- [x] 10.3 Test error boundaries by triggering errors
- [x] 10.4 Test loading states by simulating slow network
- [x] 10.5 Verify robots.txt is served at root path
- [x] 10.6 Verify sitemap.xml is served at root path
- [x] 10.7 Verify 404 page displays for non-existent routes
- [x] 10.8 Verify SEO metadata appears in page source
