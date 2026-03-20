import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageDropdown } from '@/components/auth/LanguageDropdown'

describe('LanguageDropdown', () => {
  const defaultProps = {
    selectedLocale: 'vi' as const,
    focusedIndex: 0,
    onSelect: vi.fn(),
  }

  it('renders listbox with 2 options', () => {
    render(<LanguageDropdown {...defaultProps} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
  })

  it('renders VN and EN labels', () => {
    render(<LanguageDropdown {...defaultProps} />)
    expect(screen.getByText('VN')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('renders flag images for both locales', () => {
    render(<LanguageDropdown {...defaultProps} />)
    expect(screen.getByAltText('VN flag')).toBeInTheDocument()
    expect(screen.getByAltText('EN flag')).toBeInTheDocument()
  })

  it('marks selected option with aria-selected=true', () => {
    render(<LanguageDropdown {...defaultProps} selectedLocale="vi" />)
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('marks EN as selected when selectedLocale is en', () => {
    render(<LanguageDropdown {...defaultProps} selectedLocale="en" />)
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onSelect with locale code on click', () => {
    const onSelect = vi.fn()
    render(<LanguageDropdown {...defaultProps} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('EN'))
    expect(onSelect).toHaveBeenCalledWith('en')
  })

  it('calls onSelect with already-selected locale on click', () => {
    const onSelect = vi.fn()
    render(<LanguageDropdown {...defaultProps} selectedLocale="vi" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('VN'))
    expect(onSelect).toHaveBeenCalledWith('vi')
  })

  it('sets tabIndex=0 on focused option and -1 on others', () => {
    render(<LanguageDropdown {...defaultProps} focusedIndex={1} />)
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('tabindex', '-1')
    expect(options[1]).toHaveAttribute('tabindex', '0')
  })
})
