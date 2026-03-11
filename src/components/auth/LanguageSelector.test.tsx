import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSelector from './LanguageSelector'

describe('LanguageSelector', () => {
  it('renders a button with VN text', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('VN')).toBeInTheDocument()
  })

  it('has aria-haspopup="listbox" attribute', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'listbox')
  })

  it('has aria-expanded="false" attribute', () => {
    render(<LanguageSelector />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders VN flag image', () => {
    render(<LanguageSelector />)
    expect(screen.getByAltText('Vietnam flag')).toBeInTheDocument()
  })

  it('renders chevron icon', () => {
    render(<LanguageSelector />)
    expect(document.querySelector('img[aria-hidden="true"][src*="chevron"]')).toBeTruthy()
  })

  it('onClick is a no-op and does not change aria-expanded', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<LanguageSelector />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    consoleSpy.mockRestore()
  })
})
