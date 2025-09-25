# Contributing to Takeoff Info

Thank you for your interest in contributing to the Takeoff Info paragliding application! This guide will help you understand our development process and coding standards.

## 🚀 Quick Start for Contributors

### Prerequisites
- **Node.js** 18.20.8+ (ES modules enabled)
- **MongoDB** 4.4+
- **Git** for version control
- **TypeScript** knowledge required

### Setup Development Environment

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ti
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure MongoDB and other environment variables
   ```

3. **Start Development**
   ```bash
   npm start  # Starts both backend and frontend
   ```

4. **Verify Setup**
   ```bash
   npm run check  # TypeScript + lint check
   npm test       # Run test suite
   ```

## 📋 Development Workflow

### Before You Start
1. **Create an issue** or comment on existing issue you want to work on
2. **Fork the repository** and create a feature branch
3. **Read CLAUDE.md** for current project status and priorities
4. **Review existing code** to understand patterns and conventions

### Branch Naming
```bash
feature/issue-description     # New features
fix/bug-description          # Bug fixes
refactor/component-name      # Code refactoring
docs/update-type            # Documentation updates
```

### Commit Convention
```bash
feat: add image slideshow component
fix: resolve wind filter toggle issue
refactor: centralize type definitions
docs: update API documentation
test: add integration tests for GraphQL
```

## 🏗️ Code Standards & Architecture

### TypeScript Requirements

#### ✅ **MUST DO**
- **Strict TypeScript** - No `any` types allowed
- **Centralized types** - Add interfaces to `frontend/src/types/` or `src/types/`
- **Proper error handling** - Use `CustomError` interface
- **Type exports** - Export types from dedicated files

#### ❌ **NEVER DO**
- **No `any` types** - Use proper type definitions
- **No conditional spreading** - `{...(condition && { prop })}` bypasses TypeScript
- **No inline interfaces** - Keep types centralized
- **No `@ts-ignore`** - Fix the actual type issue

### Architecture Patterns

#### Hybrid Container/Hooks Pattern
**Decision Criteria:**

| Component Type | Pattern | Example |
|---|---|---|
| Simple logic (≤15 lines) | Direct hooks | `NotFoundHandler`, `UserIconGroup` |
| Complex logic (>15 lines) | Container/component | `SitesList`, `SitesMap` |
| Reusable components | Always containers | `SiteCard`, `DeleteConfirmDialog` |
| Single-use utilities | Direct hooks | Simple form components |

#### Backend Architecture
- **Controllers** → Use `next(error)` for error handling
- **GraphQL Resolvers** → Return data or throw typed errors
- **Services** → Business logic separation
- **Models** → Mongoose schemas with validation

### File Organization

#### Frontend Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── main/           # Core app components
│   └── ui/             # Basic UI elements
├── containers/         # Container pattern implementations
├── types/              # TypeScript definitions
│   ├── api.ts         # API response types
│   ├── components.ts  # Component interfaces
│   └── redux.ts       # Redux state types
└── store/             # Redux configuration
```

#### Backend Structure
```
src/
├── graphql/           # GraphQL schema & resolvers
├── middleware/        # Express middleware
├── models/            # Mongoose schemas
├── services/          # Business logic
├── types/             # Backend type definitions
└── utils/             # Shared utilities
```

## 🧪 Testing Requirements

### Test Coverage Requirements
- **All new features** must include tests
- **Bug fixes** must include regression tests
- **GraphQL resolvers** require integration tests
- **React components** need unit tests

### Running Tests
```bash
npm test              # Watch mode for development
npm run test:run      # Single run for CI
npm run test:ui       # Visual test interface
```

### Test Patterns
```typescript
// Component testing
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../store'

// GraphQL resolver testing
import { createTestContext } from '../utils/testHelpers'
```

## 🎨 UI/UX Guidelines

