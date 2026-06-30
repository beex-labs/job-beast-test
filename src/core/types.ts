// Job Beast Test — shared domain types.
// All rating logic only uses stable IDs; display copy lives in /data.

export const RATING_IDS = [
  "shareholder",
  "enjoyer",
  "offer",
  "worker",
  "joker",
  "loser",
  "volunteer",
  "beast_of_burden",
] as const;

export type RatingId = (typeof RATING_IDS)[number];

/** 1–5 agreement scale used across experience questions. */
export type Level = 1 | 2 | 3 | 4 | 5;

export interface MoneyInput {
  /** Monthly take-home pay. */
  monthlyTakeHome: number;
  /** Guaranteed annual bonus (written in contract / certain). */
  guaranteedAnnualBonus: number;
  /** Monthly fixed allowance. */
  monthlyFixedAllowance: number;
  /** User's acceptable monthly take-home target for this stage. */
  targetMonthlyTakeHome: number;
  /** Display-only currency code; never participates in conversion. */
  currencyCode: string;
}

export interface TimeInput {
  workDaysPerWeek: number; // 0–7
  workHoursPerDay: number;
  commuteHoursPerDay: number;
  remoteDaysPerWeek: number;
  afterHoursHoursPerWeek: number;
  weekendWorkDaysPerMonth: number;
  annualPaidLeaveDays: number;
}

export interface ExperienceInput {
  yearsOfExperience: number;
  // Boundary (1 = worst, 5 = best). Negative items are stored as 1=worst too,
  // the scorer reverses them so a higher level always means a worse condition.
  roleClarity: Level; // positive
  afterHoursContact: Level; // negative (higher = contacted more often)
  urgentTaskFrequency: Level; // negative
  leaveDifficulty: Level; // negative
  // Growth
  transferableSkill: Level; // positive
  feedbackQuality: Level; // positive
  promotionClarity: Level; // positive
  resumeValue: Level; // positive
  // Stability
  salaryReliability: Level; // positive
  agreementClarity: Level; // positive
  businessOutlook: Level; // positive
  teamContinuity: Level; // positive
  // Freedom
  scheduleAutonomy: Level; // positive
  workMethodAutonomy: Level; // positive
  remoteFlexibility: Level; // positive
  decisionVoice: Level; // positive
  // Benefit coverage level (used as a fallback / summary indicator)
  benefitCoverage: Level; // positive
}

export interface BenefitFlags {
  basicInsurance: boolean;
  housingOrRetirement: boolean;
  paidLeaveUsable: boolean;
  medicalOrCommercial: boolean;
  mealOrTransport: boolean;
  overtimeCompensation: boolean;
  otherBenefit: boolean;
}

export interface RiskFlags {
  salaryArrears: boolean;
  severeRoleMismatch: boolean;
  noWrittenAgreement: boolean;
  extremeSchedule: boolean;
}

export interface JobInput extends MoneyInput, TimeInput, ExperienceInput {
  benefits: BenefitFlags;
  risks: RiskFlags;
}

export interface DimensionScores {
  reward: number;
  time: number;
  boundary: number;
  growth: number;
  stability: number;
  freedom: number;
  benefit: number;
}

export interface WeightedPoints {
  reward: number;
  time: number;
  boundary: number;
  growth: number;
  stability: number;
  freedom: number;
  benefit: number;
}

export interface ScoreBreakdown {
  dimensions: DimensionScores;
  weighted: WeightedPoints;
  rawScore: number; // weighted sum before risk caps (0–100)
  finalScore: number; // after caps, rounded, clamped (0–100)
  appliedCaps: string[];
  rating: RatingId;
  annualCash: number;
  annualLoadHours: number;
  effectiveHourlyPay: number;
  targetAnnualCash: number;
}

export interface ModifierMatch {
  id: string;
  label: string;
  copy: string;
}

export interface Explanation {
  mainConclusion: string;
  quip: string;
  advantages: string[];
  losses: string[];
}

export interface FullResult {
  input: JobInput;
  breakdown: ScoreBreakdown;
  modifier: ModifierMatch | null;
  explanation: Explanation;
}

export const DEFAULT_JOB_INPUT: JobInput = {
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
  roleClarity: 0 as Level,
  afterHoursContact: 0 as Level,
  urgentTaskFrequency: 0 as Level,
  leaveDifficulty: 0 as Level,
  transferableSkill: 0 as Level,
  feedbackQuality: 0 as Level,
  promotionClarity: 0 as Level,
  resumeValue: 0 as Level,
  salaryReliability: 0 as Level,
  agreementClarity: 0 as Level,
  businessOutlook: 0 as Level,
  teamContinuity: 0 as Level,
  scheduleAutonomy: 0 as Level,
  workMethodAutonomy: 0 as Level,
  remoteFlexibility: 0 as Level,
  decisionVoice: 0 as Level,
  benefitCoverage: 0 as Level,
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
