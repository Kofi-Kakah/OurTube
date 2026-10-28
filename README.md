# OurTube 📺

A modern, responsive YouTube/Netflix-style video streaming frontend built in **React.js** with Vite, Tailwind CSS, Zustand, and React Router. Frontend-only with a mock backend; all user state persists in `localStorage`.

## Features Overview

| Category | Features |
|---|---|
| **Layout** | Responsive mobile-first design (360px → 1440px+), collapsible sidebar, icon-only tablet sidebar, mobile bottom navigation |
| **Theming** | Light, Dark, and System modes via CSS variable design tokens; persists to `localStorage`; applied before first paint to prevent flash |
| **Video player** | Custom-built controls (no third-party player libs): play/pause, seek bar with buffered range, hover time scrub, volume + mute, theater mode, fullscreen, picture-in-picture, keyboard shortcuts, on-screen shortcut indicators, shortcuts help modal |
| **Playback** | Custom quality selector, playback speed (0.25x–2x), autoplay-next with 5-second countdown, resume-where-you-left-off with progress tracking |
| **Discovery** | Home feed with category chips, Explore (trending + categories + popular), search with debounced suggestions + filters, recommended videos on watch page |
| **Interactions** | Like/dislike (mutually exclusive), subscribe/unsubscribe, save to playlist (create new inline), comments (add/reply/like/delete, optimistic UI) |
| **Library** | Watch history (grouped by date, search, clear), Liked Videos, Playlists (CRUD, reorder, play all), Subscriptions feed |
| **Profile** | Editable profile (name, handle, avatar), settings (theme, autoplay, speed, quality), clear history/search, reset all app data |
| **State** | Zustand stores with `persist` middleware to `localStorage`; optimistic UI with toasts and undo |
| **Resilience** | Loading/empty/error states on every data view, error boundary, retry, 404 page with search |
| **Accessibility** | Semantic HTML, visible focus rings, `aria-label`/`aria-pressed`, `role="slider"` on seek/volume, keyboard-operable player, skip-to-content link, reduced-motion support |

## Tech Stack

- **Framework**: React 19 & Vite
- **Routing**: React Router v7 (route-level code splitting via `React.lazy` + `Suspense`)
- **State Management**: Zustand (with `persist` middleware to `localStorage`)
- **Styling**: Tailwind CSS + CSS variable design tokens
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + jsdom (84 tests)
- **Linting & Code Quality**: ESLint + Prettier

## Project Structure

```
src/
  app/            # App.jsx, router, providers
  assets/         # Static assets and media
  components/
    common/       # Button, IconButton, Modal, Dropdown, Skeleton, Avatar, Toast, EmptyState, Spinner, ErrorBoundary
    layout/       # AppShell, Navbar, Sidebar, MobileBottomNav, MobileDrawer
    video/        # VideoCard, VideoGrid, VideoCardSkeleton, CategoryChips, RecommendedList, LikeDislikeButtons, SubscribeButton
    player/       # VideoPlayer, Controls, SeekBar, VolumeControl, BigPlayButton, SettingsMenu, KeyboardShortcutsHelp
    comments/     # CommentList, CommentItem, CommentForm
    playlists/    # PlaylistCard, AddToPlaylistModal, CreatePlaylistForm
  pages/          # Home, Explore, Search, Watch, Subscriptions, History, LikedVideos, Playlists, PlaylistDetail, Profile, NotFound
  hooks/          # useInfiniteScroll, useDebounce, useKeyboardShortcuts, usePageTitle, useLocalStorage, useRecentSearches, useScrollRestoration, useToast, useVideoPlayer
  store/          # Zustand stores (themeStore, userStore, historyStore, playlistStore)
  services/       # Mock API (videosApi, commentsApi, channelsApi) — async, simulated latency/failures
  data/           # Mock data (videos, channels, categories, comments)
  utils/          # formatters (duration, views, relative time, subscribers), constants
  styles/         # Global CSS, theme design tokens
  tests/          # Unit & component test suites
```

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/explore` | Explore |
| `/search?q=` | Search results |
| `/watch/:videoId` | Watch |
| `/subscriptions` | Subscriptions |
| `/history` | Watch History |
| `/liked` | Liked Videos |
| `/playlists` | Playlists list |
| `/playlists/:playlistId` | Single playlist |
| `/profile` | Profile |
| `*` | 404 Not Found |

## Screenshots

Coming soon — add screenshots here showing Home, Watch, and Profile in light and dark mode.

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

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Build for production
npm run build
```

## Mock Data & API

The app uses a mock backend (`src/services/`) backed by mock data (`src/data/`):
- 60+ videos, 12 channels, 10 categories
- All service functions are `async` with simulated network latency (200–600 ms) and an optional random failure flag for testing error UI
- Paginated endpoints return `{ items, page, hasMore, total }`
- Components consume data through `services/` only — never import mock data directly — so swapping in a real backend is straightforward

Video sources reuse a small set of freely available sample MP4s across many mock videos with different metadata. The quality selector lists available qualities per video (mock: all qualities point to the same sample file).

## State Persistence

Zustand stores use the `persist` middleware to `localStorage`:
- `ourtube-user-storage` — user profile, subscriptions, likes/dislikes, autoplay/default speed/default quality
- Watch history and playlists are similarly persisted

Theme choice is persisted and applied via an inline script in `index.html` before first paint to avoid a flash of the wrong theme.

## Accessibility

- Semantic HTML with `header`/`nav`/`main` landmarks
- Visible focus rings (`:focus-visible`) and skip-to-content link
- `aria-label` on icon buttons, `aria-pressed` on toggles, `aria-valuenow/min/max/valuetext` on sliders
- Player fully keyboard-operable (Space/K, arrows, J/L, M, F, T, I, 0–9, Shift+N, ?)
- `prefers-reduced-motion` respected

Known contrast limitation: the red brand accent (`#dc2626`) used for small body text (links, shortcut indicators) falls below WCAG AA 4.5:1 against white in light mode. Larger UI elements (buttons, focus outlines) meet contrast requirements.

## Known Limitations

- Theater mode keyboard shortcut (`T`) shows an indicator; the actual toggle is via the Controls button
- Captions / the `C` shortcut are not implemented (no caption tracks in mock data)
- Quality switching in mock is cosmetic (all sources point to the same sample file)
- "Reset all app data" clears history, search history, and likes; playlists are not removed individually
- PiP requires `document.pictureInPictureEnabled` (Chrome/Edge/Safari)

## Future Improvements

- Real multi-source / HLS video qualities with hls.js
- Captions track support
- Drag-and-drop playlist reordering
- Theater mode CSS layout
- Unit test coverage for player logic and comment flows

## License

MIT