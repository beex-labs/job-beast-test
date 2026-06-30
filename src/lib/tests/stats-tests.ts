import { RATING_IDS, isRatingId } from "@/core/rating";
import type { RatingId } from "@/core/types";
import {
  InMemoryRatingStatsRepository,
  buildSummaryPayload,
} from "@/infra/rating-stats-repository";
import {
  assertEqual,
  assertGreaterEqual,
  assertLessEqual,
  assertTrue,
  type Suite,
} from "./runner";

export const statsSuite: Suite = {
  name: "统计仓储",
  tests: [
    {
      name: "八个合法评级分别可以增加一次",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        for (const id of RATING_IDS) {
          await repo.increment(id);
        }
        const summary = await repo.getSummary();
        for (const id of RATING_IDS) {
          assertEqual(summary[id], 1, `${id} 应为 1`);
        }
      },
    },
    {
      name: "非法评级被拒绝（isRatingId）",
      run: () => {
        assertTrue(!isRatingId("invalid"), "非法字符串");
        assertTrue(!isRatingId(""), "空字符串");
        assertTrue(!isRatingId(123 as unknown), "数字");
        assertTrue(!isRatingId(null as unknown), "null");
        assertTrue(!isRatingId(undefined as unknown), "undefined");
      },
    },
    {
      name: "每个合法请求只增加 1",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        await repo.increment("worker");
        await repo.increment("worker");
        await repo.increment("worker");
        const summary = await repo.getSummary();
        assertEqual(summary.worker, 3, "worker 应为 3");
      },
    },
    {
      name: "并发增加同一评级不会丢失计数",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        await Promise.all(
          Array.from({ length: 100 }, () => repo.increment("joker"))
        );
        const summary = await repo.getSummary();
        assertEqual(summary.joker, 100, "joker 应为 100");
      },
    },
    {
      name: "汇总结果补齐所有八档",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        await repo.increment("worker");
        const summary = await repo.getSummary();
        for (const id of RATING_IDS) {
          assertTrue(id in summary, `应包含 ${id}`);
        }
      },
    },
    {
      name: "汇总顺序固定为 RATING_IDS",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        const summary = await repo.getSummary();
        assertEqual(
          Object.keys(summary),
          RATING_IDS as readonly string[],
          "键顺序"
        );
      },
    },
    {
      name: "总数等于八档计数之和",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        await repo.increment("worker");
        await repo.increment("joker");
        await repo.increment("offer");
        const summary = await repo.getSummary();
        const payload = buildSummaryPayload(summary);
        const sum = payload.ratings.reduce((s, r) => s + r.count, 0);
        assertEqual(payload.total, sum, "total 应等于计数和");
        assertEqual(payload.total, 3, "total 应为 3");
      },
    },
    {
      name: "百分比总和约等于 100%",
      run: async () => {
        const counts = {} as Record<RatingId, number>;
        for (const id of RATING_IDS) counts[id] = 0;
        counts.worker = 3842;
        counts.joker = 2916;
        counts.offer = 2140;
        counts.loser = 1409;
        counts.enjoyer = 801;
        counts.volunteer = 613;
        counts.shareholder = 298;
        counts.beast_of_burden = 142;
        const payload = buildSummaryPayload(counts);
        const pctSum = payload.ratings.reduce((s, r) => s + r.percentage, 0);
        assertGreaterEqual(pctSum, 99.9, "下界");
        assertLessEqual(pctSum, 100.1, "上界");
      },
    },
    {
      name: "空数据库时所有计数为 0，百分比为 0",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        const summary = await repo.getSummary();
        const payload = buildSummaryPayload(summary);
        assertEqual(payload.total, 0, "total 应为 0");
        for (const r of payload.ratings) {
          assertEqual(r.count, 0, `${r.rating} count`);
          assertEqual(r.percentage, 0, `${r.rating} percentage`);
        }
      },
    },
    {
      name: "汇总 payload 不返回单次提交列表",
      run: async () => {
        const repo = new InMemoryRatingStatsRepository();
        await repo.increment("worker");
        const payload = buildSummaryPayload(await repo.getSummary());
        const json = JSON.stringify(payload);
        assertTrue(!json.includes("score"), "不应包含 score");
        assertTrue(!json.includes("answers"), "不应包含 answers");
        assertTrue(!json.includes("salary"), "不应包含 salary");
      },
    },
  ],
};
