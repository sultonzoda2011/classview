import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    // e2e/ содержит Playwright-спеки — у них свой раннер, vitest их не должен подбирать
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
