# ClassView — Панель управления камерами для образовательных центров

## Описание проекта

ClassView — это React + TypeScript веб-приложение для управления камерами
образовательных центров, пользователями и классами, а также для просмотра
видеопотоков. Проект предоставляет интерфейс администраторам и пользователям с
ролями (User, Admin, SuperAdmin). Основные возможности:

- Аутентификация через API и хранение JWT в cookie.
- Управление центрами (создание, редактирование, удаление).
- Управление классами (создание, редактирование, удаление) и привязка к центрам.
- Управление пользователями: просмотр списка, создание, редактирование,
  удаление.
- Просмотр видеопотоков классов (различные endpoints для админов и
  пользователей).
- Локализация интерфейса (i18next): английский, русский, таджикский.
- Тема: тёмная/светлая (локально через localStorage).

Как это работает изнутри — пошагово:

1. При старте (`npm run dev`) приложение монтируется в `src/main.tsx`,
   импортирует `i18n` и подключает Redux store.
2. Маршруты настроены в `src/App.tsx` с защитой маршрутов: `ProtectedRoute`
   требует наличие токена в cookie, `RoleProtectedRoute` дополнительно проверяет
   роль из декодированного JWT.
3. Компоненты страниц (страницы под `src/pages`) используют API-методы из
   `src/api/*` (на базе axios) и диспатчат асинхронные экшены (createAsyncThunk)
   в Redux-slices (`src/store/slices/*`).
4. UI: общая раскладка реализована в `src/layout/layout.tsx` — она включает
   `Header` и (в зависимости от роли) `Sidebar`.
5. Компоненты карточек (`src/components/*Card.tsx`) используются на страницах
   для отображения объектов и инициируют действия (удаление, открытие модалок и
   т.д.).

## Технологии и библиотеки

Ниже перечислены основные зависимости проекта (взято из `package.json`) и
пояснение, для чего они используются:

- React — UI библиотека.
- TypeScript — типизация и безопасность кода.
- Vite — сборщик и dev-сервер.
- React Router DOM — маршрутизация в приложении (`createBrowserRouter`,
  `RouterProvider`).
- Redux Toolkit (`@reduxjs/toolkit`) + react-redux — централизованное состояние
  (slices для центров, классов, стримов, пользователей).
- axios — HTTP-клиент для запросов к API.
- js-cookie — работа с cookie (хранение JWT в cookie `token`).
- jwt-decode — декодирование JWT для извлечения роли и других полей.
- i18next + react-i18next + i18next-http-backend +
  i18next-browser-languagedetector — локализация: загрузка переводов из
  `/locales/{{lng}}/translation.json` и детектирование языка.
- tailwindcss — утилитарный CSS-фреймворк (подключён в `src/index.css`).
- lucide-react — иконки.
- react-hook-form + @hookform/resolvers + zod — формы и валидация схем (zod
  используется для схем в `src/types/*` и для валидации форм через zodResolver).
- swiper — (зависимость в package.json; не явно использована в прочитанных
  файлах, но может быть подключена в иных компонентах).

Dev-зависимости:

- typescript — типы и компиляция.
- eslint и плагины — линтинг.
- @vitejs/plugin-react — React плагин для Vite.

Рекомендация: вынести `API_URL` в `.env` (сейчас жёстко закодирован в
`src/api/api.ts`). Это упростит смену окружений.

## Установка и запуск проекта

(Команды для Windows PowerShell)

1. Клонирование репозитория:

```powershell
git clone <repo-url>
cd vite-project
```

2. Установка зависимостей (npm/yarn/pnpm):

- npm

```powershell
npm install
```

- yarn

```powershell
yarn
```

- pnpm

```powershell
pnpm install
```

3. Запуск в режиме разработки:

- npm

```powershell
npm run dev
```

4. Сборка для продакшена:

- npm

```powershell
npm run build
```

5. Предпросмотр собранной версии:

```powershell
npm run preview
```

Подсказки:

- Файлы перевода находятся в `public/locales/{en,ru,tj}/translation.json`
  (поддерживаемые языки: `en`, `ru`, `tj`).
- API URL находится в `src/api/api.ts` в константе `API_URL`. Для удобства можно
  заменить на `process.env.VITE_API_URL`.

## Структура проекта (подробно)

Корневая структура (ключевые папки и файлы):

