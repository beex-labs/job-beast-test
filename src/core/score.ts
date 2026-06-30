// 牛马检测器评分核心 —— 纯逻辑实现（指南 §3）。
// 服务端/客户端通用，不含任何 React 依赖。

import type {
  DimensionScores,
  JobInput,
  RiskFlags,
  ScoreBreakdown,
  WeightedPoints,
} from "@/core/types";
import {
  BENEFIT_SCORES,
  BOUNDARY_WEIGHTS,
  CERTAINTY_TIERS,
  DIMENSION_WEIGHTS,
  FREEDOM_WEIGHTS,
  GROWTH_WEIGHTS,
  REWARD_WEIGHTS,
  RISK_CAPS,
  STABILITY_WEIGHTS,
  TIME_COEFS,
} from "@/core/score-config";
import { getRating } from "./rating";
import {
  clamp,
  levelToScore,
  ratioScore,
  reverseLevelToScore,
  roundScore,
  safeNumber,
} from "@/core/utils";

/** 到岗占比：workDaysPerWeek<=0 时为 0，否则限制在 0–1（指南 §3.5）。 */
function officeRatio(workDays: number, remoteDays: number): number {
  if (workDays <= 0) return 0;
  return clamp((workDays - remoteDays) / workDays, 0, 1);
}

/** 年度现金收入（指南 §3.4）：月薪×12 + 年终奖 + 月固定津贴×12，负数按 0。 */
export function computeAnnualCash(input: JobInput): number {
  const monthly = Math.max(0, safeNumber(input.monthlyTakeHome));
  const bonus = Math.max(0, safeNumber(input.guaranteedAnnualBonus));
  const allowance = Math.max(0, safeNumber(input.monthlyFixedAllowance));
  return monthly * 12 + bonus + allowance * 12;
}

/** 年度工时负荷（指南 §3.5）：核心工时 + 通勤折算 + 待命折算 + 周末加班。 */
export function computeAnnualLoadHours(input: JobInput): number {
  const workDaysPerWeek = Math.max(0, safeNumber(input.workDaysPerWeek));
  const remoteDaysPerWeek = Math.max(0, safeNumber(input.remoteDaysPerWeek));
  const workHoursPerDay = Math.max(0, safeNumber(input.workHoursPerDay));
  const commuteHoursPerDay = Math.max(0, safeNumber(input.commuteHoursPerDay));
  const afterHoursHoursPerWeek = Math.max(0, safeNumber(input.afterHoursHoursPerWeek));
  const weekendWorkDaysPerMonth = Math.max(0, safeNumber(input.weekendWorkDaysPerMonth));
  const annualPaidLeaveDays = Math.max(0, safeNumber(input.annualPaidLeaveDays));

  const ratio = officeRatio(workDaysPerWeek, remoteDaysPerWeek);
  const baseAnnualWorkDays = workDaysPerWeek * TIME_COEFS.weeksPerYear;
  const usableLeaveDays = clamp(
    annualPaidLeaveDays,
    0,
    Math.max(0, baseAnnualWorkDays - 1),
  );
  const annualWorkDays = Math.max(1, baseAnnualWorkDays - usableLeaveDays);

  const annualCoreHours = annualWorkDays * workHoursPerDay;
  const annualCommuteHours =
    annualWorkDays * commuteHoursPerDay * ratio * TIME_COEFS.commuteWeight;
  const annualAfterHours =
    afterHoursHoursPerWeek * TIME_COEFS.weeksPerYear * TIME_COEFS.afterHoursWeight;
  const annualWeekendHours =
    weekendWorkDaysPerMonth * 12 * Math.min(workHoursPerDay, TIME_COEFS.weekendHoursCapPerDay);

  return annualCoreHours + annualCommuteHours + annualAfterHours + annualWeekendHours;
}

/** reward 确定性子分（指南 §3.6）：欠薪直接最低档，否则按薪资按时程度。 */
function computeCertainty(input: JobInput): number {
  if (input.risks.salaryArrears) return CERTAINTY_TIERS.arrearsOrSevere;
  const reliability = input.salaryReliability;
  if (reliability >= 5) return CERTAINTY_TIERS.paidOnTimeFixedCash;
  if (reliability === 4) return CERTAINTY_TIERS.mostlyFixedSlightBonusVolatility;
  return CERTAINTY_TIERS.opaqueOrVerbal;
}

