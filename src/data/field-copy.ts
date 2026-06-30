import type { BenefitFlags, RiskFlags } from "@/core/types";

// Field metadata for the four-step form (guide §3.2 & §5.3).

export interface NumberFieldOption {
  value: number;
  label: string;
  desc?: string;
}

export interface NumberFieldDef {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  inputMode: "decimal" | "numeric";
  help?: string;
  defaultValue: number;
  /** When true, this field holds sensitive money and must be purged after scoring. */
  sensitive?: boolean;
  options?: NumberFieldOption[];
}

export interface LevelOption {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  desc?: string;
}

export interface LevelFieldDef {
  key: string;
  label: string;
  help?: string;
  /** Negative items: higher level means a worse condition (scorer reverses). */
  negative?: boolean;
  options: LevelOption[];
  defaultValue: 1 | 2 | 3 | 4 | 5;
}

export interface BenefitDef {
  key: keyof BenefitFlags;
  label: string;
  score: number;
  desc?: string;
}

export interface RiskDef {
  key: keyof RiskFlags;
  label: string;
  desc: string;
}

// Generic 1–5 option banks.
const POSITIVE_5: LevelOption[] = [
  { value: 1, label: "1 · 非常差", desc: "几乎没有" },
  { value: 2, label: "2 · 较差" },
  { value: 3, label: "3 · 一般" },
  { value: 4, label: "4 · 较好" },
  { value: 5, label: "5 · 非常好", desc: "稳定可靠" },
];

const NEGATIVE_5: LevelOption[] = [
  { value: 1, label: "1 · 几乎不", desc: "很少发生" },
  { value: 2, label: "2 · 偶尔" },
  { value: 3, label: "3 · 一般" },
  { value: 4, label: "4 · 较频繁" },
  { value: 5, label: "5 · 非常频繁", desc: "严重影响" },
];

// Option banks for pre-set intervals
const INCOME_OPTIONS: NumberFieldOption[] = [
  { value: 2000, label: "< 3K" },
  { value: 4000, label: "3K - 5K" },
  { value: 6500, label: "5K - 8K" },
  { value: 10000, label: "8K - 12K" },
  { value: 15000, label: "12K - 18K" },
  { value: 21500, label: "18K - 25K" },
  { value: 30000, label: "25K - 35K" },
  { value: 42500, label: "35K - 50K" },
  { value: 60000, label: "> 50K" },
];

const BONUS_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "无/极少" },
  { value: 3000, label: "< 5K" },
  { value: 10000, label: "5K - 15K" },
  { value: 22500, label: "15K - 30K" },
  { value: 45000, label: "30K - 60K" },
  { value: 80000, label: "60K - 100K" },
  { value: 120000, label: "> 100K" },
];

const ALLOWANCE_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "无" },
  { value: 100, label: "< 200" },
  { value: 350, label: "200 - 500" },
  { value: 750, label: "500 - 1K" },
  { value: 1500, label: "1K - 2K" },
  { value: 2500, label: "> 2K" },
];

const WORK_DAYS_OPTIONS: NumberFieldOption[] = [
  { value: 5, label: "5天及以下" },
  { value: 5.5, label: "5.5天" },
  { value: 6, label: "6天" },
  { value: 7, label: "7天" },
];

const WORK_HOURS_OPTIONS: NumberFieldOption[] = [
  { value: 5, label: "< 6小时" },
  { value: 7, label: "6 - 8小时" },
  { value: 8.5, label: "8 - 9小时" },
  { value: 9.5, label: "9 - 10小时" },
  { value: 11, label: "10 - 12小时" },
  { value: 13, label: "> 12小时" },
];

const COMMUTE_OPTIONS: NumberFieldOption[] = [
  { value: 0.25, label: "< 0.5小时" },
  { value: 0.75, label: "0.5 - 1小时" },
  { value: 1.25, label: "1 - 1.5小时" },
  { value: 1.75, label: "1.5 - 2小时" },
  { value: 2.5, label: "2 - 3小时" },
  { value: 3.5, label: "> 3小时" },
];

const REMOTE_DAYS_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "无远程" },
  { value: 1, label: "1天" },
  { value: 2.5, label: "2 - 3天" },
  { value: 4.5, label: "4 - 5天" },
  { value: 5, label: "全远程" },
];

const AFTER_HOURS_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "无" },
  { value: 1, label: "< 2小时" },
  { value: 3.5, label: "2 - 5小时" },
  { value: 7.5, label: "5 - 10小时" },
  { value: 15, label: "10 - 20小时" },
  { value: 25, label: "> 20小时" },
];

const WEEKEND_WORK_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "无" },
  { value: 1, label: "1天" },
  { value: 2, label: "2天" },
  { value: 3.5, label: "3 - 4天 (单休)" },
  { value: 6, label: "> 4天" },
];

