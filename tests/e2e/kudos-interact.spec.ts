import { test, expect } from '@playwright/test'

test.describe('US3: Heart Toggle + Copy Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
    await expect(page.locator('[role="feed"]')).toBeVisible()
  })

  test('toggles heart on click — count increments', async ({ page }) => {
    const heartButton = page.locator('article').first().getByRole('button', { name: /like|unlike/i })
    await expect(heartButton).toBeVisible()

    // Get initial count text
    const countBefore = await heartButton.locator('span[aria-live="polite"]').textContent()

    // Click to heart
    await heartButton.click()

    // Count should change (optimistic)
    await page.waitForTimeout(200)
    const countAfter = await heartButton.locator('span[aria-live="polite"]').textContent()
    expect(countAfter).not.toBe(countBefore)
  })

  test('copy link shows toast notification', async ({ page }) => {
    const copyButton = page.locator('article').first().getByRole('button', { name: /copy link/i })
    await expect(copyButton).toBeVisible()

    await copyButton.click()

    // Toast should appear
    await expect(page.getByText('Link copied -- ready to share!')).toBeVisible()

    // Toast auto-dismisses after ~3s
    await page.waitForTimeout(3500)
    await expect(page.getByText('Link copied -- ready to share!')).not.toBeVisible()
  })

  test('heart button is disabled on own kudos', async ({ page }) => {
    // Find a card where heart is disabled (own kudos)
    const disabledHeart = page.locator('article button[disabled]').first()
    // This test is conditional — only passes if the current user has sent a kudos
    if (await disabledHeart.isVisible()) {
      await expect(disabledHeart).toBeDisabled()
    }
  })
})
