# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current Session Status

- **Last Updated**: 2025-09-25
- **Last Completed**: ✅ CLAUDE.md compliance refactoring - Phase 1 (Type Centralization)
- **Current Status**: Major compliance improvements completed - Type safety restored, inline interfaces centralized
- **Next Priority**: Architecture pattern review and final compliance verification
- **Context**: Phase 1 refactoring completed successfully, ~90% CLAUDE.md compliance achieved

## Technical Decisions Made

- **Gate Middleware**: **DISABLED** (2025-08-26) - Code commented out in `src/app.ts` due to production hosting conflicts
  - **Issue**: CloudLinux/Passenger static file serving overrides Node.js routing for root URL (`/`)
  - **Root Cause**: Web server serves `frontend/dist/index.html` directly, bypassing Node.js app for `/` route
  - **Solution Applied**: Temporarily disabled middleware and `/site-access` route via comments
  - **Files Preserved**: `src/middleware/gateMiddleware.ts`, `src/views/gate.ejs` kept for future use
  - **Re-enable**: Uncomment sections in `src/app.ts` (lines ~27-36, ~96-128, import on line 13)
- **Error Handling**: 404/503/500 GraphQL errors trigger "WebApp under construction" maintenance dialog
- **Development Setup**: Vite proxy configuration updated for conditional gate middleware
- **Deployment**: CommonJS wrapper (`dist/server.cjs`) for cPanel/LiteSpeed compatibility
- **SEO Implementation**: See SEO.md for complete details
- **Typography**: Responsive breakpoints using `theme.breakpoints.down('sm')` for mobile optimization
- **Meta Tags**: All pages include "TakeOff Info ti.borislav.space" suffix for brand consistency
- **Descriptions**: Use pilot-focused terminology ("посоки на вятъра, подходящи за излитане")
- **URL Structure**: Dual language support `/sites/` and `/парапланер-старт/` already implemented

## Development Commands Reference

```bash
# Development servers
npm start                   # Start both backend and frontend concurrently
npm run start:backend       # Backend only - TypeScript watch mode
npm run start:frontend      # Frontend only - Vite dev server

# Building
npm run build               # Full build (backend + frontend)
npm run build:backend       # Compile TypeScript to dist/
npm run build:frontend      # Build React app for production
npm run clean               # Remove dist/ directory

# Frontend-specific (run from /frontend/)
npm run dev                 # Vite dev server with HMR
npm run lint                # ESLint checking
npm run preview             # Preview production build

# Testing and quality
npm run typecheck          # TypeScript type checking (backend + frontend)
npm run check              # Run typecheck and frontend lint
npm test                   # Run tests in watch mode
npm run test:run           # Run all tests once
npm run test:ui            # Run tests with UI interface

# Production testing
npm run build:preview       # Build + start production servers
```

## Key Files Location Map

```
# Documentation
SEO.md                                        # Complete SEO implementation guide
CLAUDE.md                                     # Project guidance and development tasks

# Styling and Theme
frontend/src/theme.ts                         # Material-UI theme + responsive typography
frontend/src/index.css                       # Font loading and base styles

# Gate Middleware System
src/middleware/gateMiddleware.ts              # Gate password protection middleware
src/views/gate.ejs                            # Gate password form template
.env (SITE_ACCESS_PASSWORD)                   # Gate enable/disable control

# Error Handling & Maintenance Mode
frontend/src/components/ui/ErrorNotificationView.tsx     # Maintenance dialog component
frontend/src/store/middleware/errorNotificationMiddleware.ts  # Error handling logic
frontend/src/store/utils/errorMessages.ts    # Bulgarian error message mapping

# Core Components
frontend/src/AppRoutes.tsx                    # Route definitions
frontend/src/App.tsx                          # HelmetProvider setup
frontend/src/components/pages/HomePage.tsx    # Home page with SEO
frontend/src/components/pages/SiteDetailPage.tsx  # Site detail with dynamic SEO

# Types and Configuration
frontend/src/types/                           # TypeScript type definitions
frontend/vite.config.ts                       # Vite build configuration (conditional proxy)
src/app.ts                                    # Express server setup (conditional gate)

# Build & Deployment
dist/server.cjs                               # CommonJS wrapper for LiteSpeed compatibility
create-cjs-wrapper.js                         # Script to generate CommonJS wrapper
```

