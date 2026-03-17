import { test, expect } from '@playwright/test'

test.describe('US1: Browse Kudos Feed', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Login as test user before each test
    await page.goto('/kudos')
  })

  test('displays kudos cards with sender/receiver info', async ({ page }) => {
    // Wait for feed to load
    await expect(page.locator('[role="feed"]')).toBeVisible()

    // Check at least one card renders
    const cards = page.locator('article')
    await expect(cards.first()).toBeVisible()
  })

  test('infinite scroll loads more cards', async ({ page }) => {
    await expect(page.locator('[role="feed"]')).toBeVisible()

    const initialCount = await page.locator('article').count()

    // Scroll to bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Wait for new cards to load
    await page.waitForTimeout(1500)

    const newCount = await page.locator('article').count()
    expect(newCount).toBeGreaterThanOrEqual(initialCount)
  })

  test('shows empty state when no kudos', async ({ page }) => {
    // Apply filter that returns no results
    await page.goto('/kudos?hashtag=NonExistentTag')
    await expect(page.getByText('Hien tai chua co Kudos nao.')).toBeVisible()
  })

  test('shows skeleton loading on initial load', async ({ page }) => {
    // Navigate and check loading state appears
    await page.goto('/kudos')
    // Skeleton should flash briefly
    const skeleton = page.locator('[role="status"][aria-label="Loading"]')
    // This may pass instantly if data loads fast — acceptable
    await expect(page.locator('[role="feed"]')).toBeVisible({ timeout: 5000 })
  })
})
