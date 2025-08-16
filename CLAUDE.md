# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Takeoff Info" - a paragliding sites application for Bulgaria with a Node.js/Express backend and React frontend. The application manages paragliding site information including wind directions, locations, access options, and landing fields in both Bulgarian and English.

## Architecture

### Backend (Node.js + Express + MongoDB)

- **Entry point**: `app.ts` - Express server running on port 3000
- **Database**: MongoDB with Mongoose ODM, connected via `config/database.ts`
- **API Routes**: REST API mounted at `/api` in `routes/api.ts`
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
- Frontend dev server proxies `/api` requests to backend
- MongoDB connection requires `MONGO_URI` environment variable
- TypeScript compilation outputs to `dist/` directory

### Database

- MongoDB collection: "paragliding"
- Custom numeric `_id` fields (auto-incrementing)
- Mongoose schemas with strict validation

### Frontend Architecture

- **Store**: Redux store in `frontend/src/store/`
- **API Layer**: Redux Toolkit slices with async thunks for backend communication
- **Components**: Reusable UI components in `frontend/src/components/`
- **Pages**: Route components in `frontend/src/pages/`
- **Hooks**: Custom hooks in `frontend/src/hooks/`

## Important Implementation Details

### API Endpoints

- `GET /api/sites` - List all sites
- `POST /api/site` - Create new site
- `GET /api/site/:id` - Get single site
- `PUT /api/site/:id` - Update site
- `DELETE /api/site/:id` - Delete site

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

### Implementation Plan

#### Phase 1: User Model & Database Updates ✓

1. **Update User model** - Add `email`, `invitationToken`, `tokenExpiry`, `isActive` fields
2. **Create admin user** - Manually insert user with id:1 in database

#### Phase 2: Admin Account Creation

3. **Admin account creation endpoint** - Admin-only route to create email-only accounts
4. **Dynamic email form** - Admin frontend form with + button for multiple emails
5. **Token expiry constant** - Configurable 7-minute timeout (ACTIVATION_TOKEN_EXPIRY_MINUTES)

#### Phase 3: Public Activation System

6. **Public activation page** - Email input form for account activation requests
7. **Token generation service** - Create secure tokens with expiry
8. **Email service** - Send activation emails with token links
9. **Token validation endpoint** - Verify tokens and allow username/password creation

#### Phase 4: Authentication & Authorization

10. **Login system** - Standard username/password authentication
11. **Middleware** - Protect routes based on authentication status
12. **Permission checks** - Ensure only authenticated users can create/edit sites

#### Phase 5: Future Features Foundation

13. **Suggestion system schema** - Database structure for anonymous suggestions
14. **Approval workflow** - Admin interface for managing suggestions

### Current Status

- User management system fully implemented ✓
- Email activation system working ✓ 
- JWT authentication and authorization ✓
- Admin account creation functionality ✓
- Security middleware implemented ✓
- ObjectId-based super admin system ✓

### Security Implementation

#### XSS Protection
- Helmet middleware with Content Security Policy
- CSP restricts scripts/styles to self-hosted only
- Input sanitization via express-validator

#### CSRF Protection  
- Session-based CSRF tokens
- `/api/csrf-token` endpoint for token retrieval
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