- `index.html` — root html
- `package.json` — зависимости и скрипты
- `vite.config.ts` — конфигурация Vite
- `src/`
  - `main.tsx` — точка входа: подключение `i18n`, `store`, монтирование React
  - `App.tsx` — маршрутизация приложения и защитники маршрутов
  - `i18n.ts` — настройка i18next
  - `index.css`, `App.css` — глобальные стили (tailwind)
  - `api/` — axios/асинхронные вызовы к серверу:
    - `api.ts` — базовые константы (API_URL, STREAM_URL)
    - `loginApi.ts`, `usersApi.ts`, `centerApi.ts`, `classRoomApi.ts`,
      `streamApi.ts`, ... — createAsyncThunk обёртки
  - `components/` — переиспользуемые UI-компоненты и модалки
    - `formInput.tsx` — компонент инпута с React Hook Form Controller
    - `header.tsx`, `sidebar.tsx` — общие элементы layout
    - `centerCard.tsx`, `classRoomCard.tsx`, `streamCard.tsx` — карточки для
      отображения сущностей
    - `modal/` — набор модальных компонентов (create/update, send-otp, reset
      password, stream viewer и т.д.)
  - `layout/` — `layout.tsx` общий контейнер с Header/Sidebar/Outlet
  - `pages/` — страницы приложения
    - `login.tsx` — страница логина
    - `users.tsx`, `centers.tsx`, `streams.tsx`, `overview.tsx`, `profile.tsx`,
      `notFound.tsx`, `forbidden.tsx` и прочие
  - `store/` — redux store + slices
    - `store.ts` — combine reducers, configureStore
    - `slices/` — `usersSlice.ts`, `centerSlice.ts`, `classRoomSlice.ts`,
      `streamSlice.ts`
  - `types/` — TS типы и zod схемы (`users.ts`, `classRoom.ts`, `stream.ts`,
    `login.ts`, `jwt.ts` и др.)
  - `images/` — логотипы и картинки

## Ключевые компоненты и страницы (detailed)

Ниже описаны ключевые компоненты и страницы. Для каждого даётся: что делает,
пропсы с типами, зависимости и пример использования.

---

### `FormInput` (`src/components/formInput.tsx`)

- Что делает:
  - Оборачивает `react-hook-form` Controller над обычным input.
  - Поддерживает иконку слева, отображение ошибок внизу, стили для состояния
    ошибки.

- Пропсы: | prop | тип | описание | |---|---|---| | `name` | `string` | имя поля
  в `react-hook-form` (`Controller` name) | `placeholder` | `string` |
  placeholder для input | `type` | `string` | тип input — `text`, `password`,
  `email`, и т.д. | `control` | `any` | control объект из `useForm()` (required)
  | `icon` | `React.ComponentType<SVGProps>` | опциональная иконка (например из
  lucide-react) | `error` | `FieldError` | ошибка поля из `formState.errors`

- Используемые хуки/библиотеки:
  - `react-hook-form` Controller

- Пример использования:

```tsx
<FormInput
	name="phoneOrUserName"
	placeholder="Phone or username"
	type="text"
	control={control}
	icon={User}
	error={errors.phoneOrUserName}
/>
```

- Пояснения и edge-cases:
  - Ожидает, что `control` передан из `useForm`.
  - Опциональная иконка изменяет внутренний padding (pl-10 vs pl-4).

---

### `Header` (`src/components/header.tsx`)

- Что делает:
  - Верхняя панель сайта. Отображает заголовок, переключатель темы, выбор языка
    и кнопку пользователя для открытия modal меню.
  - Меняет язык через `i18n.changeLanguage`.
  - Считывает JWT из cookie и декодирует его, чтобы показать первую букву имени.

- Props: нет

- Используемые хуки/библиотеки:
  - `useTranslation` (react-i18next)
  - `useState`, `useEffect`
  - `jwt-decode` + `js-cookie`

- Примеры и поведение:
  - При переключении языка `i18n.changeLanguage(selectedLang.code)` вызывается
    внутри useEffect.
  - Тема хранится в localStorage `theme` и переключается через
    `document.documentElement.classList.add('dark')`.

---

### `Sidebar` (`src/components/sidebar.tsx`)

- Что делает:
  - Боковая навигация, показывающая пункты в зависимости от роли пользователя
    (User / Admin / SuperAdmin).
  - Для mobile показывает нижнюю панель.

- Props: | prop | тип | описание | |---|---|---| | `info` |
  `CustomJwtPayload | null` | данные из декодированного token (role, unique_name
  и т.д.)

- Используемые хуки/библиотеки:
  - `useTranslation`, `useLocation` (react-router)

