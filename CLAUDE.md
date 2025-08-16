# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
