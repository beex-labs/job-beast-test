// 结果持久化（指南 §8.1、§11.3）。
// 仅存渲染结果页所需字段，绝不存金额/原始答案。
// 将原 `submitted` 单标志拆为：
//   statsConsent          —— 用户是否同意上传评级（控制能否查看全站分布）
//   statsSubmissionState  —— 后台提交状态（不阻塞结果页）
// 查看结果与查看全站分布只依赖 statsConsent，不依赖 API 是否成功。

import type { DimensionScores, RatingId } from "@/core/types";
import { SESSION_KEYS, readSession, removeSession, writeSession } from "@/infra/storage";

export type StatsSubmissionState = "idle" | "pending" | "submitted" | "failed";

export interface PersistedResult {
  score: number;
  rating: RatingId;
  modifierId: string | null;
  modifierLabel: string | null;
  dimensions: DimensionScores;
  appliedCaps: string[];
  mainConclusion: string;
  quip: string;
  advantages: string[];
  losses: string[];
  /** 用户是否同意上传评级（只控制全站分布可见性）。 */
  statsConsent: boolean;
  /** 后台提交的实际状态（仅展示提示，不阻塞结果页）。 */
  statsSubmissionState: StatsSubmissionState;
  annualCash?: number;
  annualLoadHours?: number;
  effectiveHourlyPay?: number;
}

export function readResult(): PersistedResult | null {
  return readSession<PersistedResult>(SESSION_KEYS.currentResult);
}

export function writeResult(result: PersistedResult): void {
  writeSession(SESSION_KEYS.currentResult, result);
}

export function patchResult(patch: Partial<PersistedResult>): void {
  const current = readResult();
  if (current === null) return;
  writeSession(SESSION_KEYS.currentResult, { ...current, ...patch });
}

export function clearResult(): void {
  removeSession(SESSION_KEYS.currentResult);
}
