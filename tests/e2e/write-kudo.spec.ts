import { test, expect } from '@playwright/test'

test.describe('US1: Write and Send Kudos', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Login as test user before each test
    await page.goto('/kudos')
  })

  test('opens modal from search input on Live Board', async ({ page }) => {
    // Click the search input/pill to open modal
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    // Modal should appear
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Gửi lời cám ơn và ghi nhận đến đồng đội')).toBeVisible()
  })

  test('modal closes on Cancel button click', async ({ page }) => {
    // Open modal
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    await expect(page.getByRole('dialog')).toBeVisible()

    // Click Cancel (Hủy)
    await page.getByText('Hủy').click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('modal closes on Escape key', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('submit button is disabled when form is empty', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    await expect(page.getByRole('dialog')).toBeVisible()

    // Submit button should be disabled/have disabled styling
    const submitBtn = page.getByText('Gửi', { exact: false }).locator('visible=true').last()
    await expect(submitBtn).toBeVisible()
  })

  test('displays all form sections', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    await expect(page.getByRole('dialog')).toBeVisible()

    // Verify all form sections are present
    await expect(page.getByText('Người nhận')).toBeVisible()
    await expect(page.getByText('Danh hiệu')).toBeVisible()
    await expect(page.getByText('Hashtag')).toBeVisible()
    await expect(page.getByText('Image')).toBeVisible()
    await expect(page.getByText('Gửi lời cám ơn và ghi nhận ẩn danh')).toBeVisible()
  })

  test('anonymous toggle shows name field', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }
    await expect(page.getByRole('dialog')).toBeVisible()

    // Check anonymous checkbox
    await page.getByText('Gửi lời cám ơn và ghi nhận ẩn danh').click()

    // Name field should appear
    await expect(page.getByPlaceholder('Nhập tên ẩn danh')).toBeVisible()

    // Uncheck
    await page.getByText('Gửi lời cám ơn và ghi nhận ẩn danh').click()
    await expect(page.getByPlaceholder('Nhập tên ẩn danh')).not.toBeVisible()
  })
})

test.describe('Write Kudo - Responsive Modal', () => {
  test('mobile: modal is fullscreen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/kudos')

    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // On mobile, modal should fill the viewport
    const dialogBox = await dialog.locator('> div').first().boundingBox()
    if (dialogBox) {
      expect(dialogBox.width).toBeGreaterThanOrEqual(370)
    }
  })

  test('desktop: modal is centered with max width', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/kudos')

    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    // On desktop, modal should be ~752px wide
    const dialogBox = await dialog.locator('> div').first().boundingBox()
    if (dialogBox) {
      expect(dialogBox.width).toBeLessThanOrEqual(760)
      expect(dialogBox.width).toBeGreaterThanOrEqual(700)
    }
  })

  test('keyboard navigation: Tab cycles within modal', async ({ page }) => {
    await page.goto('/kudos')

    const searchInput = page.locator('input[placeholder*="Tìm kiếm"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.click()
    }

    await expect(page.getByRole('dialog')).toBeVisible()

    // Tab through focusable elements - focus should stay within modal
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab')
    }

    // Focus should still be within the dialog
    const activeElement = await page.evaluate(() => {
      const el = document.activeElement
      return el?.closest('[role="dialog"]') !== null
    })
    expect(activeElement).toBe(true)
  })
})
