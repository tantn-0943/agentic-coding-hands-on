import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept Supabase auth to control session state
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid JWT', status: 401 }),
      })
    })
  })

  // Scenario 1: Login button is active on page load
  test('login button is visible and active on page load', async ({ page }) => {
    await page.goto('/login')
    const loginButton = page.getByRole('button', { name: /login with google/i })
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()
  })

  // Scenario 2: Button becomes disabled while loading
  test('login button is disabled while loading after click', async ({ page }) => {
    // Block the OAuth redirect to keep loading state
    await page.route('**/auth/v1/authorize**', async (route) => {
      await new Promise((r) => setTimeout(r, 5000))
      await route.abort()
    })

    await page.goto('/login')
    const loginButton = page.getByRole('button', { name: /login with google/i })
    await loginButton.click()
    await expect(loginButton).toBeDisabled()
  })

  // Scenario 3: Redirect to / after OAuth success (simulated via callback route)
  test('redirects to / after successful OAuth callback', async ({ page }) => {
    // Mock the Supabase exchangeCodeForSession by intercepting the callback
    await page.route('**/auth/v1/token**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user: { id: 'user-123', email: 'test@example.com' },
        }),
      })
    })

    // Navigate directly to callback with a code (simulates successful OAuth return)
    await page.goto('/auth/callback?code=test-code')
    // Should redirect away from callback
    await expect(page).not.toHaveURL(/\/auth\/callback/)
  })

  // Scenario 4: Error is shown and button is active after OAuth failure
  test('shows error message when auth_failed param is present', async ({ page }) => {
    await page.goto('/login?error=auth_failed')
    await expect(page.getByText(/authentication failed/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login with google/i })).toBeEnabled()
  })

  // Scenario 5: Auto-redirect if already logged in
  test('redirects authenticated user from /login to /', async ({ page }) => {
    // Override the user endpoint to return an authenticated user
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          email: 'test@example.com',
          role: 'authenticated',
        }),
      })
    })

    await page.goto('/login')
    // Middleware should redirect to /
    await expect(page).toHaveURL('/')
  })
})

test.describe('Login Page - Responsive', () => {
  test('renders correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible()
  })

  test('renders correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible()
  })

  test('renders correctly on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/login')
    await expect(page.getByRole('button', { name: /login with google/i })).toBeVisible()
  })
})

test.describe('Login Page - Accessibility', () => {
  test('language selector has correct aria attributes', async ({ page }) => {
    await page.goto('/login')
    const langButton = page.getByRole('button', { name: /select language/i })
    await expect(langButton).toHaveAttribute('aria-haspopup', 'listbox')
    await expect(langButton).toHaveAttribute('aria-expanded', 'false')
  })

  test('interactive elements are keyboard focusable in correct order', async ({ page }) => {
    await page.goto('/login')
    await page.keyboard.press('Tab')
    const langButton = page.getByRole('button', { name: /select language/i })
    await expect(langButton).toBeFocused()

    await page.keyboard.press('Tab')
    const loginButton = page.getByRole('button', { name: /login with google/i })
    await expect(loginButton).toBeFocused()
  })
})
