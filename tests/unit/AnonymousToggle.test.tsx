import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnonymousToggle } from '@/components/kudos/write/AnonymousToggle'

describe('AnonymousToggle', () => {
  const defaultProps = {
    isChecked: false,
    name: '',
    onToggle: vi.fn(),
    onNameChange: vi.fn(),
  }

  it('renders checkbox and label', () => {
    render(<AnonymousToggle {...defaultProps} />)
    expect(screen.getByText('Gửi lời cám ơn và ghi nhận ẩn danh')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('checkbox is unchecked by default', () => {
    render(<AnonymousToggle {...defaultProps} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn()
    render(<AnonymousToggle {...defaultProps} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('shows name input when checked', () => {
    render(<AnonymousToggle {...defaultProps} isChecked={true} />)
    expect(screen.getByPlaceholderText('Nhập tên ẩn danh')).toBeInTheDocument()
  })

  it('hides name input when unchecked', () => {
    render(<AnonymousToggle {...defaultProps} isChecked={false} />)
    expect(screen.queryByPlaceholderText('Nhập tên ẩn danh')).not.toBeInTheDocument()
  })

  it('calls onNameChange when name input changes', () => {
    const onNameChange = vi.fn()
    render(<AnonymousToggle {...defaultProps} isChecked={true} onNameChange={onNameChange} />)
    fireEvent.change(screen.getByPlaceholderText('Nhập tên ẩn danh'), { target: { value: 'Test' } })
    expect(onNameChange).toHaveBeenCalledWith('Test')
  })

  it('calls onToggle(false) when unchecking', () => {
    const onToggle = vi.fn()
    render(<AnonymousToggle {...defaultProps} isChecked={true} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })
})
