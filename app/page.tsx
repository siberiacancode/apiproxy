export default function Home() {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const proxyBase = base ? `${base}/api/proxy` : "/api/proxy";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          API Proxy
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Прокси для обхода блокировок (например OpenAI из РФ). Домен цели — в query или заголовке, без env.
        </p>
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Базовый URL прокси:
          </p>
          <code className="mt-1 block break-all text-sm text-zinc-800 dark:text-zinc-200">
            {proxyBase}
          </code>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Домен в query: <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">{proxyBase}/v1/chat/completions?base=https://api.openai.com</code>
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Или один раз заголовок <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">X-Proxy-Base: https://api.openai.com</code> и baseURL = {proxyBase}
          </p>
        </div>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Подробнее в README.
        </p>
      </main>
    </div>
  );
}
