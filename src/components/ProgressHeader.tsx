import { useEffect } from "preact/hooks";

export interface ProgressHeaderProps {
  current: number;
  total: number;
  title: string;
  description: string;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function ProgressHeader({
  current,
  total,
  title,
  description,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ProgressHeaderProps) {
  const pct = (current / total) * 100;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [current]);

  return (
    <div
      className={["step-header", className].filter(Boolean).join(" ")}
      data-component="ProgressHeader"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="step-count"
        data-qoder-id="qel-step-count-2f87075b"
        data-qoder-source='{"qoderId":"qel-step-count-2f87075b","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"step-count","loc":{"line":490,"column":7}}'
      >
        {current} / {total}
      </div>
      <h2
        data-qoder-id="qel-h2-51683dad"
        data-qoder-source='{"qoderId":"qel-h2-51683dad","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"h2","loc":{"line":491,"column":7}}'
      >
        {title}
      </h2>
      <p
        className="step-desc"
        data-qoder-id="qel-step-desc-4a5e1f3d"
        data-qoder-source='{"qoderId":"qel-step-desc-4a5e1f3d","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"step-desc","loc":{"line":492,"column":7}}'
      >
        {description}
      </p>
      <div
        className="step-progress"
        data-qoder-id="qel-step-progress-9377f45d"
        data-qoder-source='{"qoderId":"qel-step-progress-9377f45d","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"step-progress","loc":{"line":493,"column":7}}'
      >
        <div
          className="progress-track"
          data-qoder-id="qel-progress-track-d9fdd341"
          data-qoder-source='{"qoderId":"qel-progress-track-d9fdd341","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"progress-track","loc":{"line":494,"column":9}}'
        >
          <div
            className="progress-fill"
            style={{ width: pct + "%" }}
            data-qoder-id="qel-progress-fill-b5e5221c"
            data-qoder-source='{"qoderId":"qel-progress-fill-b5e5221c","filePath":"react-vite/src/App.jsx","componentName":"ProgressHeader","elementRole":"progress-fill","loc":{"line":495,"column":11}}'
          />
        </div>
      </div>
    </div>
  );
}