- Пример использования:

```tsx
<Sidebar info={info} />
```

- Замечание: если `info.role === 'User'` — sidebar скрыт.

---

### `CenterCard` (`src/components/centerCard.tsx`)

- Что делает:
  - Визуальная карточка центра с картинкой, названием, адресом и кнопками
    удалить/редактировать.
  - При клике на `Delete` вызывает `deleteCenter(id)` (dispatch thunk).

- Props: | prop | тип | описание | |---|---|---| | `id` | `number` | ID центра |
  `name` | `string` | название центра | `address` | `string` | адрес центра |
  `setId` | `Dispatch<SetStateAction<number>>` | callback для установки id (для
  модалки) | `setUpdateCenterModalOpen` | `Dispatch<SetStateAction<boolean>>` |
  открытие модалки обновления

- Используемые хуки:
  - `useDispatch` (Redux toolkit)

- Пример использования:

```tsx
<CenterCard
	id={1}
	name="Kavsar"
	address="Dushanbe"
	setId={setId}
	setUpdateCenterModalOpen={setOpen}
/>
```

---

### `ClassRoomCard` (`src/components/classRoomCard.tsx`)

- Что делает:
  - Похож на `CenterCard`, отображает данные класса (cameraUrl, center) и
    кнопки.
  - Вызывает `deleteClassrooms(id)` при удалении.

- Props: | prop | тип | описание | |---|---|---| | `id` | `number` | ID класса |
  `name` | `string` | название класса | `cameraUrl` | `string` | URL камеры |
  `center` | `string` | название центра | `setId` |
  `Dispatch<SetStateAction<number>>` | callback | `setUpdateClassRoomModalOpen`
  | `Dispatch<SetStateAction<boolean>>` | callback

- Пример использования: аналогично `CenterCard`.

---

### `StreamCard` (`src/components/streamCard.tsx`)

- Что делает:
  - Карточка для просмотра или выбора видеопотока класса.
  - При клике открывает `StreamVideoModal` и устанавливает `id` класса для
    загрузки плейлиста.

- Props: | prop | тип | описание | |---|---|---| | `id` | `number` | | `name` |
  `string` | | `center` | `string` | | `setId` |
  `Dispatch<SetStateAction<number>>` | | `setStreamVideoModalOpen` |
  `Dispatch<SetStateAction<boolean>>` | | `streamModalOpen` | `boolean` |

- Используемые хуки: нет, статeless UI (обработка клика локально).

---

### `Layout` (`src/layout/layout.tsx`)

- Что делает:
  - Обёртка приложения с `Header`, `Sidebar` и `Outlet` для страниц.
  - Определяет `showSidebar` на основе роли из JWT.

- Props: нет

- Используемые хуки/библиотеки:
  - `jwt-decode`, `js-cookie`.

---

### Страницы ключевые

#### `Login` (`src/pages/login.tsx`)

- Что делает:
  - Форма логина, валидация через zod + react-hook-form.
  - При успешном `dispatch(loginApi(data))` токен сохраняется в cookie внутри
    `loginApi` (см. `loginApi.ts`).
  - После логина приложение декодирует токен и перенаправляет: `SuperAdmin` ->
    `/` (overview), иначе -> `/streams`.

- Зависимости:
  - `loginApi` (createAsyncThunk в `src/api/loginApi.ts`), `zod` схемы из
    `src/types/login.ts`, `react-hook-form`.

- Примеры:

```tsx
// В форме
await dispatch(loginApi({ phoneOrUserName: 'user', password: 'pass' }))
```

#### `Users` (`src/pages/users.tsx`)

- Что делает:
  - Запрашивает `getUsers`, `getClassrooms`, `getCenters` при монтировании и
    отображает таблицу пользователей.
  - Поддерживает поиск по имени/телефону/имени ребенка.
  - Кнопки: просмотр, редактирование (navigate), удаление (`deleteUser`).

- Используемые функции/API:
  - `getUsers`, `deleteUser`, `getClassrooms`.

#### `Centers` (`src/pages/centers.tsx`)

- Что делает:
  - Запрашивает `getCenters` и показывает карточки `CenterCard`.
  - Поддержка поиска и модалок создания/обновления.

- Компоненты: `CreateCenterModal`, `UpdateCenterModal` (в `components/modal`).

#### `Streams` (`src/pages/streams.tsx`)

