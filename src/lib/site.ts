/**
 * Site-wide constants (guide §13).
 * Static frontend (Vite): set VITE_SITE_URL / VITE_REPO_URL at build time
 * to the canonical origin and repository URL. No hardcoded production values.
 */

/** Vite injects import.meta.env.*; fall back to empty / placeholder when unset. */
const ENV = (import.meta.env ?? {}) as Record<string, string | undefined>;

export const SITE = {
  name: "牛马检测器",
  nameEn: "Job Beast Test",
  tagline: "测测这份岗位到底是什么物种",
  description:
    "牛马检测器通过收入、时间、边界、成长、稳定、自由和福利七个维度，给岗位生成一个娱乐向的含金量评级。评级从 Shareholder、Enjoyer，一直到 Volunteer 和 Loser。所有岗位输入默认在浏览器本地计算，服务器只接收最终评级。",
  // Build-time canonical origin. Leave empty in the public template;
  // set VITE_SITE_URL=https://your-domain.example when deploying.
  url: ENV.VITE_SITE_URL ?? "",
  version: "0.2.0",
  // Build-time repository URL. Override with VITE_REPO_URL in your deployment.
  repoUrl: ENV.VITE_REPO_URL ?? "https://github.com/your-name/your-repo",
} as const;

/** Dev-only flag. Vite inlines DEV=false in production builds (tree-shaken). */
export const IS_DEV = Boolean(ENV.DEV) || import.meta.env?.MODE !== "production";

export interface NavLink {
  href: string;
  label: string;
  devOnly?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "首页" },
  { href: "/score", label: "开始鉴定" },
  { href: "/about", label: "关于" },
  { href: "/tests", label: "测试", devOnly: true },
];
