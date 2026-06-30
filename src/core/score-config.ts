// Centralised weights and coefficients.
// Per the guide: coefficients must live here, never inside page components.

export const DIMENSION_WEIGHTS = {
  reward: 0.3,
  time: 0.18,
  boundary: 0.14,
  growth: 0.12,
  stability: 0.1,
  freedom: 0.08,
  benefit: 0.08,
} as const;

export const REWARD_WEIGHTS = {
  cashTarget: 0.5,
  hourly: 0.35,
  certainty: 0.15,
} as const;

export const BOUNDARY_WEIGHTS = {
  roleClarity: 0.25,
  afterHoursContact: 0.3,
  urgentTaskFrequency: 0.25,
  leaveDifficulty: 0.2,
} as const;

export const GROWTH_WEIGHTS = {
  transferableSkill: 0.35,
  feedbackQuality: 0.25,
  promotionClarity: 0.2,
  resumeValue: 0.2,
} as const;

export const STABILITY_WEIGHTS = {
  salaryReliability: 0.35,
  agreementClarity: 0.2,
  businessOutlook: 0.25,
  teamContinuity: 0.2,
} as const;

export const FREEDOM_WEIGHTS = {
  scheduleAutonomy: 0.35,
  workMethodAutonomy: 0.3,
  remoteFlexibility: 0.2,
  decisionVoice: 0.15,
} as const;

export const BENEFIT_SCORES = {
  basicInsurance: 25,
  housingOrRetirement: 15,
  paidLeaveUsable: 20,
  medicalOrCommercial: 10,
  mealOrTransport: 10,
  overtimeCompensation: 15,
  otherBenefit: 5,
} as const;

export const TIME_COEFS = {
  commuteWeight: 0.5,
  afterHoursWeight: 0.8,
  standardDailyHours: 7.5,
  dailyLoadPenaltyPerHour: 10,
  extraDayPenalty: 14,
  weekendPenaltyPerDay: 4,
  leaveBonusPerDay: 0.8,
  leaveBonusCapDays: 20,
  weeksPerYear: 52,
  standardWeekHours: 5 * 8,
  weekendHoursCapPerDay: 10,
} as const;

export const RISK_CAPS = {
  salaryArrears: 44,
  extremeSchedule: 57,
  noWrittenAgreement: 57,
  roleMismatchPenalty: 10,
  roleMismatchCap: 69,
} as const;

// Certainty tiers for the reward dimension (see guide 3.6).
export const CERTAINTY_TIERS = {
  paidOnTimeFixedCash: 100,
  mostlyFixedSlightBonusVolatility: 75,
  opaqueOrVerbal: 45,
  arrearsOrSevere: 10,
} as const;