## Session Recovery Checklist

- [ ] Review last completed task in "Current Session Status"
- [ ] Check git status for any uncommitted changes
- [ ] Verify development environment is running (`npm start`)
- [ ] Confirm current branch and recent commits
- [ ] Review any open issues in "Current Issues & Known Problems"
- [ ] Check todo list for in-progress tasks

## Recently Completed Features ✅

- **Gate Middleware System** (2025-08-22) - Conditional password protection with environment variable control (`SITE_ACCESS_PASSWORD=false` disables gate, any other value enables it)
- **Error Handling Enhancement** (2025-08-22) - 404/503/500 GraphQL errors trigger "WebApp under construction" maintenance dialog instead of regular error messages  
- **LiteSpeed Compatibility** (2025-08-22) - CommonJS wrapper (`dist/server.cjs`) for cPanel/CloudLinux deployment environments
- **SEO Optimization** (2025-08-18) - Complete implementation with sitemap generation, meta tags, Open Graph/Twitter Cards, and TouristAttraction schema markup
- **Responsive Typography** (2025-08-18) - Mobile-optimized font sizes using Material-UI breakpoints  
- **Enhanced Map Preferences** (2025) - Map labels toggle and localStorage persistence with Redux state management

## Upcoming Development Tasks

### CRITICAL PRIORITY 🚨

#### 1. Code Standards Compliance (CLAUDE.md Rules Violations)

**Task:** Fix violations of global CLAUDE.md coding standards throughout the codebase
**Priority:** CRITICAL - Code quality, type safety, and maintainability

**🟡 REMAINING MINOR IMPROVEMENTS:**

1. **Architecture Pattern Verification**
   - **Rule**: Apply Hybrid Container/Hooks Pattern correctly
   - **Components to Review**: `SitesMap.tsx`, `SiteCardContent.tsx` - verify complexity vs pattern usage

2. **Component Naming Consistency**
   - **Rule**: Consistent naming patterns
   - **Action**: Quick verification of all `*Page.tsx` components

**Current Compliance Status:** ~90% ✅

**Remaining Work:**
- Architecture pattern verification (20-30 min)
- Component naming consistency check (5 min)

### CRITICAL PRIORITY 🚨

#### 1.2. Project Documentation & Developer Experience

**Task:** Create missing standard documentation files for better developer onboarding
**Priority:** CRITICAL - Developer experience and project accessibility

**Missing Documentation:**

1. **Root README.md** - No main project README exists
   - **Issue**: Poor first impression for new developers
   - **Content**: Project overview, quick start, architecture summary, key features
   - **Template**:
     ```markdown
     # Takeoff Info - Paragliding Sites Bulgaria
     > Comprehensive paragliding sites application with bilingual support

     ## Quick Start
     npm start                # Start development servers
     npm run build           # Production build
     npm run typecheck       # Type checking

     ## Architecture
     - Backend: Node.js + Express + GraphQL + MongoDB
     - Frontend: React 19 + TypeScript + Material-UI
     - See CLAUDE.md for detailed guidance
     ```

2. **Frontend README.md** - Currently generic Vite template
   - **Issue**: No project-specific frontend guidance
   - **Content**: Frontend-specific setup, component structure, development workflow

3. **Contributing Guidelines** - Missing CONTRIBUTING.md
   - **Content**: Code review process, development workflow, standards

**Implementation Steps:**
1. Create comprehensive root README.md with project overview
2. Replace generic frontend README.md with project-specific content
3. Add CONTRIBUTING.md with development guidelines
4. Consider adding deployment documentation

