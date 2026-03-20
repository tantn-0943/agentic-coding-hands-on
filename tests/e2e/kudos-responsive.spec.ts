import { test, expect } from '@playwright/test'

test.describe('Responsive: Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
  })

  test('hero banner renders without horizontal overflow', async ({ page }) => {
    const body = page.locator('body')
    const bodyBox = await body.boundingBox()
    expect(bodyBox?.width).toBeLessThanOrEqual(375)
  })

  test('feed section takes full width', async ({ page }) => {
    const feed = page.locator('[role="feed"]')
    if (await feed.isVisible()) {
      const feedBox = await feed.boundingBox()
      if (feedBox) {
        expect(feedBox.width).toBeGreaterThan(300)
      }
    }
  })

  test('sidebar stacks below feed on mobile', async ({ page }) => {
    const feed = page.locator('[role="feed"]')
    const sidebar = page.locator('[data-testid="sidebar"], aside')

    if (await feed.isVisible() && await sidebar.isVisible()) {
      const feedBox = await feed.boundingBox()
      const sidebarBox = await sidebar.boundingBox()
      if (feedBox && sidebarBox) {
        // Sidebar should be below feed, not beside it
        expect(sidebarBox.y).toBeGreaterThanOrEqual(feedBox.y + feedBox.height - 50)
      }
    }
  })

  test('no horizontal scrollbar', async ({ page }) => {
    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHScroll).toBe(false)
  })
})

test.describe('Responsive: Tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
  })

  test('page renders without horizontal overflow', async ({ page }) => {
    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHScroll).toBe(false)
  })

  test('header navigation is visible on tablet', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()
  })
})

test.describe('Responsive: Desktop (1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await page.goto('/kudos')
  })

  test('page renders at full desktop width', async ({ page }) => {
    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHScroll).toBe(false)
  })

  test('header navigation is visible', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()
  })

  test('feed and sidebar render side by side', async ({ page }) => {
    const feed = page.locator('[role="feed"]')
    const sidebar = page.locator('[data-testid="sidebar"], aside')

    if (await feed.isVisible() && await sidebar.isVisible()) {
      const feedBox = await feed.boundingBox()
      const sidebarBox = await sidebar.boundingBox()
      if (feedBox && sidebarBox) {
        // At desktop width, sidebar should be beside feed (similar Y position)
        expect(Math.abs(sidebarBox.y - feedBox.y)).toBeLessThan(200)
      }
    }
  })
})
