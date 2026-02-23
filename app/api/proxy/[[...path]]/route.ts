import { NextRequest, NextResponse } from "next/server";

const FORBIDDEN_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "transfer-encoding",
  "te",
  "trailer",
  "upgrade",
  "proxy-authorization",
  "proxy-authenticate",
  "x-proxy-base",
]);

type Params = { path?: string[] };

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  return proxy(request, context);
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  const { path: pathParam } = await context.params;
  const path = pathParam ?? [];
  const searchParams = request.nextUrl.searchParams;

  const base =
    request.headers.get("x-proxy-base") ??
    searchParams.get("base") ??
    searchParams.get("target");
  if (!base || !base.startsWith("http")) {
    return NextResponse.json(
      {
        error: "Missing or invalid base URL",
        hint: "Use query ?base=https://... or header X-Proxy-Base: https://...",
      },
      { status: 400 }
    );
  }

  const secret = process.env.PROXY_SECRET;
  if (secret) {
    const provided =
      searchParams.get("proxy_secret") ??
      request.headers.get("x-proxy-secret");
    if (provided !== secret) {
      return NextResponse.json(
        { error: "Invalid or missing proxy secret" },
        { status: 403 }
      );
    }
  }

  const pathname = path.length ? `/${path.join("/")}` : "";
  const forwardParams = new URLSearchParams(searchParams);
  forwardParams.delete("base");
  forwardParams.delete("target");
  forwardParams.delete("proxy_secret");
  const search = forwardParams.toString() ? `?${forwardParams}` : "";
  const url = `${base.replace(/\/$/, "")}${pathname}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!FORBIDDEN_HEADERS.has(lower)) {
      headers.set(key, value);
    }
  });

  let body: string | undefined;
  try {
    body = await request.text();
  } catch {
    // no body
  }

  const res = await fetch(url, {
    method: request.method,
    headers,
    body: body && body.length > 0 ? body : undefined,
  });

  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!FORBIDDEN_HEADERS.has(lower) && lower !== "content-encoding") {
      responseHeaders.set(key, value);
    }
  });

  const responseBody = await res.arrayBuffer();
  return new NextResponse(responseBody, {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}
