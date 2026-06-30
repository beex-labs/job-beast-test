import type {
  Explanation,
  FullResult,
  JobInput,
  ScoreBreakdown,
} from "@/core/types";
import { clamp } from "@/core/utils";
import { getRatingCopy } from "@/data/rating-copy";
import { scoreJob } from "./score";
import { matchModifier } from "./modifiers";

// Explanation generator (guide §5.4). Derives a one-line conclusion, a quip,
// three advantages and three losses from the breakdown + raw input.
// Copy (主文案/短句) lives in @app/data/rating-copy; this module only reasons.

interface Aspect {
  key: string;
  score: number; // 0–100, higher = better
  advantage: string;
  loss: string;
}

function positiveLevel(level: number): number {
  return clamp((Math.max(1, Math.min(5, level)) - 1) * 25);
}
function negativeLevel(level: number): number {
  return clamp((5 - Math.max(1, Math.min(5, level))) * 25);
}

function timeAspectScores(input: JobInput) {
  const workDays = Math.max(input.workDaysPerWeek, 0);
  const officeRatio =
    workDays > 0
      ? clamp((workDays - input.remoteDaysPerWeek) / workDays, 0, 1)
      : 0;
  const effectiveDailyLoad =
    input.workHoursPerDay +
    input.commuteHoursPerDay * officeRatio * 0.5 +
    (input.afterHoursHoursPerWeek / Math.max(input.workDaysPerWeek, 1)) * 0.8;
  return {
    dailyLoad: clamp(100 - Math.max(0, effectiveDailyLoad - 7.5) * 15),
    commute: clamp(100 - input.commuteHoursPerDay * 15),
    afterHours: clamp(100 - input.afterHoursHoursPerWeek * 5),
    weekend: clamp(100 - input.weekendWorkDaysPerMonth * 10),
  };
}

function buildAspects(input: JobInput, breakdown: ScoreBreakdown): Aspect[] {
  const t = timeAspectScores(input);
  const rewardSub = {
    cashTarget:
      breakdown.targetAnnualCash > 0
        ? clamp(50 + 35 * Math.log2(breakdown.annualCash / breakdown.targetAnnualCash))
        : 0,
    hourly: (() => {
      const targetHourly = breakdown.targetAnnualCash / 2080;
      const eff =
        breakdown.annualLoadHours > 0
          ? breakdown.effectiveHourlyPay
          : breakdown.annualCash;
      return targetHourly > 0 ? clamp(50 + 35 * Math.log2(eff / targetHourly)) : 0;
    })(),
    certainty: input.risks.salaryArrears
      ? 10
      : input.salaryReliability >= 5
        ? 100
        : input.salaryReliability === 4
          ? 75
          : 45,
  };

  return [
    {
      key: "reward-cash",
      score: rewardSub.cashTarget,
      advantage: "到手收入达到或超过个人目标",
      loss: "到手收入低于个人目标",
    },
    {
      key: "reward-hourly",
      score: rewardSub.hourly,
      advantage: "有效时薪较高",
      loss: "有效时薪偏低",
    },
    {
      key: "reward-certainty",
      score: rewardSub.certainty,
      advantage: "收入兑现较为确定",
      loss: "收入兑现存在不确定性",
    },
    {
      key: "time-load",
      score: t.dailyLoad,
      advantage: "工时与负荷较为合理",
      loss: "工时与负荷偏高",
    },
    {
      key: "time-commute",
      score: t.commute,
      advantage: "通勤负担较轻",
      loss: "通勤吞掉大量可支配时间",
    },
    {
      key: "time-afterhours",
      score: t.afterHours,
      advantage: "下班后较少被打扰",
      loss: "每周下班后待命时间过长",
    },
    {
      key: "time-weekend",
      score: t.weekend,
      advantage: "周末较少被占用",
      loss: "周末常被工作占用",
    },
    {
      key: "boundary-contact",
      score: negativeLevel(input.afterHoursContact),
      advantage: "下班边界较为清晰",
      loss: "下班待命和临时任务边界模糊",
    },
    {
      key: "boundary-leave",
      score: negativeLevel(input.leaveDifficulty),
      advantage: "请假较为方便",
      loss: "请假比较困难",
    },
    {
      key: "growth-skill",
      score: positiveLevel(input.transferableSkill),
      advantage: "能学到可迁移技能",
      loss: "可迁移技能积累有限",
    },
    {
      key: "growth-resume",
      score: positiveLevel(input.resumeValue),
      advantage: "履历具有一定市场价值",
      loss: "履历市场价值有限",
    },
    {
      key: "stability-salary",
      score: positiveLevel(input.salaryReliability),
      advantage: "发薪相对稳定",
      loss: "发薪不够稳定",
    },
  ];
}

export function generateExplanation(
  input: JobInput,
  breakdown: ScoreBreakdown
): Explanation {
  const copy = getRatingCopy(breakdown.rating);
  const aspects = buildAspects(input, breakdown).slice().sort((a, b) => b.score - a.score);

  const advantages = aspects.slice(0, 3).map((a) => a.advantage);
  const losses = aspects
    .slice(-3)
    .reverse()
    .map((a) => a.loss);

  return {
    mainConclusion: copy.summary,
    quip: copy.mainCopy,
    advantages,
    losses,
  };
}

export function buildFullResult(input: JobInput): FullResult {
  const breakdown = scoreJob(input);
  const modifier = matchModifier(breakdown, input);
  const explanation = generateExplanation(input, breakdown);
  return { input, breakdown, modifier, explanation };
}