**Benefits:**
- Improved developer onboarding experience
- Clear project overview for stakeholders
- Standardized contribution process
- Better project discoverability and professionalism

### HIGH PRIORITY 🔴

#### 2. Image Slideshow for Site Detail View

**Task:** Implement interactive image slideshow component for site detail pages
**Priority:** HIGH - Enhanced user experience

**Requirements:**

1. **Auto-slide Functionality**
   - Automatic slideshow with 3-second intervals
   - Auto-advance stops permanently once user manually interacts
   - Smooth transitions between images

2. **Manual Controls**
   - Drag/swipe left/right navigation
   - Touch support for mobile devices
   - Optional navigation dots or arrows

3. **Integration**
   - Position at bottom of SiteDetailView component
   - Display site gallery images
   - Fallback for sites without images

4. **User Experience**
   - Responsive design for all screen sizes
   - Smooth animations and transitions
   - Clear visual indicators for navigation
   - Accessibility support (keyboard navigation)

**Technical Implementation:**
- Create reusable ImageSlideshow component
- Integrate with existing site.galleryImages data
- Handle different image aspect ratios
- Optimize for performance (lazy loading, image compression)

### MEDIUM PRIORITY 🟡

#### 3. Internationalization (i18n)

**Task:** Translate everything into Bulgarian and create language switch functionality
**Description:**

- Implement complete Bulgarian translation for the entire application
- Create language switching functionality between English and Bulgarian
- Set up i18n infrastructure using React i18next or similar
- Translate all UI text, error messages, and content
- Implement language persistence (localStorage/cookies)
- Add language toggle in the UI

**Current State:**

- Mixed Bulgarian/English content exists
- Some components already have bilingual support via `LocalizedText`
- Need systematic approach for UI translations

**Implementation Steps:**

1. Set up i18n library (react-i18next)
2. Extract all hardcoded text into translation files
3. Create comprehensive Bulgarian translation
4. Add language switcher component
5. Implement language persistence
6. Update all components to use translation hooks

**Benefits:**

- Full Bulgarian localization
- Better user experience for Bulgarian users
- Foundation for additional languages in future
- Professional, polished application

### Technical Requirements

#### Language Switch Implementation

- Toggle button in main navigation
- Persistent language selection
- Graceful fallbacks for missing translations
- SEO-friendly language switching
- Update document language attribute

#### Translation Coverage

- All UI components and pages
- Error messages and notifications
- Form labels and validation messages
- Navigation and menu items
- Footer and legal text
- Meta tags and SEO content

---

## Current Issues & Known Problems

### Wind Filter Button Toggle Issue

**Problem**: Wind filter button doesn't properly close filter when clicked while filter is open. Button click and outside click handler interfere with each other.

**Current Behavior**: 
- Filter closed: Button opens filter correctly
- Filter open: Button click doesn't close filter as expected

**Workaround**: Use outside click to close filter
**Status**: Manual fix needed

### Maintenance Mode Implementation

**Feature**: 503 error detection triggers maintenance mode
- Shows "WebApp under construction" dialog
- Hides bottom navigation during maintenance
- Automatically activates on any GraphQL 503 error

### MongoDB Session Store

**Fix Applied**: Replaced default MemoryStore with MongoDB-backed sessions using connect-mongo
- Eliminates "MemoryStore not designed for production" warning
- Sessions persist in database for scalability
- Maintains existing CSRF protection functionality

### Gateway Middleware Production Conflict (DISABLED)

**Issue**: Gateway middleware bypassed on root URL (`/`) in production environment
- **Root Cause**: CloudLinux/Passenger static file serving takes precedence over Node.js routing
- **Behavior**: Web server serves `frontend/dist/index.html` directly for `/`, bypassing Node.js app
- **Testing Confirmed**: Renaming `index.html` → gateway works, restoring file → gateway bypassed
- **Status**: **DISABLED** - Middleware commented out in `src/app.ts`
- **Files Preserved**: All gateway files kept for potential future solutions
- **Alternative Solutions**: Require web server configuration changes or static file restructuring


