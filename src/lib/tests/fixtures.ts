import { DEFAULT_JOB_INPUT } from "@/core/types";
import type { JobInput } from "@/core/types";

export function clone(input: JobInput): JobInput {
  return {
    ...input,
    benefits: { ...input.benefits },
    risks: { ...input.risks },
  };
}

export const base = (): JobInput => clone(DEFAULT_JOB_INPUT);

/** A clearly strong job: high pay, low time, good everything, no risks. */
export const strongJob = (): JobInput => ({
  ...base(),
  monthlyTakeHome: 30000,
  guaranteedAnnualBonus: 60000,
  monthlyFixedAllowance: 1500,
  targetMonthlyTakeHome: 12000,
  workDaysPerWeek: 5,
  workHoursPerDay: 7,
  commuteHoursPerDay: 0.5,
  remoteDaysPerWeek: 2,
  afterHoursHoursPerWeek: 0,
  weekendWorkDaysPerMonth: 0,
  annualPaidLeaveDays: 15,
  roleClarity: 5,
  afterHoursContact: 1,
  urgentTaskFrequency: 1,
  leaveDifficulty: 1,
  transferableSkill: 5,
  feedbackQuality: 5,
  promotionClarity: 5,
  resumeValue: 5,
  salaryReliability: 5,
  agreementClarity: 5,
  businessOutlook: 5,
  teamContinuity: 5,
  scheduleAutonomy: 5,
  workMethodAutonomy: 5,
  remoteFlexibility: 4,
  decisionVoice: 4,
  benefits: {
    basicInsurance: true,
    housingOrRetirement: true,
    paidLeaveUsable: true,
    medicalOrCommercial: true,
    mealOrTransport: true,
    overtimeCompensation: true,
    otherBenefit: true,
  },
  risks: {
    salaryArrears: false,
    severeRoleMismatch: false,
    noWrittenAgreement: false,
    extremeSchedule: false,
  },
});

/** A clearly weak job: low pay, heavy time, poor everything. */
export const weakJob = (): JobInput => ({
  ...base(),
  monthlyTakeHome: 3500,
  guaranteedAnnualBonus: 0,
  monthlyFixedAllowance: 0,
  targetMonthlyTakeHome: 8000,
  workDaysPerWeek: 6,
  workHoursPerDay: 11,
  commuteHoursPerDay: 3,
  remoteDaysPerWeek: 0,
  afterHoursHoursPerWeek: 12,
  weekendWorkDaysPerMonth: 4,
  annualPaidLeaveDays: 0,
  roleClarity: 2,
  afterHoursContact: 5,
  urgentTaskFrequency: 5,
  leaveDifficulty: 5,
  transferableSkill: 1,
  feedbackQuality: 1,
  promotionClarity: 1,
  resumeValue: 1,
  salaryReliability: 2,
  agreementClarity: 2,
  businessOutlook: 2,
  teamContinuity: 2,
  scheduleAutonomy: 1,
  workMethodAutonomy: 1,
  remoteFlexibility: 1,
  decisionVoice: 1,
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
});
