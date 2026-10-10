import { expect, test } from '@playwright/test'

test.describe('Вход и защита маршрутов', () => {
  test('неавторизованный доступ к / редиректит на /login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('неверный пароль показывает ошибку и не пускает дальше', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/email|телефон|логин/i).fill('nobody@example.com')
    await page.locator('input[type="password"]').fill('wrong-password')
    await page.getByRole('button', { name: /войти|login/i }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('успешный вход superadmin ведёт на дашборд', async ({ page }) => {
    const email = process.env.E2E_SUPERADMIN_EMAIL
    const password = process.env.E2E_SUPERADMIN_PASSWORD
    test.skip(!email || !password, 'E2E_SUPERADMIN_EMAIL / E2E_SUPERADMIN_PASSWORD не заданы')

    await page.goto('/login')
    await page.getByPlaceholder(/email|телефон|логин/i).fill(email!)
    await page.locator('input[type="password"]').fill(password!)
    await page.getByRole('button', { name: /войти|login/i }).click()
    await expect(page).not.toHaveURL(/\/login$/)
  })
})
