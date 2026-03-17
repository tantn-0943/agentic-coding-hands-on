import { test, expect } from '@playwright/test'

test.describe('US4: Highlight Kudos Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
  })

  test('renders carousel with pagination indicator', async ({ page }) => {
    // Check pagination text like "1/5"
    const pagination = page.getByText(/\d+\/\d+/)
    await expect(pagination).toBeVisible()
  })

  test('navigates forward with right arrow', async ({ page }) => {
    const rightArrow = page.getByRole('button', { name: 'Next card' })
    await expect(rightArrow).toBeVisible()

    await rightArrow.click()

    // Pagination should update
    await expect(page.getByText('2/')).toBeVisible()
  })

  test('left arrow is disabled on first page', async ({ page }) => {
    const leftArrow = page.getByRole('button', { name: 'Previous card' })
    await expect(leftArrow).toBeDisabled()
  })

  test('right arrow is disabled on last page', async ({ page }) => {
    const rightArrow = page.getByRole('button', { name: 'Next card' })

    // Navigate to last page
    for (let i = 0; i < 10; i++) {
      if (await rightArrow.isDisabled()) break
      await rightArrow.click()
      await page.waitForTimeout(400)
    }

    await expect(rightArrow).toBeDisabled()
  })
})