- Что делает:
  - Загружает список `classrooms` и, в зависимости от роли, плейлисты через
    `getStreamsAdmin`/`getStreamsUser`.
  - Отображает `StreamCard` для каждого класса. Открывает `StreamVideoModal` с
    `stream.data`.

- Примечание: `getStreamsAdmin` принимает `classRoomId` и запрашивает
  `${API_URL}/Streams/${classRoomId}/playlist.m3u8`.

---

## Локализация и i18next

Проект использует `i18next` и `react-i18next` с HTTP backend и browser language
detector. Конфигурация находится в `src/i18n.ts`.

Как подключено:

- `i18n` инициализируется в `src/i18n.ts` с
  backend`loadPath: '/locales/{{lng}}/translation.json'` и
  `supportedLngs: ['en','ru','tj']`.
- `main.tsx` импортирует `./i18n`, поэтому i18n доступен в любом компоненте.

Как добавить новый язык:

1. Создать файл `public/locales/<код_языка>/translation.json` (например
   `es/translation.json`).
2. Добавить код языка в `supportedLngs` в `src/i18n.ts`.
3. Перезапустить dev-сервер (или, если backend отдаёт файлы, обновить страницу).

Как использовать `useTranslation` в компоненте:

```tsx
import { useTranslation } from 'react-i18next'

const Comp = () => {
	const { t } = useTranslation()
	return <div>{t('login.title')}</div>
}
```

Где `login.title` — ключ в `translation.json`.

## API и взаимодействие с сервером

Базовый URL API: `http://37.27.249.153:5990/api` (см `src/api/api.ts`).
Рекомендуется вынести в `VITE_API_URL`.

Короткий список endpoints (на основе кода в `src/api`):

- Account
  - POST /Account/login — логин. Тело: { phoneOrUserName, password } (тип
    `ILogin` в `src/types/login.ts`). Ответ: в коде ожидается response.data.data
    === token.
  - POST /Account/change-password — изменение пароля (см.
    usersApi.changePassword)

- Users
  - GET /Users — получить список пользователей (возвращаемый объект:
    response.data.data — массив пользователей (`IUser[]`)).
  - GET /Users/:id — получить пользователя по id.
  - POST /Users — создать пользователя.
  - DELETE /Users/:id — удалить пользователя.
  - POST /Users/create-employee — создать сотрудника.
  - PUT /Users/:id — обновить пользователя.

- Centers
  - GET /Centers — список центров (response.data.data)
  - POST /Centers — создать центр
  - PUT /Centers/:id — обновить
  - DELETE /Centers/:id — удалить

- ClassRooms
  - GET /ClassRooms — список
  - POST /ClassRooms — создать
  - PUT /ClassRooms/:id — обновить
  - DELETE /ClassRooms/:id — удалить

- Streams
  - GET /Streams/playlist.m3u8 — плейлист для обычного пользователя
  - GET /Streams/:classRoomId/playlist.m3u8 — плейлист для админа по classRoomId

Формат ответов

- В большинстве случаев код использует `response.data.data` — значит сервер
  отвечает в формате { data: <payload>, ... }.
- В `loginApi`, token ожидается в `response.data.data` и сохраняется в cookie
  `token`.

Как интегрированы вызовы:

- Все API вызовы реализованы как `createAsyncThunk` (Redux Toolkit), поэтому
  страницы диспатчат их через `dispatch(getUsers())`, а слайды (`slices`)
  обрабатывают fulfilled case и записывают данные в store.
- Заголовок `Authorization: Bearer ${Cookies.get('token')}` добавляется ручно в
  каждом запросе.

Пример запроса через axios (из кода):

```ts
const response = await axios.get(`${API_URL}/Users`, {
	headers: { Authorization: `Bearer ${Cookies.get('token')}` }
})
return response.data.data
```

Рекомендация: централизовать axios instance (например `axios.create`) и добавить
interceptor для автоматического добавления Authorization header и обработки 401.

## Примеры использования (код)

1. Диспатч асинхронного экшена и чтение данных из store (страница Users):

```tsx
// В компоненте
const dispatch: AppDispatch = useDispatch()
useEffect(() => {
	dispatch(getUsers())
}, [dispatch])

const users = useSelector((state: RootState) => state.users.users)
```

2. Использование `FormInput` с react-hook-form:

```tsx
const { control, handleSubmit } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

<form onSubmit={handleSubmit(onSubmit)}>
  <FormInput name="phoneOrUserName" placeholder="Phone" type="text" control={control} />
</form>
```

