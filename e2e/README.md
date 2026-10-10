# E2E (Playwright)

Эти сценарии гоняются против настоящего backend. Перед запуском:

1. Подними backend (`npm run start:dev` в classview-backend) с базой, где есть SuperAdmin
   из `SEED_*` переменных.
2. Задай переменные окружения для теста:
   - `E2E_SUPERADMIN_EMAIL`, `E2E_SUPERADMIN_PASSWORD` — учётка из seed-скрипта бэкенда.
3. `npm run build && npx playwright install --with-deps chromium`
4. `npm run e2e`

В этой песочнице нет доступа к cdn.playwright.dev, поэтому браузер Playwright здесь
не установился и тесты не запускались живьём — структура и сценарии готовы для CI,
где сеть не ограничена (workflow уже делает `playwright install` сам).
