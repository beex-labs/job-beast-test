import { useEffect, useState } from "preact/hooks";
import {
  canUseRatingSubmissionStorage,
  getLocalRatingSubmission,
} from "@/infra/rating-submission-storage";
import {
  fetchRatingSummary,
  type RatingSummary,
} from "@/infra/rating-stats-client";
import { navigate } from "@/app/router";
import { RatingDistribution } from "@/components/RatingDistribution";

export function ReportPage() {
  const [gate] = useState(() => {
    const canStore = canUseRatingSubmissionStorage();
    const sub = canStore ? getLocalRatingSubmission() : null;
    return { gated: sub !== null, rating: sub ? sub.rating : null };
  });
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = () => {
    if (!gate.gated) return;
    setLoading(true);
    setError(null);
    fetchRatingSummary()
      .then((s) => {
        setSummary(s);
        if (!s) setError("暂时无法加载全站分布。");
        setLoading(false);
      })
      .catch(() => {
        setError("暂时无法加载全站分布。");
        setLoading(false);
      });
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gate.gated]);

  if (!gate.gated) {
    return (
      <main
        className="page-main"
        id="main"
        data-qoder-id="qel-main-825d47d7"
        data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"main","loc":{"line":1077,"column":5}}'
      >
        <div
          className="container page-section"
          data-component="ReportPage"
          data-qoder-id="qel-reportpage-bc1eb8a0"
          data-qoder-source='{"qoderId":"qel-reportpage-bc1eb8a0","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"reportpage","loc":{"line":1078,"column":7}}'
        >
          <div className="empty">
            <h1
              data-qoder-id="qel-h1-0ef29e90"
              data-qoder-source='{"qoderId":"qel-h1-0ef29e90","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"h1","loc":{"line":1080,"column":11}}'
            >
              全站分布
            </h1>
            <h2>尚未解锁</h2>
            <p className="muted">完成一次评级并允许上传后，才能查看全站分布。</p>
            <div className="btn-row" style={{ marginTop: "16px" }}>
              <button className="btn btn-primary" onClick={() => navigate("/score")}>
                去测一个
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="page-main"
      id="main"
      data-qoder-id="qel-main-825d47d7"
      data-qoder-source='{"qoderId":"qel-main-825d47d7","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"main","loc":{"line":1077,"column":5}}'
    >
      <div
        className="container page-section"
        data-component="ReportPage"
        data-qoder-id="qel-reportpage-bc1eb8a0"
        data-qoder-source='{"qoderId":"qel-reportpage-bc1eb8a0","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"reportpage","loc":{"line":1078,"column":7}}'
      >
        <div
          className="report-head"
          data-qoder-id="qel-report-head-1420e067"
          data-qoder-source='{"qoderId":"qel-report-head-1420e067","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"report-head","loc":{"line":1079,"column":9}}'
        >
          <h1
            data-qoder-id="qel-h1-0ef29e90"
            data-qoder-source='{"qoderId":"qel-h1-0ef29e90","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"h1","loc":{"line":1080,"column":11}}'
          >
            全站评级分布
          </h1>
          <button
            className="btn btn-ghost"
            onClick={reload}
            disabled={loading}
            aria-label="刷新全站分布"
            data-qoder-id="qel-btn-a0416245"
            data-qoder-source='{"qoderId":"qel-btn-a0416245","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"btn","loc":{"line":1081,"column":11}}'
          >
            {loading ? "加载中…" : "刷新"}
          </button>
        </div>
        <p
          className="muted"
          style={{ marginBottom: "24px" }}
          data-qoder-id="qel-muted-a14276ff"
          data-qoder-source='{"qoderId":"qel-muted-a14276ff","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"muted","loc":{"line":1083,"column":9}}'
        >
          以下是所有用户上传的评级汇总统计。数据匿名聚合，无法回溯到个人。
        </p>

        <RatingDistribution
          summary={summary}
          loading={loading}
          error={error}
          highlightRating={gate.rating}
          data-qoder-id="qel-ratingdistribution-38f58179"
          data-qoder-source='{"qoderId":"qel-ratingdistribution-38f58179","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"ratingdistribution","loc":{"line":1086,"column":9}}'
        />

        <section
          className="result-section"
          data-qoder-id="qel-result-section-9a914974"
          data-qoder-source='{"qoderId":"qel-result-section-9a914974","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"result-section","loc":{"line":1091,"column":9}}'
        >
          <h3
            data-qoder-id="qel-h3-164809ff"
            data-qoder-source='{"qoderId":"qel-h3-164809ff","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"h3","loc":{"line":1092,"column":11}}'
          >
            说明
          </h3>
          <p
            className="muted"
            style={{ lineHeight: "1.65" }}
            data-qoder-id="qel-muted-99402bd0"
            data-qoder-source='{"qoderId":"qel-muted-99402bd0","filePath":"react-vite/src/App.jsx","componentName":"ReportPage","elementRole":"muted","loc":{"line":1093,"column":11}}'
          >
            以上数据来自用户自愿上传的评级名称。服务器不存储任何原始输入数据。
            评级分布会随参与人数增加而变化，仅供参考。
          </p>
        </section>

        <div className="btn-row" style={{ marginTop: "24px" }}>
          <button className="btn btn-primary" onClick={() => navigate("/score")}>
            我也来测一个
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/result")}>
            回到我的结果
          </button>
        </div>
      </div>
    </main>
  );
}
