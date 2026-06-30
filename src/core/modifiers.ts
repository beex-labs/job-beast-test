// 牛马检测器型号匹配（指南 §4）：按固定顺序匹配，最多返回首个命中型号。

import type {
  JobInput,
  ModifierMatch,
  ScoreBreakdown,
} from "@/core/types";
import { MODIFIER_COPY, MODIFIER_ORDER } from "@/data/modifier-copy";

type ModifierTest = (breakdown: ScoreBreakdown, input: JobInput) => boolean;

// 各型号触发条件（指南 §4），按 MODIFIER_ORDER 顺序评估。
const MODIFIER_TESTS: Partial<Record<string, ModifierTest>> = {
  high_pay_burnout: (d) => d.dimensions.reward >= 80 && d.dimensions.time <= 35,
  rmb_painkiller: (d) => d.dimensions.reward >= 70 && d.dimensions.boundary <= 45,
  five_pm_vanishing: (d) => d.dimensions.time >= 85 && d.dimensions.boundary >= 80,
  high_pay_beast: (d) =>
    d.dimensions.reward >= 80 && d.dimensions.time <= 20 && d.dimensions.boundary <= 25,
  low_pay_early_retire: (d) =>
    d.dimensions.reward <= 40 &&
    d.dimensions.time >= 80 &&
    d.dimensions.stability >= 75,
  newbie_godly_gear: (d, input) =>
    input.yearsOfExperience <= 1 &&
    d.dimensions.growth >= 85 &&
    d.finalScore >= 75,
};

/**
 * 匹配首个命中的型号，返回其文案副本（拷贝对象，避免外部 mutation）。
 * 都不命中返回 null。
 */
export function matchModifier(
  breakdown: ScoreBreakdown,
  input: JobInput,
): ModifierMatch | null {
  for (const id of MODIFIER_ORDER) {
    const test = MODIFIER_TESTS[id];
    if (test && test(breakdown, input)) {
      const copy = MODIFIER_COPY[id];
      if (copy) {
        return { id: copy.id, label: copy.label, copy: copy.copy };
      }
    }
  }
  return null;
}
