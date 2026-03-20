import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HashtagSection } from '@/components/kudos/write/HashtagSection'

vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

// Mock fetch for hashtag loading
const mockHashtags = [
  { id: '1', name: 'teamwork' },
  { id: '2', name: 'innovation' },
  { id: '3', name: 'leadership' },
]

describe('HashtagSection', () => {
  const defaultProps = {
    selectedHashtags: [] as Array<{ id: string; name: string }>,
    onAdd: vi.fn(),
    onRemove: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: mockHashtags }),
    })
  })

  it('renders label with required asterisk', () => {
    render(<HashtagSection {...defaultProps} />)
    // "Hashtag" appears in both label and button, verify at least one exists
    expect(screen.getAllByText('Hashtag').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders add button', () => {
    render(<HashtagSection {...defaultProps} />)
    expect(screen.getByText('Tối đa 5')).toBeInTheDocument()
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(1)
  })

  it('opens dropdown on add button click', async () => {
    render(<HashtagSection {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    const addButton = buttons[0]
    fireEvent.click(addButton)
    await waitFor(() => {
      expect(screen.getByText('#teamwork')).toBeInTheDocument()
    })
  })

  it('calls onAdd when selecting a hashtag from dropdown', async () => {
    const onAdd = vi.fn()
    render(<HashtagSection {...defaultProps} onAdd={onAdd} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    await waitFor(() => {
      expect(screen.getByText('#teamwork')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('#teamwork'))
    expect(onAdd).toHaveBeenCalledWith(mockHashtags[0])
  })

  it('renders selected hashtags as chips', () => {
    render(
      <HashtagSection
        {...defaultProps}
        selectedHashtags={[{ id: '1', name: 'teamwork' }, { id: '2', name: 'innovation' }]}
      />
    )
    expect(screen.getByText('#teamwork')).toBeInTheDocument()
    expect(screen.getByText('#innovation')).toBeInTheDocument()
  })

  it('calls onRemove when clicking x on chip', () => {
    const onRemove = vi.fn()
    render(
      <HashtagSection
        {...defaultProps}
        selectedHashtags={[{ id: '1', name: 'teamwork' }]}
        onRemove={onRemove}
      />
    )
    // The close button is inside the chip
    const closeButtons = screen.getAllByTestId('icon-close-x')
    fireEvent.click(closeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('1')
  })

  it('hides add button when 5 hashtags selected', () => {
    const fiveHashtags = Array.from({ length: 5 }, (_, i) => ({ id: String(i), name: `tag${i}` }))
    render(<HashtagSection {...defaultProps} selectedHashtags={fiveHashtags} />)
    // Only chip close buttons should exist, no add button
    const allButtons = screen.getAllByRole('button')
    // 5 close buttons for chips only
    expect(allButtons).toHaveLength(5)
  })

  it('shows error message when error prop provided', () => {
    render(<HashtagSection {...defaultProps} error="Vui lòng chọn ít nhất 1 hashtag" />)
    expect(screen.getByText('Vui lòng chọn ít nhất 1 hashtag')).toBeInTheDocument()
  })
})