## Project Overview

This is "Takeoff Info" - a paragliding sites application for Bulgaria with a Node.js/Express backend and React frontend. The application manages paragliding site information including wind directions, locations, access options, and landing fields in both Bulgarian and English.

## Architecture

### Backend (Node.js + Express + MongoDB)

- **Entry point**: `app.ts` - Express server running on port 3000
- **Database**: MongoDB with Mongoose ODM, connected via `config/database.ts`
- **API Routes**: GraphQL API at `/graphql` with remaining REST endpoints at `/api` for file uploads and development utilities
- **Models**: Mongoose schemas in `models/` directory
- **Data Model**: Flying sites with bilingual support (Bulgarian/English)

### Frontend (React + TypeScript + Vite)

- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit with RTK Query for API calls
- **UI Framework**: Material-UI (MUI) with custom theme
- **Routing**: React Router v7
- **Build Tool**: Vite with dev server proxy to backend

### Key Data Structures

- **FlyingSite**: Main entity with bilingual fields, wind directions, coordinates, access options
- **LocalizedText**: Object with `bg` (Bulgarian) and `en` (English) properties
- **WindDirection**: Enum for 16 compass directions (N, NNE, NE, etc.)
- **Location**: GeoJSON Point with coordinates array [longitude, latitude]
- **CustomError**: Extended Error interface with `status`, `isValidationError`, and `errors` properties


## Key Configuration

### Development Setup

- Backend runs on port 3000
- Frontend dev server proxies `/api` requests to backend ??? is it true?
- MongoDB connection requires `MONGO_URI` environment variable
- TypeScript compilation outputs to `dist/` directory

### Database

- MongoDB collection: "paragliding"
- Custom mixed-type `_id` fields for sites, default MongoDB ObjectId for users
- Mongoose schemas with strict validation

### Frontend Architecture

- **Store**: Redux store in `frontend/src/store/`
- **API Layer**: Redux Toolkit slices with async thunks for backend communication
- **Components**: Reusable UI components in `frontend/src/components/`
- **Pages**: Route components in `frontend/src/pages/`
- **Hooks**: Custom hooks in `frontend/src/hooks/`

## Important Implementation Details

### API Endpoints

**GraphQL Endpoint:**

- `POST /graphql` - Single GraphQL endpoint for all site operations

**Available GraphQL Operations:**

- `sites` - List all sites
- `site(id: ID!)` - Get single site
- `sitesByWindDirection(directions: [WindDirection!])` - Filter sites by wind
- `createSite(input: SiteInput!)` - Create new site
- `updateSite(id: ID!, input: SiteInput!)` - Update site
- `deleteSite(id: ID!)` - Delete site

**Remaining REST Endpoints:**

- `POST /api/image/upload` - Upload images (multipart handling)
- `DELETE /api/image/:filename` - Delete images
- `POST /api/image/generate-thumbnails/:filename` - Generate thumbnails
- `GET /api/auth/test-email` - Test email service (development)

### State Management Pattern

- Redux Toolkit slices with async thunks for server state management
- Separate slices for sites data, loading states, and errors
- Manual cache invalidation and state updates

### Bilingual Support

- All user-facing text stored in `LocalizedText` objects
- UI components should handle both `bg` and `en` properties
- Forms collect bilingual input where applicable

### Error Handling

- **Global Error Handler**: All errors are processed through a centralized middleware in `app.ts`
- **Controller Pattern**: Controllers use `next(error)` to forward errors to global handler
- **Custom Error Types**: `CustomError` interface in `models/sites.ts` provides structured error handling
- **Error Categories**: Validation errors, database errors, HTTP status errors all handled consistently
- **No Direct HTTP Responses**: Controllers never send error responses directly - all go through global handler

