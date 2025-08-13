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
- **API Layer**: RTK Query slice handles all backend communication
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

- RTK Query for server state with automatic caching and invalidation
- Separate slices for sites data, loading states, and errors
- Tagged cache invalidation strategy

### Bilingual Support

- All user-facing text stored in `LocalizedText` objects
- UI components should handle both `bg` and `en` properties
- Forms collect bilingual input where applicable

### Type Safety

- Shared type definitions between frontend (`types.ts`) and backend models
- Strict TypeScript configuration with additional safety checks
- Form validation and API response typing

## Environment Requirements

- Node.js (ES modules enabled)
- MongoDB instance
- MONGO_URI environment variable for database connection