/** reward 维度（指南 §3.6）：现金达标 50% + 时薪 35% + 确定性 15%。 */
function computeReward(
  input: JobInput,
  annualCash: number,
  annualLoadHours: number,
): number {
  const effectiveLoadHours = Math.max(annualLoadHours, 1);
  const effectiveHourlyPay = annualCash / effectiveLoadHours;
  const targetAnnualCash = Math.max(safeNumber(input.targetMonthlyTakeHome), 0) * 12;
  // 标准年工时 = 52 周 × (5 天 × 8 小时) = 2080
  const standardAnnualHours = TIME_COEFS.weeksPerYear * TIME_COEFS.standardWeekHours;
  const targetHourlyPay = targetAnnualCash / standardAnnualHours;

  const cashTargetScore =
    targetAnnualCash > 0 ? ratioScore(annualCash / targetAnnualCash) : 0;
  const hourlyScore =
    targetHourlyPay > 0 ? ratioScore(effectiveHourlyPay / targetHourlyPay) : 0;
  const certaintyScore = computeCertainty(input);

  const rewardScore =
    cashTargetScore * REWARD_WEIGHTS.cashTarget +
    hourlyScore * REWARD_WEIGHTS.hourly +
    certaintyScore * REWARD_WEIGHTS.certainty;
  return clamp(rewardScore);
}

/** time 维度（指南 §3.7）：日负荷惩罚 + 加班天惩罚 + 周末惩罚 - 年假加成。 */
function computeTime(input: JobInput): number {
  const workDaysPerWeek = Math.max(0, safeNumber(input.workDaysPerWeek));
  const remoteDaysPerWeek = Math.max(0, safeNumber(input.remoteDaysPerWeek));
  const workHoursPerDay = Math.max(0, safeNumber(input.workHoursPerDay));
  const commuteHoursPerDay = Math.max(0, safeNumber(input.commuteHoursPerDay));
  const afterHoursHoursPerWeek = Math.max(0, safeNumber(input.afterHoursHoursPerWeek));
  const weekendWorkDaysPerMonth = Math.max(0, safeNumber(input.weekendWorkDaysPerMonth));
  const annualPaidLeaveDays = Math.max(0, safeNumber(input.annualPaidLeaveDays));

  const ratio = officeRatio(workDaysPerWeek, remoteDaysPerWeek);
  const effectiveDailyLoad =
    workHoursPerDay +
    commuteHoursPerDay * ratio * TIME_COEFS.commuteWeight +
    (afterHoursHoursPerWeek / Math.max(workDaysPerWeek, 1)) * TIME_COEFS.afterHoursWeight;

  let timeScore = 100;
  timeScore -=
    Math.max(0, effectiveDailyLoad - TIME_COEFS.standardDailyHours) *
    TIME_COEFS.dailyLoadPenaltyPerHour;
  timeScore -= Math.max(0, workDaysPerWeek - 5) * TIME_COEFS.extraDayPenalty;
  timeScore -= weekendWorkDaysPerMonth * TIME_COEFS.weekendPenaltyPerDay;
  timeScore +=
    Math.min(annualPaidLeaveDays, TIME_COEFS.leaveBonusCapDays) *
    TIME_COEFS.leaveBonusPerDay;
  return clamp(timeScore);
}

/** boundary 维度（指南 §3.8）：角色清晰正向，其余三项负向反转。 */
function computeBoundary(input: JobInput): number {
  const boundaryScore =
    levelToScore(input.roleClarity) * BOUNDARY_WEIGHTS.roleClarity +
    reverseLevelToScore(input.afterHoursContact) * BOUNDARY_WEIGHTS.afterHoursContact +
    reverseLevelToScore(input.urgentTaskFrequency) * BOUNDARY_WEIGHTS.urgentTaskFrequency +
    reverseLevelToScore(input.leaveDifficulty) * BOUNDARY_WEIGHTS.leaveDifficulty;
  return clamp(boundaryScore);
}

/** growth 维度（指南 §3.9）：全部正向。 */
function computeGrowth(input: JobInput): number {
  const growthScore =
    levelToScore(input.transferableSkill) * GROWTH_WEIGHTS.transferableSkill +
    levelToScore(input.feedbackQuality) * GROWTH_WEIGHTS.feedbackQuality +
    levelToScore(input.promotionClarity) * GROWTH_WEIGHTS.promotionClarity +
    levelToScore(input.resumeValue) * GROWTH_WEIGHTS.resumeValue;
  return clamp(growthScore);
}

/** stability 维度（§3.10）：全部正向。 */
function computeStability(input: JobInput): number {
  const stabilityScore =
    levelToScore(input.salaryReliability) * STABILITY_WEIGHTS.salaryReliability +
    levelToScore(input.agreementClarity) * STABILITY_WEIGHTS.agreementClarity +
    levelToScore(input.businessOutlook) * STABILITY_WEIGHTS.businessOutlook +
    levelToScore(input.teamContinuity) * STABILITY_WEIGHTS.teamContinuity;
  return clamp(stabilityScore);
}

