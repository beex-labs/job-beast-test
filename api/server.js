// 独立统计 API 服务（指南 §3.2、§13）。
// 用 Node 原生 http，不依赖 Next.js，也不需要编译。
//
// 为避免运行 .ts 的复杂性，这里内联最小校验逻辑（RATING_IDS 常量）+ 内存计数器。
// 评分常量与前端 src/core/rating.ts 保持同步：若 RATING_IDS 变化需同步本文件。
//
// 接口：
//   POST /api/ratings/first    body { rating }  → 200 {ok:true}
//   GET  /api/ratings/summary                   → 200 { total, ratings: [...] }
//   OPTIONS *                                  → 204

import http from "node:http";
import { URL } from "node:url";

// 与 src/core/rating.ts 的 RATING_IDS 保持一致（顺序固定，勿改）。
const RATING_IDS = [
  "shareholder",
  "enjoyer",
  "offer",
  "worker",
  "beast_of_burden",
  "joker",
  "volunteer",
  "loser",
];
const RATING_SET = new Set(RATING_IDS);

function isRatingId(v) {
  return typeof v === "string" && RATING_SET.has(v);
}

// 内存计数器（生产可替换为 D1 / Redis）。
const counts = Object.fromEntries(RATING_IDS.map((id) => [id, 0]));

function increment(rating) {
  if (isRatingId(rating)) counts[rating]++;
}

function getSummary() {
  const snapshot = {};
  for (const id of RATING_IDS) snapshot[id] = counts[id];
  return snapshot;
}

function buildSummaryPayload(counts) {
  const items = RATING_IDS.map((id) => counts[id] ?? 0);
  const total = items.reduce((s, c) => s + c, 0);
  const ratings = RATING_IDS.map((id, i) => {
    const count = items[i];
    const percentage =
      total === 0 ? 0 : Math.round((count / total) * 100 * 100) / 100;
    return { rating: id, count, percentage };
  });
  return { total, ratings };
}

const PORT = Number(process.env.PORT ?? 6670);
const HOST = process.env.HOST ?? "127.0.0.1";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function corsHeaders(req) {
  const origin = req.headers.origin;
  const allowed =
    ALLOWED_ORIGINS.length === 0
      ? true
      : ALLOWED_ORIGINS.includes(origin);
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (origin && allowed) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }
  return headers;
}

function send(res, status, body, extra = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...extra,
  });
  res.end(payload);
}

function isAllowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  if (ALLOWED_ORIGINS.length === 0) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(req));
    res.end();
    return;
  }

  if (req.method === "POST" && path === "/api/ratings/first") {
    if (!isAllowedOrigin(req)) {
      return send(res, 403, { ok: false, error: "FORBIDDEN_ORIGIN" }, corsHeaders(req));
    }
    const ct = req.headers["content-type"] ?? "";
    if (!ct.includes("application/json")) {
      return send(res, 415, { ok: false, error: "INVALID_CONTENT_TYPE" }, corsHeaders(req));
    }
    const chunks = [];
    let size = 0;
    for await (const c of req) {
      size += c.length;
      if (size > 1024) {
        return send(res, 413, { ok: false, error: "BODY_TOO_LARGE" }, corsHeaders(req));
      }
      chunks.push(c);
    }
    let parsed;
    try {
      parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return send(res, 400, { ok: false, error: "INVALID_JSON" }, corsHeaders(req));
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return send(res, 400, { ok: false, error: "INVALID_BODY" }, corsHeaders(req));
    }
    const keys = Object.keys(parsed);
    if (keys.length !== 1 || keys[0] !== "rating" || !isRatingId(parsed.rating)) {
      return send(res, 400, { ok: false, error: "INVALID_RATING" }, corsHeaders(req));
    }
    try {
      increment(parsed.rating);
      return send(res, 200, { ok: true }, { "Cache-Control": "no-store", ...corsHeaders(req) });
    } catch {
      return send(res, 500, { ok: false, error: "STATS_WRITE_FAILED" }, corsHeaders(req));
    }
  }

  if (req.method === "GET" && path === "/api/ratings/summary") {
    try {
      const payload = buildSummaryPayload(getSummary());
      return send(res, 200, payload, {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        ...corsHeaders(req),
      });
    } catch {
      return send(res, 500, { ok: false, error: "STATS_READ_FAILED" }, {
        "Cache-Control": "no-store",
        ...corsHeaders(req),
      });
    }
  }

  send(res, 404, { ok: false, error: "NOT_FOUND" }, corsHeaders(req));
});

server.listen(PORT, HOST, () => {
  console.log(`[job-beast-test-api] listening on http://${HOST}:${PORT}`);
  console.log(`[job-beast-test-api] ratings tracked: ${RATING_IDS.join(", ")}`);
});
