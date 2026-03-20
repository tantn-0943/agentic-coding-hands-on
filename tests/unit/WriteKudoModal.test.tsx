import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WriteKudoModal } from '@/components/kudos/write/WriteKudoModal'

describe('WriteKudoModal', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <WriteKudoModal isOpen={false} onClose={vi.fn()}>
        <p>Content</p>
      </WriteKudoModal>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders children when open', () => {
    render(
      <WriteKudoModal isOpen={true} onClose={vi.fn()}>
        <p>Modal content</p>
      </WriteKudoModal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    render(
      <WriteKudoModal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </WriteKudoModal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'write-kudo-title')
  })

  it('fires onClose on Escape key', () => {
    const onClose = vi.fn()
    render(
      <WriteKudoModal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </WriteKudoModal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onClose on overlay click', () => {
    const onClose = vi.fn()
    render(
      <WriteKudoModal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </WriteKudoModal>
    )
    const overlay = screen.getByRole('dialog')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClose when clicking dialog content', () => {
    const onClose = vi.fn()
    render(
      <WriteKudoModal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </WriteKudoModal>
    )
    fireEvent.click(screen.getByText('Content'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
