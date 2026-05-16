# Dryve

MVP клиентской части веб-сервиса аренды и проката автомобилей на `Svelte + SvelteKit + JavaScript`.

## Что реализовано

- Каталог автомобилей с поиском и фильтрами.
- Страница карточки автомобиля с деталями и переходом к бронированию.
- Поток бронирования с расчетом стоимости по датам.
- Легкая авторизация (демо аккаунт) и личный кабинет.
- Mock backend внутри SvelteKit (`/api/cars`, `/api/auth`, `/api/bookings`).
- Дизайн-система Dryve: off-white + mint, outline UI, без теней/glow, единые CSS variables.

## Стек

- `SvelteKit` (маршруты страниц и API).
- `Vite` (dev/build инструмент через SvelteKit).
- `JavaScript`.

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу, который покажет Vite (обычно `http://localhost:5173`).

Демо-логин:

- Email: `demo@dryve.app`
- Пароль: `123456`

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `src/routes` — страницы приложения.
- `src/routes/api` — mock backend endpoints.
- `src/lib/components` — UI-компоненты.
- `src/lib/api/client.js` — API-клиент.
- `src/lib/server/mock-data.js` — in-memory данные и бизнес-логика.
- `src/lib/styles/design-system.css` — токены и глобальные стили Dryve.

## Как заменить mock backend на реальный API

1. Оставить UI-слой как есть.
2. Переопределить вызовы в `src/lib/api/client.js` на URL реального backend.
3. Постепенно отключить `src/routes/api/*` или использовать их как BFF-прокси.

## Бесплатный деплой (рекомендовано)

Для SvelteKit с server routes проще всего использовать:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

### Базовый сценарий

1. Создать Git-репозиторий и запушить проект.
2. Подключить репозиторий в Vercel/Netlify.
3. Выбрать framework `SvelteKit` (обычно определяется автоматически).
4. Убедиться, что build command: `npm run build`.
5. Получить публичный URL и использовать как демо-домен для защиты.

## Про домен

Если нужен собственный домен/поддомен:

1. Купить или использовать имеющийся домен.
2. В панели хостинга добавить custom domain.
3. Настроить DNS (A/CNAME записи по инструкции платформы).
4. Дождаться SSL и проверить доступность приложения.
