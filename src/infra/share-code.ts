// 分享编码（指南 §9.1–9.2）。
// 分享数据绝不包含金额、公司、城市、目标收入、原始答案、访客标识。

import type { RatingId } from "@/core/types";
import { isRatingId } from "@/core/rating";
import { RATING_IDS } from "@/core/rating";
import { MODIFIER_ORDER } from "@/data/modifier-copy";
import { clamp } from "@/core/utils";

export interface SharedResultV1 {
  v: 1;
  score: number; // 0–100
  rating: RatingId;
  modifier?: string; // modifier id 或 undefined
  dimensions: {
    reward: number;
    time: number;
    boundary: number;
    growth: number;
    stability: number;
    freedom: number;
    benefit: number;
  };
}

type DimensionKey =
  | "reward"
  | "time"
  | "boundary"
  | "growth"
  | "stability"
  | "freedom"
  | "benefit";

const DIMENSION_KEYS: readonly DimensionKey[] = [
  "reward",
  "time",
  "boundary",
  "growth",
  "stability",
  "freedom",
  "benefit",
];

/** v1 Base64URL 编码（向后兼容旧链接，新分享改用 encodeShare 紧凑格式）。 */
function encodeShareV1(result: SharedResultV1): string {
  try {
    const json = JSON.stringify(result);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

/**
 * 反向解码：自动识别 v2（二进制，前缀 "2"）与 v1（JSON + Base64URL）。
 * 严格校验各字段并 clamp 0–100；任何不合法返回 null，损坏 payload 友好失败不抛错。
 */
export function decodeShare(payload: string): SharedResultV1 | null {
  if (typeof payload !== "string" || payload.length === 0) return null;
  // v2: 以 "2" 开头，后接 base64url 编码的 9 字节二进制。
  if (payload.charCodeAt(0) === 50 /* "2" */) {
    return decodeShareV2(payload.slice(1));
  }
  return decodeShareV1(payload);
}

/** v2 二进制紧凑编码：9 字节 → base64url，前缀 "2"。 */
export function encodeShare(result: SharedResultV1): string {
  try {
    const bytes = new Uint8Array(9);
    bytes[0] = clamp(result.score);
    const ratingIdx = RATING_IDS.indexOf(result.rating);
    if (ratingIdx < 0) return "";
    const modifierIdx = result.modifier
      ? MODIFIER_ORDER.indexOf(result.modifier) + 1
      : 0;
    if (modifierIdx < 0 || modifierIdx > 7) return "";
    bytes[1] = (ratingIdx << 4) | (modifierIdx & 0x0f);
    const dims = DIMENSION_KEYS.map((k) => result.dimensions[k]);
    for (let i = 0; i < 7; i++) {
      bytes[2 + i] = clamp(dims[i]);
    }
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return "2" + base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeShareV2(payload: string): SharedResultV1 | null {
  try {
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const binary = atob(base64);
    if (binary.length < 9) return null;
    const bytes = new Uint8Array(9);
    for (let i = 0; i < 9; i++) bytes[i] = binary.charCodeAt(i);
    const score = clamp(bytes[0]);
    const ratingIdx = bytes[1] >> 4;
    const modifierIdx = bytes[1] & 0x0f;
    if (ratingIdx < 0 || ratingIdx >= RATING_IDS.length) return null;
    if (modifierIdx < 0 || modifierIdx > MODIFIER_ORDER.length) return null;
    const dimensions = {} as Record<DimensionKey, number>;
    for (let i = 0; i < 7; i++) {
      dimensions[DIMENSION_KEYS[i]] = clamp(bytes[2 + i]);
    }
    return {
      v: 1,
      score,
      rating: RATING_IDS[ratingIdx],
      modifier: modifierIdx > 0 ? MODIFIER_ORDER[modifierIdx - 1] : undefined,
      dimensions,
    };
  } catch {
    return null;
  }
}

function decodeShareV1(payload: string): SharedResultV1 | null {
  try {
    let base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // 补齐结尾 = 以便 atob 正常工作
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const json = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;
    const obj = parsed as Record<string, unknown>;
    if (obj.v !== 1) return null;
    if (typeof obj.score !== "number" || !Number.isFinite(obj.score)) return null;
    if (!isRatingId(obj.rating)) return null;
    if (obj.modifier !== undefined && typeof obj.modifier !== "string") return null;
    if (typeof obj.dimensions !== "object" || obj.dimensions === null) return null;
    const dims = obj.dimensions as Record<string, unknown>;
    const dimensions = {} as Record<DimensionKey, number>;
    for (const key of DIMENSION_KEYS) {
      const val = dims[key];
      if (typeof val !== "number" || !Number.isFinite(val)) return null;
      dimensions[key] = clamp(val);
    }
    return {
      v: 1,
      score: clamp(obj.score),
      rating: obj.rating,
      modifier: typeof obj.modifier === "string" ? obj.modifier : undefined,
      dimensions,
    };
  } catch {
    return null;
  }
}

/** 组装 v1 结构，所有维度分数 clamp 0–100。appliedCaps 不进入分享数据。 */
export function buildShareFromBreakdown(
  breakdown: {
    finalScore: number;
    rating: RatingId;
    dimensions: {
      reward: number;
      time: number;
      boundary: number;
      growth: number;
      stability: number;
      freedom: number;
      benefit: number;
    };
    appliedCaps?: string[];
  },
  modifierId?: string | null
): SharedResultV1 {
  const result: SharedResultV1 = {
    v: 1,
    score: clamp(breakdown.finalScore),
    rating: breakdown.rating,
    dimensions: {
      reward: clamp(breakdown.dimensions.reward),
      time: clamp(breakdown.dimensions.time),
      boundary: clamp(breakdown.dimensions.boundary),
      growth: clamp(breakdown.dimensions.growth),
      stability: clamp(breakdown.dimensions.stability),
      freedom: clamp(breakdown.dimensions.freedom),
      benefit: clamp(breakdown.dimensions.benefit),
    },
  };
  if (modifierId) {
    result.modifier = modifierId;
  }
  return result;
}
