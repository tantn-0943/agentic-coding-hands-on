import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginButton from './LoginButton'

const mockSignInWithOAuth = vi.fn()
vi.mock('@/libs/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
    },
  })),
}))

describe('LoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignInWithOAuth.mockResolvedValue({ error: null })
  })

  it('renders the login button with correct default text', () => {
    render(<LoginButton />)
    expect(screen.getByRole('button', { name: /login with google/i })).toBeInTheDocument()
  })

  it('shows error message when initialError prop is provided', () => {
    render(<LoginButton initialError="auth_failed" />)
    expect(screen.getByText(/authentication failed/i)).toBeInTheDocument()
  })

  it('shows generic error for unknown error codes', () => {
    render(<LoginButton initialError="unknown_error" />)
    expect(screen.getByText(/an error occurred/i)).toBeInTheDocument()
  })

  it('disables button and shows loading state on click', async () => {
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {})) // never resolves
    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /login with google/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).toBeDisabled()
    })
  })

  it('shows client error and re-enables button when signInWithOAuth returns error', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: new Error('OAuth error') })
    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /login with google/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(button).not.toBeDisabled()
      expect(screen.getByText(/authentication failed/i)).toBeInTheDocument()
    })
  })

  it('keeps loading state when signInWithOAuth succeeds (waiting for redirect)', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    render(<LoginButton />)
    const button = screen.getByRole('button', { name: /login with google/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: 'google' })
      )
    })
    expect(button).toBeDisabled()
  })

  it('has correct aria-label on button', () => {
    render(<LoginButton />)
    expect(screen.getByRole('button', { name: 'Login with Google' })).toBeInTheDocument()
  })
})
