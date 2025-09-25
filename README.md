# Takeoff Info - Paragliding Sites Bulgaria

> Comprehensive paragliding sites application with bilingual support (Bulgarian/English)

A full-stack web application for managing and discovering paragliding takeoff sites across Bulgaria, featuring wind direction filtering, interactive maps, site management, and user authentication.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development servers (backend + frontend)
npm start

# Production build
npm run build

# Run tests
npm test

# Type checking
npm run check
```

## 🏗️ Architecture

### Backend
- **Node.js + Express** - REST API and GraphQL server
- **MongoDB + Mongoose** - Database with custom schemas
- **GraphQL** - Modern API with type-safe queries/mutations
- **JWT Authentication** - Secure user sessions
- **Sharp + Multer** - Image processing and uploads

### Frontend
- **React 19 + TypeScript** - Modern UI with strict typing
- **Redux Toolkit + Async Thunks** - State management and API calls
- **Material-UI (MUI)** - Component library with custom theming
- **React Router v7** - Client-side routing
- **Vite** - Fast build tool with dev server

### Key Features
- 🌐 **Bilingual Support** - Complete Bulgarian/English localization
- 🗺️ **Interactive Maps** - Leaflet integration with site markers
- 🌪️ **Wind Direction Filtering** - 16-point compass filtering
- 📱 **Responsive Design** - Mobile-first approach
- 🔐 **User Authentication** - Admin-controlled registration system
- 📸 **Image Management** - Multi-size image processing (thumbnail/small/large)
- 🔍 **SEO Optimization** - Dynamic meta tags, Open Graph, schema markup

## 📂 Project Structure

```
├── src/                      # Backend (Node.js + Express)
│   ├── graphql/             # GraphQL schema, resolvers, scalars
│   ├── middleware/          # Auth, CORS, error handling
│   ├── models/              # Mongoose schemas
│   ├── services/            # Business logic (images, email, tokens)
│   ├── utils/               # Utilities and helpers
│   └── types/               # TypeScript type definitions
├── frontend/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── containers/      # Container/component pattern
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Redux store and slices
│   │   ├── types/           # Frontend type definitions
│   │   └── utils/           # Frontend utilities
│   └── dist/                # Built frontend assets
├── gallery/                 # Image storage (original/thmb/small/large)
└── dist/                    # Built backend (TypeScript compiled)
```

## 🔧 Development Commands

```bash
# Development
npm start                    # Start both backend and frontend
npm run start:backend        # Backend only (TypeScript watch)
npm run start:frontend       # Frontend only (Vite dev server)

# Building
npm run build               # Full build (backend + frontend)
npm run build:backend       # Compile TypeScript to dist/
npm run build:frontend      # Build React app for production

# Quality & Testing
npm run typecheck          # TypeScript compilation check
npm run check              # Typecheck + frontend lint
npm test                   # Run tests in watch mode
npm run test:run           # Run all tests once

# Production
npm run build:preview      # Build + preview production setup
```

## 🗃️ Database Schema

### FlyingSite Collection
- **Custom mixed `_id`** - Numeric IDs for user-friendly URLs
- **Bilingual content** - `LocalizedText` objects with `bg`/`en` properties
- **Wind directions** - Array of 16-point compass directions
- **Location** - GeoJSON Point with coordinates
- **Gallery images** - Multiple sizes with metadata
- **Access options** - Categorized approach types

### User Management
- **Admin-controlled registration** - Email-only account creation
- **Two-step activation** - Token-based account completion
- **Role-based access** - SuperAdmin vs Active User permissions

## 🎨 UI/UX Features

### Design System
- **Material-UI Theming** - Custom Comfortaa font, responsive breakpoints
- **Component Architecture** - Hybrid container/hooks pattern
- **Type-Safe Props** - Centralized interface definitions
- **Accessibility** - ARIA labels, keyboard navigation

### Responsive Layout
- **Mobile-first** - Optimized for all screen sizes
- **Bottom Navigation** - Touch-friendly mobile navigation
- **Progressive Enhancement** - Works without JavaScript

## 🔐 Authentication Flow

1. **Admin Creates Accounts** - Email-only registration
2. **Public Activation** - Users activate via email token
3. **Role-Based Access**:
   - **Anonymous** - Read-only site access
   - **Active Users** - Create/edit sites
   - **Super Admin** - User management + migrations

## 📸 Image Processing Pipeline

All uploaded images are automatically processed into 4 formats:
- **Original** - Converted to `.jpg` regardless of input format
- **Thumbnail** - 300px width, 92% quality (`/gallery/thmb/`)
- **Small** - 960px width, 96% quality (`/gallery/small/`)
- **Large** - 1960px width, 96% quality (`/gallery/large/`)

## 🌐 SEO & Performance

- **Dynamic Meta Tags** - Per-page titles, descriptions, Open Graph
- **Sitemap Generation** - Automatic XML sitemap for search engines
- **Schema Markup** - TouristAttraction structured data
- **Font Optimization** - Preloaded WOFF2 fonts with fallbacks
- **Bundle Optimization** - Tree-shaking, code splitting, lazy loading

## 🚀 Recent Achievements (2025-09-25)

### ✅ CLAUDE.md Compliance Refactoring
- **Type Safety Restoration** - Eliminated all `any` types from codebase
- **GraphQL Context System** - Proper auth contexts (`PublicGraphQLContext` + `AuthenticatedGraphQLContext`)
- **Type Centralization** - Moved all inline interfaces to `frontend/src/types/components.ts`
- **Clean Architecture** - Hybrid container/hooks pattern implementation
- **Test Coverage** - All 35 tests passing with proper mocking

### 📊 Current Status
- **CLAUDE.md Compliance**: ~90% ✅
- **TypeScript Strict Mode**: Full compliance
- **Test Coverage**: 35/35 tests passing
- **Build Status**: Zero errors/warnings
- **Code Quality**: ESLint + Prettier compliant

## 🔧 Environment Setup

### Required Environment Variables
```bash
# Database
MONGO_URI=mongodb://localhost:27017/paragliding

# Authentication
JWT_SECRET=your-64-character-secret
SESSION_SECRET=your-64-character-secret

# Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-email
SMTP_PASS=your-password
FROM_EMAIL=noreply@yourdomain.com

# Frontend URL (for email links)
FRONTEND_URL=https://yourdomain.com
```

### Development Dependencies
- **Node.js** 18.20.8+ (ES modules enabled)
- **MongoDB** 4.4+
- **Sharp** (native image processing)

## 🚀 Deployment

### Production Build
1. **Environment**: Set `NODE_ENV=production`
2. **Build**: `npm run build` (creates `dist/` and `frontend/dist/`)
3. **Upload**: Backend (`dist/`), frontend (`frontend/dist/`), `package.json`
4. **Install**: `npm install --production`
5. **Start**: `node dist/server.cjs` (CommonJS wrapper for LiteSpeed compatibility)

### Server Configuration
- **Document Root**: `frontend/dist/` (static files)
- **API Proxy**: `/api`, `/graphql`, `/gallery` → `http://localhost:3000`
- **Process Management**: PM2 recommended
- **HTTPS**: Required for production

## 📖 Additional Documentation

- **CLAUDE.md** - Development guidance and current status
- **SEO.md** - Complete SEO implementation details
- **Frontend Architecture** - See `frontend/src/types/components.ts` for patterns

## 🤝 Contributing

1. Follow TypeScript strict mode (no `any` types)
2. Use centralized type definitions
3. Apply hybrid container/hooks pattern
4. Run `npm run check` before commits
5. All tests must pass

---

**Built with ❤️ for the Bulgarian paragliding community**