import { RATING_IDS, getRatingRule } from "@/core/rating";
import { getRatingCopy } from "@/data/rating-copy";

export interface RatingDistributionItem {
  rating: string;
  count: number;
  percentage: number;
}

export interface RatingDistributionSummary {
  total: number;
  ratings: RatingDistributionItem[];
}

export interface RatingDistributionProps {
  total?: number;
  rows?: { id: string; zh: string; count: number; pct: number }[];
  youId?: string;
  summary?: RatingDistributionSummary | null;
  highlightRating?: string | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function RatingDistribution({
  total: propTotal,
  rows: propRows,
  youId: propYouId,
  summary,
  highlightRating,
  loading,
  error,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: RatingDistributionProps) {
  if (loading) {
    return <p className="muted">加载全站分布…</p>;
  }
  if (error) {
    return <p className="muted">暂时无法加载全站分布。</p>;
  }

  // Derive values from either design-draft props or workspace summary props
  let finalTotal = propTotal ?? 0;
  let finalRows: { id: string; zh: string; count: number; pct: number }[] = [];
  const finalYouId = propYouId ?? (highlightRating || undefined);

  if (propRows && propTotal !== undefined) {
    finalTotal = propTotal;
    finalRows = propRows;
  } else if (summary && summary.total > 0) {
    finalTotal = summary.total;
    finalRows = RATING_IDS.map((id) => {
      const rule = getRatingRule(id);
      const copy = getRatingCopy(id);
      const item = summary.ratings.find((r) => r.rating === id) ?? {
        rating: id,
        count: 0,
        percentage: 0,
      };
      return {
        id,
        zh: copy.zh,
        count: item.count,
        pct: item.percentage,
      };
    });
  } else {
    return <p className="muted">还没有人提交过评级，成为第一个吧。</p>;
  }

  return (
    <div
      className={["dist-block", className].filter(Boolean).join(" ")}
      data-component="RatingDistribution"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="dist-meta"
        data-qoder-id="qel-dist-meta-dd232981"
        data-qoder-source='{"qoderId":"qel-dist-meta-dd232981","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-meta","loc":{"line":652,"column":7}}'
      >
        <span
          className="dist-total"
          data-qoder-id="qel-dist-total-3f563ec4"
          data-qoder-source='{"qoderId":"qel-dist-total-3f563ec4","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-total","loc":{"line":653,"column":9}}'
        >
          共{" "}
          <strong
            data-qoder-id="qel-strong-883dc1b9"
            data-qoder-source='{"qoderId":"qel-strong-883dc1b9","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"strong","loc":{"line":653,"column":40}}'
          >
            {finalTotal.toLocaleString()}
          </strong>{" "}
          份评级
        </span>
        <span
          className="dist-legend"
          data-qoder-id="qel-dist-legend-658614ba"
          data-qoder-source='{"qoderId":"qel-dist-legend-658614ba","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-legend","loc":{"line":654,"column":9}}'
        >
          <span
            className="dist-legend-mark"
            data-qoder-id="qel-dist-legend-mark-03b41cd9"
            data-qoder-source='{"qoderId":"qel-dist-legend-mark-03b41cd9","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-legend-mark","loc":{"line":655,"column":11}}'
          />
          你的位置
        </span>
      </div>
      <div
        className="dist-list"
        data-qoder-id="qel-dist-list-c57c759a"
        data-qoder-source='{"qoderId":"qel-dist-list-c57c759a","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-list","loc":{"line":659,"column":7}}'
      >
        {finalRows.map((r) => (
          <div
            className={"dist-row" + (r.id === finalYouId ? " is-you" : "")}
            key={r.id}
            data-qoder-id="qel-div-3e7dc24b"
            data-qoder-source='{"qoderId":"qel-div-3e7dc24b","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"div","loc":{"line":661,"column":11}}'
          >
            <span
              className="bar-label"
              data-qoder-id="qel-bar-label-9cc6825e"
              data-qoder-source='{"qoderId":"qel-bar-label-9cc6825e","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"bar-label","loc":{"line":662,"column":13}}'
            >
              {r.zh}
              {r.id === finalYouId && (
                <span
                  className="you-mark"
                  data-qoder-id="qel-you-mark-62a579ac"
                  data-qoder-source='{"qoderId":"qel-you-mark-62a579ac","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"you-mark","loc":{"line":664,"column":34}}'
                >
                  你
                </span>
              )}
            </span>
            <div
              className="dist-bar"
              data-qoder-id="qel-dist-bar-7a4e0b41"
              data-qoder-source='{"qoderId":"qel-dist-bar-7a4e0b41","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"dist-bar","loc":{"line":666,"column":13}}'
            >
              <span
                style={{ width: r.pct + "%" }}
                data-qoder-id="qel-span-3667e86b"
                data-qoder-source='{"qoderId":"qel-span-3667e86b","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"span","loc":{"line":667,"column":15}}'
              />
            </div>
            <span
              className="bar-value"
              data-qoder-id="qel-bar-value-d04801b7"
              data-qoder-source='{"qoderId":"qel-bar-value-d04801b7","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"bar-value","loc":{"line":669,"column":13}}'
            >
              {r.count}
              <span
                className="bar-pct"
                data-qoder-id="qel-bar-pct-c6b0e942"
                data-qoder-source='{"qoderId":"qel-bar-pct-c6b0e942","filePath":"react-vite/src/App.jsx","componentName":"RatingDistribution","elementRole":"bar-pct","loc":{"line":671,"column":15}}'
              >
                {r.pct}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
