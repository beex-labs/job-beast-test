import {
  applyRiskCaps,
  computeAnnualCash,
  computeAnnualLoadHours,
  scoreJob,
} from "@/core/score";
import { base, clone, strongJob, weakJob } from "./fixtures";
import {
  assertEqual,
  assertGreaterEqual,
  assertLessEqual,
  assertApprox,
  assertTrue,
  type Suite,
} from "./runner";

const DIM_KEYS = [
  "reward",
  "time",
  "boundary",
  "growth",
  "stability",
  "freedom",
  "benefit",
] as const;

export const scoreSuite: Suite = {
  name: "评分模型",
  tests: [
    {
      name: "合理默认值结果在 0–100",
      run: () => {
        const r = scoreJob(base());
        assertGreaterEqual(r.finalScore, 0, "下界");
        assertLessEqual(r.finalScore, 100, "上界");
      },
    },
    {
      name: "月到手增加，回报分不下降",
      run: () => {
        const a = scoreJob({ ...base(), monthlyTakeHome: 8000 });
        const b = scoreJob({ ...base(), monthlyTakeHome: 16000 });
        assertGreaterEqual(b.dimensions.reward, a.dimensions.reward, "回报分");
      },
    },
    {
      name: "工时增加，时间分不提高",
      run: () => {
        const a = scoreJob({ ...base(), workHoursPerDay: 8 });
        const b = scoreJob({ ...base(), workHoursPerDay: 10 });
        assertLessEqual(b.dimensions.time, a.dimensions.time, "时间分");
      },
    },
    {
      name: "通勤增加，时间分不提高",
      run: () => {
        const a = scoreJob({ ...base(), commuteHoursPerDay: 0.5 });
        const b = scoreJob({ ...base(), commuteHoursPerDay: 2 });
        assertLessEqual(b.dimensions.time, a.dimensions.time, "时间分");
      },
    },
    {
      name: "远程天数增加，通勤负担不增加",
      run: () => {
        const a = computeAnnualLoadHours({ ...base(), remoteDaysPerWeek: 0 });
        const b = computeAnnualLoadHours({ ...base(), remoteDaysPerWeek: 2 });
        assertLessEqual(b, a, "年度工时负荷");
      },
    },
    {
      name: "下班待命增加，时间分不提高",
      run: () => {
        const a = scoreJob({ ...base(), afterHoursHoursPerWeek: 0 });
        const b = scoreJob({ ...base(), afterHoursHoursPerWeek: 10 });
        assertLessEqual(b.dimensions.time, a.dimensions.time, "时间分");
      },
    },
    {
      name: "下班被打扰加重，边界分不提高",
      run: () => {
        const a = scoreJob({ ...base(), afterHoursContact: 1 });
        const b = scoreJob({ ...base(), afterHoursContact: 5 });
        assertLessEqual(b.dimensions.boundary, a.dimensions.boundary, "边界分");
      },
    },
    {
      name: "年假增加，时间分不下降",
      run: () => {
        const a = scoreJob({ ...base(), annualPaidLeaveDays: 5 });
        const b = scoreJob({ ...base(), annualPaidLeaveDays: 20 });
        assertGreaterEqual(b.dimensions.time, a.dimensions.time, "时间分");
      },
    },
    {
      name: "奖金为 0 时不计入固定回报",
      run: () => {
        const noBonus = computeAnnualCash({ ...base(), guaranteedAnnualBonus: 0 });
        const withBonus = computeAnnualCash({ ...base(), guaranteedAnnualBonus: 10000 });
        assertEqual(withBonus - noBonus, 10000, "差额应等于奖金");
      },
    },
    {
      name: "负数输入被安全截断为 0",
      run: () => {
        const neg = computeAnnualCash({ ...base(), monthlyTakeHome: -1000 });
        const zero = computeAnnualCash({ ...base(), monthlyTakeHome: 0 });
        assertEqual(neg, zero, "负月薪应等同于 0");
      },
    },
    {
      name: "NaN/Infinity 不会进入结果",
      run: () => {
        const r = scoreJob({
          ...base(),
          monthlyTakeHome: Number.POSITIVE_INFINITY,
        });
        assertTrue(Number.isFinite(r.finalScore), "finalScore 须为有限数");
        assertGreaterEqual(r.finalScore, 0, "下界");
        assertLessEqual(r.finalScore, 100, "上界");
      },
    },
    {
      name: "工资拖欠时最终分最高 44",
      run: () => {
        const r = scoreJob({ ...strongJob(), risks: { ...strongJob().risks, salaryArrears: true } });
        assertLessEqual(r.finalScore, 44, "封顶 44");
        assertTrue(r.appliedCaps.includes("salary_arrears_cap"), "应标记封顶");
      },
    },
    {
      name: "极端工时时最终分最高 57",
      run: () => {
        const r = scoreJob({
          ...strongJob(),
          risks: { ...strongJob().risks, extremeSchedule: true },
        });
        assertLessEqual(r.finalScore, 57, "封顶 57");
        assertTrue(r.appliedCaps.includes("extreme_schedule_cap"), "应标记封顶");
      },
    },
    {
      name: "无书面协议最终分最高 57",
      run: () => {
        const r = scoreJob({
          ...strongJob(),
          risks: { ...strongJob().risks, noWrittenAgreement: true },
        });
        assertLessEqual(r.finalScore, 57, "封顶 57");
        assertTrue(r.appliedCaps.includes("agreement_cap"), "应标记封顶");
      },
    },
    {
      name: "职责严重不符扣 10 且最高 69",
      run: () => {
        const raw = scoreJob(strongJob());
        const capped = scoreJob({
          ...strongJob(),
          risks: { ...strongJob().risks, severeRoleMismatch: true },
        });
        assertLessEqual(capped.finalScore, 69, "封顶 69");
        assertTrue(capped.appliedCaps.includes("role_mismatch_penalty"), "应标记扣分");
        // raw was likely capped above; ensure the penalty reduced the score.
        assertLessEqual(capped.finalScore, Math.max(0, raw.rawScore - 9) + 0.5, "应扣约 10");
      },
    },
    {
      name: "所有维度分均在 0–100",
      run: () => {
        for (const input of [base(), strongJob(), weakJob()]) {
          const r = scoreJob(input);
          for (const k of DIM_KEYS) {
            assertGreaterEqual(r.dimensions[k], 0, `${k} 下界`);
            assertLessEqual(r.dimensions[k], 100, `${k} 上界`);
          }
        }
      },
    },
    {
      name: "总分等于加权维度之和并正确四舍五入",
      run: () => {
        const input = clone(base());
        const r = scoreJob(input);
        const sum =
          r.weighted.reward +
          r.weighted.time +
          r.weighted.boundary +
          r.weighted.growth +
          r.weighted.stability +
          r.weighted.freedom +
          r.weighted.benefit;
        assertApprox(r.rawScore, sum, 1e-6, "rawScore 应等于加权和");
        const expected = applyRiskCaps(r.rawScore, input.risks).finalScore;
        assertEqual(r.finalScore, expected, "finalScore 应等于封顶后的值");
      },
    },
  ],
};
