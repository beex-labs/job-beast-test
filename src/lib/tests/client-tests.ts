import { RATING_SUBMISSION_STORAGE_KEY } from "@/infra/rating-submission-storage";
import {
  canUseRatingSubmissionStorage,
  clearLocalRatingSubmission,
  getLocalRatingSubmission,
  saveLocalRatingSubmission,
} from "@/infra/rating-submission-storage";
import {
  fetchRatingSummary,
  resetSubmissionGuard,
  submitFirstBrowserRating,
} from "@/infra/rating-stats-client";
import {
  buildShareFromBreakdown,
  decodeShare,
  encodeShare,
  type SharedResultV1,
} from "@/infra/share-code";
import {
  assertEqual,
  assertTrue,
  type Suite,
} from "./runner";

const samplePayload = (): SharedResultV1 =>
  buildShareFromBreakdown(
    {
      finalScore: 53,
      rating: "joker",
      dimensions: {
        reward: 60,
        time: 40,
        boundary: 45,
        growth: 50,
        stability: 70,
        freedom: 35,
        benefit: 55,
      },
    },
    "rmb_painkiller"
  );

export const shareSuite: Suite = {
  name: "分享编码",
  tests: [
    {
      name: "编码后不含金额/公司/城市",
      run: () => {
        const payload = samplePayload();
        const round = decodeShare(encodeShare(payload));
        assertTrue(round !== null, "应能解码");
        const keys = Object.keys(round as object).sort();
        assertEqual(
          keys,
          ["dimensions", "modifier", "rating", "score", "v"].sort(),
          "字段集合"
        );
        const json = JSON.stringify(round);
        assertTrue(!json.includes("monthlyTakeHome"), "不含月薪");
        assertTrue(!json.includes("company"), "不含公司");
        assertTrue(!json.includes("city"), "不含城市");
        assertTrue(!json.includes("answers"), "不含答案");
      },
    },
    {
      name: "评级 ID 可恢复",
      run: () => {
        const round = decodeShare(encodeShare(samplePayload()));
        assertEqual(round?.rating, "joker", "rating");
      },
    },
    {
      name: "损坏 payload 显示友好错误（返回 null）",
      run: () => {
        assertEqual(decodeShare("!!!not-valid-base64!!!"), null, "损坏应返回 null");
        assertEqual(decodeShare(""), null, "空串应返回 null");
      },
    },
    {
      name: "不支持版本显示升级提示（v:2 返回 null）",
      run: () => {
        const v2 = JSON.stringify({
          v: 2,
          score: 50,
          rating: "worker",
          dimensions: {
            reward: 50,
            time: 50,
            boundary: 50,
            growth: 50,
            stability: 50,
            freedom: 50,
            benefit: 50,
          },
        });
        // Base64URL encode (mirror encodeShare).
        const b64 = btoa(unescape(encodeURIComponent(v2)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
        assertEqual(decodeShare(b64), null, "v:2 应返回 null");
      },
    },
    {
      name: "分数和维度被限制在 0–100",
      run: () => {
        const over = buildShareFromBreakdown(
          {
            finalScore: 150,
            rating: "offer",
            dimensions: {
              reward: 200,
              time: 200,
              boundary: 200,
              growth: 200,
              stability: 200,
              freedom: 200,
              benefit: 200,
            },
          },
          null
        );
        assertEqual(over.score, 100, "score 上限");
        assertEqual(over.dimensions.reward, 100, "reward 上限");
        const under = buildShareFromBreakdown(
          {
            finalScore: -5,
            rating: "beast_of_burden",
            dimensions: {
              reward: -10,
              time: -10,
              boundary: -10,
              growth: -10,
              stability: -10,
              freedom: -10,
              benefit: -10,
            },
          },
          null
        );
        assertEqual(under.score, 0, "score 下限");
        assertEqual(under.dimensions.time, 0, "time 下限");
      },
    },
  ],
};

export const storageSuite: Suite = {
  name: "首次浏览器提交存储",
  tests: [
    {
      name: "无本地记录时允许提交",
      run: () => {
        clearLocalRatingSubmission();
        assertEqual(getLocalRatingSubmission(), null, "无记录应返回 null");
      },
    },
    {
      name: "接口成功后写入本地记录",
      run: () => {
        clearLocalRatingSubmission();
        const ok = saveLocalRatingSubmission("worker");
        assertTrue(ok, "写入应成功");
        const rec = getLocalRatingSubmission();
        assertEqual(rec?.rating, "worker", "rating");
        assertEqual(rec?.status, "submitted", "status");
        assertEqual(rec?.version, 1, "version");
      },
    },
    {
      name: "本地已有记录时不发送 POST（前置条件成立）",
      run: () => {
        // The submission client checks this; verified in network suite.
        saveLocalRatingSubmission("worker");
        assertTrue(getLocalRatingSubmission() !== null, "应存在记录");
      },
    },
    {
      name: "本地记录只包含 version/status/rating",
      run: () => {
        saveLocalRatingSubmission("offer");
        const raw = window.localStorage.getItem(RATING_SUBMISSION_STORAGE_KEY);
        assertTrue(raw !== null, "应存在原始记录");
        const parsed = JSON.parse(raw as string) as Record<string, unknown>;
        assertEqual(
          Object.keys(parsed).sort(),
          ["rating", "status", "version"],
          "字段集合"
        );
        const json = raw as string;
        assertTrue(!json.includes("score"), "不含 score");
        assertTrue(!json.includes("monthlyTakeHome"), "不含金额");
        assertTrue(!json.includes("answers"), "不含答案");
      },
    },
    {
      name: "localStorage 数据损坏时页面不崩溃",
      run: () => {
        window.localStorage.setItem(
          RATING_SUBMISSION_STORAGE_KEY,
          "{not valid json"
        );
        assertEqual(getLocalRatingSubmission(), null, "损坏应返回 null");
        clearLocalRatingSubmission();
      },
    },
    {
      name: "localStorage 可用探测正常",
      run: () => {
        assertTrue(canUseRatingSubmissionStorage(), "浏览器应支持 localStorage");
        clearLocalRatingSubmission();
      },
    },
  ],
};

interface CapturedRequest {
  url: string;
  method: string;
  body?: string;
}

function installMockFetch(statusOk = true) {
  const requests: CapturedRequest[] = [];
  const original = window.fetch;
  window.fetch = (async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    let urlStr: string;
    if (typeof input === "string") urlStr = input;
    else if (input instanceof URL) urlStr = input.href;
    else urlStr = input.url;
    const method = (init?.method ?? "GET").toUpperCase();
    const body =
      typeof init?.body === "string" ? init.body : undefined;
    requests.push({ url: urlStr, method, body });

    if (urlStr.endsWith("/api/ratings/first")) {
      return new Response(
        JSON.stringify(statusOk ? { ok: true } : { ok: false }),
        {
          status: statusOk ? 200 : 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (urlStr.endsWith("/api/ratings/summary")) {
      return new Response(
        JSON.stringify({ total: 0, ratings: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response("Not Found", { status: 404 });
  }) as typeof window.fetch;
  return {
    requests,
    restore: () => {
      window.fetch = original;
    },
  };
}

export const networkSuite: Suite = {
  name: "前端网络",
  tests: [
    {
      name: "生成报告只发一个 POST，Body 只有 rating",
      run: async () => {
        clearLocalRatingSubmission();
        resetSubmissionGuard();
        const mock = installMockFetch(true);
        try {
          const outcome = await submitFirstBrowserRating(
            "worker",
            "new-assessment"
          );
          assertEqual(outcome, "submitted", "应提交成功");
          const posts = mock.requests.filter(
            (r) => r.method === "POST" && r.url.endsWith("/api/ratings/first")
          );
          assertEqual(posts.length, 1, "应只发一个 POST");
          const body = JSON.parse(posts[0].body as string) as Record<string, unknown>;
          assertEqual(Object.keys(body), ["rating"], "Body 只能含 rating");
          assertEqual(body.rating, "worker", "rating 值");
          assertTrue(!("score" in body), "不含 score");
          assertTrue(!("dimensions" in body), "不含维度");
          assertTrue(!("salary" in body), "不含金额");
          assertTrue(!("answers" in body), "不含答案");
          assertTrue(!("ip" in body), "不含 IP");
          assertTrue(!("visitorId" in body), "不含访客 ID");
          assertTrue(!("deviceId" in body), "不含设备 ID");
        } finally {
          mock.restore();
        }
      },
    },
    {
      name: "本地已有标记时不发 POST",
      run: async () => {
        saveLocalRatingSubmission("worker");
        resetSubmissionGuard();
        const mock = installMockFetch(true);
        try {
          const outcome = await submitFirstBrowserRating(
            "offer",
            "new-assessment"
          );
          assertEqual(outcome, "skipped", "应跳过");
          const posts = mock.requests.filter((r) => r.method === "POST");
          assertEqual(posts.length, 0, "不应发 POST");
        } finally {
          mock.restore();
          clearLocalRatingSubmission();
        }
      },
    },
    {
      name: "统计失败不阻塞（返回 failed，不写入本地）",
      run: async () => {
        clearLocalRatingSubmission();
        resetSubmissionGuard();
        const mock = installMockFetch(false);
        try {
          const outcome = await submitFirstBrowserRating(
            "joker",
            "new-assessment"
          );
          assertEqual(outcome, "failed", "应返回 failed");
          assertEqual(getLocalRatingSubmission(), null, "不应写入本地标记");
        } finally {
          mock.restore();
          clearLocalRatingSubmission();
        }
      },
    },
    {
      name: "分享页不提交评级",
      run: async () => {
        clearLocalRatingSubmission();
        resetSubmissionGuard();
        const mock = installMockFetch(true);
        try {
          const outcome = await submitFirstBrowserRating("worker", "share");
          assertEqual(outcome, "skipped", "分享来源应跳过");
          const posts = mock.requests.filter((r) => r.method === "POST");
          assertEqual(posts.length, 0, "不应发 POST");
        } finally {
          mock.restore();
        }
      },
    },
    {
      name: "历史结果不提交评级",
      run: async () => {
        clearLocalRatingSubmission();
        resetSubmissionGuard();
        const mock = installMockFetch(true);
        try {
          const outcome = await submitFirstBrowserRating("worker", "history");
          assertEqual(outcome, "skipped", "历史来源应跳过");
          const posts = mock.requests.filter((r) => r.method === "POST");
          assertEqual(posts.length, 0, "不应发 POST");
        } finally {
          mock.restore();
        }
      },
    },
    {
      name: "汇总只发 GET，且不轮询",
      run: async () => {
        const mock = installMockFetch(true);
        try {
          const summary = await fetchRatingSummary();
          assertTrue(summary !== null, "应返回汇总");
          const gets = mock.requests.filter(
            (r) => r.method === "GET" && r.url.endsWith("/api/ratings/summary")
          );
          assertEqual(gets.length, 1, "应只发一个 GET");
        } finally {
          mock.restore();
        }
      },
    },
  ],
};