### Type Safety

- Shared type definitions between frontend (`types.ts`) and backend models
- Strict TypeScript configuration with additional safety checks
- Form validation and API response typing
- Custom error interfaces for structured error handling

## Environment Requirements

### Development

- Node.js (ES modules enabled)
- MongoDB instance
- MONGO_URI environment variable for database connection


## Planned User Management System

### Overview

Implementing admin-controlled user registration with two-step activation process:

- Anonymous users: read-only access, can suggest edits/creations
- Authenticated users: create and edit sites
- Admin users (id:1): create email-only accounts and approve suggestions

### Registration Flow

#### Step 1: Admin Account Creation

- Admin creates accounts with email only (multiple emails via dynamic form)
- Accounts created with: id, email, isActive:false

#### Step 2: Public Account Activation

- Public page where anyone can enter email for activation
- If email exists in database → generate 7-minute token + send activation email
- If email doesn't exist → same "you will receive an email..." message (prevents enumeration)
- User completes username/password form via token link
- Success → isActive:true, token cleared
- Timeout → token deleted

### Security Implementation

#### XSS Protection

- Helmet middleware with Content Security Policy
- CSP restricts scripts/styles to self-hosted only
- Input sanitization via express-validator

#### CSRF Protection

- Session-based CSRF tokens
- Session-based CSRF protection via custom headers (X-Requested-With)
- `X-CSRF-Token` header validation on state-changing requests
- Frontend `fetchWithCsrf` utility for automatic token inclusion
- Auth endpoints exempt (use JWT authentication)

#### CORS Protection

- Dynamic origin configuration based on environment
- Development: localhost only
- Production: any subdomain of `borislav.space`

#### Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 attempts per 15 minutes per IP

#### Additional Security

- Body size limits (10mb)
- Secure session configuration
- HTTP security headers via Helmet

### API Endpoints (Security-Protected)

#### GraphQL Operations (CSRF Protected)

- `POST /graphql` - All site and auth operations via GraphQL
  - **Auth mutations**: `login`, `requestActivation`, `activateAccount`, `createUserAccounts`
  - **Auth queries**: `validateToken`, `constants`
  - **Site queries**: `sites`, `site`, `sitesByWindDirection`
  - **Site mutations**: `createSite`, `updateSite`, `deleteSite`, `unsetSiteFields`

#### Legacy REST Endpoints

- **Image Operations** (multipart handling required):
  - `POST /api/image/upload` - Upload images
  - `DELETE /api/image/:filename` - Delete images
  - `POST /api/image/generate-thumbnails/:filename` - Generate thumbnails

**Image Storage System:**

- **Format standardization**: All uploads converted to `.jpg` format regardless of input (.png, .JPG, .jpeg, etc.)
- **Naming**: Timestamp prefix + original name + `.jpg` (e.g., `1755472200000-MyPhoto.jpg`)
- **Generated sizes**: 3 versions created automatically with same filename:
  - `/gallery/thmb/filename.jpg` (thumbnail - 300px width, 92% quality)
  - `/gallery/small/filename.jpg` (small - 960px width, 96% quality)
  - `/gallery/large/filename.jpg` (large - 1960px width, 96% quality)
- **Deletion**: When image/site deleted, all 4 files (original + 3 sizes) removed from filesystem
- **Benefits**: Prevents duplicates, consistent format, predictable paths, simplified deletion
- **Development Utilities**:
  - `GET /api/auth/test-email` - Test email service

#### Security Utilities

- `GET /api/csrf-token` - Retrieve CSRF token for session

### Environment Variables Required

```bash
MONGO_URI=mongodb-connection-string
SMTP_PASS=email-password
SESSION_SECRET=session-secret-key (production)
NODE_ENV=production|development
```

### Production Deployment Configuration

**Target Environment:**