/** freedom 维度（§3.11）：全部正向。 */
function computeFreedom(input: JobInput): number {
  const freedomScore =
    levelToScore(input.scheduleAutonomy) * FREEDOM_WEIGHTS.scheduleAutonomy +
    levelToScore(input.workMethodAutonomy) * FREEDOM_WEIGHTS.workMethodAutonomy +
    levelToScore(input.remoteFlexibility) * FREEDOM_WEIGHTS.remoteFlexibility +
    levelToScore(input.decisionVoice) * FREEDOM_WEIGHTS.decisionVoice;
  return clamp(freedomScore);
}

/** benefit 维度（§3.12）：仅按勾选福利累加，benefitCoverage 不参与评分。 */
function computeBenefit(input: JobInput): number {
  const b = input.benefits;
  let s = 0;
  if (b.basicInsurance) s += BENEFIT_SCORES.basicInsurance;
  if (b.housingOrRetirement) s += BENEFIT_SCORES.housingOrRetirement;
  if (b.paidLeaveUsable) s += BENEFIT_SCORES.paidLeaveUsable;
  if (b.medicalOrCommercial) s += BENEFIT_SCORES.medicalOrCommercial;
  if (b.mealOrTransport) s += BENEFIT_SCORES.mealOrTransport;
  if (b.overtimeCompensation) s += BENEFIT_SCORES.overtimeCompensation;
  if (b.otherBenefit) s += BENEFIT_SCORES.otherBenefit;
  return clamp(s);
}

/** 七维原始分（指南 §3.6–3.12）。 */
export function computeDimensions(input: JobInput): DimensionScores {
  const annualCash = computeAnnualCash(input);
  const annualLoadHours = computeAnnualLoadHours(input);
  return {
    reward: computeReward(input, annualCash, annualLoadHours),
    time: computeTime(input),
    boundary: computeBoundary(input),
    growth: computeGrowth(input),
    stability: computeStability(input),
    freedom: computeFreedom(input),
    benefit: computeBenefit(input),
  };
}

/** 风险封顶（指南 §3.13）：依次应用各风险上限/扣分。 */
export function applyRiskCaps(
  rawScore: number,
  risks: RiskFlags,
): { finalScore: number; appliedCaps: string[] } {
  let score = rawScore;
  const appliedCaps: string[] = [];

  if (risks.salaryArrears) {
    score = Math.min(score, RISK_CAPS.salaryArrears);
    appliedCaps.push("salary_arrears_cap");
  }
  if (risks.extremeSchedule) {
    score = Math.min(score, RISK_CAPS.extremeSchedule);
    appliedCaps.push("extreme_schedule_cap");
  }
  if (risks.noWrittenAgreement) {
    score = Math.min(score, RISK_CAPS.noWrittenAgreement);
    appliedCaps.push("agreement_cap");
  }
  if (risks.severeRoleMismatch) {
    score = Math.min(score - RISK_CAPS.roleMismatchPenalty, RISK_CAPS.roleMismatchCap);
    appliedCaps.push("role_mismatch_penalty");
  }

  return { finalScore: roundScore(clamp(score)), appliedCaps };
}

/** 完整评分：维度 → 加权 → 风险封顶 → 评级（指南 §3.1）。 */
export function scoreJob(input: JobInput): ScoreBreakdown {
  const dimensions = computeDimensions(input);
  const annualCash = computeAnnualCash(input);
  const annualLoadHours = computeAnnualLoadHours(input);
  const effectiveHourlyPay = annualCash / Math.max(annualLoadHours, 1);
  const targetAnnualCash = Math.max(safeNumber(input.targetMonthlyTakeHome), 0) * 12;

  const weighted: WeightedPoints = {
    reward: dimensions.reward * DIMENSION_WEIGHTS.reward,
    time: dimensions.time * DIMENSION_WEIGHTS.time,
    boundary: dimensions.boundary * DIMENSION_WEIGHTS.boundary,
    growth: dimensions.growth * DIMENSION_WEIGHTS.growth,
    stability: dimensions.stability * DIMENSION_WEIGHTS.stability,
    freedom: dimensions.freedom * DIMENSION_WEIGHTS.freedom,
    benefit: dimensions.benefit * DIMENSION_WEIGHTS.benefit,
  };
  const rawScore =
    weighted.reward +
    weighted.time +
    weighted.boundary +
    weighted.growth +
    weighted.stability +
    weighted.freedom +
    weighted.benefit;

  const { finalScore, appliedCaps } = applyRiskCaps(rawScore, input.risks);
  const rating = getRating(finalScore);

  return {
    dimensions,
    weighted,
    rawScore,
    finalScore,
    appliedCaps,
    rating,
    annualCash,
    annualLoadHours,
    effectiveHourlyPay,
    targetAnnualCash,
  };
}
