import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '@/components/common'

export default function CategoryChips({
  categories = [],
  selectedCategory = 'All',
  onSelectCategory,
}) {
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollContainerRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [categories])

  const scroll = (direction) => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = direction === 'left' ? -250 : 250
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-14 md:top-16 z-20 bg-[var(--bg-base)]/95 backdrop-blur-md py-3 -mx-4 md:-mx-6 px-4 md:px-6 border-b border-[var(--border-color)] flex items-center select-none">
      {/* Left Scroll Button (Desktop) */}
      {canScrollLeft && (
        <div className="hidden md:flex absolute left-4 z-10 items-center bg-gradient-to-r from-[var(--bg-base)] via-[var(--bg-base)] to-transparent pr-4">
          <IconButton
            aria-label="Scroll categories left"
            size="sm"
            onClick={() => scroll('left')}
            className="shadow-md bg-[var(--bg-surface-elevated)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </IconButton>
        </div>
      )}

      {/* Horizontal Chips Track */}
      <div
        ref={scrollContainerRef}
        role="tablist"
        aria-label="Video categories"
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isSelected =
            selectedCategory.toLowerCase() === category.toLowerCase()

          return (
            <button
              key={category}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] ${
                isSelected
                  ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-sm'
                  : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      {/* Right Scroll Button (Desktop) */}
      {canScrollRight && (
        <div className="hidden md:flex absolute right-4 z-10 items-center bg-gradient-to-l from-[var(--bg-base)] via-[var(--bg-base)] to-transparent pl-4">
          <IconButton
            aria-label="Scroll categories right"
            size="sm"
            onClick={() => scroll('right')}
            className="shadow-md bg-[var(--bg-surface-elevated)]"
          >
            <ChevronRight className="w-4 h-4" />
          </IconButton>
        </div>
      )}
    </div>
  )
}

CategoryChips.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
}