- **Server**: borislav.space subdomain
- **Node.js**: 18.20.8 LTS (production server)
- **Development**: Node.js 24.2.0 (local) - fully compatible

**Production Environment Variables:**

```bash
NODE_ENV=production
PORT=3000
SESSION_SECRET=<64-character-random-string>  # Generate: openssl rand -base64 64
JWT_SECRET=<64-character-random-string>      # Generate: openssl rand -base64 64
MONGO_URI=mongodb://localhost:27017/paragliding-production
SMTP_HOST=mail.borislav.space
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=fly@borislav.space
SMTP_PASS=<production-email-password>
FROM_EMAIL=noreply@borislav.space
FRONTEND_URL=https://your-subdomain.borislav.space
```

**Security Notes:**
- ⚠️ **CRITICAL**: Generate unique 64+ character secrets for production
- 📧 Email functionality requires valid SMTP credentials
- 🌐 Frontend URL must match your actual domain for email links

**CORS Configuration:**

- Configured for `*.borislav.space` subdomains in production
- See `app.ts` `getAllowedOrigins()` function
- Development: localhost only

**Build Configuration:**

- Frontend: Vite production build (867KB bundle, 275KB gzipped)
- Backend: TypeScript compiled to `dist/`
- Assets: Served from `/gallery` static directory
- Fonts: Optimized Comfortaa family

**Deployment Checklist:**

1. **Pre-deployment (Local):**

   - ✅ Production build tested and working
   - ✅ Update SMTP_PASS in .env for new mail account
   - ✅ Set NODE_ENV=production in .env
   - ✅ All files ready for upload

2. **Files to Upload to Server:**

   ```
   /app-root/                 # Web root directory
   ├── dist/                  # ✅ Compiled backend (Node.js)
   ├── frontend/dist/         # ✅ Built frontend (static files)
   ├── gallery/               # ✅ Create empty directory for uploads
   ├── package.json           # ✅ Dependencies list
   ├── package-lock.json      # ✅ Version locks
   └── .env                   # ✅ Environment variables (with MongoDB connection)
   ```

3. **Server Setup Commands:**

   ```bash
   # Install only production dependencies
   npm install --production

   # Create gallery directory if not exists
   mkdir -p gallery
   chmod 755 gallery

   # Start the application (LiteSpeed compatibility)
   node dist/server.cjs
   
   # Alternative: Direct ES module (if supported)
   # node dist/app.js
   ```

4. **Web Server Configuration:**

   - **Document root**: `/app-root/frontend/dist/` (serve static frontend)
   - **API proxy**: `/api`, `/graphql`, `/gallery` → `http://localhost:3000`
   - **HTTPS**: Required for production
   - **File uploads**: Max 10MB (configured in app)

5. **Process Management:**

   ```bash
   # Simple start (LiteSpeed compatible)
   NODE_ENV=production node dist/server.cjs

   # With PM2 (recommended)
   pm2 start dist/server.cjs --name "paragliding-app"
   pm2 startup  # Auto-start on server reboot
   pm2 save     # Save current process list
   
   # Alternative: Direct ES module (if server supports)
   # pm2 start dist/app.js --name "paragliding-app"
   ```

6. **Verification Steps:**
   - ✅ Frontend loads at https://subdomain.borislav.space
   - ✅ GraphQL endpoint responds at /graphql
   - ✅ Image uploads work (/gallery accessible)
   - ✅ Database connection established
   - ✅ Email service working with new SMTP account

### Frontend Security Integration

- `fetchWithCsrf` utility automatically handles CSRF tokens
- Token caching with 10-minute refresh
- All state-changing operations protected
- Session credentials included in requests

## Development Roadmap

### Phase 4: Pre-Deployment

11. **Production Environment** - Add SESSION_SECRET and other production configs
12. **End-to-End Testing** - Complete authentication flow validation
13. **Subdomain Deployment** - Configure for deployment on borislav.space subdomain

