# Frontend - Takeoff Info

> React frontend for the Takeoff Info paragliding sites application

## 🏗️ Tech Stack

- **React 19** with **TypeScript** - Modern UI with strict typing
- **Redux Toolkit** - State management with async thunks
- **Material-UI (MUI)** - Component library with custom theming
- **React Router v7** - Client-side routing
- **Vite** - Fast build tool and dev server
- **React Helmet Async** - Dynamic meta tags for SEO

## 🚀 Quick Start

```bash
# Install dependencies (from project root)
npm install

# Start frontend dev server only
npm run start:frontend

# Or start full stack (backend + frontend)
npm start

# Build for production
npm run build:frontend

# Preview production build
npm run preview
```

## 📂 Architecture

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (dialogs, notifications)
│   ├── main/            # Core app components (maps, lists)
│   ├── navigation/      # Navigation components
│   ├── pages/           # Page-level components
│   ├── site/            # Site-specific components
│   └── ui/              # Basic UI elements
├── containers/          # Container/component pattern implementations
├── hooks/               # Custom React hooks
├── store/               # Redux store configuration
│   ├── slices/         # RTK Query slices
│   ├── middleware/     # Custom middleware
│   └── utils/          # Store utilities
├── types/               # TypeScript type definitions
├── utils/               # Frontend utilities
└── theme.ts            # Material-UI theme configuration
```

### Design Patterns

#### Hybrid Container/Hooks Architecture
- **Simple components (≤15 lines logic)** → Direct hooks
- **Complex components (>15 lines logic)** → Container/component pattern
- **Reusable components** → Always use containers
- **Single-use utilities** → Direct hooks approach

#### Type Safety
- **Centralized type definitions** in `src/types/`
- **No `any` types** - strict TypeScript compliance
- **Shared interfaces** between components
- **GraphQL type generation** from schema

## 🎨 Styling & Theme

### Material-UI Configuration
```typescript
// src/theme.ts
- Custom Comfortaa font family
- Responsive typography breakpoints
- Mobile-first design approach
- Consistent color palette
```

### Font Optimization
- **Preloaded fonts** - WOFF2/WOFF formats only
- **Font display: swap** - Prevents invisible text
- **Modern browser support** - 99%+ compatibility

## 🔄 State Management

### Redux Toolkit Setup
- **Store configuration** in `src/store/index.ts`
- **Async thunks** for GraphQL API calls
- **Error handling middleware** for maintenance mode
- **localStorage persistence** for user preferences

### Key Slices
- **sitesSlice** - Site data and CRUD operations
- **authSlice** - User authentication state
- **mapSlice** - Map preferences and state
- **errorSlice** - Global error handling

## 🌐 API Integration

### GraphQL Client
```typescript
// All API calls through Redux Toolkit async thunks
- fetchSites() - Load all sites
- fetchSitesByWind() - Filter by wind direction
- createSite() - Add new site
- updateSite() - Edit existing site
- deleteSite() - Remove site
```

### Error Handling
- **Maintenance mode detection** - 503 errors trigger maintenance dialog
- **User-friendly messages** - Bulgarian error translations
- **Network error recovery** - Automatic retry logic

## 🗺️ Map Integration

### Leaflet Configuration
- **Lazy loading** - Map loads only when needed (~200KB saved)
- **Custom markers** - Site-specific icons and popups
- **Responsive design** - Touch-friendly mobile controls
- **Performance optimized** - Efficient marker clustering

## 📱 Responsive Design

### Breakpoints
```typescript
theme.breakpoints.down('sm') // Mobile: <600px
theme.breakpoints.down('md') // Tablet: <900px
theme.breakpoints.up('lg')   // Desktop: ≥1200px
```

### Mobile Features
- **Bottom navigation** - Touch-friendly mobile nav
- **Swipe gestures** - Image slideshow controls
- **Progressive enhancement** - Works without JavaScript

## 🔍 SEO Implementation

### Dynamic Meta Tags
```typescript
// React Helmet Async usage
<Helmet>
  <title>Site Name - TakeOff Info ti.borislav.space</title>
  <meta name="description" content="Specific site description" />
  <meta property="og:title" content="..." />
  <meta property="og:description" content="..." />
</Helmet>
```

### Performance Features
- **Code splitting** - Route-based lazy loading
- **Bundle optimization** - Tree-shaking enabled
- **Image optimization** - Responsive image sizes
- **Font preloading** - Critical fonts loaded first

## 🧪 Development

### Code Quality
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Both checks
npm run check
```

### Testing
```bash
# Run tests (from project root)
npm test               # Watch mode
npm run test:run       # Single run
npm run test:ui        # Test UI interface
```

### Development Features
- **Hot Module Replacement** - Instant updates during development
- **TypeScript strict mode** - Maximum type safety
- **ESLint + Prettier** - Code formatting and quality
- **Source maps** - Easy debugging

## 🏗️ Build Configuration

### Vite Setup
```typescript
// vite.config.ts features
- TypeScript path aliases (@/ → src/)
- Development proxy to backend (:3000)
- Production optimization
- Manual chunk splitting
- Bundle analysis
```

### Bundle Optimization
- **Material-UI tree-shaking** - Only used components bundled
- **Vendor chunk splitting** - Better caching strategy
- **Lazy loading** - Map components load on demand
- **Asset optimization** - Images and fonts optimized

## 🌍 Internationalization

### Current Implementation
- **Bilingual content** - Bulgarian/English support via `LocalizedText`
- **Content data** - Sites have bilingual descriptions
- **Future ready** - Architecture supports i18n expansion

### Planned Features
- **UI translations** - All interface text
- **Language switcher** - User preference toggle
- **Persistent selection** - localStorage integration
- **SEO-friendly URLs** - Language-specific routes

## 🚀 Performance Metrics

### Bundle Sizes (Production)
- **Initial bundle** - ~275KB gzipped
- **Map chunk** - ~200KB (lazy loaded)
- **Vendor libraries** - Separate chunks for caching
- **Assets optimized** - Images, fonts, icons

### Core Web Vitals
- **LCP** - Optimized with font preloading
- **FID** - Minimal JavaScript blocking
- **CLS** - Font display: swap prevents layout shift

## 📖 Key Files

```
frontend/
├── index.html              # HTML template with font preloading
├── src/
│   ├── App.tsx            # Root component with routing
│   ├── AppRoutes.tsx      # Route definitions
│   ├── theme.ts           # Material-UI theme config
│   ├── types/
│   │   ├── api.ts         # API response types
│   │   ├── components.ts  # Component prop interfaces
│   │   └── redux.ts       # Redux state types
│   └── store/
│       ├── index.ts       # Store configuration
│       └── slices/        # Redux slices
├── vite.config.ts         # Build configuration
└── dist/                  # Production build output
```

## 🤝 Development Guidelines

### Component Creation
1. **Determine complexity** - Simple (direct hooks) vs Complex (container pattern)
2. **Define types first** - Add interfaces to `src/types/components.ts`
3. **Follow naming conventions** - PascalCase components, camelCase functions
4. **Add proper TypeScript** - No `any` types allowed
5. **Test thoroughly** - All components should have tests

### Code Style
- **TypeScript strict mode** - Maximum type safety
- **No conditional spreading** - `{...(condition && { prop })}` forbidden
- **Centralized types** - Keep interfaces in dedicated files
- **Separation of concerns** - Logic separate from presentation
- **DRY principle** - Avoid code duplication

---

**Part of the Takeoff Info paragliding application - Built for the Bulgarian paragliding community**