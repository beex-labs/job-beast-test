// 浏览器端提交客户端（指南 §7.12）。
// 请求体只能包含 { rating }，绝不附带 score/维度/金额/答案/IP/设备标识。
// 统计失败不抛错，返回 "failed"。

import type { RatingId } from "@/core/types";
import { isRatingId } from "@/core/rating";
import {
  canUseRatingSubmissionStorage,
  getLocalRatingSubmission,
  saveLocalRatingSubmission,
} from "./rating-submission-storage";

export type ResultSource = "new-assessment" | "share" | "history";
export type SubmitOutcome = "submitted" | "skipped" | "failed";

interface SummaryItem {
  rating: RatingId;
  count: number;
  percentage: number;
}
export type RatingSummary = {
  total: number;
  ratings: SummaryItem[];
};

// 模块级内存锁，保证一次会话最多提交一次首次评级。
let ratingSubmissionStarted = false;

/** 仅测试用：重置内存锁。 */
export function resetSubmissionGuard(): void {
  ratingSubmissionStarted = false;
}

export async function submitFirstBrowserRating(
  rating: RatingId,
  resultSource: ResultSource
): Promise<SubmitOutcome> {
  if (resultSource !== "new-assessment") return "skipped";
  if (ratingSubmissionStarted) return "skipped";
  if (!canUseRatingSubmissionStorage()) return "skipped";
  if (getLocalRatingSubmission()) return "skipped";
  ratingSubmissionStarted = true;

  try {
    const res = await fetch("/api/ratings/first", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
      credentials: "omit",
      keepalive: true,
    });
    if (!res.ok) return "failed";
    const body = (await res.json()) as unknown;
    if (
      typeof body !== "object" ||
      body === null ||
      (body as { ok?: unknown }).ok !== true
    ) {
      return "failed";
    }
    saveLocalRatingSubmission(rating);
    return "submitted";
  } catch {
    return "failed";
  }
}

/**
 * GET /api/ratings/summary。
 * 校验 body 为对象、有 total(number)、有 ratings(数组)，并对每个 rating 做边界校验。
 * 失败返回 null（不抛错，不阻塞结果页）。
 */
export async function fetchRatingSummary(): Promise<RatingSummary | null> {
  try {
    const res = await fetch("/api/ratings/summary", { method: "GET" });
    if (!res.ok) return null;
    const body = (await res.json()) as unknown;
    if (typeof body !== "object" || body === null) return null;
    const b = body as { total?: unknown; ratings?: unknown };
    if (typeof b.total !== "number" || !Array.isArray(b.ratings)) return null;

    const ratings: SummaryItem[] = [];
    for (const item of b.ratings) {
      if (typeof item !== "object" || item === null) continue;
      const r = item as { rating?: unknown; count?: unknown; percentage?: unknown };
      if (!isRatingId(r.rating)) continue;
      if (typeof r.count !== "number" || typeof r.percentage !== "number") continue;
      ratings.push({ rating: r.rating, count: r.count, percentage: r.percentage });
    }
    return { total: b.total, ratings };
  } catch {
    return null;
  }
}
