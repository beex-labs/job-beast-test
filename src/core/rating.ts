// 评级体系覆盖（调整顺序：Shareholder→Enjoyer→Offer→Worker→mer~→Joker→Volunteer→Loser）。
// 合并自 beex-module 的 RatingRule/isRatingId，统一在本文件定义，不再依赖 beex-module。
// 评级 ID 值不变（RatingId union 类型不受影响），仅顺序与区间重新分配。

import type { RatingId } from "./types";
import { clamp, roundScore } from "./utils";

export interface RatingRule {
  id: RatingId;
  label: string;
  zh: string;
  min: number;
  max: number;
  summary: string;
  mainCopy: string;
  stickerClass: string;
}

// 新顺序：beast_of_burden(mers) 移到 Worker 之后，Loser 移到最后。
export const RATING_RULES: readonly RatingRule[] = [
  {
    id: "shareholder",
    label: "Shareholder",
    zh: "Shareholder",
    min: 90,
    max: 100,
    summary: "条件好到不像来打工，更像每天到公司查看自己的产业。",
    mainCopy: "你不是来上班的，你是来巡视产业的。工资像分红，福利像股东权益，下班时间还真正属于自己。",
    stickerClass: "sticker-shareholder",
  },
  {
    id: "enjoyer",
    label: "Enjoyer",
    zh: "Enjoyer",
    min: 80,
    max: 89,
    summary: "别人在工位渡劫，你居然在飞升。",
    mainCopy: "别人在工位渡劫，你居然能从工作中获得快乐。钱、时间和成长至少有两项明显在线。",
    stickerClass: "sticker-enjoyer",
  },
  {
    id: "offer",
    label: "Offer",
    zh: "Offer",
    min: 70,
    max: 79,
    summary: "达到值得认真考虑的水平",
    mainCopy: "恭喜，这确实配得上叫 Offer。它不一定完美，但已经值得认真比较和考虑。",
    stickerClass: "sticker-offer",
  },
  {
    id: "worker",
    label: "Worker",
    zh: "Worker",
    min: 58,
    max: 69,
    summary: "正常劳动换正常回报",
    mainCopy: "一份 standard 劳动交换：你提供时间，公司支付回报，双方暂时都没有把对方当慈善机构。",
    stickerClass: "sticker-worker",
  },
  {
    id: "beast_of_burden",
    label: "mer~",
    zh: "mer~",
    min: 46,
    max: 57,
    summary: "已进入牛马化，但还没彻底失去体面",
    mainCopy: "公司提供磨盘，你负责自己长草。建议优先研究退出路线，而不是继续研究忍耐技巧。",
    stickerClass: "sticker-beast_of_burden",
  },
  {
    id: "joker",
    label: "Joker",
    zh: "Joker",
    min: 34,
    max: 45,
    summary: "表面看着能干，细算让人笑不出来。小丑竟是我自己。",
    mainCopy: "第一眼好像还能接受，仔细一算发现笑点来自自己。",
    stickerClass: "sticker-joker",
  },
  {
    id: "volunteer",
    label: "Volunteer",
    zh: "Volunteer",
    min: 18,
    max: 33,
    summary: "工资更像象征性感谢",
    mainCopy: "公司用工资象征性表达感谢，岗位实际运行方式更接近长期公益活动。",
    stickerClass: "sticker-volunteer",
  },
  {
    id: "loser",
    label: "Loser",
    zh: "Loser",
    min: 0,
    max: 17,
    summary: "钱、时间和机会成本一起输掉",
    mainCopy: "失去的不只是时间，还有本可以选择其他岗位的机会成本。",
    stickerClass: "sticker-loser",
  },
];

// 固定显示顺序（高→低）。
export const RATING_IDS: readonly RatingId[] = RATING_RULES.map(
  (r) => r.id
) as readonly RatingId[];

export function isRatingId(value: unknown): value is RatingId {
  return typeof value === "string" && RATING_RULES.some((r) => r.id === value);
}

export function getRatingRule(id: RatingId): RatingRule {
  return RATING_RULES.find((r) => r.id === id) ?? RATING_RULES[0];
}

// 分数→评级（新映射：46-57→mer~, 34-45→Joker, 18-33→Volunteer, 0-17→Loser）。
export function getRating(score: number): RatingId {
  const value = roundScore(clamp(score));
  if (value >= 90) return "shareholder";
  if (value >= 80) return "enjoyer";
  if (value >= 70) return "offer";
  if (value >= 58) return "worker";
  if (value >= 46) return "beast_of_burden"; // mer~
  if (value >= 34) return "joker";
  if (value >= 18) return "volunteer";
  return "loser";
}
