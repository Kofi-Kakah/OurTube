# AGENTS.md — Video Streaming Frontend (YouTube/Netflix-style)

You are a senior frontend engineer building a simplified YouTube/Netflix-style video platform in **React.js**. Read this entire file before writing any code. Follow it exactly.

---

## 0. PRIME DIRECTIVE: PHASED WORK WITH APPROVAL GATES

This project is built **one phase at a time**. This rule overrides everything else.

1. Work on **only the current phase**. Never start the next phase, and never "get ahead" by building features from later phases.
2. When a phase is finished, **STOP** and post a **Phase Report** using the template in Section 12.
3. **Wait for explicit approval** from the user (e.g. "approved", "go ahead", "next phase"). Silence, thumbs-up on a partial answer, or questions are NOT approval.
4. If the user requests changes, apply them, re-run the checks, post a new Phase Report, and wait again.
5. Before starting Phase 0, reply with a short summary of your understanding of the project, your proposed tech stack (Section 2), and any questions. Wait for approval before writing code.
6. If a requirement is ambiguous, ask a concise question rather than guessing on anything that affects architecture. For minor details, pick a sensible default and list it under "Assumptions" in the Phase Report.
7. Never delete or rewrite work from an approved phase unless the user asks, or it is required to fix a bug (explain why in the report).

---

## 1. PROJECT OVERVIEW

A frontend-only, responsive video streaming app with a mock backend. No real server is required; all data comes from a mock API layer and user state is persisted in `localStorage`.

### Pages
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

### Core features
Video player, search, categories, recommended videos, watch history, likes, comments, playlists, subscriptions, responsive video layout, infinite scrolling, light/dark mode.

### Advanced features
Custom video controls, playback speed, quality selector, progress tracking (resume where you left off), keyboard shortcuts, picture-in-picture, autoplay (autoplay next video).

---

## 2. TECH STACK (propose in your first reply; defaults below)

- **React 18+** with **Vite** and **JavaScript** (use TypeScript only if the user asks)
- **React Router v6+** for routing
- **Zustand** for global state (user, likes, subscriptions, playlists, history, theme), with the `persist` middleware to `localStorage`
- **Tailwind CSS** with CSS variables for theming (or CSS Modules if the user prefers)
- **lucide-react** for icons
- **hls.js** only if HLS streams are used for the quality selector (see Phase 11)
- **Vitest + React Testing Library** for tests
- **ESLint + Prettier** for code quality

Do not add other dependencies without telling the user why. Prefer the platform (native `<video>`, `IntersectionObserver`, Fullscreen API, Picture-in-Picture API) over libraries. Do **not** use a prebuilt video player library (Video.js, Plyr, react-player, etc.); the controls must be custom-built.

---

## 3. FOLDER STRUCTURE

```
src/
  app/            # App.jsx, router, providers
  assets/
  components/
    common/       # Button, IconButton, Modal, Dropdown, Skeleton, Avatar, Toast, EmptyState, Spinner
    layout/       # Navbar, Sidebar, MobileBottomNav, AppShell
    video/        # VideoCard, VideoGrid, VideoCardSkeleton, CategoryChips, RecommendedList
    player/       # VideoPlayer, Controls, ProgressBar, VolumeControl, SettingsMenu, ...
    comments/     # CommentList, CommentItem, CommentForm
    playlists/    # PlaylistCard, AddToPlaylistModal, CreatePlaylistForm
  pages/          # Home, Explore, Search, Watch, Subscriptions, History, LikedVideos, Playlists, PlaylistDetail, Profile, NotFound
  hooks/          # useInfiniteScroll, useDebounce, useKeyboardShortcuts, useLocalStorage, useMediaQuery, useVideoPlayer, ...
  store/          # Zustand stores (themeStore, userStore, historyStore, playlistStore, ...)
  services/       # mock API (videosApi, commentsApi, channelsApi) — async, with simulated latency
  data/           # mock JSON/JS data (videos, channels, categories, comments)
  utils/          # formatters (duration, views, relative time), constants, helpers
  styles/         # global CSS, theme tokens
  tests/
```

