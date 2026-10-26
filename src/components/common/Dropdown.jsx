import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        close()
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const alignStyles = {
    right: 'right-0',
    left: 'left-0',
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={toggle} aria-haspopup="true" aria-expanded={isOpen}>
        {typeof trigger === 'function'
          ? trigger({ isOpen, toggle, close })
          : trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute ${alignStyles[align] || alignStyles.right} mt-2 w-56 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] shadow-xl py-1.5 z-40 focus:outline-none`}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}

Dropdown.propTypes = {
  trigger: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
}
