# AGENTS.md

React 19 + Vite + TS strict — фронт панели камер классов. Backend — отдельный репо `classview-backend` (NestJS), ожидается на `localhost:5990`.

## Команды

- `npm run dev` — dev-сервер (5173); прокси `/api` (с отбрасыванием префикса) и `/Streams` (ws) на `VITE_API_URL`
- Порядок проверки как в CI (`.github/workflows/ci.yml`, Node 22):
  `npm run lint` → `npx tsc -b --noEmit` → `npm run check-i18n` → `npm test` → `npm run build`
- `npm run build` = `tsc -b && vite build` (typecheck входит в сборку)
- `npm test` — vitest, jsdom, подбирает только `src/**/*.test.{ts,tsx}`; один тест: `npx vitest run src/lib/time.test.ts`
- `npm run check-i18n` — exit 1 при любом расхождении ключей en/ru/tj (и пропущенных, и лишних)

## e2e (Playwright)

- Нужен поднятый backend с сид-суперадмином: `npm run build && npx playwright install --with-deps chromium`, затем `E2E_SUPERADMIN_EMAIL=... E2E_SUPERADMIN_PASSWORD=... npm run e2e`
- `playwright.config.ts` нет — дефолты Playwright, спеки в `e2e/`; суперадмин-тест сам скипается без env
- В CI job `e2e` крутится только при repo var `E2E_ENABLED=true` + секрет `E2E_SUPERADMIN_PASSWORD`

## Архитектура

- Один RTK Query root `src/store/api.ts`; сущности — `injectEndpoints` в `src/store/<entity>Api.ts` (теги `Center`/`ClassRoom`/`User`/`Me`, паттерн `id: 'LIST'`)
- `src/api/baseQuery.ts`: axios, разворачивает `{statusCode,data,message}`, ошибки → тост (sonner), 401 → разлогин (кроме `/Account/login|send-otp|verify-otp|reset-password`), `silent: true` гасит тост
- `src/hooks/useAuth.ts` — единственный decode JWT, токен в cookie `token`, реактивность через `useSyncExternalStore` + событие `app:token-changed`
- Роутинг `src/App.tsx`: createBrowserRouter, все страницы ленивые; роли — `RoleProtectedRoute` (SuperAdmin: `/`, `/centers`, `/users/create-employee`; Admin+SuperAdmin: `/users`, `/classrooms`, CRUD пользователей)
- UI: `components/ui/*` — шадcn-подобный кит (Radix + Tailwind v4 + cva); поля форм — `components/fields/*`; составные формы — `components/forms/*`; диалоги сущностей — `components/modal/*`
- zod-схемы в `src/types/*.ts` — фабрики `schema(t)`, а не статичные объекты
- Переводы: `public/locales/{en,ru,tj}/translation.json`; в тестах загружаются напрямую, язык по умолчанию — `ru`

## Конвенции

- Поле формы → только `TextField`/`SelectField`/`SwitchField`, `<input>` руками не вёрстать
- Удаление чего угодно — только через `ConfirmDialog` (исторический баг: один клик удалял сущность)
- Новый текст UI → `t('...')` + ключ сразу в `en`, `ru` и `tj`
- Ошибки запросов не глушить в `catch` — `baseQuery` уже показал тост; `catch` нужен только чтобы прервать flow
- Доступ проверяет в первую очередь backend — фронт-фильтрация не источник истины

## Грабли

- `vite` замаскирован под `rolldown-vite@7.1.12` (npm override) — не настоящий Vite, совместимость плагинов не гарантирована
- README частично устарел: `.env.development` в репо нет; шаблон — `.env.production`, сам `.env` gitignored (`VITE_API_URL`, `VITE_API_URL_STREAMS`)
- TS: `erasableSyntaxOnly` — никаких enum/namespace/parameter properties; включены `noUnusedLocals`/`noUnusedParameters`
- Сообщения об ошибках backend приходят на русском вне зависимости от языка UI
- `manualChunks` в `vite.config.ts`: hls.js (~575 KB) — отдельный ленивый чанк `vendor-hls` только для `/streams`
