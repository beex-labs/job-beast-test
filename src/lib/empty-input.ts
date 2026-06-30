import type { JobInput, Level } from "@/core/types";

/**
 * Empty form input — no prefilled defaults (per requirement).
 * Numeric fields use 0 as a neutral sentinel; the form renders 0 as empty
 * (via defaultValue falsy check) but allows the user to type 0 explicitly.
 * Levels use 0 sentinel (1–5 are valid choices).
 */
export function createEmptyInput(): JobInput {
  return {
    monthlyTakeHome: 0,
    guaranteedAnnualBonus: 0,
    monthlyFixedAllowance: 0,
    targetMonthlyTakeHome: 0,
    currencyCode: "CNY",
    workDaysPerWeek: 0,
    workHoursPerDay: 0,
    commuteHoursPerDay: 0,
    remoteDaysPerWeek: 0,
    afterHoursHoursPerWeek: 0,
    weekendWorkDaysPerMonth: 0,
    annualPaidLeaveDays: 0,
    yearsOfExperience: 0,
    roleClarity: 0 as unknown as Level,
    afterHoursContact: 0 as unknown as Level,
    urgentTaskFrequency: 0 as unknown as Level,
    leaveDifficulty: 0 as unknown as Level,
    transferableSkill: 0 as unknown as Level,
    feedbackQuality: 0 as unknown as Level,
    promotionClarity: 0 as unknown as Level,
    resumeValue: 0 as unknown as Level,
    salaryReliability: 0 as unknown as Level,
    agreementClarity: 0 as unknown as Level,
    businessOutlook: 0 as unknown as Level,
    teamContinuity: 0 as unknown as Level,
    scheduleAutonomy: 0 as unknown as Level,
    workMethodAutonomy: 0 as unknown as Level,
    remoteFlexibility: 0 as unknown as Level,
    decisionVoice: 0 as unknown as Level,
    benefitCoverage: 0 as unknown as Level,
    benefits: {
      basicInsurance: false,
      housingOrRetirement: false,
      paidLeaveUsable: false,
      medicalOrCommercial: false,
      mealOrTransport: false,
      overtimeCompensation: false,
      otherBenefit: false,
    },
    risks: {
      salaryArrears: false,
      severeRoleMismatch: false,
      noWrittenAgreement: false,
      extremeSchedule: false,
    },
  };
}

/** True when every required numeric + level field still needs user input. */
export function isLevelChosen(level: Level | number): boolean {
  return level >= 1 && level <= 5;
}
