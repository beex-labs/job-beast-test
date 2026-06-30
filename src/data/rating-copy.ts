import type { RatingId } from "@/core/types";

// Display copy for each rating tier (guide §2.1 & §2.3).
// Stable IDs live in beex-module/core; display text is centralised here.
export interface RatingCopy {
  id: RatingId;
  label: string;
  zh: string;
  summary: string;
  /** 主文案 (guide §2.3). */
  mainCopy: string;
  /** 短句候选 (guide §2.3); empty when the guide gives none. */
  shortQuips: string[];
  /** CSS utility for the sticker background (see globals.css). */
  stickerClass: string;
}

export const RATING_COPY: Record<RatingId, RatingCopy> = {
  shareholder: {
    id: "shareholder",
    label: "Shareholder",
    zh: "Shareholder",
    summary: "条件好到不像来打工，更像每天到公司查看自己的产业。",
    mainCopy:
      "你不是来上班的，你是来巡视产业的。工资像分红，福利像股东权益，下班时间还真正属于自己。",
    shortQuips: [
      "公司是大家的，待遇像是你的。",
      "建议检查劳动合同，确认自己没有被写进股东名册。",
      "别人汇报工作，你像在听经营简报。",
    ],
    stickerClass: "rating-sticker-shareholder",
  },
  enjoyer: {
    id: "enjoyer",
    label: "Enjoyer",
    zh: "Enjoyer",
    summary: "别人在工位渡劫，你居然在飞升。",
    mainCopy:
      "别人在工位渡劫，你居然能从工作中获得快乐。钱、时间和成长至少有两项明显在线。",
    shortQuips: [
      "全网罕见的自愿上班人类。",
      "别人在等下班，你偶尔会觉得今天过得太快。",
      "朋友听完待遇后，已经开始整理简历。",
    ],
    stickerClass: "rating-sticker-enjoyer",
  },
  offer: {
    id: "offer",
    label: "Offer",
    zh: "Offer",
    summary: "达到值得认真考虑的水平",
    mainCopy: "恭喜，这确实配得上叫 Offer。它不一定完美，但已经值得认真比较和考虑。",
    shortQuips: [],
    stickerClass: "rating-sticker-offer",
  },
  worker: {
    id: "worker",
    label: "Worker",
    zh: "Worker",
    summary: "正常劳动换正常回报",
    mainCopy:
      "一份标准劳动交换：你提供时间，公司支付回报，双方暂时都没有把对方当慈善机构。",
    shortQuips: [],
    stickerClass: "rating-sticker-worker",
  },
  joker: {
    id: "joker",
    label: "Joker",
    zh: "Joker",
    summary: "表面看着能干，细算让人笑不出来。小丑竟是我自己。",
    mainCopy:
      "第一眼好像还能接受，仔细一算发现笑点来自自己。",
    shortQuips: [],
    stickerClass: "rating-sticker-joker",
  },
  loser: {
    id: "loser",
    label: "Loser",
    zh: "Loser",
    summary: "钱、时间和机会成本一起输掉",
    mainCopy: "失去的不只是时间，还有本可以选择其他岗位的机会成本。",
    shortQuips: [],
    stickerClass: "rating-sticker-loser",
  },
  volunteer: {
    id: "volunteer",
    label: "Volunteer",
    zh: "Volunteer",
    summary: "工资更像象征性感谢",
    mainCopy: "公司用工资象征性表达感谢，岗位实际运行方式更接近长期公益活动。",
    shortQuips: [],
    stickerClass: "rating-sticker-volunteer",
  },
  beast_of_burden: {
    id: "beast_of_burden",
    label: "mer~",
    zh: "mer~",
    summary: "已进入牛马化，但还没彻底失去体面",
    mainCopy:
      "公司提供磨盘，你负责自己长草。建议优先研究退出路线，而不是继续研究忍耐技巧。",
    shortQuips: [],
    stickerClass: "rating-sticker-beast_of_burden",
  },
};

export function getRatingCopy(id: RatingId): RatingCopy {
  return RATING_COPY[id];
}
