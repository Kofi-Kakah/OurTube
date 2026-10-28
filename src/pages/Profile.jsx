import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  User,
  Clock,
  ThumbsUp,
  ListVideo,
  Settings,
  Trash2,
  AlertTriangle,
  Plus,
  Sun,
  Moon,
  Laptop,
  ChevronDown,
} from 'lucide-react'
import {
  useUserStore,
  usePlaylistStore,
  useHistoryStore,
  useThemeStore,
} from '@/store'
import { useRecentSearches, usePageTitle } from '@/hooks'
import { useToast } from '@/components/common'
import { IconButton, Avatar, Modal, Dropdown } from '@/components/common'
import Playlists from '@/pages/Playlists'
import LikedVideos from '@/pages/LikedVideos'
import History from '@/pages/History'

const TABS = [
  { key: 'overview', label: 'Overview', Icon: User },
  { key: 'playlists', label: 'Playlists', Icon: ListVideo },
  { key: 'liked', label: 'Liked Videos', Icon: ThumbsUp },
  { key: 'history', label: 'History', Icon: Clock },
]

const QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '1080p', label: '1080p' },
  { value: '720p', label: '720p' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
]

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export default function Profile() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const {
    user,
    subscriptions,
    likedVideoIds,
    updateProfile,
    toggleAutoplay,
    setPlaybackSpeed,
    setDefaultQuality,
    autoplayDefault,
    defaultPlaybackSpeed,
    defaultQuality,
    removeLike,
  } = useUserStore()
  const { playlists } = usePlaylistStore()
  const { entries, clearHistory } = useHistoryStore()
  const { clear: clearRecentSearches } = useRecentSearches()

  usePageTitle('Profile — OurTube')

  const [activeTab, setActiveTab] = useState('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editHandle, setEditHandle] = useState(user.handle)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})

  const [clearHistoryConfirm, setClearHistoryConfirm] = useState(false)
  const [clearSearchConfirm, setClearSearchConfirm] = useState(false)
  const [resetConfirm, setResetConfirm] = useState(false)

  const stats = [
    { label: 'Subscriptions', value: subscriptions.length, Icon: User, path: '/subscriptions' },
    { label: 'Playlists', value: playlists.length, Icon: ListVideo, path: '/playlists' },
    { label: 'Liked Videos', value: likedVideoIds.length, Icon: ThumbsUp, path: '/liked' },
    { label: 'History', value: entries.length, Icon: Clock, path: '/history' },
  ]

  const validateEdit = useCallback(() => {
    const next = {}
    if (!editName.trim()) next.name = 'Name is required'
    if (!editHandle.trim()) next.handle = 'Handle is required'
    else if (!/^@[\w]+$/.test(editHandle)) next.handle = 'Handle must start with @'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [editName, editHandle])

  const handleEditOpen = () => {
    setEditName(user.name)
    setEditHandle(user.handle)
    setAvatarPreview(user.avatar)
    setAvatarFile(null)
    setErrors({})
    setEditOpen(true)
  }

  const handleEditSave = useCallback(() => {
    if (!validateEdit()) return
    setUploading(true)
    updateProfile({
      name: editName.trim(),
      handle: editHandle.trim(),
      avatar: avatarPreview,
    })
    setEditOpen(false)
    setUploading(false)
    showToast({ message: 'Profile updated', type: 'success' })
  }, [editName, editHandle, avatarPreview, updateProfile, validateEdit, showToast])

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'Please upload an image file' }))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAvatarFile(file)
      setAvatarPreview(ev.target.result)
      setErrors((prev) => ({ ...prev, avatar: undefined }))
    }
    reader.readAsDataURL(file)
  }

  const handleResetAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(user.avatar)
    setErrors((prev) => ({ ...prev, avatar: undefined }))
  }

  const handleClearHistory = () => {
    clearHistory()
    setClearHistoryConfirm(false)
    showToast({ message: 'Watch history cleared', type: 'success' })
  }

  const handleClearSearches = () => {
    clearRecentSearches()
    setClearSearchConfirm(false)
    showToast({ message: 'Search history cleared', type: 'success' })
  }

  const handleResetAll = () => {
    clearHistory()
    clearRecentSearches()
    likedVideoIds.forEach((id) => removeLike(id))
    setResetConfirm(false)
    navigate('/')
    showToast({ message: 'App data reset', type: 'success' })
  }

  const themeOptions = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'system', label: 'Device theme', Icon: Laptop },
  ]

  return (
    <main className="flex flex-col gap-6 w-full pb-8">
      {/* Tab navigation */}
      <div className="border-b border-[var(--border-color)] sticky top-14 md:top-16 z-20 bg-[var(--bg-surface)]">
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
          {TABS.map((tab) => {
            const Icon = tab.Icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-pressed={isActive}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          {/* Profile header */}
          <div className="relative w-full h-48 md:h-64 rounded-2xl bg-[var(--bg-surface-elevated)] overflow-hidden">
            <div className="absolute inset-0 bg-[var(--bg-surface-elevated)]/50" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-end gap-3">
                <div className="relative shrink-0">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="lg"
                    className="ring-4 ring-[var(--bg-surface)]"
                  />
                  <button
                    type="button"
                    onClick={handleEditOpen}
                    className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--accent-hover)] transition-colors"
                    aria-label="Edit profile"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-[var(--text-primary)] leading-snug">
                    {user.name}
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                    {user.handle}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <IconButton
                    size="sm"
                    onClick={handleEditOpen}
                    aria-label="Edit profile"
                  >
                    <Settings className="w-4 h-4" />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => {
              const Icon = stat.Icon
              return (
                <Link
                  key={stat.label}
                  to={stat.path}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-colors text-center"
                >
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {stat.label}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Edit profile modal */}
          <Modal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            title="Edit profile"
            size="md"
          >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                >
                  Name
                </label>
                <input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full rounded-lg border bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                      : 'border-[var(--border-color)] focus:ring-[var(--accent)]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-[var(--danger)] mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-handle"
                  className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                >
                  Handle
                </label>
                <input
                  id="edit-handle"
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  className={`w-full rounded-lg border bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 ${
                    errors.handle
                      ? 'border-[var(--danger)] focus:ring-[var(--danger)]'
                      : 'border-[var(--border-color)] focus:ring-[var(--accent)]'
                  }`}
                />
                {errors.handle && (
                  <p className="text-xs text-[var(--danger)] mt-1">{errors.handle}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-avatar"
                  className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                >
                  Avatar
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="edit-avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-[var(--text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-surface-elevated)] file:text-[var(--accent)] hover:file:bg-[var(--bg-base)]"
                  />
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={handleResetAvatar}
                      className="text-xs font-medium text-[var(--danger)] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {errors.avatar && (
                  <p className="text-xs text-[var(--danger)] mt-1">{errors.avatar}</p>
                )}
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="mt-2 w-20 h-20 rounded-full object-cover border border-[var(--border-color)]"
                />
              </div>
              <ModalFooter>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Saving…' : 'Save changes'}
                </button>
              </ModalFooter>
            </form>
          </Modal>

          {/* Settings */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-[var(--text-primary)] text-lg">
              Settings
            </h2>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Appearance
              </h3>
              <Dropdown
                align="right"
                trigger={() => (
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                    aria-label="Theme"
                  >
                    {themeOptions.find((o) => o.value === theme)?.Icon || Sun} {(
                      <span>
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>
                    )}
                    <ChevronDown className="w-3 h-3 ml-auto text-[var(--text-secondary)]" />
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="py-1">
                    {themeOptions.map((opt) => {
                      const Icon = opt.Icon
                      return (
                        <button
                          key={opt.value}
                          role="menuitem"
                          onClick={() => {
                            setTheme(opt.value)
                            close()
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                            theme === opt.value
                              ? 'font-semibold text-[var(--accent)] bg-[var(--bg-surface)]'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </Dropdown>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Playback
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-primary)]">
                    Autoplay next video
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoplayDefault}
                    onClick={toggleAutoplay}
                    className={`relative w-10 h-5 shrink-0 rounded-full border transition-colors ${
                      autoplayDefault
                        ? 'bg-[var(--accent)] border-[var(--accent)]'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-color)]'
                    }`}>
                    <span
                      className={`block w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        autoplayDefault ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Default playback speed
                  </label>
                  <select
                    value={defaultPlaybackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {SPEED_OPTIONS.map((speed) => (
                      <option key={speed} value={speed}>
                        {speed === 1 ? 'Normal' : speed + 'x'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Default quality
                  </label>
                  <select
                    value={defaultQuality}
                    onChange={(e) => setDefaultQuality(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  >
                    {QUALITY_OPTIONS.map((q) => (
                      <option key={q.value} value={q.value}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
              <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-3">
                Data &amp; privacy
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setClearHistoryConfirm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                  <span>Clear watch history</span>
                </button>
                <button
                  type="button"
                  onClick={() => setClearSearchConfirm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg transition-colors"
                >
                  <Clock className="w-4 h-4 shrink-0 text-[var(--text-secondary)]" />
                  <span>Clear search history</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] rounded-lg transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[var(--danger)]" />
                  <span className="text-[var(--danger)]">Reset all app data</span>
                </button>
              </div>
            </div>
          </section>

          {/* Confirm dialogs */}
          {clearHistoryConfirm && (
            <Modal
              isOpen={clearHistoryConfirm}
              onClose={() => setClearHistoryConfirm(false)}
              title="Clear watch history"
              size="sm"
            >
              <p className="text-sm text-[var(--text-primary)] mb-4">
                Are you sure you want to clear your entire watch history? This
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClearHistoryConfirm(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--danger)] hover:bg-[#b91c1c] transition-colors"
                >
                  Clear all
                </button>
              </div>
            </Modal>
          )}
          {clearSearchConfirm && (
            <Modal
              isOpen={clearSearchConfirm}
              onClose={() => setClearSearchConfirm(false)}
              title="Clear search history"
              size="sm"
            >
              <p className="text-sm text-[var(--text-primary)] mb-4">
                Are you sure you want to clear your recent searches? This cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClearSearchConfirm(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearSearches}
                  className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--danger)] hover:bg-[#b91c1c] transition-colors"
                >
                  Clear all
                </button>
              </div>
            </Modal>
          )}
          {resetConfirm && (
            <Modal
              isOpen={resetConfirm}
              onClose={() => setResetConfirm(false)}
              title="Reset all app data"
              size="sm"
            >
              <p className="text-sm text-[var(--text-primary)] mb-4">
                This will reset all app data including watch history, search
                history, liked videos, and profile settings. This cannot be
                undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1.5 rounded text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-3 py-1.5 rounded text-xs font-medium text-white bg-[var(--danger)] hover:bg-[#b91c1c] transition-colors"
                >
                  Reset all
                </button>
              </div>
            </Modal>
          )}
        </>
      )}

      {/* Playlists tab */}
      {activeTab === 'playlists' && <Playlists />}

      {/* Liked tab */}
      {activeTab === 'liked' && <LikedVideos />}

      {/* History tab */}
      {activeTab === 'history' && <History />}
    </main>
  )
}

function ModalFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
      {children}
    </div>
  )
}

ModalFooter.propTypes = {
  children: PropTypes.node,
}

Profile.propTypes = {}