3. Добавление нового центра (пример thunk вызова):

```ts
// dispatch(createCenter({ name: 'New Center', address: 'Addr' }))
```

4. Доступ к потокам (Streams page):

```ts
// Для пользователя
dispatch(getStreamsUser())

// Для админа по id класса
dispatch(getStreamsAdmin(classRoomId))
```

## Как расширять проект — рекомендации для разработчиков

1. Новая страница:
   - Создайте файл в `src/pages/YourPage.tsx`.
   - Добавьте маршрут в `src/App.tsx` — при необходимости через
     `RoleProtectedRoute`.
   - Для API взаимодействий создайте thunk в `src/api/yourApi.ts` и добавьте
     slice case в `src/store/slices/`.

2. Новый компонент:
   - Поместите компонент в `src/components/`. Если компонент сложный и имеет
     много зависимостей — создайте поддиректорию с `index.tsx` и
     `styles.module.css`.
   - Опишите пропсы как интерфейс в верхней части файла и экспортируйте типы,
     если компонент используется в других местах.

3. Новая сущность (backend endpoint):
   - Добавьте thunk в `src/api/*Api.ts`.
   - Добавьте slice и state-тормоз в `src/store/slices`.
   - Добавьте страницы/карточки для отображения.

4. Стили и тема:
   - Используйте Tailwind для быстрых утилитарных стилей. Для кастомных
     стилизаций добавляйте классы в `index.css` или используйте `@apply` в CSS
     файлах.

5. Переменные окружения & API URL:
   - Вынесите `API_URL` в `.env` как `VITE_API_URL` и используйте
     `import.meta.env.VITE_API_URL`.
   - Добавьте `.env.example` с переменными, которые нужно заполнить.

Coding standards:

- Типизируйте пропсы и возвращаемые значения функций.
- Пишите небольшие компоненты (single responsibility).
- Логика запросов должна быть в `api/*` и как thunks.
- Компоненты не должны напрямую обращаться к `localStorage`/`document` —
  инкапсулируйте взаимодействие (исключения: тема и язык в Header/Login).

## Советы и рекомендации / Подводные камни

- JWT хранится в cookie `token`. Убедитесь, что механизмы обновления/обработки
  истёкших токенов предусмотрены — на текущий момент есть риск 401 без
  автоматического refresh.
- Сейчас `API_URL` — хардкод, вынесите в env.
- Лучше централизовать axios instance и использовать interceptors для
  автоматической подстановки Authorization header и единообразной обработки
  ошибок.
- Проверяйте наличие полей при декодировании токена — `jwtDecode` может
  выбросить ошибку для некорректных токенов.
- По производительности: на больших списках (users) подумайте о пагинации на
  бэкенде и на клиенте.
- Формы используют zod + react-hook-form — всегда обновляйте схемы при
  изменениях API.

## Quality gates / Быстрая проверка

- Линтинг: `npm run lint` — проверит файлы через ESLint.
- Сборка: `npm run build` — запускает `tsc -b` и `vite build`.
- Dev-run: `npm run dev`.

## Тестирование

- Тестов в проекте не найдено. Рекомендация: добавить unit тесты для утилит и
  критических компонент (Jest + React Testing Library) и e2e (Cypress) для
  основных сценариев (логин, CRUD для centers/classrooms/users, просмотр
  стрима).

## Возможные улучшения (next steps)

- Вынести API_URL/STREAM_URL в `.env`.
- Создать axios instance с interceptor'ом.
- Добавить refresh-token flow и обработку 401.
- Добавить global ErrorBoundary и централизованный toast/snackbar для ошибок.
- Добавить тесты (unit/e2e).
- Написать Storybook для компонентов.

## Лицензия

В проекте не найден файл LICENSE. Рекомендуется добавить лицензию (например MIT)
в корень репозитория: `LICENSE`.

Если вы хотите, я могу автоматически добавить `.env.example` и простую
конфигурацию axios (`src/api/axios.ts`) и внести `API_URL` в
`import.meta.env.VITE_API_URL` — скажите, нужно ли это сделать.

---

Если нужно, могу:

- Сгенерировать `axios` instance и мигрировать текущие вызовы на него.
- Вынести `API_URL` в `.env` и обновить `api.ts`.
- Добавить `.env.example` и `LICENSE` (MIT).

Текущее состояние: создал `README_FULL.md` в корне проекта с полной
документацией для команды разработчиков. Завершу финальный шаг (проверка) по
вашему разрешению.