const LEAVE_OPTIONS: NumberFieldOption[] = [
  { value: 2.5, label: "0 - 5天" },
  { value: 7.5, label: "5 - 10天" },
  { value: 12.5, label: "10 - 15天" },
  { value: 17.5, label: "15 - 20天" },
  { value: 25, label: "> 20天" },
];

const EXPERIENCE_OPTIONS: NumberFieldOption[] = [
  { value: 0, label: "应届生/无经验" },
  { value: 2, label: "1 - 3年" },
  { value: 4, label: "3 - 5年" },
  { value: 6.5, label: "5 - 8年" },
  { value: 10, label: "8 - 12年" },
  { value: 15, label: "> 12年" },
];

// Step 1 — 钱给多少
export const MONEY_FIELDS: NumberFieldDef[] = [
  {
    key: "monthlyTakeHome",
    label: "月到手收入",
    unit: "元/月",
    min: 0,
    max: 1_000_000,
    step: 100,
    inputMode: "decimal",
    help: "扣完社保公积金和个税后，每月实际到手的金额。",
    defaultValue: 12000,
    sensitive: true,
    options: INCOME_OPTIONS,
  },
  {
    key: "guaranteedAnnualBonus",
    label: "确定能拿到的年度奖金",
    unit: "元/年",
    min: 0,
    max: 1_000_000,
    step: 500,
    inputMode: "decimal",
    help: "只填写入合同或确定能拿到的奖金，不填“最高可达”的浮动收入。",
    defaultValue: 0,
    sensitive: true,
    options: BONUS_OPTIONS,
  },
  {
    key: "monthlyFixedAllowance",
    label: "每月固定补贴",
    unit: "元/月",
    min: 0,
    max: 100_000,
    step: 50,
    inputMode: "decimal",
    help: "每月固定发放的餐补、交通补贴等，不含需要垫付且不确定的报销。",
    defaultValue: 0,
    sensitive: true,
    options: ALLOWANCE_OPTIONS,
  },
  {
    key: "targetMonthlyTakeHome",
    label: "你认为可接受的月到手目标",
    unit: "元/月",
    min: 1,
    max: 1_000_000,
    step: 100,
    inputMode: "decimal",
    help: "用于计算收入是否达到你的个人标准，只在本机使用，不会上传。",
    defaultValue: 12000,
    sensitive: true,
    options: INCOME_OPTIONS,
  },
];

// Step 2 — 时间拿走多少
export const TIME_FIELDS: NumberFieldDef[] = [
  { key: "workDaysPerWeek", label: "每周工作天数", unit: "天/周", min: 0, max: 7, step: 1, inputMode: "numeric", help: "0–7。", defaultValue: 5, options: WORK_DAYS_OPTIONS },
  { key: "workHoursPerDay", label: "每天实际工作小时（不包含摸鱼、吃饭等）", unit: "小时/天", min: 0, max: 24, step: 0.5, inputMode: "decimal", defaultValue: 8, options: WORK_HOURS_OPTIONS },
  { key: "commuteHoursPerDay", label: "每天往返通勤小时", unit: "小时/天", min: 0, max: 12, step: 0.25, inputMode: "decimal", help: "单日往返总时长。", defaultValue: 1, options: COMMUTE_OPTIONS },
  { key: "remoteDaysPerWeek", label: "每周远程天数", unit: "天/周", min: 0, max: 7, step: 1, inputMode: "numeric", defaultValue: 0, options: REMOTE_DAYS_OPTIONS },
  { key: "afterHoursHoursPerWeek", label: "每周下班后待命/处理工作小时", unit: "小时/周", min: 0, max: 80, step: 0.5, inputMode: "decimal", defaultValue: 2, options: AFTER_HOURS_OPTIONS },
  { key: "weekendWorkDaysPerMonth", label: "每月被占用的周末天数", unit: "天/月", min: 0, max: 16, step: 1, inputMode: "numeric", defaultValue: 0, options: WEEKEND_WORK_OPTIONS },
  { key: "annualPaidLeaveDays", label: "每年可实际使用的带薪假天数", unit: "天/年", min: 0, max: 60, step: 1, inputMode: "numeric", defaultValue: 10, options: LEAVE_OPTIONS },
];

// Step 3 — 岗位像不像人干的
export const BOUNDARY_FIELDS: LevelFieldDef[] = [
  { key: "roleClarity", label: "职责是否清晰", negative: false, help: "是否清楚自己该做什么、不该做什么。", options: POSITIVE_5, defaultValue: 4 },
  { key: "afterHoursContact", label: "下班后是否经常被联系", negative: true, help: "越高表示越频繁被打扰。", options: NEGATIVE_5, defaultValue: 3 },
  { key: "urgentTaskFrequency", label: "临时任务是否频繁", negative: true, help: "越高表示越频繁被加活。", options: NEGATIVE_5, defaultValue: 3 },
  { key: "leaveDifficulty", label: "请假是否困难", negative: true, help: "越高表示越难请假。", options: NEGATIVE_5, defaultValue: 2 },
];

