import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EditorToolbar } from '@/components/kudos/write/EditorToolbar'

// Mock Icon component
vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name, ...props }: { name: string; size?: number; className?: string }) => (
    <span data-testid={`icon-${name}`} {...props}>{name}</span>
  ),
}))

// Create a mock editor
function createMockEditor(activeFormats: string[] = []) {
  const chainMethods = {
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }
  return {
    chain: vi.fn(() => chainMethods),
    isActive: vi.fn((format: string) => activeFormats.includes(format)),
    _chainMethods: chainMethods,
  } as unknown as ReturnType<typeof createMockEditor>
}

describe('EditorToolbar', () => {
  it('renders 6 toolbar buttons', () => {
    const editor = createMockEditor()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(6)
  })

  it('renders all expected button labels', () => {
    const editor = createMockEditor()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    expect(screen.getByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Italic')).toBeInTheDocument()
    expect(screen.getByLabelText('Strikethrough')).toBeInTheDocument()
    expect(screen.getByLabelText('Ordered List')).toBeInTheDocument()
    expect(screen.getByLabelText('Link')).toBeInTheDocument()
    expect(screen.getByLabelText('Quote')).toBeInTheDocument()
  })

  it('renders community standards link', () => {
    const editor = createMockEditor()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    expect(screen.getByText('Tiêu chuẩn cộng đồng')).toBeInTheDocument()
  })

  it('shows active state for toggled format', () => {
    const editor = createMockEditor(['bold'])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    const boldBtn = screen.getByLabelText('Bold')
    expect(boldBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows inactive state for non-toggled format', () => {
    const editor = createMockEditor([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    const boldBtn = screen.getByLabelText('Bold')
    expect(boldBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls editor command on button click', () => {
    const editor = createMockEditor()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render(<EditorToolbar editor={editor as any} />)
    fireEvent.click(screen.getByLabelText('Bold'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((editor as any).chain).toHaveBeenCalled()
  })
})
