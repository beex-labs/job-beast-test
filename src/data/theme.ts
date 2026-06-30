// 主题切换（指南 §10.4）：不依赖 next-themes。
// 选项：system / light / dark。持久化到 localStorage，初值在 index.html 中已应用。

export type ThemeChoice = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "job_beast_theme_v1";

export function getStoredThemeChoice(): ThemeChoice {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    // ignore
  }
  return "system";
}

export function systemPrefersDark(): boolean {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === "light" || choice === "dark") return choice;
  return systemPrefersDark() ? "dark" : "light";
}

export function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolved;
}

/** Set choice (persist) and apply. Pass "system" to clear stored pref. */
export function setTheme(choice: ThemeChoice): void {
  try {
    if (choice === "system") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, choice);
    }
  } catch {
    // ignore
  }
  applyTheme(resolveTheme(choice));
}

/** Subscribe to system changes; returns an unsubscribe fn. Only meaningful for "system". */
export function subscribeSystem(cb: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => cb();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
