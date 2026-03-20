import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageSection } from '@/components/kudos/write/ImageSection'

vi.mock('@/components/ui/Icon', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`}>{name}</span>,
}))

vi.mock('@/lib/kudos/actions', () => ({
  uploadKudoImage: vi.fn().mockResolvedValue({ url: 'https://example.com/uploaded.jpg' }),
}))

describe('ImageSection', () => {
  const defaultProps = {
    images: [] as string[],
    onUpload: vi.fn(),
    onRemove: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders label', () => {
    render(<ImageSection {...defaultProps} />)
    // "Image" appears in both label and button text
    expect(screen.getAllByText('Image').length).toBeGreaterThanOrEqual(1)
  })

  it('renders add button when less than 5 images', () => {
    render(<ImageSection {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders image thumbnails', () => {
    render(
      <ImageSection
        {...defaultProps}
        images={['https://example.com/1.jpg', 'https://example.com/2.jpg']}
      />
    )
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[0]).toHaveAttribute('src', 'https://example.com/1.jpg')
  })

  it('calls onRemove when clicking delete button on thumbnail', () => {
    const onRemove = vi.fn()
    render(
      <ImageSection
        {...defaultProps}
        images={['https://example.com/1.jpg']}
        onRemove={onRemove}
      />
    )
    const deleteButtons = screen.getAllByTestId('icon-close-x')
    fireEvent.click(deleteButtons[0])
    expect(onRemove).toHaveBeenCalledWith(0)
  })

  it('hides add button when 5 images attached', () => {
    const fiveImages = Array.from({ length: 5 }, (_, i) => `https://example.com/${i}.jpg`)
    render(<ImageSection {...defaultProps} images={fiveImages} />)
    // Should only have delete buttons (5), no add button
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(5)
  })

  it('calls onUpload after successful upload', async () => {
    const onUpload = vi.fn()
    render(<ImageSection {...defaultProps} onUpload={onUpload} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith('https://example.com/uploaded.jpg')
    })
  })

  it('calls onUploadError on upload failure', async () => {
    const { uploadKudoImage } = await import('@/lib/kudos/actions')
    vi.mocked(uploadKudoImage).mockRejectedValueOnce(new Error('Upload failed'))

    const onUploadError = vi.fn()
    render(<ImageSection {...defaultProps} onUploadError={onUploadError} />)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalledWith('Upload failed')
    })
  })

  it('accepts correct file types', () => {
    render(<ImageSection {...defaultProps} />)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png,image/gif,image/webp')
  })
})
