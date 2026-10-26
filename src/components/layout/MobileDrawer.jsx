import { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  X,
  Play,
  Home,
  Compass,
  Tv,
  History,
  ThumbsUp,
  ListVideo,
  User,
} from 'lucide-react'
import { IconButton } from '@/components/common'

const navGroups = [
  {
    title: 'Explore',
    items: [
      { label: 'Home', path: '/', icon: Home },
      { label: 'Explore', path: '/explore', icon: Compass },
      { label: 'Subscriptions', path: '/subscriptions', icon: Tv },
    ],
  },
  {
    title: 'You',
    items: [
      { label: 'History', path: '/history', icon: History },
      { label: 'Liked Videos', path: '/liked', icon: ThumbsUp },
      { label: 'Playlists', path: '/playlists', icon: ListVideo },
      { label: 'Profile', path: '/profile', icon: User },
    ],
  },
]

export default function MobileDrawer({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Drawer"
      className="fixed inset-0 z-50 md:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--overlay)] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-64 max-w-[80vw] h-full bg-[var(--bg-surface)] border-r border-[var(--border-color)] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-color)]">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2 text-[var(--text-primary)]"
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span className="font-bold text-base tracking-tight">OurTube</span>
          </Link>

          <IconButton
            aria-label="Close navigation drawer"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                {group.title}
              </span>
              <div className="mt-1 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}

MobileDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
