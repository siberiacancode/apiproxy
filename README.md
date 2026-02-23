# API Proxy

Прокси для API (например OpenAI), чтобы обходить блокировки и ходить через свой домен на Vercel. Один раз запускаешь — домен цели передаёшь в запросе (query или заголовок), без настроек в env.

## Как это работает

- Запрос: **`/api/proxy/<path>?base=https://api.openai.com`** (или заголовок **`X-Proxy-Base: https://api.openai.com`**).
- Прокси перенаправляет запрос на `base + path` и возвращает ответ. Остальные query-параметры и заголовки пробрасываются.

Примеры:

- `GET /api/proxy/v1/models?base=https://api.openai.com` → `https://api.openai.com/v1/models`
- С заголовком `X-Proxy-Base: https://api.openai.com`: `POST /api/proxy/v1/chat/completions` → `https://api.openai.com/v1/chat/completions`

## Настройка

### Без env (сразу работает)

Домен цели — в каждом запросе в query или один раз в заголовке:

**Вариант 1 — query (любой клиент):**

```
https://твой-сайт.vercel.app/api/proxy/v1/chat/completions?base=https://api.openai.com
```

**Вариант 2 — заголовок (один раз в клиенте):**
В HTTP-клиенте задай заголовок `X-Proxy-Base: https://api.openai.com` и baseURL прокси:

```ts
const openai = new OpenAI({
  baseURL: "https://твой-сайт.vercel.app/api/proxy",
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "X-Proxy-Base": "https://api.openai.com",
  },
});
```

Тогда все вызовы (`/v1/chat/completions`, `/v1/models` и т.д.) автоматически идут в OpenAI через прокси.

### Опционально: защита секретом

Чтобы прокси не мог использовать кто угодно, задай в env переменную **`PROXY_SECRET`** (любая строка). Тогда в каждом запросе нужен один из вариантов:

- query: `proxy_secret=твой_секрет`
- заголовок: `X-Proxy-Secret: твой_секрет`

Если `PROXY_SECRET` не задан, прокси открыт для всех (норм для личного использования).

## Запуск

```bash
npm install
npm run dev
```

Прокси: `http://localhost:3000/api/proxy/<path>?base=https://...`

Деплой на Vercel: подключи репозиторий. Переменные окружения не обязательны (только при желании задай `PROXY_SECRET`).
