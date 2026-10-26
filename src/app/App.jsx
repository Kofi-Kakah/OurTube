import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/history" element={<History />} />
          <Route path="/liked" element={<LikedVideos />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
