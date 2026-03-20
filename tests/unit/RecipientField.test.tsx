import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RecipientField } from '@/components/kudos/write/RecipientField'

// Mock useProfileSearch hook
const mockSetQuery = vi.fn()
const mockClose = vi.fn()
let mockHookState = {
  query: '',
  setQuery: mockSetQuery,
  results: [] as Array<{ id: string; name: string; avatar_url: string | null; department: { name: string } | null }>,
  isLoading: false,
  isOpen: false,
  close: mockClose,
}

vi.mock('@/hooks/useProfileSearch', () => ({
  useProfileSearch: () => mockHookState,
}))

vi.mock('@/components/ui/Avatar', () => ({
  Avatar: ({ alt }: { alt: string }) => <span data-testid="avatar">{alt}</span>,
}))

vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

describe('RecipientField', () => {
  const defaultProps = {
    selectedId: null,
    selectedName: null,
    onSelect: vi.fn(),
    onClear: vi.fn(),
  }

  beforeEach(() => {
    mockHookState = {
      query: '',
      setQuery: mockSetQuery,
      results: [],
      isLoading: false,
      isOpen: false,
      close: mockClose,
    }
    vi.clearAllMocks()
  })

  it('renders label and search input', () => {
    render(<RecipientField {...defaultProps} />)
    expect(screen.getByText('Người nhận')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tìm kiếm')).toBeInTheDocument()
  })

  it('renders required asterisk', () => {
    render(<RecipientField {...defaultProps} />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows selected name when recipient is selected', () => {
    render(<RecipientField {...defaultProps} selectedId="123" selectedName="Nguyễn Văn A" />)
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Tìm kiếm')).not.toBeInTheDocument()
  })

  it('shows dropdown results when open with results', () => {
    mockHookState.isOpen = true
    mockHookState.results = [
      { id: '1', name: 'User One', avatar_url: null, department: { name: 'Engineering' } },
      { id: '2', name: 'User Two', avatar_url: null, department: null },
    ]
    render(<RecipientField {...defaultProps} />)
    // Results rendered inside list items with name paragraphs
    expect(screen.getAllByText('User One').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('User Two').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Engineering')).toBeInTheDocument()
  })

  it('calls onSelect when clicking a result', () => {
    const onSelect = vi.fn()
    mockHookState.isOpen = true
    mockHookState.results = [
      { id: '1', name: 'User One', avatar_url: null, department: null },
    ]
    render(<RecipientField {...defaultProps} onSelect={onSelect} />)
    // Click the button in the dropdown (not the avatar text)
    const listButtons = screen.getAllByRole('button')
    fireEvent.click(listButtons[0])
    expect(onSelect).toHaveBeenCalledWith('1', 'User One')
  })

  it('shows error state with error message', () => {
    render(<RecipientField {...defaultProps} error="Vui lòng chọn người nhận" />)
    expect(screen.getByText('Vui lòng chọn người nhận')).toBeInTheDocument()
  })

  it('calls onClear when clearing selected recipient', () => {
    const onClear = vi.fn()
    render(<RecipientField {...defaultProps} selectedId="123" selectedName="User" onClear={onClear} />)
    fireEvent.click(screen.getByTestId('icon-close-x'))
    expect(onClear).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    mockHookState.isOpen = true
    mockHookState.isLoading = true
    render(<RecipientField {...defaultProps} />)
    expect(screen.getByText('Đang tìm kiếm...')).toBeInTheDocument()
  })

  it('shows empty state when no results found', () => {
    mockHookState.isOpen = true
    mockHookState.isLoading = false
    mockHookState.query = 'xyz'
    render(<RecipientField {...defaultProps} />)
    expect(screen.getByText('Không tìm thấy kết quả')).toBeInTheDocument()
  })
})
