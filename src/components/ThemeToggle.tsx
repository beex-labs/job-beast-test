import { useEffect, useState } from "preact/hooks";
import {
  type ThemeChoice,
  getStoredThemeChoice,
  resolveTheme,
  setTheme as storeTheme,
  subscribeSystem,
  applyTheme,
} from "@/data/theme";

export interface ThemeToggleProps {
  theme?: string;
  onToggle?: () => void;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemeChoice, string> = {
  system: "跟随系统",
  light: "浅色",
  dark: "深色",
};

export function ThemeToggle({
  theme: propTheme,
  onToggle: propOnToggle,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ThemeToggleProps) {
  // If props are passed (e.g. from App/AppHeader), use them. Otherwise fall back to local state.
  const [localChoice, setLocalChoice] = useState<ThemeChoice>(() => getStoredThemeChoice());

  useEffect(() => {
    if (propTheme !== undefined) return;
    const apply = () => applyTheme(resolveTheme(localChoice));
    apply();
    if (localChoice === "system") {
      const unsub = subscribeSystem(apply);
      return unsub;
    }
    return;
  }, [localChoice, propTheme]);

  const activeTheme = propTheme ?? localChoice;
  const resolved = activeTheme === "system" ? resolveTheme("system") : activeTheme;

  const icon = activeTheme === "system" ? "🌗" : resolved === "dark" ? "🌙" : "☀";
  const label = activeTheme === "system" ? "跟随系统" : activeTheme === "light" ? "浅色" : "深色";

  const handleToggle = () => {
    if (propOnToggle) {
      propOnToggle();
    } else {
      const next = NEXT[localChoice];
      setLocalChoice(next);
      storeTheme(next);
    }
  };

  return (
    <button
      type="button"
      className={["theme-toggle", className].filter(Boolean).join(" ")}
      onClick={handleToggle}
      aria-label={`主题：${label}，点击切换`}
      title={`主题：${label}`}
      data-component="ThemeToggle"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      {icon}
    </button>
  );
}
