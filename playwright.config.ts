import { defineConfig, devices } from '@playwright/test'

/**
 * Критичные e2e-сценарии. Требует запущенный backend (см. README бэкенда) с тестовым
 * SuperAdmin и переменные ниже. В CI браузеры ставятся через `npx playwright install --with-deps chromium`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
