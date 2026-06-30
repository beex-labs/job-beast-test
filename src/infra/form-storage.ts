// 表单草稿持久化（指南 §5.3、§11.5）。
// 滑块高频变化时不再每次同步写 sessionStorage：内存更新 + 停止滑动 250ms 后落盘，
// 切换步骤或 pagehide 时立即 flush。money 与原始答案仅本机使用，不上传。

import type { JobInput } from "@/core/types";
import { SESSION_KEYS, readSession, removeSession, writeSession } from "@/infra/storage";

export interface FormDraft {
  step: number;
  input: JobInput;
}

const DEBOUNCE_MS = 250;
let pendingDraft: FormDraft | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

export function readDraft(): FormDraft | null {
  return readSession<FormDraft>(SESSION_KEYS.formDraft);
}

/** 立即同步写入（切换步骤、提交、pagehide 时使用）。 */
export function writeDraftSync(draft: FormDraft): void {
  pendingDraft = null;
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  writeSession(SESSION_KEYS.formDraft, draft);
}

/**
 * 防抖写入：滑块/选项高频变化时只更新内存中的待写草稿，
 * 停止变化 DEBOUNCE_MS 后真正写 sessionStorage。
 */
export function scheduleDraftWrite(draft: FormDraft): void {
  pendingDraft = draft;
  if (timer !== null) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    if (pendingDraft !== null) {
      writeSession(SESSION_KEYS.formDraft, pendingDraft);
      pendingDraft = null;
    }
  }, DEBOUNCE_MS);
}

/** 取消待写并立即落盘（用于 pagehide / visibilitychange hidden）。 */
export function flushDraft(): void {
  if (pendingDraft !== null) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    writeSession(SESSION_KEYS.formDraft, pendingDraft);
    pendingDraft = null;
  }
}

export function clearDraft(): void {
  pendingDraft = null;
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  removeSession(SESSION_KEYS.formDraft);
}
