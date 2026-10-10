import { expect, test } from '@playwright/test'

test.describe('Доступ по ролям', () => {
  test('прямой заход на /centers без токена редиректит на /login', async ({ page }) => {
    await page.goto('/centers')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('прямой заход на /403 показывает страницу доступа запрещён', async ({ page }) => {
    await page.goto('/403')
    await expect(page.getByText(/403|доступ запрещ/i)).toBeVisible()
  })

  test('несуществующий маршрут показывает 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText(/404|не найдена/i)).toBeVisible()
  })
})