export const GROWTH_FIELDS: LevelFieldDef[] = [
  { key: "transferableSkill", label: "是否能学到可迁移技能", options: POSITIVE_5, defaultValue: 3 },
  { key: "feedbackQuality", label: "是否有人提供有效反馈", options: POSITIVE_5, defaultValue: 3 },
  { key: "promotionClarity", label: "晋升与涨薪路径是否清晰", options: POSITIVE_5, defaultValue: 3 },
  { key: "resumeValue", label: "履历是否具有一定市场价值", options: POSITIVE_5, defaultValue: 3 },
];

export const STABILITY_FIELDS: LevelFieldDef[] = [
  { key: "salaryReliability", label: "工资是否按时", options: POSITIVE_5, defaultValue: 5 },
  { key: "agreementClarity", label: "合同与用工是否清晰", options: POSITIVE_5, defaultValue: 4 },
  { key: "businessOutlook", label: "团队或业务前景是否稳定", options: POSITIVE_5, defaultValue: 3 },
  { key: "teamContinuity", label: "团队是否稳定（裁撤风险）", options: POSITIVE_5, defaultValue: 4 },
];

export const FREEDOM_FIELDS: LevelFieldDef[] = [
  { key: "scheduleAutonomy", label: "是否能自主安排时间", options: POSITIVE_5, defaultValue: 3 },
  { key: "workMethodAutonomy", label: "是否能自主选择工作方式", options: POSITIVE_5, defaultValue: 3 },
  { key: "remoteFlexibility", label: "是否支持远程或弹性", options: POSITIVE_5, defaultValue: 2 },
  { key: "decisionVoice", label: "是否有决策话语权", options: POSITIVE_5, defaultValue: 2 },
];

export const BENEFIT_FIELDS: BenefitDef[] = [
  { key: "basicInsurance", label: "基础保险或法定保障完整", score: 25, desc: "社保、医保等法定保障。" },
  { key: "housingOrRetirement", label: "住房、公积金或退休储蓄支持", score: 15 },
  { key: "paidLeaveUsable", label: "带薪年假可实际使用", score: 20, desc: "不是纸面上的天数，是能真正休到的。" },
  { key: "medicalOrCommercial", label: "医疗、商业保险或体检", score: 10 },
  { key: "mealOrTransport", label: "餐补、交通补贴或通勤支持", score: 10 },
  { key: "overtimeCompensation", label: "加班补偿或调休能兑现", score: 15 },
  { key: "otherBenefit", label: "其他真实可兑现福利", score: 5 },
];

// Step 4 — 风险确认
export const RISK_FIELDS: RiskDef[] = [
  { key: "salaryArrears", label: "近期是否出现工资拖欠", desc: "工资延迟或拖欠是最强风险信号。" },
  { key: "severeRoleMismatch", label: "实际职责与招聘描述严重不符", desc: "入职后发现工作内容完全不对。" },
  { key: "noWrittenAgreement", label: "正式用工但没有书面协议", desc: "没有合同保障的岗位风险极高。" },
  { key: "extremeSchedule", label: "长期日均工作超 12 小时或几乎没有完整休息日", desc: "极端工时会摧毁健康和判断力。" },
];

export interface FormStep {
  id: string;
  title: string;
  description: string;
}

export const FORM_STEPS: FormStep[] = [
  { id: "money", title: "钱给多少", description: "只填确定能拿到的现金，不填口头承诺。" },
  { id: "time", title: "时间拿走多少", description: "工时、通勤、待命和被占用的休息时间。" },
  { id: "boundary", title: "工作边界", description: "职责清晰、下班联系、临时任务、请假难度。" },
  { id: "growth", title: "成长价值", description: "技能、反馈、晋升路径与履历价值。" },
  { id: "stability", title: "稳定程度", description: "发薪、合同、业务前景与团队连续性。" },
  { id: "freedom", title: "自由程度", description: "时间、方式、远程与决策话语权。" },
  { id: "benefits", title: "福利体验", description: "只统计实际可兑现的福利。" },
  { id: "risk", title: "风险确认", description: "几项不能被高薪抵消的风险。" },
];

export const EXPERIENCE_YEARS_FIELD: NumberFieldDef = {
  key: "yearsOfExperience",
  label: "工作年限",
  unit: "年",
  min: 0,
  max: 50,
  step: 1,
  inputMode: "numeric",
  help: "仅用于“新手村神装”型号判定，不会上传。",
  defaultValue: 3,
  options: EXPERIENCE_OPTIONS,
};
