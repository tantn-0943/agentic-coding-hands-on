import { test, expect } from '@playwright/test'

test.describe('Language Selector Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    // Clear locale cookie
    await page.context().clearCookies()
    await page.goto('/login')
  })

  test('opens dropdown on click and shows VN/EN options', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const listbox = page.getByRole('listbox')
    await expect(listbox).toBeVisible()

    const options = page.getByRole('option')
    await expect(options).toHaveCount(2)
    await expect(options.nth(0)).toContainText('VN')
    await expect(options.nth(1)).toContainText('EN')
  })

  test('switches language VN → EN and updates trigger', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await trigger.click()

    // Click EN option
    await page.getByRole('option', { name: /EN/i }).click()

    // Dropdown should close
    await expect(page.getByRole('listbox')).not.toBeVisible()

    // Trigger should now show EN
    await expect(trigger).toContainText('EN')
  })

  test('persists language after page reload', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await trigger.click()
    await page.getByRole('option', { name: /EN/i }).click()

    // Reload page
    await page.reload()

    // Should still show EN
    const triggerAfterReload = page.getByRole('button', { name: /select language/i })
    await expect(triggerAfterReload).toContainText('EN')
  })

  test('closes dropdown on click outside', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await trigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()

    // Click outside the dropdown
    await page.locator('body').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('listbox')).not.toBeVisible()
  })

  test('closes dropdown on Escape key', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await trigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).not.toBeVisible()
  })

  test('keyboard navigation: Arrow Down/Up + Enter selects', async ({ page }) => {
    const trigger = page.getByRole('button', { name: /select language/i })
    await trigger.focus()

    // Open with Enter
    await page.keyboard.press('Enter')
    await expect(page.getByRole('listbox')).toBeVisible()

    // Arrow Down to EN
    await page.keyboard.press('ArrowDown')

    // Enter to select
    await page.keyboard.press('Enter')

    // Should close and switch to EN
    await expect(page.getByRole('listbox')).not.toBeVisible()
    await expect(trigger).toContainText('EN')
  })
})
