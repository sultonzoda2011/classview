# ClassView — панель управления камерами образовательных центров

React + TypeScript приложение: родители смотрят трансляцию с камеры класса своего
ребёнка, администраторы управляют центрами, классами и родителями. Роли: `User`
(родитель), `Admin` (центр), `SuperAdmin` (вся система). Backend:
[classview-backend](https://github.com/sultonzoda2011/classview-backend) (NestJS).

## Стек

- **React 19 + Vite + TypeScript** (strict)
- **UI-кит** — `src/components/ui/*`: примитивы в духе shadcn/ui (Radix + Tailwind v4 +
  `class-variance-authority`), один и тот же `Button`/`Dialog`/`Table`/`Form`/`Select`
  используется на каждой странице — ничего не свёрстано заново под конкретный экран.
- **RTK Query** (`src/store/*Api.ts`) — вместо ручных `createAsyncThunk` на каждую
  сущность: один `baseQuery` поверх axios, авто-кэш, авто-инвалидация по тегам, единое
  состояние loading/error на каждый запрос.
- **react-hook-form + zod** — валидация полностью на 3 языках: zod-схемы это фабрики
  `schema(t)`, а не статичные объекты (`src/types/*.ts`), поэтому сообщения об ошибках
  меняются вместе с языком интерфейса.
- **i18next**, 3 языка: `en`, `ru`, `tj` (`public/locales/*/translation.json`).
- **hls.js** — проигрывание HLS-потока с бэкенда.

## Запуск

\`\`\`bash
npm install
cp .env.development .env   # VITE_API_URL, VITE_API_URL_STREAMS — адрес backend
npm run dev                # http://localhost:5173
\`\`\`

## Проверка перед коммитом

\`\`\`bash
npm run lint         # ESLint
npx tsc -b            # типы
npm run check-i18n    # ключи en/ru/tj синхронны (иначе exit 1)
npm test              # unit/component-тесты (vitest)
npm run build          # production-сборка
\`\`\`

Все пять команд гоняются в CI (`.github/workflows/ci.yml`) на каждый push/PR — ни один
из этих пунктов не должен "просто сломаться потом в проде".

### e2e (Playwright)

\`\`\`bash
npm run build && npx playwright install chromium
E2E_SUPERADMIN_EMAIL=... E2E_SUPERADMIN_PASSWORD=... npm run e2e
\`\`\`

Нужен поднятый backend с сид-супер-админом. Подробности — `e2e/README.md`. В CI
прогоняется отдельным job'ом, включается переменной репозитория `E2E_ENABLED=true`.

## Структура

\`\`\`
src/
  components/ui/        — общий UI-кит (Button, Dialog, Table, Form, Select, ...)
  components/fields/     — TextField/SelectField/SwitchField — единственные поля форм
  components/forms/      — составные формы (UserForm — одна на создание и правку)
  components/modal/      — диалоги конкретных сущностей (поверх components/ui/dialog)
  hooks/useAuth.ts        — единственное место, где декодируется JWT
  hooks/useDarkMode.ts    — тема
  store/*Api.ts            — RTK Query эндпоинты по сущностям
  api/baseQuery.ts         — axios + разворачивание {statusCode,data,message} + тосты
  types/*.ts                — TS-интерфейсы + zod-схемы (фабрики с t())
  lib/                      — utils (cn), notify (sonner), time
  pages/                     — маршруты (ленивая загрузка через React.lazy в App.tsx)
\`\`\`

## Конвенции

- **Новое поле формы** → `TextField`/`SelectField`/`SwitchField` из
  `components/fields`, никогда не вёрстывать `<input>` руками — так все формы выглядят
  и ведут себя одинаково.
- **Новый диалог** → обёртка над `components/ui/dialog.tsx`, управляемый
  `open`/`onOpenChange` пропсами (как `CenterFormDialog`, `ConfirmDialog`).
- **Удаление чего угодно** → только через `ConfirmDialog` (`components/ui/confirm-dialog.tsx`).
  Без подтверждения `dispatch`/мутация на удаление не вызывается нигде в проекте — это
  было реальным багом в старой версии (один клик удалял центр/класс/родителя).
- **Новый текст в UI** → только через `t('namespace.key')`, добавить ключ сразу в
  `en`, `ru` и `tj` — `npm run check-i18n` упадёт, если забыть один язык.
- **Новая сущность с CRUD** → `injectEndpoints` в `store/<entity>Api.ts` по образцу
  `centersApi.ts`, а не новый `createAsyncThunk`.
- **Ошибки запросов** никогда не глушить в `catch` — `baseQuery` уже показывает тост
  с сообщением сервера; `try { await mutation().unwrap() } catch { return }` в
  компоненте нужен только чтобы не продолжать выполнение после ошибки.

## Роли и доступ

Разруливается в двух местах:
- `App.tsx` → `RoleProtectedRoute` закрывает маршруты по роли (несовпадение — редирект
  на `/403`).
- Сам backend — источник истины: что бы ни отрисовал фронт, сервер проверяет роль и
  `centerId` на каждый запрос заново.

## Известные ограничения

- `vendor-hls` чанк (~575 KB) — это сам hls.js, подключается лениво только на
  странице `/streams`, на остальные страницы не влияет.
- Сообщения об ошибках, которые присылает сам backend (`message` в ответе), сейчас
  приходят на русском независимо от выбранного языка интерфейса — локализация текста
  ошибок на стороне backend в этот проход не входила.
