import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import { ToastProvider, Spinner } from '@/components/common'

const Home = lazy(() => import('@/pages/Home'))
const Explore = lazy(() => import('@/pages/Explore'))
const Search = lazy(() => import('@/pages/Search'))
const Watch = lazy(() => import('@/pages/Watch'))
const Subscriptions = lazy(() => import('@/pages/Subscriptions'))
const History = lazy(() => import('@/pages/History'))
const LikedVideos = lazy(() => import('@/pages/LikedVideos'))
const Playlists = lazy(() => import('@/pages/Playlists'))
const PlaylistDetail = lazy(() => import('@/pages/PlaylistDetail'))
const Profile = lazy(() => import('@/pages/Profile'))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
              <Spinner size="lg" aria-label="Loading page" />
            </div>
          }
        >
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watch/:videoId" element={<Watch />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/history" element={<History />} />
              <Route path="/liked" element={<LikedVideos />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route
                path="/playlists/:playlistId"
                element={<PlaylistDetail />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  )
}
