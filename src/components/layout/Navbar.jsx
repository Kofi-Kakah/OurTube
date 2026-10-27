import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Menu,
  Search,
  Sun,
  Moon,
  Laptop,
  Play,
  ChevronRight,
  X,
  Clock,
} from 'lucide-react'
import { useThemeStore } from '@/store'
import { useDebounce, useRecentSearches } from '@/hooks'
import { getSearchSuggestions } from '@/services'
import { IconButton, Avatar, Dropdown } from '@/components/common'

const SUGGESTION_LIMIT = 6

export default function Navbar({ onToggleSidebar }) {
  const { theme, resolvedTheme, setTheme } = useThemeStore()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  const inputRef = useRef(null)
  const {
    searches: recentSearches,
    add: addRecent,
    remove: removeRecent,
    clear: clearRecent,
  } = useRecentSearches()

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch suggestions on debounced query change
  useEffect(() => {
    let mounted = true
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([])
        setIsSuggestionsOpen(false)
        return
      }
      try {
        const data = await getSearchSuggestions({
          q: debouncedQuery,
          limit: SUGGESTION_LIMIT,
        })
        if (mounted) {
          setSuggestions(data)
          if (data.length) setIsSuggestionsOpen(true)
        }
      } catch {
        if (mounted) setSuggestions([])
      }
    }
    fetchSuggestions()
    return () => {
      mounted = false
    }
  }, [debouncedQuery])

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    setIsSuggestionsOpen(true)
    setSuggestionIndex(-1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    addRecent(q)
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setIsSuggestionsOpen(false)
    setSuggestionIndex(-1)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const handleSuggestionSelect = (suggestion) => {
    addRecent(suggestion.title)
    if (suggestion.type === 'video') {
      navigate(`/watch/${suggestion.id}`)
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.title)}`)
    }
    setIsSuggestionsOpen(false)
    setSearchQuery('')
    setSuggestionIndex(-1)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const handleRecentSelect = (query) => {
    addRecent(query)
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsSuggestionsOpen(false)
    setSearchQuery(query)
    setSuggestionIndex(-1)
    if (isSearchOpen) setIsSearchOpen(false)
  }

  const handleRecentRemove = (query, e) => {
    e.preventDefault()
    e.stopPropagation()
    removeRecent(query)
  }

  const handleClearRecent = () => {
    clearRecent()
    setSuggestions([])
    setIsSuggestionsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSuggestionIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestionIndex >= 0 && suggestions[suggestionIndex]) {
        handleSuggestionSelect(suggestions[suggestionIndex])
      } else {
        handleSubmit(e)
      }
    } else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false)
      setSuggestionIndex(-1)
      if (isSearchOpen) setIsSearchOpen(false)
    }
  }

  const themeIcons = {
    light: <Sun className="w-5 h-5 text-amber-500" />,
    dark: <Moon className="w-5 h-5 text-indigo-400" />,
    system: <Laptop className="w-5 h-5 text-[var(--text-secondary)]" />,
  }

  const activeThemeIcon =
    theme === 'system' ? themeIcons.system : themeIcons[resolvedTheme]

  const handleToggleSearch = () => {
    setIsSearchOpen((prev) => !prev)
    if (!isSearchOpen) setIsSuggestionsOpen(false)
  }

  const renderSuggestionItem = (suggestion, index) => (
    <button
      key={suggestion.id}
      type="button"
      role="option"
      aria-selected={suggestionIndex === index}
      onClick={() => handleSuggestionSelect(suggestion)}
      onMouseEnter={() => setSuggestionIndex(index)}
      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer text-sm ${
        suggestionIndex === index
          ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent)]'
          : 'hover:bg-[var(--bg-surface-elevated)]'
      }`}
    >
      <img
        src={suggestion.thumbnail}
        alt=""
        className="w-12 h-8 rounded object-cover shrink-0"
        loading="lazy"
        decoding="async"
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate text-[var(--text-primary)]">
          {suggestion.title}
        </div>
        <div className="text-xs truncate text-[var(--text-secondary)]">
          {suggestion.channelName}
        </div>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
    </button>
  )

  const renderRecentItem = (query) => (
    <button
      key={query}
      type="button"
      role="option"
      onClick={() => handleRecentSelect(query)}
      className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-surface-elevated)] cursor-pointer"
    >
      <div className="flex items-center gap-2 min-w-0">
        <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
        <span className="text-sm truncate text-[var(--text-primary)]">
          {query}
        </span>
      </div>
      <button
        type="button"
        onClick={(e) => handleRecentRemove(query, e)}
        className="p-1 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--bg-base)] rounded transition-colors"
        aria-label={`Remove ${query} from recent searches`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </button>
  )

  const renderSuggestionsPanel = () => {
    if (!isSuggestionsOpen) return null

    return (
      <div
        className="absolute left-0 right-0 mt-1 z-40 border border-[var(--border-color)] rounded-xl bg-[var(--bg-surface)] shadow-lg text-[var(--text-primary)]"
        role="listbox"
        aria-label="Search suggestions"
      >
        {searchQuery.trim() ? (
          <>
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-color)]">
              Results
            </div>
            {suggestions.length ? (
              suggestions.map((s, i) => renderSuggestionItem(s, i))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
                No results for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
            <div className="border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-[var(--accent)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>See all results for &ldquo;{searchQuery}&rdquo;</span>
              </button>
            </div>
          </>
        ) : recentSearches.length ? (
          <>
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-color)]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Recent searches
              </div>
              <button
                type="button"
                onClick={handleClearRecent}
                className="text-xs text-[var(--accent)] hover:underline"
                aria-label="Clear recent searches"
              >
                Clear all
              </button>
            </div>
            {recentSearches.map(renderRecentItem)}
          </>
        ) : (
          <div className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
            Search for videos, channels, or topics
          </div>
        )}
      </div>
    )
  }

  return (
    <>
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

      {/* Center: Search */}
      <div className="relative flex-1 max-w-xl mx-2 hidden sm:block">
        <div className="relative w-full group">
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search videos, channels, topics..."
            onFocus={() => setIsSuggestionsOpen(true)}
            className="w-full h-10 pl-4 pr-10 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-0 group-focus-within:opacity-100 transition-opacity"
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>
          {searchQuery && (
            <IconButton
              aria-label="Clear search"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSuggestions([])
                setIsSuggestionsOpen(false)
                setSuggestionIndex(-1)
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </IconButton>
          )}
        </div>
        {renderSuggestionsPanel()}
      </div>

      {/* Right: Theme Toggle & User Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile search toggle */}
        {isMobile && (
          <IconButton
            aria-label={isSearchOpen ? 'Close search' : 'Search'}
            size="md"
            onClick={handleToggleSearch}
          >
            <Search className="w-5 h-5" />
          </IconButton>
        )}

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

    {/* Mobile search overlay */}
    {isMobile && isSearchOpen && (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-surface)]"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="-ml-1 flex items-center text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] rounded-full p-1.5"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Search</h2>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="relative mb-6">
            <input
              ref={inputRef}
              type="search"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Search videos, channels, topics..."
              className="w-full h-11 pl-4 pr-10 rounded-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {searchQuery.trim() ? (
            <>
              <div className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Results
              </div>
              {suggestions.length ? (
                suggestions.map((s, i) => renderSuggestionItem(s, i))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-[var(--text-secondary)]">
                  No results for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
              <div className="border-t border-[var(--border-color)] mt-3 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-[var(--accent)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>See all results for &ldquo;{searchQuery}&rdquo;</span>
                </button>
              </div>
            </>
          ) : recentSearches.length ? (
            <>
              <div className="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Recent searches
              </div>
              {recentSearches.map(renderRecentItem)}
              <button
                type="button"
                onClick={handleClearRecent}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-xs text-[var(--accent)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
                aria-label="Clear recent searches"
              >
                <span>Clear all</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
              Search for videos, channels, or topics
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}

Navbar.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
}