### Material-UI Standards
- **Use theme breakpoints** - `theme.breakpoints.down('sm')`
- **Custom Comfortaa font** - Follow existing typography
- **Responsive design** - Mobile-first approach
- **Accessibility** - ARIA labels, keyboard navigation

### Component Development
```typescript
// ✅ Good: Centralized interface
interface ButtonProps extends ComponentProps<'button'> {
  variant: 'primary' | 'secondary'
  loading?: boolean
}

// ❌ Bad: Inline interface
const Button: React.FC<{
  variant: 'primary' | 'secondary'
  loading?: boolean
}> = ({ variant, loading, children }) => {
```

### Styling Approach
- **Material-UI styling** - Use `sx` prop or `styled` components
- **Theme consistency** - Use theme colors and spacing
- **No inline styles** - Except for dynamic values
- **Responsive typography** - Use theme breakpoints

## 🔍 Code Review Process

### Pull Request Requirements

#### Before Submitting
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Code follows linting rules (`npm run check`)
- [ ] Documentation updated if needed
- [ ] CLAUDE.md updated if significant changes

#### PR Description Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] No breaking changes

## Screenshots
(For UI changes)

## Checklist
- [ ] Code follows project standards
- [ ] TypeScript strict compliance
- [ ] All tests passing
- [ ] Documentation updated
```

### Review Criteria

#### Code Quality
- **TypeScript compliance** - No `any` types, proper interfaces
- **Architecture adherence** - Follows container/hooks patterns
- **Error handling** - Proper error types and handling
- **Performance** - No unnecessary re-renders, efficient queries

#### Testing
- **Coverage** - New code has appropriate tests
- **Integration** - GraphQL operations tested end-to-end
- **Edge cases** - Error scenarios covered

#### Documentation
- **Code comments** - Only when necessary for complex logic
- **README updates** - If APIs or setup changed
- **CLAUDE.md updates** - For significant architectural changes

## 🚀 Deployment & Production

### Production Checklist
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Build process successful
- [ ] All tests passing
- [ ] Performance metrics acceptable
- [ ] Security scan completed

### Build Process
```bash
npm run build         # Full production build
npm run build:preview # Test production build locally
```

## 📚 Resources & References

### Documentation
- **CLAUDE.md** - Current project status and priorities
- **SEO.md** - SEO implementation details
- **Frontend README** - Frontend-specific guidelines
- **Root README** - Project overview and setup

### External Resources
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Components](https://mui.com/components/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)

## 🎯 Current Development Priorities

### High Priority Features
1. **Image Slideshow Component** - Interactive site galleries
2. **Wind Filter Toggle Fix** - Button interaction improvements
3. **Internationalization** - Complete Bulgarian localization

### Technical Debt
1. **TypeScript Strict Compliance** - ~40 remaining type errors
2. **Test Coverage** - Expand integration test suite
3. **Performance Optimization** - Bundle size improvements

### Architecture Improvements
1. **Container/Hooks Review** - Finalize hybrid pattern implementation
2. **Type Centralization** - Complete interface consolidation
3. **Error Handling** - Enhance user experience

## 🤝 Communication

### Getting Help
- **Create GitHub issue** for bugs or feature requests
- **Discussion section** for architectural questions
- **Code comments** for specific implementation questions

### Code of Conduct
- **Respectful communication** in all interactions
- **Constructive feedback** during code reviews
- **Collaborative approach** to problem-solving
- **Knowledge sharing** to help others learn

## 🔧 Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
npx tsc --build --clean

# Restart TypeScript service in VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

#### Development Server Issues
```bash
# Clear all caches
npm run clean
rm -rf node_modules package-lock.json
npm install
```

#### MongoDB Connection
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux
```

#### Build Problems
```bash
# Verbose build output
npm run build -- --verbose

# Clean build
npm run clean && npm run build
```

---

Thank you for contributing to the Takeoff Info project! Your efforts help improve the paragliding community's access to flight information across Bulgaria. 🪂

**Questions?** Check CLAUDE.md for current project status or create an issue for help.