# OurTube 📺

A modern, responsive YouTube/Netflix-style video streaming frontend built in React.js with Vite, Tailwind CSS, Zustand, and React Router.

## Features Overview
- **Responsive Layout**: Mobile-first design supporting 360px up to 1440px+ screens.
- **Theming**: System, Light, and Dark modes powered by CSS variable design tokens.
- **Mock API Layer**: Client-side mock backend with simulated network latency and realistic video data.
- **Custom Video Player**: Native video element paired with custom controls, shortcuts, resume tracking, and playback settings.
- **State Persistence**: Zustand state (user preferences, watch history, liked videos, playlists) persisted to `localStorage`.

## Tech Stack
- **Framework**: React 18+ & Vite
- **Routing**: React Router v6+
- **State Management**: Zustand (with `persist` middleware)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + jsdom
- **Linting & Code Quality**: ESLint + Prettier

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Build production assets into `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across codebase |
| `npm run format` | Format files using Prettier |
| `npm run format:check` | Check code formatting without writing |
| `npm test` | Run test suite with Vitest |

## Project Structure

```
src/
  app/            # App.jsx, router, providers
  assets/         # Static assets and media
  components/
    common/       # Reusable UI primitives (Button, Modal, Toast, Skeleton, etc.)
    layout/       # AppShell, Navbar, Sidebar, MobileBottomNav
    video/        # VideoCard, VideoGrid, CategoryChips, RecommendedList
    player/       # VideoPlayer, Controls, ProgressBar, VolumeControl
    comments/     # CommentList, CommentItem, CommentForm
    playlists/    # PlaylistCard, AddToPlaylistModal
  pages/          # Route page views (Home, Explore, Watch, Profile, etc.)
  hooks/          # Custom hooks (useInfiniteScroll, useDebounce, etc.)
  store/          # Zustand stores (themeStore, userStore, historyStore, etc.)
  services/       # Mock API services (videosApi, commentsApi, etc.)
  data/           # Mock JSON / data definitions
  utils/          # Formatters, helpers, constants
  styles/         # Global styles & theme token definitions
  tests/          # Unit & component test suites
```
