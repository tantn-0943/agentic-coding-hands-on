import { test, expect } from '@playwright/test'

test.describe('Countdown - Prelaunch', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/countdown')
	})

	test('P1-SC1: shows DAYS, HOURS, MINUTES unit labels', async ({ page }) => {
		await expect(page.getByText('DAYS')).toBeVisible()
		await expect(page.getByText('HOURS')).toBeVisible()
		await expect(page.getByText('MINUTES')).toBeVisible()
	})

	test('P1-SC2: all digit characters are numeric (0–9)', async ({ page }) => {
		// Each CountdownUnit renders two single-digit spans via DigitCard
		const digitSpans = page.locator('span').filter({ hasText: /^[0-9]$/ })
		const count = await digitSpans.count()
		expect(count).toBeGreaterThanOrEqual(6) // 3 units × 2 digits each
		for (let i = 0; i < count; i++) {
			const text = await digitSpans.nth(i).textContent()
			expect(text).toMatch(/^[0-9]$/)
		}
	})

	test('P1-SC6: no JS console errors on load', async ({ page }) => {
		const consoleErrors: string[] = []
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text())
		})
		await page.reload()
		await page.waitForLoadState('networkidle')
		expect(consoleErrors).toHaveLength(0)
	})

	test('SC-005: 375px viewport has no horizontal overflow', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 })
		await page.goto('/countdown')
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
		expect(scrollWidth).toBeLessThanOrEqual(375)
	})

	test('SC-002: digit cards have backdrop-blur styling', async ({ page }) => {
		const innerBgDiv = page.locator('[aria-hidden="true"]').first()
		await expect(innerBgDiv).toBeVisible()
		const backdropFilter = await innerBgDiv.evaluate(
			(el) => window.getComputedStyle(el).backdropFilter
		)
		// backdrop-blur should produce a blur value
		expect(backdropFilter).toContain('blur')
	})

	test('heading "Sự kiện sẽ bắt đầu sau" is visible', async ({ page }) => {
		await expect(page.getByRole('heading', { name: 'Sự kiện sẽ bắt đầu sau' })).toBeVisible()
	})
})
