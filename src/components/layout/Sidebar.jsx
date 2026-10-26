import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Home,
  Compass,
  Tv,
  History,
  ThumbsUp,
  ListVideo,
  User,
} from 'lucide-react'

const mainNavItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Subscriptions', path: '/subscriptions', icon: Tv },
]

const libraryNavItems = [
  { label: 'History', path: '/history', icon: History },
  { label: 'Liked Videos', path: '/liked', icon: ThumbsUp },
  { label: 'Playlists', path: '/playlists', icon: ListVideo },
  { label: 'Profile', path: '/profile', icon: User },
]

export default function Sidebar({ isCollapsed = false }) {
  const renderNavLink = (item) => {
    const Icon = item.icon
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) =>
          `flex ${
            isCollapsed
              ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px]'
              : 'flex-row items-center gap-4 px-3 py-2.5 text-sm'
          } rounded-xl font-medium transition-colors ${
            isActive
              ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)] font-semibold'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]'
          }`
        }
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          className={isCollapsed ? 'w-5 h-5 shrink-0' : 'w-5 h-5 shrink-0'}
        />
        <span className={isCollapsed ? 'truncate max-w-[60px]' : 'truncate'}>
          {item.label}
        </span>
      </NavLink>
    )
  }

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] sticky top-14 md:top-16 bg-[var(--bg-surface)] border-r border-[var(--border-color)] overflow-y-auto transition-all duration-200 select-none ${
        isCollapsed ? 'w-18 px-1.5 py-3' : 'w-60 px-3 py-4'
      }`}
    >
      <nav aria-label="Primary Navigation" className="flex flex-col gap-1">
        {mainNavItems.map(renderNavLink)}

        <div className="my-2 border-t border-[var(--border-color)]" />

        {!isCollapsed && (
          <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            You
          </span>
        )}
        {libraryNavItems.map(renderNavLink)}
      </nav>
    </aside>
  )
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool,
}