### Production Build Status

#### ✅ **Build Process Validated (Ready for Deployment)**

**Backend Build:** ✅ **WORKING**

- TypeScript compilation successful
- Path alias resolution working
- GraphQL import fixes applied
- Ready for production deployment

**Frontend Build:** ⚠️ **FUNCTIONAL WITH KNOWN ISSUES**

- Build process works but has ~40 TypeScript strict type errors
- Issues are related to `exactOptionalPropertyTypes: true` configuration
- **Does not prevent deployment** - these are type safety improvements

#### 🔧 **Technical Debt Identified**

**TypeScript Strict Type Issues (~40 errors):**

- `exactOptionalPropertyTypes` compliance needed
- Null/undefined safety improvements required
- Optional property type definitions need refinement
- Event handler type signatures need updates

**Priority:** Low - these are code quality improvements, not blocking issues

**Next Steps for Production:**

1. ✅ **Deploy current codebase** (backend + frontend working)
2. 🔄 **Address TypeScript strict types** in follow-up iteration
3. 🔄 **Implement remaining keyboard navigation features**

### Design Philosophy

- **Hidden Authentication**: No visible login button - only those who need access know about it
- **Clean Anonymous UX**: Regular users see read-only site without auth UI clutter
- **Progressive Enhancement**: Authenticated users get additional functionality seamlessly

### Phase 5: SEO-First Development Plan

**Priority Order:**

1. **SEO Optimization (Immediate)**

   - **Phase 1**: React Helmet + URL structure (`/sites/kunino`, dynamic titles)
   - **Phase 2**: Bot detection + pre-rendering for search engines
   - Sitemap generation for better crawling
   - Open Graph and Twitter Card support

2. **Performance Optimization**

   - DataLoader for batching database queries
   - Query optimization and N+1 problem prevention
   - Caching strategies for frequently accessed data
   - Core Web Vitals optimization

3. **Testing Migration**

   - Update existing tests for GraphQL resolvers
   - Integration tests for GraphQL endpoints
   - Test new SEO URL structure and meta tags
   - Type safety validation

4. **Documentation Updates**
   - GraphQL schema documentation
   - API endpoint documentation
   - Frontend query examples
   - SEO implementation guide

**Rationale**: SEO provides immediate business value and establishes URL foundation that other phases will build upon.

---

## Applied Functionalities & Completed Features

### ✅ Hybrid Container/Hooks Architecture (2024)

**Implementation Summary:**
Successfully implemented a hybrid approach combining container/component pattern with direct hooks usage, eliminating unnecessary abstraction while maintaining structure where it adds value.

**Converted Components (Direct Hooks):**

- **NotFoundHandler** - Simple logging with useEffect
- **SiteCardContent** - Direct useAuth for authentication state
- **UserIconGroup** - Direct useAuth + useNavigate + migration logic
- **WindDirectionFilter** - Direct Redux hooks for filter state
- **NotificationDialog** - Direct timer logic with useEffect/useCallback

**Maintained Container Pattern:**

- **Complex Business Logic**: SitesList, SitesMap, all page components
- **Reusable Components**: SiteCard, DeleteConfirmDialog
- **Multi-state Components**: Components with data fetching, validation, side effects

**Results Achieved:**

- **40% reduction** in boilerplate files (5 containers removed)
- **Improved Developer Experience** for simple components
- **Clear decision criteria** documented in global CLAUDE.md
- **Type safety maintained** with proper cleanup of unused types
- **All existing functionality preserved**

**Architecture Guidelines Established:**

- Simple logic (≤15 lines) → Direct hooks
- Complex logic (>15 lines) → Container/component pattern
- Reusable components → Always use containers
- Single-use utilities → Direct hooks approach

This implementation serves as a reference for future component architecture decisions and demonstrates successful balance between simplicity and structure.

### ✅ Bundle Size Optimization & Performance Improvements (January 2025)

