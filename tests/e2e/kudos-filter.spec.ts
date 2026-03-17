import { test, expect } from '@playwright/test'

test.describe('US5: Filter by Hashtag/Department', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
    await expect(page.locator('[role="feed"]')).toBeVisible()
  })

  test('opens hashtag dropdown and selects filter', async ({ page }) => {
    const hashtagButton = page.getByRole('button', { name: /hashtag/i })
    await expect(hashtagButton).toBeVisible()

    await hashtagButton.click()

    // Dropdown should appear with options
    const dropdown = page.locator('[class*="absolute"]').filter({ hasText: /Dedicated|Inspiring|Teamwork/i })
    await expect(dropdown).toBeVisible()

    // Select a hashtag
    await dropdown.getByText('Dedicated').click()

    // URL should update
    await expect(page).toHaveURL(/hashtag=Dedicated/)
  })

  test('opens department dropdown and selects filter', async ({ page }) => {
    const deptButton = page.getByRole('button', { name: /phong ban/i })
    await expect(deptButton).toBeVisible()

    await deptButton.click()

    const dropdown = page.locator('[class*="absolute"]').filter({ hasText: /Engineering|Design|Product/i })
    await expect(dropdown).toBeVisible()

    await dropdown.getByText('Engineering').click()

    await expect(page).toHaveURL(/department=Engineering/)
  })

  test('clears filter reverts to all kudos', async ({ page }) => {
    // Apply filter first
    await page.goto('/kudos?hashtag=Dedicated')

    const hashtagButton = page.getByRole('button', { name: /Dedicated/i })
    await hashtagButton.click()

    // Click "Clear filter"
    await page.getByText('Clear filter').click()

    await expect(page).not.toHaveURL(/hashtag=/)
  })

  test('clicking hashtag badge on card applies filter', async ({ page }) => {
    // Find a hashtag badge in the feed
    const badge = page.locator('article button').filter({ hasText: /^#/ }).first()

    if (await badge.isVisible()) {
      const tagName = (await badge.textContent())?.replace('#', '')
      await badge.click()

      if (tagName) {
        await expect(page).toHaveURL(new RegExp(`hashtag=${tagName}`))
      }
    }
  })
})
