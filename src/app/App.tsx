import { h, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import { useRoute } from "@/app/router";
import { AppHeader } from "@/components/AppHeader";
import { SiteFooter } from "@/components/SiteFooter";
import HomePage from "@/pages/HomePage";
import { AssessmentPage } from "@/pages/AssessmentPage";
import { ResultPage } from "@/pages/ResultPage";
import { ReportPage } from "@/pages/ReportPage";
import AboutPage from "@/pages/AboutPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TestsPage from "@/pages/TestsPage";
import { IS_DEV } from "@/lib/site";

function NotFound() {
  return (
    <main class="page-main">
      <div class="container page-section">
        <div class="empty">
          <h2>页面不存在</h2>
          <p class="muted">这里没有东西，<a href="/">回到首页</a>。</p>
        </div>
      </div>
    </main>
  );
}

export function App() {
  const { path } = useRoute();

  // Keep document.title in sync with the route.
  useEffect(() => {
    const base = "牛马检测器 · Job Beast Test";
    const map: Record<string, string> = {
      "/": `${base}`,
      "/score": `开始鉴定 · ${base}`,
      "/result": `你的评级 · ${base}`,
      "/report": `全站分布 · ${base}`,
      "/about": `关于 · ${base}`,
      "/privacy": `隐私说明 · ${base}`,
      "/tests": `测试 · ${base}`,
    };
    document.title = map[path] ?? base;
    // Scroll to top on route change (not on hash-only share navigation).
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [path]);

  let page: preact.JSX.Element;
  switch (path) {
    case "/":
      page = <HomePage />;
      break;
    case "/score":
      page = <AssessmentPage />;
      break;
    case "/result":
      page = <ResultPage />;
      break;
    case "/report":
      page = <ReportPage />;
      break;
    case "/about":
      page = <AboutPage />;
      break;
    case "/privacy":
      page = <PrivacyPage />;
      break;
    case "/tests":
      page = IS_DEV ? <TestsPage /> : <NotFound />;
      break;
    default:
      page = <NotFound />;
  }

  return (
    <Fragment>
      <a class="skip-link" href="#main">跳到主要内容</a>
      <AppHeader currentPath={path} />
      {page}
      <SiteFooter />
    </Fragment>
  );
}
