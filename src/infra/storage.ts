// 通用 sessionStorage/localStorage 安全包装（指南 §5.3、§8.1）。
// 首次浏览器评级提交标记由独立文件 rating-submission-storage.ts 管理，此处不重复。

export const SESSION_KEYS = {
  formDraft: "job_beast_form_draft_v1",
  currentResult: "job_beast_current_result_v1",
} as const;

export const LOCAL_KEYS = {
  disclaimerSeen: "job_beast_disclaimer_seen_v1",
} as const;

const PROBE_KEY = "job_beast_probe";

/** 探测式：setItem 探针再 removeItem，失败返回 false。SSR 返回 false。 */
export function canUseSessionStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(PROBE_KEY, "1");
    window.sessionStorage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** 探测式：setItem 探针再 removeItem，失败返回 false。SSR 返回 false。 */
export function canUseLocalStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(PROBE_KEY, "1");
    window.localStorage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function readSession<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeSession(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // 静默忽略
  }
}

export function readLocal<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeLocal(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeLocal(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // 静默忽略
  }
}
