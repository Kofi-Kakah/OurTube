import { NavLink } from 'react-router-dom'
import { Home, Compass, Tv, User } from 'lucide-react'

const bottomNavItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Subscriptions', path: '/subscriptions', icon: Tv },
  { label: 'You', path: '/profile', icon: User },
]

export default function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-2 flex items-center justify-around select-none"
    >
      {bottomNavItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
