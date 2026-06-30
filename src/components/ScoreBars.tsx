import type { DimensionScores } from "@/core/types";

export interface ScoreBarsProps {
  dimensions: DimensionScores;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

const LABELS = {
  reward: "收入回报",
  time: "时间消耗",
  boundary: "工作边界",
  growth: "成长价值",
  stability: "稳定程度",
  freedom: "自由程度",
  benefit: "福利体验",
};

export function ScoreBars({
  dimensions,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ScoreBarsProps) {
  // Order of display matches the keys of LABELS
  const entries = (Object.keys(LABELS) as Array<keyof typeof LABELS>).map((key) => {
    return [key, dimensions[key]] as [keyof typeof LABELS, number];
  });

  return (
    <div
      className={["score-bars", className].filter(Boolean).join(" ")}
      data-component="ScoreBars"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      {entries.map(([key, val]) => (
        <div
          className="score-bar"
          key={key}
          data-qoder-id="qel-score-bar-69a0f1be"
          data-qoder-source='{"qoderId":"qel-score-bar-69a0f1be","filePath":"react-vite/src/App.jsx","componentName":"ScoreBars","elementRole":"score-bar","loc":{"line":606,"column":9}}'
        >
          <span
            className="bar-label"
            data-qoder-id="qel-bar-label-dedb7da8"
            data-qoder-source='{"qoderId":"qel-bar-label-dedb7da8","filePath":"react-vite/src/App.jsx","componentName":"ScoreBars","elementRole":"bar-label","loc":{"line":607,"column":11}}'
          >
            {LABELS[key]}
          </span>
          <div
            className="bar-track"
            data-qoder-id="qel-bar-track-972968cf"
            data-qoder-source='{"qoderId":"qel-bar-track-972968cf","filePath":"react-vite/src/App.jsx","componentName":"ScoreBars","elementRole":"bar-track","loc":{"line":608,"column":11}}'
          >
            <div
              className="bar-fill"
              style={{ width: Math.round(val) + "%" }}
              data-qoder-id="qel-bar-fill-babac7b8"
              data-qoder-source='{"qoderId":"qel-bar-fill-babac7b8","filePath":"react-vite/src/App.jsx","componentName":"ScoreBars","elementRole":"bar-fill","loc":{"line":609,"column":13}}'
            />
          </div>
          <span
            className="bar-value"
            data-qoder-id="qel-bar-value-1dfc03c0"
            data-qoder-source='{"qoderId":"qel-bar-value-1dfc03c0","filePath":"react-vite/src/App.jsx","componentName":"ScoreBars","elementRole":"bar-value","loc":{"line":611,"column":11}}'
          >
            {Math.round(val)}
          </span>
        </div>
      ))}
    </div>
  );
}
