// Vitest 入口：复用自研浏览器测试 runner 的套件定义（指南 §10）。
// 60 项断言全部在此运行，保留原始断言语义，仅换运行宿主为 Vitest + happy-dom。

import { describe, it, expect, beforeEach } from "vitest";
import { runSuite, type Suite } from "@/lib/tests/runner";
import { SUITES } from "@/lib/tests/index";
import { clearLocalRatingSubmission } from "@/infra/rating-submission-storage";

// storage / network 套件共享 localStorage，每个用例前清干净，避免互相串扰。
beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    // ignore
  }
  clearLocalRatingSubmission();
});

for (const suite of SUITES) {
  describe(suite.name, () => {
    for (const t of suite.tests) {
      it(t.name, async () => {
        const s: Suite = { name: suite.name, tests: [t] };
        const results = await runSuite(s);
        const r = results[0];
        if (!r.passed) {
          expect.fail(r.error ?? "测试失败但未提供错误信息");
        }
      });
    }
  });
}
