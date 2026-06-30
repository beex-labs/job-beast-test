// Special model (型号) labels & copy (guide §4).
// Triggers live in src/core/modifiers.ts; copy is centralised here.

export interface ModifierCopy {
  id: string;
  label: string;
  copy: string;
}

export const MODIFIER_COPY: Record<string, ModifierCopy> = {
  high_pay_burnout: {
    id: "high_pay_burnout",
    label: "高薪燃烧型 Offer",
    copy: "钱给得确实多，所以每次想离职时都会先打开银行卡余额。",
  },
  rmb_painkiller: {
    id: "rmb_painkiller",
    label: "人民币止痛型",
    copy: "工资能缓解一部分痛苦，但不能治疗下班待命和临时加活。",
  },
  five_pm_vanishing: {
    id: "five_pm_vanishing",
    label: "五点消失型",
    copy: "到点之后，人和工作消息至少有一个会消失。",
  },
  high_pay_beast: {
    id: "high_pay_beast",
    label: "高薪牛马",
    copy: "你是一匹吃精饲料的牛马，但仍然是牛马。",
  },
  low_pay_early_retire: {
    id: "low_pay_early_retire",
    label: "低薪养老",
    copy: "钱不多，事也不多。适合恢复生命值，不适合恢复银行卡余额。",
  },
  newbie_godly_gear: {
    id: "newbie_godly_gear",
    label: "新手村神装",
    copy: "别人刚出新手村还在捡木棍，你已经拿到了发光装备。",
  },
};

// Fixed evaluation order (guide §4: 标签匹配顺序固定，最多展示一个主型号).
export const MODIFIER_ORDER: string[] = [
  "high_pay_burnout",
  "rmb_painkiller",
  "five_pm_vanishing",
  "high_pay_beast",
  "low_pay_early_retire",
  "newbie_godly_gear",
];

export function getModifierCopy(id: string): ModifierCopy | null {
  return MODIFIER_COPY[id] ?? null;
}
