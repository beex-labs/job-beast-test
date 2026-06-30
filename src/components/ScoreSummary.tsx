import type { RatingRule } from "@/core/rating";

export interface ScoreSummaryProps {
  score: number;
  ratingLabel?: string;
  ratingZh?: string;
  modifierLabel?: string | null;
  quip?: string;
  rating?: RatingRule;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function ScoreSummary({
  score,
  ratingLabel,
  ratingZh,
  modifierLabel,
  quip,
  rating,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ScoreSummaryProps) {
  // Use properties from rating object if available, otherwise fall back to discrete props
  const zh = rating ? rating.zh : (ratingZh ?? "");
  const stickerClass = rating ? rating.stickerClass : `sticker-${ratingLabel?.toLowerCase() || "worker"}`;
  const label = rating ? rating.label : (ratingLabel ?? "");
  const summary = rating ? rating.summary : (quip ?? "");

  return (
    <div
      className={["result-hero", className].filter(Boolean).join(" ")}
      data-component="ScoreSummary"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <span
        className={`eyebrow sticker ${stickerClass}`}
        data-qoder-id="qel-span-29e0d5fb"
        data-qoder-source='{"qoderId":"qel-span-29e0d5fb","filePath":"react-vite/src/App.jsx","componentName":"ScoreSummary","elementRole":"span","loc":{"line":621,"column":7}}'
      >
        {zh}
      </span>
      <div
        className="score-big"
        data-qoder-id="qel-score-big-72393614"
        data-qoder-source='{"qoderId":"qel-score-big-72393614","filePath":"react-vite/src/App.jsx","componentName":"ScoreSummary","elementRole":"score-big","loc":{"line":622,"column":7}}'
      >
        {Math.round(score)}
      </div>
      <p
        className="muted"
        style={{
          marginTop: "12px",
          maxWidth: "32ch",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        data-qoder-id="qel-muted-3c397cdc"
        data-qoder-source='{"qoderId":"qel-muted-3c397cdc","filePath":"react-vite/src/App.jsx","componentName":"ScoreSummary","elementRole":"muted","loc":{"line":623,"column":7}}'
      >
        {summary}
        {modifierLabel ? ` · ${modifierLabel}` : ""}
      </p>
    </div>
  );
}