**Implementation Summary:**
Successfully implemented core bundle optimization strategies focusing on Material-UI tree-shaking and Leaflet lazy loading to improve initial load performance.

**Optimization Strategies Applied:**

- **Material-UI Tree-Shaking**: Converted barrel imports to individual imports across key components
- **Leaflet Lazy Loading**: Implemented route-based code splitting for map functionality
- **Manual Chunk Splitting**: Configured Vite for better vendor library caching
- **Component-Level Optimization**: Applied optimizations to high-impact components

**Technical Implementation:**

- **LazyMap Component**: Created lazy-loaded wrapper for SitesMap with Suspense fallback
- **Import Optimization**: Updated 4 core components (SiteDetailView, SitesMap, SitesList, LazyMap)
- **Build Configuration**: Enhanced vite.config.ts with manual chunk splitting

**Performance Results:**

- **Reduced Bundle Size**: Only required MUI components bundled (tree-shaking effective)
- **Conditional Loading**: Leaflet (~200KB) loads only when map view accessed
- **Better Caching**: Separate vendor chunks improve repeat visit performance
- **User Experience**: Loading states for asynchronous chunk loading

**Files Optimized:**

- `frontend/src/components/site/SiteDetailView.tsx` - 8 MUI component imports
- `frontend/src/components/main/SitesMap.tsx` - 4 MUI component imports
- `frontend/src/components/main/SitesList.tsx` - 4 MUI component imports
- `frontend/src/components/main/LazyMap.tsx` - New lazy loading wrapper
- `frontend/vite.config.ts` - Manual chunk configuration

**Architecture Benefits:**

- **List View Priority**: Users who prefer list view get faster initial loads
- **Progressive Enhancement**: Map functionality loads seamlessly when needed
- **Maintenance Efficiency**: Clear separation between critical and optional components
- **Development Workflow**: TypeScript compilation and builds remain fast

This optimization provides immediate performance benefits and establishes a foundation for future lazy loading implementations across other application routes.

### ✅ Font Loading Optimization & Preloading (January 2025)

**Implementation Summary:**
Successfully implemented comprehensive font optimization strategies to improve initial page load performance and eliminate layout shift from font loading.

**Optimization Strategies Applied:**

- **Font Preloading**: Added `<link rel="preload">` tags for all three Comfortaa font variants in HTML head
- **Modern Format Priority**: Optimized font declarations to use only WOFF2 and WOFF formats
- **Font Display Optimization**: Implemented `font-display: swap` to prevent invisible text during font load
- **Legacy Format Removal**: Eliminated EOT, TTF, and SVG format declarations

**Technical Implementation:**

- **HTML Preloading**: Added preload links for `comfortaa-regular`, `comfortaa-light`, and `comfortaa-bold` WOFF2 fonts
- **CSS Optimization**: Streamlined `@font-face` declarations in `frontend/src/index.css`
- **Format Prioritization**: WOFF2 first (best compression), WOFF fallback (broad support)

**Performance Results:**

- **Faster Font Loading**: Browser fetches critical fonts immediately during HTML parsing
- **Reduced Bundle Size**: ~60% reduction in font format declarations
- **Better User Experience**: `font-display: swap` shows fallback text immediately instead of blank space
- **Modern Browser Support**: WOFF2 + WOFF covers 99%+ of browsers

**Files Optimized:**

- `frontend/index.html` - Added font preloading links
- `frontend/src/index.css` - Optimized font-face declarations with modern formats only

**Architecture Benefits:**

- **Immediate Load Improvement**: Critical fonts load in parallel with other resources
- **Fallback Strategy**: Graceful degradation for older browsers with WOFF support
- **Maintenance Simplicity**: Fewer font formats to manage and deploy
- **Foundation for Future**: Establishes pattern for additional font optimizations

This optimization eliminates one of the largest performance bottlenecks and provides immediate improvements to user experience across all devices and network conditions.
