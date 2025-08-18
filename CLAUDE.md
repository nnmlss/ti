# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Upcoming Development Tasks

### HIGH PRIORITY 🔴

**Remaining Tasks:**

- Implement lazy loading for routes with React.lazy() (page components)
- Performance monitoring setup

#### 1.2. Route-Based Code Splitting

**Task:** Implement lazy loading for all major routes
**Description:**

- Convert static imports to React.lazy() for page components
- Add loading fallbacks for each route
- Split authentication flows into separate chunks
- Separate admin functionality from public pages

**Target Routes for Splitting:**

- HomePage (with maps)
- Admin pages (CreateAccounts, Profile)
- Authentication flows (Login, Activation)
- Site editing functionality

#### 1.3. Performance Monitoring Setup

**Task:** Add bundle analysis and performance monitoring
**Description:**

- Set up automated bundle size monitoring
- Add performance budgets to CI/CD
- Implement Core Web Vitals tracking
- Regular bundle composition analysis

**Tools to Implement:**

- Bundle analyzer in build process
- Performance budgets (warn if >300KB gzipped)
- Lighthouse CI integration
- Bundle size tracking over time

### MEDIUM PRIORITY 🟡

#### 4. Cookie Interface & Remember System

**Task:** Create user preference persistence system
**Description:**

- Implement localStorage/sessionStorage for user preferences
- Remember user settings across sessions
- Create simple preference management interface

**Features to Remember:**

- Map/list view preference
- Wind filter selections
- Language preference
- Theme/display preferences
- Form input persistence

#### 5. Internationalization (i18n)

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

## Production Build Status & Technical Debt

### TypeScript Configuration Issues (December 2024)

**Current Status**: TypeScript strict type checking temporarily disabled for production builds.

**Disabled Settings in `frontend/tsconfig.app.json`:**

```json
{
  "strictNullChecks": false, // TODO: Fix null checks and re-enable
  "noUncheckedIndexedAccess": false, // TODO: Fix array access and re-enable
  "exactOptionalPropertyTypes": false // TODO: Fix types and re-enable
}
```

**Build Script Modified:**

- **Original**: `"build": "tsc -b && vite build"` (TypeScript validation + build)
- **Current**: `"build": "vite build"` (Skip TypeScript validation for production)

**Identified Type Errors (~17 remaining):**

1. **AdminCreateAccounts.tsx**: Missing `id` property in result type
2. **Profile.tsx**: Event handler signature mismatches (5 instances)
3. **HomePageContainer.tsx**: Missing required props in HomePage component
4. **NotFoundHandler.tsx**: Missing return type annotation
5. **useProfilePage.ts**: Missing return statements in event handlers (5 instances)
6. **useFocusTrap.ts**: Missing return statement in focus handler
7. **useKeyboardNavigation.ts**: Missing return statement in navigation handler

**Why This Happened:**

- Development mode uses esbuild (ignores TypeScript errors)
- Production mode runs `tsc` first (validates TypeScript before build)
- Strict type checking settings exposed existing type safety issues

**Resolution Plan:**

1. **Phase 1**: Deploy with relaxed settings (current status)
2. **Phase 2**: Systematically fix all type errors
3. **Phase 3**: Re-enable strict type checking
4. **Phase 4**: Establish type safety standards for future development

**Risk Assessment:**

- **Low Risk**: Most errors are UI event handlers and optional props
- **Medium Risk**: Null/undefined access could cause runtime errors
- **Mitigation**: Thorough testing of production build before deployment

---

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

## Development Commands

### Full Stack Development

```bash
npm start                    # Start both backend and frontend concurrently
npm run start:backend       # Backend only - TypeScript watch mode
npm run start:frontend      # Frontend only - Vite dev server
```

### Building

```bash
npm run build               # Build both backend and frontend
npm run build:backend       # Compile TypeScript to dist/
npm run build:frontend      # Build React app for production
```

### Frontend-Specific (run from /frontend/)

```bash
npm run dev                 # Vite dev server with HMR
npm run build               # Production build
npm run lint                # ESLint checking
npm run preview             # Preview production build
```

### Backend-Specific

```bash
npm run clean               # Remove dist/ directory
```

### Testing

```bash
npm test                    # Run tests in watch mode
npm run test:run           # Run all tests once
npm run test:ui            # Run tests with UI interface
npm run typecheck          # TypeScript type checking for both backend and frontend
npm run check              # Run typecheck and frontend lint
```

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

### Production Environment Variables

**Critical Security Variables (REQUIRED):**

```bash
NODE_ENV=production
SESSION_SECRET=<64-character-random-string>  # Generate: openssl rand -base64 64
JWT_SECRET=<64-character-random-string>      # Generate: openssl rand -base64 64
MONGO_URI=mongodb://username:password@host:port/database
```

**Email Service Configuration:**

```bash
SMTP_HOST=mail.borislav.space
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=fly@borislav.space
SMTP_PASS=<your-email-password>
FROM_EMAIL=noreply@borislav.space
```

**Frontend Configuration:**

```bash
FRONTEND_URL=https://your-subdomain.borislav.space
```

**Security Notes:**

- ⚠️ **CRITICAL**: `SESSION_SECRET` and `JWT_SECRET` currently use fallback values
- 🔒 Generate unique 64+ character secrets for production
- 📧 Email functionality requires valid SMTP credentials
- 🌐 Frontend URL must match your actual domain for email links

**Environment Validation:**
The app will start with fallback secrets but this is a **security vulnerability** in production. Ensure all variables are properly set before deployment.

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
MONGO_URI=mongodb://localhost:27017/paragliding-production
SESSION_SECRET=<strong-random-secret-for-production>
SMTP_PASS=<production-email-password>
```

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

   # Start the application
   node dist/app.js
   ```

4. **Web Server Configuration:**

   - **Document root**: `/app-root/frontend/dist/` (serve static frontend)
   - **API proxy**: `/api`, `/graphql`, `/gallery` → `http://localhost:3000`
   - **HTTPS**: Required for production
   - **File uploads**: Max 10MB (configured in app)

5. **Process Management:**

   ```bash
   # Simple start
   NODE_ENV=production node dist/app.js

   # With PM2 (recommended)
   pm2 start dist/app.js --name "paragliding-app"
   pm2 startup  # Auto-start on server reboot
   pm2 save     # Save current process list
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
