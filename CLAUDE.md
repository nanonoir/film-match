# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Film-Match** is a modern React 19 + TypeScript movie discovery and matching SPA (single-page application). It features a Tinder-like card swiping interface for movie discovery, filtering by genre/year/rating, user ratings and comments, and an AI chatbot for recommendations.

**Tech Stack:**
- React 19.1.1 with TypeScript 5.9.3 (strict mode)
- Vite 7.1.7 (build tool with HMR)
- Tailwind CSS + PostCSS
- Framer Motion (card animations)
- Lucide React (icons)
- Context API (state management)
- Bun (package manager)

## Common Development Commands

```bash
# Start development server (HMR enabled)
bun run dev          # or: npm run dev

# Run linting
bun run lint         # or: npm run lint

# Build for production
bun run build        # or: npm run build
# Runs: tsc -b && vite build

# Preview production build locally
bun run preview      # or: npm run preview
```

The dev server runs at `http://localhost:5173` by default.

## Architecture & Key Files

### Routing Structure
- **App.tsx**: Root component with BrowserRouter and AppProvider wrapper. Three main routes:
  - `/login` → Login.tsx
  - `/home` → Home.tsx (main movie discovery page)
  - `/movie/:id` → MovieDetailsPage.tsx

### State Management
- **AppContext.tsx**: Global Context API provider with:
  - `movies`: Movie array loaded from movies.json
  - `currentMovieIndex`: Current card position
  - `matches`: User's matched movies
  - `userRatings`: Array with optional comments
  - `filters`: {search, genres[], yearRange, minRating}
  - Key functions: `addMatch()`, `skipMovie()`, `addRating()`, `setFilters()`, `getFilteredMovies()`

### Component Structure
**Pages:**
- `Login.tsx`: Authentication interface
- `Home.tsx`: Main swipeable card interface with filters, match modal, rating modal, chatbot
- `MovieDetailsPage.tsx`: Individual movie view

**Components:**
- `MovieCard.tsx`: Draggable card with Framer Motion animations
- `FiltersSidebar.tsx`: Genre/year/rating filter controls
- `LoginForm.tsx`: Auth form
- `Navbar.tsx`: Navigation header
- `MatchModal.tsx`: Confirmation when movie matched
- `RatingModal.tsx`: Modal for rating/commenting on movie
- `Chatbot.tsx`: AI recommendation chat

### Data
- `movies.json`: Hardcoded movie database (122 entries)
  - Fields: id, title, year, genres[], duration, rating, overview, director, cast[], poster

## Configuration Files

**TypeScript:**
- Strict mode enabled (`strict: true`)
- `noUnusedLocals` and `noUnusedParameters` enforced
- Target: ES2022

**ESLint:**
- Uses modern flat config format (eslint.config.js)
- React Hooks and React Refresh plugins enabled
- Browser environment

**Tailwind:**
- Custom colors: `primary.pink: #ff005a`, `primary.purple: #9c27ff`
- Dark theme: `dark.bg: #0e0e11`, `dark.card: #1a1a1f`, `dark.input: #25252d`
- Custom gradients defined

## Important Notes

### Testing
- **No testing framework currently configured** (no Jest, Vitest, etc.)
- No test files exist in the project
- Consider adding testing when feature stability is required

### Known Limitations from README
- React Compiler is not compatible with the current SWC plugin setup
- ESLint config uses basic rules; production projects should enable type-aware rules (see README.md for recommended config)

### Development Workflow
- HMR (Hot Module Reload) enabled in Vite for fast feedback
- Type checking runs during build via `tsc -b`
- SWC transpilation provides fast builds
- No pre-commit hooks or git workflows configured

## Git Information

**Current Branch:** develop
**Main Branch:** main (use for PRs)
**Package Manager:** Bun (indicated by bun.lock)

Recent git changes:
- Modified: bun.lock, package.json
- Deleted: package-lock.json

## When Making Changes

- **Type Safety:** Use TypeScript strictly; strict mode is enabled
- **Styling:** Use Tailwind utility classes or custom theme colors from tailwind.config.js
- **State:** Use AppContext for global state; avoid prop drilling
- **Components:** Keep components in src/components; pages in src/pages
- **Animations:** Use Framer Motion for animations (already set up)
- **Linting:** Run `bun run lint` before committing; fix any ESLint errors

## Performance Considerations

- Vite with SWC provides fast development builds
- Consider code splitting for the build output if the bundle grows large
- Framer Motion animations are GPU-accelerated; use for interactive elements
- Context API may cause unnecessary re-renders at scale; monitor with React DevTools if needed