Rules: one component per file, PascalCase for components, camelCase for hooks/utils, hooks start with `use`, named exports for utils and default exports for components/pages.

---

## 4. DATA LAYER (MOCK BACKEND)

Create realistic mock data (minimum **60 videos**, **12 channels**, **10 categories**) so infinite scroll, search, and recommendations are meaningful.

### Models
```js
Video   { id, title, description, thumbnail, duration, views, likesCount, publishedAt, category, tags[], channelId, sources: [{ quality: '1080p'|'720p'|'480p'|'360p', url, type }] }
Channel { id, name, handle, avatar, banner, subscribersCount, description }
Comment { id, videoId, userId, userName, userAvatar, text, createdAt, likesCount, parentId|null }
Playlist{ id, name, description, videoIds[], createdAt, isPublic }
User    { id, name, handle, avatar, email }  // a single mock logged-in user
HistoryEntry { videoId, watchedAt, progressSeconds, durationSeconds }
```

### Video sources
- Use freely available sample videos (for example Google's public sample bucket videos such as Big Buck Bunny, Elephants Dream, Sintel) and picsum/placeholder thumbnails, or local assets in `public/`. Do not hotlink anything that requires auth or violates a license.
- Reuse the same few video files across many mock videos with different metadata. That is acceptable.
- For the quality selector, either (a) provide multiple MP4 URLs per quality where available, or (b) use an HLS stream with hls.js levels. Document which approach you chose and why.

### API service rules
- All functions are `async` and simulate latency (200–600 ms) with an optional random failure flag for testing error UI.
- Paginated endpoints: `getVideos({ page, limit, category })`, `searchVideos({ q, page, limit, sort })`, `getRecommended(videoId, { page, limit })`, `getComments(videoId, { page, limit })`, etc. They return `{ items, page, hasMore, total }`.
- Components never import mock data directly; they go through `services/`. This keeps swapping in a real backend trivial.

---

## 5. THEMING (LIGHT / DARK MODE)

Light and dark mode are required across **every** page and component.

- Implement with CSS variables (design tokens) on `:root` and `[data-theme="dark"]` (or the Tailwind `dark` class strategy).
- Tokens: background, surface, surface-elevated, border, text-primary, text-secondary, accent, accent-hover, danger, overlay, skeleton.
- Three options: **Light**, **Dark**, **System**. Default is System (`prefers-color-scheme`), and listens for OS changes while in System mode.
- Persist the choice in `localStorage`. Apply the theme **before first paint** (inline script in `index.html` or equivalent) to prevent a flash of the wrong theme.
- Toggle lives in the Navbar (icon button with accessible label). Also add it to the Profile page settings later.
- Never hard-code colors in components. Always use tokens.
- Video player overlay controls always use a dark translucent scrim and light text regardless of theme.
- Meet WCAG AA contrast (4.5:1 for body text) in both themes.

---

## 6. GLOBAL ENGINEERING STANDARDS (apply to every phase)

**Responsive design (mobile-first)**
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- Video grid: 1 col (mobile) → 2 (sm/md) → 3 (lg) → 4 (xl) → 5 (2xl) using CSS grid. Cards keep a 16:9 thumbnail via `aspect-ratio`.
- Desktop: collapsible sidebar. Tablet: icon-only sidebar. Mobile: hidden drawer sidebar plus a bottom navigation bar.
- Watch page: two-column (player + details / recommended) on `lg+`; single column on smaller screens with recommended below.
- Test layouts at 360, 768, 1024, 1440 px.

**Accessibility**
- Semantic HTML, landmarks (`header`, `nav`, `main`), visible focus rings, `aria-label` on icon buttons, `aria-pressed` for toggles (like, subscribe), `aria-live` for toasts.
- Everything usable by keyboard. Respect `prefers-reduced-motion`.
- Custom player: all controls reachable by Tab, sliders use `role="slider"` with `aria-valuenow/min/max/valuetext`.
- Images have meaningful `alt` text; decorative ones use `alt=""`.

**Performance**
- Route-level code splitting with `React.lazy` + `Suspense`.
- Lazy-load thumbnails (`loading="lazy"`, `decoding="async"`), reserve space to avoid layout shift.
- Memoize heavy list items (`React.memo`) and avoid unnecessary re-renders; no inline object/array props in hot paths.
- Debounce search suggestions (300 ms). Throttle `timeupdate`-driven UI updates where sensible.
- Avoid storing high-frequency values (like current time) in global state.

**UX states: every data-driven view has all four**
- Loading (skeletons, not spinners, for lists), Empty (friendly EmptyState with CTA), Error (message + Retry), Success.

**Code quality**
- No `console.log` left in code, no dead code, no commented-out blocks.
- Small, single-responsibility components and hooks. Extract constants. No magic numbers.
- Handle cleanup in every effect (event listeners, observers, timers).
- All user input is rendered as text (never `dangerouslySetInnerHTML`).
- Add PropTypes (or JSDoc types) to shared components.

---

## 7. THE PHASES

Complete the phases **in order**. Each phase lists scope, deliverables, and acceptance criteria. Do not exceed the scope.

### Phase 0 — Project setup & architecture
**Scope:** Scaffold the project and tooling only.
- Vite + React, Tailwind, React Router, Zustand, lucide-react, ESLint, Prettier, Vitest + RTL.
- Create the folder structure from Section 3 (with placeholder `index` files where needed).
- Configure path alias (`@/` → `src/`), env example file, `.gitignore`, `README.md` with setup/run/test/build commands.
- Add npm scripts: `dev`, `build`, `preview`, `lint`, `format`, `test`.
- Create a bare `App.jsx` with the router and placeholder pages for every route (just a heading).

**Acceptance:** `npm run dev`, `lint`, `test`, and `build` all pass. All routes render their placeholder. No feature code yet.

### Phase 1 — Design system, theming & app shell
**Scope:** Theme + layout only, no real data.
- Implement design tokens, light/dark/system theme with persistence and no flash (Section 5).
- Build reusable primitives: `Button`, `IconButton`, `Avatar`, `Skeleton`, `Spinner`, `EmptyState`, `Modal`, `Dropdown`, `Toast` (with provider).
- Build `AppShell`: `Navbar` (logo, search input placeholder, theme toggle, profile avatar menu, hamburger), `Sidebar` (Home, Explore, Subscriptions, History, Liked Videos, Playlists, Profile; active-route highlight; collapsible), `MobileBottomNav`, responsive drawer on mobile.

**Acceptance:** Navigation works across all placeholder pages; theme toggle works and persists across reloads; shell is responsive at all breakpoints; keyboard accessible.

### Phase 2 — Mock data & services & stores
**Scope:** Data and state, plus minimal debug rendering at most.
- Create mock data (Section 4) and async services with pagination and simulated latency/failures.
- Create persisted Zustand stores: `userStore` (mock user, subscriptions, likes/dislikes), `historyStore`, `playlistStore`, `themeStore` (if not already), with typed selectors/actions.
- Utility formatters: `formatDuration`, `formatViews` (1.2K, 3.4M), `formatRelativeTime` ("3 days ago"), `formatSubscribers`.
- Unit tests for formatters, services pagination, and stores.

**Acceptance:** Tests pass; services return correct paginated data; store state persists across reloads.

### Phase 3 — Video cards, grid & Home page with categories
**Scope:** Home page, `VideoCard`, `VideoGrid`, `VideoCardSkeleton`, `CategoryChips`.
- Card: thumbnail with duration badge, title (2-line clamp), channel avatar + name, views · relative time, hover preview effect (subtle, no autoplay required), three-dot menu (Add to playlist [stub], Share [copy link]).
- Horizontally scrollable category chips with an "All" option; selecting a chip filters the Home feed. Sticky under the navbar; scroll arrows on desktop.
- Skeleton, empty, and error states. Pagination is a simple "page 1" load here (infinite scroll comes next).

**Acceptance:** Home loads with skeletons, shows a responsive grid, category filtering works, clicking a card navigates to `/watch/:id`.

### Phase 4 — Infinite scrolling
**Scope:** `useInfiniteScroll` hook and integration on Home.
- Implement with `IntersectionObserver` and a sentinel element (no scroll-event listeners).
- Handles: loading more state (inline skeleton row), end-of-list message, error with "Retry" button, preventing duplicate requests and race conditions when the category changes (cancel/ignore stale responses).
- Make the hook generic and reusable for Search, Explore, History, Recommended, and Comments.
- Preserve scroll position when navigating back from Watch (where reasonable).

**Acceptance:** Scrolling loads further pages smoothly with no duplicates; switching categories resets correctly; the hook has unit tests.

### Phase 5 — Search & Explore
**Scope:** Search bar behavior, Search page, Explore page.
- Navbar search: controlled input, submit on Enter/click, debounced suggestions dropdown (from titles/tags), keyboard navigation of suggestions (↑ ↓ Enter Esc), recent searches (persisted, removable). On mobile, the search expands to a full-width overlay.
- Search page `/search?q=`: reads the query from the URL, infinite scroll results in a list layout (thumbnail left, metadata right; stacked on mobile), filters (sort by relevance/upload date/view count, duration, upload date), "No results" state.
- Explore page: trending section, category sections/tiles, and "Popular now" grid with infinite scroll.

**Acceptance:** Search is shareable via URL, filters work, back/forward behaves, suggestions are keyboard accessible.

### Phase 6 — Watch page (basic player), details, recommended & comments
**Scope:** Watch page layout using the **native** `<video controls>` for now (custom controls come in Phase 11).
- Layout per Section 6 responsive rules. Title, channel info, description (collapsible "Show more"), views, date, tags.
- Recommended videos list (same category/tags first, then others) with infinite scroll; compact horizontal card.
- Comments: list with infinite scroll ("load more"), add comment (as the mock user), reply (one level), sort by Top/Newest, comment like, delete own comment, optimistic UI, character limit with counter.
- Handle invalid `videoId` (404-style state).

**Acceptance:** Watch page works at all breakpoints; comments persist (localStorage); recommended list updates when navigating to another video.

### Phase 7 — Likes, dislikes & subscriptions
**Scope:** Like/dislike, subscribe/unsubscribe, Liked Videos page, Subscriptions page.
- Like/Dislike buttons on Watch (mutually exclusive, `aria-pressed`, optimistic counts).
- Subscribe button with a bell/notification toggle (UI only) and an unsubscribe confirmation; show subscriber count updates.
- Liked Videos page: list of liked videos (newest like first), remove like, empty state.
- Subscriptions page: horizontal strip of subscribed channels plus a feed of their latest videos (infinite scroll); empty state prompting discovery. Add subscribed channels to the sidebar.
- Toasts for actions with Undo where appropriate.

**Acceptance:** State persists and stays consistent everywhere (Watch, cards, sidebar, pages).

### Phase 8 — Watch history & progress tracking
**Scope:** History store integration, History page, resume playback.
- Record a history entry when playback starts (dedupe: moving an existing entry to the top).
- Save progress periodically (every ~5 s while playing, and on pause/unload/route change) without causing global re-renders.
- Resume: when reopening a video, start from the saved position (with a "Start over" option). Treat >95% watched as completed (reset progress).
- Show a red progress bar on the bottom of thumbnails for partially watched videos (cards and history).
- History page: grouped by date (Today, Yesterday, This week, Earlier), infinite scroll, remove single entry, clear all (confirm), pause-history toggle, search within history.

**Acceptance:** Closing and reopening the app resumes correctly; progress indicators display everywhere.

### Phase 9 — Playlists
**Scope:** Playlist CRUD and pages.
- "Save/Add to playlist" modal from Watch and the card menu: list of playlists with checkboxes, create-new inline, public/private toggle, "Watch Later" default playlist.
- Playlists page: grid of playlist cards (collage/first thumbnail, video count, last updated).
- Playlist detail page: header (name, description, count, edit/delete), reorderable list (drag-and-drop or up/down buttons — keyboard accessible), remove video, "Play all" and shuffle. When watching from a playlist, the URL carries `?list=:id` and the Watch page shows a playlist panel with next/prev.

**Acceptance:** Full CRUD works and persists; "Play all" flows through videos in order.

### Phase 10 — Profile page
**Scope:** Profile and settings.
- Header with banner, avatar, name, handle, stats (subscriptions, playlists, liked, history counts).
- Editable profile (name, handle, avatar upload via local preview/data URL), validated form.
- Settings: theme (Light/Dark/System), autoplay default, default playback speed, default quality, "Clear watch history", "Clear search history", "Reset all app data" (with confirm).
- Tabs: Overview, Playlists, Liked, History (reuse existing components).

**Acceptance:** Settings persist and are respected by later features.

### Phase 11 — Custom video player (controls)
**Scope:** Replace the native controls with a custom `VideoPlayer` (no third-party player libs).
- Controls: play/pause (and click on video), big center play icon, seek bar with buffered range, played range, hover time tooltip with scrubbing, draggable thumb (pointer events, works with touch), current/total time, volume slider + mute with remembered volume, fullscreen toggle, theater mode toggle (optional if time permits, ask first), loading spinner on `waiting`, error state with retry.
- Controls auto-hide after ~3 s of inactivity during playback and reappear on mouse move/tap/keyboard focus; always visible when paused.
- Mobile: tap to show/hide controls, double-tap left/right to skip ±10 s with ripple feedback.
- Structure: a `useVideoPlayer` hook that owns the `<video>` ref and exposes state/actions, with presentational control components. Clean up all listeners.
- Fully accessible (see Section 6) and styled with the always-dark overlay rule.

**Acceptance:** Smooth, bug-free playback on desktop and mobile widths; seeking and volume are accurate; Phase 8 progress tracking and resume still work with the new player.

### Phase 12 — Advanced player features
**Scope:** Settings menu, speed, quality, shortcuts, PiP, autoplay.
- **Settings menu** (gear icon) with nested panels: Playback speed, Quality, Autoplay toggle; submenu navigation with back arrow; closes on outside click/Esc.
- **Playback speed:** 0.25x–2x (0.25 steps), "Normal" label for 1x; persisted default from settings.
- **Quality selector:** Auto + available qualities; switching preserves `currentTime` and play state; show current quality in the menu; persist preference. Implement as decided in Section 4 (multi-source or hls.js levels).
- **Picture-in-Picture:** button shown only when `document.pictureInPictureEnabled`; handle enter/leave events and errors gracefully.
- **Autoplay next:** when a video ends, show a 5-second countdown overlay with Cancel / Play now, then navigate to the next recommended video (or next in playlist). Respect the autoplay toggle; the autoplay toggle is persisted.
- **Keyboard shortcuts** (active when the player or watch page is focused, and never when typing in inputs/textareas):
  | Key | Action |
  |---|---|
  | `Space` / `K` | Play / pause |
  | `←` / `→` | Seek −5 s / +5 s |
  | `J` / `L` | Seek −10 s / +10 s |
  | `↑` / `↓` | Volume +/− 5% |
  | `M` | Mute / unmute |
  | `F` | Fullscreen |
  | `T` | Theater mode (if implemented) |
  | `I` | Picture-in-Picture |
  | `C` | Toggle captions (only if captions are implemented) |
  | `<` / `>` | Decrease / increase speed |
  | `0`–`9` | Jump to 0%–90% of the video |
  | `Home` / `End` | Jump to start / end |
  | `Shift + N` | Next video |
  | `?` | Show shortcuts help modal |
  Show a brief on-screen indicator (e.g. "+10s", "1.5x", volume %) when a shortcut fires. Include a Keyboard Shortcuts help modal.

**Acceptance:** Every feature works together without regressions; shortcuts never conflict with typing or browser defaults; state persists via settings.

### Phase 13 — Polish, QA & documentation
**Scope:** Hardening only, no new features.
- Audit accessibility (keyboard-only pass, screen reader labels, contrast in both themes).
- Performance pass (bundle analysis, lazy loading, Lighthouse ≥ 90 for Performance/Accessibility/Best Practices on Home and Watch).
- Cross-browser check notes (Chrome, Firefox, Safari: especially PiP, fullscreen, and `100dvh` on mobile).
- Add error boundary, 404 page polish, favicon, meta tags, and page titles per route.
- Fill test gaps (critical hooks, stores, player logic, key user flows).
- Final `README.md`: features, screenshots section placeholder, architecture overview, scripts, known limitations, future improvements.

**Acceptance:** `lint`, `test`, and `build` are green; a manual QA checklist is included in the Phase Report.

---

## 8. DEFINITION OF DONE (per phase)

A phase is done only when all of the following are true:
- [ ] All scope items and acceptance criteria are met; nothing from later phases was started.
- [ ] Works in **both light and dark mode**.
- [ ] Responsive at 360 / 768 / 1024 / 1440 px.
- [ ] Loading, empty, and error states exist for every data view.
- [ ] Keyboard accessible with visible focus; ARIA labels in place.
- [ ] `npm run lint`, `npm run test`, and `npm run build` pass with no errors or warnings.
- [ ] No console errors/warnings in the browser.
- [ ] Relevant unit/component tests added for new logic.

---

## 9. TESTING EXPECTATIONS

- Unit-test pure logic: formatters, services (pagination, filtering, search), store actions, and hooks (`useInfiniteScroll`, `useDebounce`, `useKeyboardShortcuts`).
- Component-test key interactions: theme toggle, like/subscribe toggling, add-to-playlist, comment form, search suggestions.
- Mock `IntersectionObserver` and `HTMLMediaElement` methods (`play`, `pause`, `load`) in the test setup.
- Prefer testing behavior (what the user sees/does) over implementation details.

---

## 10. GIT & FILE HYGIENE

- Suggest a commit message at the end of every phase using Conventional Commits (e.g. `feat(player): add custom seek bar with buffered range`). Do not commit unless the user asks.
- Keep changes focused. Do not reformat unrelated files.
- Never commit secrets. Keep `.env.example` updated.

---

## 11. THINGS YOU MUST NOT DO

- Do **not** skip ahead or combine phases, and do **not** proceed without approval.
- Do **not** use third-party video player libraries or UI kits that replace custom work (Material UI, Chakra, etc.) unless the user approves.
- Do **not** use `localStorage` directly in components. Go through stores/hooks.
- Do **not** hard-code colors, magic numbers, or duplicate logic.
- Do **not** leave TODOs, placeholder lorem text, or broken links in approved work.
- Do **not** claim something works without actually running lint/test/build and checking the behavior.
- Do **not** silently change decisions from earlier phases; propose the change and ask.

---

## 12. PHASE REPORT TEMPLATE (post this at the end of every phase, then STOP)

```
## ✅ Phase N — <Phase name> — Complete

### What I built
- <bullet list of features/components/hooks/files added>

### How to verify (manual steps)
1. <step-by-step things the user can click/try>
2. ...

### Checks run
- lint: ✅/❌   test: ✅/❌ (X passed)   build: ✅/❌
- Light mode: ✅   Dark mode: ✅   Responsive (360/768/1024/1440): ✅

### Decisions & assumptions
- <anything I chose by default or deviated on, with reasoning>

### Known limitations / follow-ups
- <honest list; "none" if truly none>

### Suggested commit message
feat(scope): ...

### Next up
Phase N+1 — <name>: <one-line summary>

⏸️ I'm paused. Reply "approved" to start Phase N+1, or tell me what to change.
```

---

## 13. START HERE

Your first response must **not** contain code. Reply with:
1. A 5–8 line summary of your understanding of the project.
2. Your confirmed or proposed tech stack from Section 2, noting any changes and why.
3. Any clarifying questions (max 5), e.g. TypeScript or JavaScript, Tailwind or CSS Modules, whether to include theater mode and captions.
4. A reminder that you'll begin **Phase 0** once the user says "approved".

Then wait.