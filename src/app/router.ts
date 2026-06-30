// 轻量路由：原生 History API + popstate。无路由库依赖（指南 §3.1）。
// 仅 hash 之外支持 pathname，SPA fallback 由 Nginx 处理。

import { useEffect, useState } from "preact/hooks";

export interface RouteState {
  path: string;
}

function currentPath(): string {
  if (typeof window === "undefined") return "/";
  // We use pathname for the main app; share codes use location.hash (#r=...).
  return window.location.pathname || "/";
}

export function navigate(path: string, replace = false): void {
  if (typeof window === "undefined") return;
  if (replace) {
    window.history.replaceState({}, "", path);
  } else {
    window.history.pushState({}, "", path);
  }

  const notify = () => {
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  // The assessment queues its upload in a microtask after calling navigate.
  // Defer rendering the result route so the request is started first in
  // browsers (notably WeChat's webview) that may interrupt pending work.
  if (path === "/result") {
    window.setTimeout(notify, 0);
    return;
  }

  // Notify listeners — pushState/replaceState don't fire popstate.
  notify();
}

export function useRoute(): RouteState {
  const [path, setPath] = useState<string>(() => currentPath());
  useEffect(() => {
    const onChange = () => setPath(currentPath());
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return { path };
}

/** Read the share code from `#r=...` (kept in hash so it survives static hosts). Disallowed to preserve privacy. */
export function readShareCodeFromHash(): string | null {
  return null;
}

export function buildShareLink(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.origin}/`;
}
