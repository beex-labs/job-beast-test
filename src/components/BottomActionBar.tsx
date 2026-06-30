import type { ComponentChildren } from "preact";

export interface BottomActionBarProps {
  onBack?: (() => void) | null;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLast?: boolean;
  left?: ComponentChildren;
  right?: ComponentChildren;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function BottomActionBar({
  onBack,
  onNext,
  backLabel = "上一步",
  nextLabel = "下一步",
  nextDisabled = false,
  isLast = false,
  left,
  right,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: BottomActionBarProps) {
  return (
    <div
      className={["bottom-bar", className].filter(Boolean).join(" ")}
      data-component="BottomActionBar"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="btn-row"
        data-qoder-id="qel-btn-row-d5fe988a"
        data-qoder-source='{"qoderId":"qel-btn-row-d5fe988a","filePath":"react-vite/src/App.jsx","componentName":"BottomActionBar","elementRole":"btn-row","loc":{"line":505,"column":7}}'
      >
        {left !== undefined ? (
          left
        ) : (
          onBack && (
            <button
              className="btn btn-secondary"
              onClick={onBack}
              disabled={!onBack}
              data-qoder-id="qel-btn-8fc6e3e3"
              data-qoder-source='{"qoderId":"qel-btn-8fc6e3e3","filePath":"react-vite/src/App.jsx","componentName":"BottomActionBar","elementRole":"btn","loc":{"line":507,"column":11}}'
            >
              {backLabel}
            </button>
          )
        )}
        {right !== undefined ? (
          right
        ) : (
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={nextDisabled}
            data-qoder-id="qel-btn-8ec6e250"
            data-qoder-source='{"qoderId":"qel-btn-8ec6e250","filePath":"react-vite/src/App.jsx","componentName":"BottomActionBar","elementRole":"btn","loc":{"line":511,"column":9}}'
          >
            {isLast ? "查看结果" : nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
