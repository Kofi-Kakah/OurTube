import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Search, ArrowLeft } from 'lucide-react'
import { Button, Spinner } from '@/components/common'
import { searchVideos } from '@/services'
import { usePageTitle } from '@/hooks'

const DEBOUNCE_MS = 300

export default function NotFound() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const timerRef = useRef(null)

  usePageTitle('404 — Page not found — OurTube')

  const handleSearch = useCallback(
    (value) => {
      setQuery(value)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (!value.trim()) {
        setResults([])
        return
      }
      setIsLoading(true)
      timerRef.current = setTimeout(async () => {
        try {
          const data = await searchVideos({ q: value, limit: 5 })
          setResults(data.items ?? [])
        } catch {
          setResults([])
        } finally {
          setIsLoading(false)
        }
      }, DEBOUNCE_MS)
    },
    []
  )

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <main className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="max-w-md w-full">
        <AlertCircle className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
          404 — Page not found
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search videos…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 pl-9 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
          {isLoading && <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Searching" />}
        </div>

        {results.length > 0 && (
          <div className="space-y-2 text-left">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Search results
            </p>
            {results.map((video) => (
              <Button
                key={video.id}
                onClick={() => navigate(`/watch/${video.id}`)}
                variant="ghost"
                className="w-full justify-start text-left text-sm gap-2"
                aria-label={`Watch ${video.title}`}
              >
                {video.title}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGoHome} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go home
          </Button>
        </div>
      </div>
    </main>
  )
}