#### Authentication (Rate Limited)
- `POST /api/auth/request-activation` - Public email activation request
- `GET /api/auth/validate/:token` - Token validation
- `POST /api/auth/activate/:token` - Complete account activation  
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/create-accounts` - Admin create accounts (JWT required)

#### Sites API (CSRF Protected)
- `GET /api/sites` - List all sites (no CSRF)
- `POST /api/site` - Create site (CSRF + auth required)
- `GET /api/site/:id` - Get single site (no CSRF)  
- `PUT /api/site/:id` - Update site (CSRF + auth required)
- `DELETE /api/site/:id` - Delete site (CSRF + auth required)

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

### Phase 1: Core Security & UI Protection
1. **Route Protection** - Authenticate create/edit site endpoints with middleware
2. **UI Element Hiding** - Hide edit/delete/create buttons for non-authenticated users
3. **Frontend Auth State** - User context for authentication status management
4. **Navigation Guards** - Protect admin routes from unauthorized access

### Phase 2: Hidden Login UX
5. **User Icon Menu** - Replace "Места за летене" with user icon dropdown:
   - Profile (edit username/password)
   - Logout
   - Admin only: "Add Users" → account creation page
6. **Profile Management** - Username/password editing with validation
7. **Email Change Notifications** - Send notifications to fly@borislav.space when users change email/username
8. **Admin Menu Item** - Special "Add Users" option for user ID 1 only
9. **Logout Functionality** - Clear auth state and redirect

### Phase 3: GraphQL Migration  
10. **GraphQL Implementation** - Replace REST API with GraphQL (see GraphQL Migration Plan below)

### Phase 4: Pre-Deployment
11. **Production Environment** - Add SESSION_SECRET and other production configs
12. **End-to-End Testing** - Complete authentication flow validation
13. **Subdomain Deployment** - Configure for deployment on borislav.space subdomain

### Design Philosophy
- **Hidden Authentication**: No visible login button - only those who need access know about it
- **Clean Anonymous UX**: Regular users see read-only site without auth UI clutter
- **Progressive Enhancement**: Authenticated users get additional functionality seamlessly

## GraphQL Migration Plan

### Overview
Migrate from REST API to GraphQL for better performance, type safety, and developer experience while maintaining all existing functionality.

### Current Status: 95% Complete ⚠️ - Cleanup Pending
- **COMPLETED**: GraphQL foundation, core site CRUD operations, frontend integration, auth system migration
- **COMPLETED**: All GraphQL auth resolvers implemented, auth queries/mutations defined
- **COMPLETED**: All frontend hooks migrated to GraphQL, REST auth endpoints removed
- **REMAINING**: Legacy REST sites endpoints cleanup in backend routes

### Detailed Implementation Status

#### ✅ FULLY IMPLEMENTED (Backend)
- **GraphQL Schema**: All auth mutations (`login`, `requestActivation`, `activateAccount`, `createUserAccounts`) and queries (`validateToken`)
- **GraphQL Resolvers**: Complete auth resolver implementations in `src/graphql/resolvers/index.ts:277-471`
- **Authentication Context**: JWT extraction and user context injection working
- **Type Definitions**: All auth types (`AuthPayload`, `ActivationResponse`, etc.) defined
- **Validation & Security**: Input validation, error handling, super admin checks implemented

#### ✅ MOSTLY IMPLEMENTED (Frontend)  
- **GraphQL Queries**: All auth mutations/queries defined in `frontend/src/utils/graphqlQueries.ts:122-200`
- **Login**: Already using GraphQL (`useLoginPage.ts` updated)
- **GraphQL Client**: Configured with auth headers and CSRF handling

#### ✅ FULLY COMPLETED
- **`useActivationRequest.ts`**: ✅ Using GraphQL `REQUEST_ACTIVATION` mutation
- **`useCompleteActivationPage.ts`**: ✅ Using GraphQL `ACTIVATE_ACCOUNT` mutation  
- **`useAdminCreateAccountsPage.ts`**: ✅ Using GraphQL `CREATE_USER_ACCOUNTS` mutation
- **REST auth routes**: ✅ Removed from `src/routes/auth.ts` (only test-email endpoint remains)
- **Auth controllers**: ✅ Removed unused controller file

### ⚠️ GraphQL Migration Status: 95% Complete

**Completed steps:**
1. ✅ All frontend hooks migrated to GraphQL
2. ✅ REST auth routes removed from backend
3. ✅ Unused auth controllers removed
4. ✅ TypeScript compilation and linting successful

**Remaining cleanup tasks:**
5. 🔲 Remove legacy REST sites endpoints from `src/routes/api.ts`
6. 🔲 Remove unused sites controllers
7. 🔲 Final verification and testing
8. 🔲 Update status to 100% complete

**Current Result:** Frontend fully using GraphQL, backend auth migrated, sites endpoints cleanup pending.

### Phase 1: GraphQL Foundation ✓
1. **Install GraphQL Dependencies** ✓
   - `graphql-yoga`
   - `graphql`
   - `@graphql-tools/schema`
   - `graphql-scalars` (for custom scalars)

2. **Create GraphQL Schema** ✓
   - Type definitions for Site, User, LocalizedText
   - Custom scalars (LocalizedText, WindDirection, Location)
   - Query and Mutation root types

3. **Set Up GraphQL Yoga Server** ✓
   - GraphQL Yoga Express integration
   - Single `/graphql` endpoint
   - GraphiQL interface for development

### Phase 2: Core Resolvers ✓
4. **Site Resolvers (Query)** ✓
   - `sites: [Site]` - List all sites ✓
   - `site(id: ID!): Site` - Get single site ✓
   - `sitesByWindDirection(directions: [WindDirection!]): [Site]` ✓

5. **Site Resolvers (Mutation)** ✓
   - `createSite(input: SiteInput!): Site` ✓
   - `updateSite(id: ID!, input: SiteInput!): Site` ✓
   - `unsetSiteFields(id: ID!, fields: [String!]!): Site` ✓ (BONUS: proper field removal)
   - `deleteSite(id: ID!): Boolean` ✓

6. **Authentication Context** ✓
   - Extract JWT from Authorization header ✓
   - Inject user context into resolvers ✓
   - Replace Express middleware auth with context-based auth ✓

### Phase 3: Auth System Migration ✓
7. **Auth Resolvers** ✓
   - `login(username: String!, password: String!): AuthPayload` ✓
   - `requestActivation(email: String!): ActivationResponse` ✓
   - `validateToken(token: String!): TokenValidation` ✓
   - `activateAccount(token: String!, username: String!, password: String!): AuthPayload` ✓

8. **Admin Resolvers** ✓
   - `createUserAccounts(emails: [String!]!): [AccountCreationResult!]` ✓
   - Require `isSuperAdmin` context check ✓

9. **Error Handling** ✓
   - Custom error classes for GraphQL ✓
   - Structured error responses ✓
   - Input validation using GraphQL schema ✓

### Phase 4: Frontend Migration ✓
10. **GraphQL Client Setup** ✓
    - Chose graphql-request for simplicity ✓
    - Keep Redux slices/thunks (better for this project) ✓
    - Configure client with auth headers ✓

11. **Update React Components** ✓
    - Update Redux thunks to use GraphQL instead of REST ✓
    - Maintain existing Redux state management patterns ✓
    - Keep existing loading and error states ✓

12. **Authentication Flow** ✓ (Partial)
    - Update login to use GraphQL mutations ✓
    - Modify JWT token handling for GraphQL context ✓
    - Update admin account creation forms (3 hooks remaining)

### Phase 5: Security & Optimization
13. **Security Migration** ✓ (Partial)
    - CSRF protection for GraphQL mutations ✓
    - Rate limiting on GraphQL operations ✓ (inherited from Express)
    - Query complexity analysis and depth limiting (optional)

14. **Performance Optimization**
    - DataLoader for batching database queries
    - Query optimization and N+1 problem prevention
    - Caching strategies for frequently accessed data

15. **Testing Migration**
    - Update existing tests for GraphQL resolvers
    - Integration tests for GraphQL endpoints
    - Type safety validation

### Phase 6: Cleanup & Documentation
16. **Remove REST Infrastructure**
    - Delete REST controllers and routes
    - Remove unused Express middleware
    - Clean up import statements

17. **Documentation Updates**
    - GraphQL schema documentation
    - API endpoint documentation
    - Frontend query examples

### Phase 7: Final REST Cleanup ⚠️ (In Progress)
18. **Remove Legacy REST Sites Endpoints** 
    - Remove unused sites endpoints from `src/routes/api.ts` (lines 45-70)
    - Remove sites controller imports and dependencies  
    - Keep image upload endpoints (multipart handling required)
    - Keep test-email endpoint (development utility)

19. **Remove Unused Sites Controllers**
    - Delete `src/controllers/sites.ts` if no longer needed
    - Clean up any remaining controller imports

20. **Final Verification**
    - Run typecheck and lint to ensure no broken imports
    - Test GraphQL endpoints still work
    - Update status to 100% complete

### What Stays the Same
- **Models** - Mongoose schemas unchanged
- **Services** - Email, token, image services unchanged
- **Database** - MongoDB structure unchanged
- **Authentication** - JWT tokens and user system unchanged
- **Frontend Routes** - React Router paths unchanged (`/site/123`, `/activate`, etc.)

### What Changes
- **API Layer** - REST endpoints → GraphQL resolvers
- **Data Fetching** - Redux slices/thunks → GraphQL client
- **Error Handling** - Express error middleware → GraphQL error handling
- **Route Protection** - Express middleware → resolver-level authorization

### Benefits After Migration
- **Type Safety** - End-to-end TypeScript types from schema
- **Performance** - Single endpoint, optimized queries, reduced overfetching
- **Developer Experience** - GraphQL Playground, better tooling
- **Scalability** - Easier to add new features and fields
- **Mobile-Friendly** - Better suited for React Native apps

### Rollback Strategy
- Keep REST endpoints during parallel development
- Feature flags for gradual migration
- Database unchanged - can revert to REST if needed
