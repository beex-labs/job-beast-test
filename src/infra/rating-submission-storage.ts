// 首次浏览器评级提交标记（指南 §7.4–7.5）。
// 本地记录只能包含 version/status/rating 三个字段，
// 绝不保存分数、金额、答案、设备信息、时间戳。
// localStorage 不可用时默认跳过（返回 false/null），不退回 Cookie/指纹/设备 ID。

import { isRatingId } from "@/core/rating";
import type { RatingId } from "@/core/types";

export const RATING_SUBMISSION_STORAGE_KEY = "job_beast_first_browser_rating_v1";

export interface LocalRatingSubmissionV1 {
  version: 1;
  status: "submitted";
  rating: RatingId;
}

/** 探测 localStorage：setItem 探针（key + ":probe"）再 removeItem。 */
export function canUseRatingSubmissionStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = RATING_SUBMISSION_STORAGE_KEY + ":probe";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** 严格校验 version===1、status==="submitted"、isRatingId(rating)，任何异常/null 返回 null。 */
export function getLocalRatingSubmission(): LocalRatingSubmissionV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RATING_SUBMISSION_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      (parsed as { version?: unknown }).version === 1 &&
      (parsed as { status?: unknown }).status === "submitted" &&
      isRatingId((parsed as { rating?: unknown }).rating)
    ) {
      return {
        version: 1,
        status: "submitted",
        rating: (parsed as { rating: RatingId }).rating,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLocalRatingSubmission(rating: RatingId): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: LocalRatingSubmissionV1 = {
      version: 1,
      status: "submitted",
      rating,
    };
    window.localStorage.setItem(
      RATING_SUBMISSION_STORAGE_KEY,
      JSON.stringify(payload)
    );
    return true;
  } catch {
    return false;
  }
}

/** 移除键，供测试/手工验收用。 */
export function clearLocalRatingSubmission(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RATING_SUBMISSION_STORAGE_KEY);
  } catch {
    // 静默忽略
  }
}
