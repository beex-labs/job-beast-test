// 统计仓储抽象 + 内存实现（指南 §10.5）。

import type { RatingId } from "@/core/types";
import { RATING_IDS, isRatingId } from "@/core/rating";

export interface RatingStatsRepository {
  increment(rating: RatingId): Promise<void>;
  getSummary(): Promise<Record<RatingId, number>>;
}

/** 内存实现：构造时把 RATING_IDS 全部初始化为 0（按固定顺序）。 */
export class InMemoryRatingStatsRepository implements RatingStatsRepository {
  private counts: Record<RatingId, number>;

  constructor() {
    this.counts = {} as Record<RatingId, number>;
    for (const id of RATING_IDS) {
      this.counts[id] = 0;
    }
  }

  async increment(rating: RatingId): Promise<void> {
    // 接口约定只接收合法 RatingId，但仍做运行时校验，非法忽略。
    if (!isRatingId(rating)) return;
    this.counts[rating]++;
  }

  /** 返回一份按 RATING_IDS 固定顺序的快照（拷贝，避免外部修改）。 */
  async getSummary(): Promise<Record<RatingId, number>> {
    const snapshot = {} as Record<RatingId, number>;
    for (const id of RATING_IDS) {
      snapshot[id] = this.counts[id];
    }
    return snapshot;
  }
}

/** 模块级单例，供 Next.js API route 在无 D1 绑定时使用。 */
export const ratingStatsRepository: RatingStatsRepository =
  new InMemoryRatingStatsRepository();

export interface SummaryPayload {
  total: number;
  ratings: Array<{ rating: RatingId; count: number; percentage: number }>;
}

/**
 * summary 接口聚合函数。
 * 按 RATING_IDS 固定顺序，缺失按 0 补齐；percentage 保留两位小数；total===0 时所有 percentage 为 0。
 */
export function buildSummaryPayload(counts: Record<RatingId, number>): SummaryPayload {
  const items = RATING_IDS.map((id) => counts[id] ?? 0);
  const total = items.reduce((sum, c) => sum + c, 0);
  const ratings = RATING_IDS.map((id, i) => {
    const count = items[i];
    const percentage =
      total === 0 ? 0 : Math.round((count / total) * 100 * 100) / 100;
    return { rating: id, count, percentage };
  });
  return { total, ratings };
}
