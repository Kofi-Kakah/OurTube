import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Menu, Search, Sun, Moon, Laptop, Play } from 'lucide-react'
import { useThemeStore } from '@/store'
import { IconButton, Avatar, Dropdown } from '@/components/common'

export default function Navbar({ onToggleSidebar }) {
  const { theme, resolvedTheme, setTheme } = useThemeStore()

  const themeIcons = {
    light: <Sun className="w-5 h-5 text-amber-500" />,
    dark: <Moon className="w-5 h-5 text-indigo-400" />,
    system: <Laptop className="w-5 h-5 text-[var(--text-secondary)]" />,
  }

  const activeThemeIcon =
    theme === 'system' ? themeIcons.system : themeIcons[resolvedTheme]

  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 flex items-center justify-between gap-4">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-3">
        <IconButton
          aria-label="Toggle navigation menu"
          onClick={onToggleSidebar}
          size="md"
        >
          <Menu className="w-5 h-5" />
        </IconButton>

        <Link
          to="/"
          className="flex items-center gap-2 group text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg p-1"
          aria-label="OurTube Home"
        >
          <div className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
            OurTube
          </span>
        </Link>
      </div>

      {/* Center: Search Placeholder */}
      <div className="flex-1 max-w-xl mx-2 hidden sm:block">
        <div className="relative flex items-center">
          <input
            type="search"
            placeholder="Search videos, channels, topics..."
            disabled
            className="w-full h-10 pl-4 pr-10 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none cursor-default opacity-80"
          />
          <div className="absolute right-3 text-[var(--text-secondary)] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Right: Theme Toggle & User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Theme Dropdown */}
        <Dropdown
          align="right"
          trigger={({ isOpen }) => (
            <IconButton
              aria-label={`Current theme: ${theme}. Click to change theme.`}
              active={isOpen}
            >
              {activeThemeIcon}
            </IconButton>
          )}
        >
          {({ close }) => (
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                Appearance
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setTheme('light')
                  close()
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'font-semibold text-[var(--accent)] bg-[var(--bg-surface)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setTheme('dark')
                  close()
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'font-semibold text-[var(--accent)] bg-[var(--bg-surface)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setTheme('system')
                  close()
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  theme === 'system'
                    ? 'font-semibold text-[var(--accent)] bg-[var(--bg-surface)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                }`}
              >
                <Laptop className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>Device theme</span>
              </button>
            </div>
          )}
        </Dropdown>

        {/* Profile Avatar & Menu */}
        <Dropdown
          align="right"
          trigger={({ isOpen }) => (
            <button
              aria-label="User account menu"
              aria-expanded={isOpen}
              className="p-1 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
            >
              <Avatar name="Alex Creator" size="sm" />
            </button>
          )}
        >
          {({ close }) => (
            <div className="py-1">
              <div className="px-4 py-3 border-b border-[var(--border-color)]">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Alex Creator
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  alex@ourtube.internal
                </p>
              </div>
              <Link
                to="/profile"
                onClick={close}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors"
              >
                Profile & Settings
              </Link>
            </div>
          )}
        </Dropdown>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
}
