import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import {
  Button,
  IconButton,
  Avatar,
  Skeleton,
  EmptyState,
  Modal,
  Dropdown,
  ToastProvider,
  useToast,
} from '@/components/common'

describe('Common Components', () => {
  describe('Button', () => {
    it('renders text and handles clicks', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      const btn = screen.getByRole('button', { name: /click me/i })
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('disables when loading and shows spinner', () => {
      render(<Button loading>Submit</Button>)
      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(
        screen.getByRole('status', { name: /loading/i })
      ).toBeInTheDocument()
    })
  })

  describe('IconButton', () => {
    it('renders with required aria-label and aria-pressed', () => {
      render(
        <IconButton aria-label="Favorite" active={true}>
          <span>★</span>
        </IconButton>
      )
      const btn = screen.getByRole('button', { name: /favorite/i })
      expect(btn).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Avatar', () => {
    it('renders initials when no image src is provided', () => {
      render(<Avatar name="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('renders img with proper alt when src is provided', () => {
      render(
        <Avatar
          src="https://example.com/avatar.jpg"
          alt="User avatar"
          name="John Doe"
        />
      )
      const img = screen.getByRole('img', { name: /user avatar/i })
      expect(img).toBeInTheDocument()
    })
  })

  describe('Skeleton', () => {
    it('renders with aria-hidden="true"', () => {
      const { container } = render(
        <Skeleton variant="rounded" width={100} height={40} />
      )
      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('EmptyState', () => {
    it('renders title, description and CTA button', () => {
      render(
        <EmptyState
          title="No items found"
          description="Try searching for something else."
          action={<button>Reload</button>}
        />
      )
      expect(screen.getByText('No items found')).toBeInTheDocument()
      expect(
        screen.getByText('Try searching for something else.')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /reload/i })
      ).toBeInTheDocument()
    })
  })

  describe('Modal', () => {
    it('renders when isOpen is true and calls onClose on Esc', () => {
      const handleClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal body content</p>
        </Modal>
      )
      expect(
        screen.getByRole('dialog', { name: /test modal/i })
      ).toBeInTheDocument()
      expect(screen.getByText('Modal body content')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' })
      expect(handleClose).toHaveBeenCalled()
    })

    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Hidden Modal">
          <p>Hidden</p>
        </Modal>
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('Dropdown', () => {
    it('toggles dropdown menu on trigger click', () => {
      render(
        <Dropdown trigger={<button>Open Menu</button>}>
          {({ close }) => (
            <div>
              <button onClick={close}>Item 1</button>
            </div>
          )}
        </Dropdown>
      )
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      expect(screen.getByRole('menu')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /item 1/i })
      ).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /item 1/i }))
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  describe('Toast', () => {
    function ToastTrigger() {
      const { showToast } = useToast()
      return (
        <button
          onClick={() =>
            showToast({
              message: 'Saved successfully!',
              type: 'success',
              duration: 0,
            })
          }
        >
          Trigger Toast
        </button>
      )
    }

    it('displays toast message upon invocation', () => {
      render(
        <ToastProvider>
          <ToastTrigger />
        </ToastProvider>
      )
      fireEvent.click(screen.getByRole('button', { name: /trigger toast/i }))
      expect(screen.getByText('Saved successfully!')).toBeInTheDocument()
    })
  })
})
