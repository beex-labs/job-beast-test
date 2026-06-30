export interface ConsentSheetProps {
  open: boolean;
  ratingZh?: string;
  onAccept: () => void;
  onDecline?: () => void;
  onSkip?: () => void;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function ConsentSheet({
  open,
  ratingZh,
  onAccept,
  onDecline,
  onSkip,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ConsentSheetProps) {
  if (!open) return null;

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    } else if (onSkip) {
      onSkip();
    }
  };

  return (
    <div
      className={["sheet-overlay", className].filter(Boolean).join(" ")}
      data-component="ConsentSheet"
      onClick={handleDecline}
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        data-qoder-id="qel-sheet-9cf8a1eb"
        data-qoder-source='{"qoderId":"qel-sheet-9cf8a1eb","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"sheet","loc":{"line":634,"column":7}}'
        role="dialog"
        aria-modal="true"
        aria-label="是否上传评级"
      >
        <h2
          data-qoder-id="qel-h2-d27c8bb6"
          data-qoder-source='{"qoderId":"qel-h2-d27c8bb6","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"h2","loc":{"line":635,"column":9}}'
        >
          是否上传你的{ratingZh ? `「${ratingZh}」` : ""}评级？
        </h2>
        <p
          className="muted"
          data-qoder-id="qel-muted-fde74e50"
          data-qoder-source='{"qoderId":"qel-muted-fde74e50","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"muted","loc":{"line":636,"column":9}}'
        >
          你的评级名称（如 "Worker" 等）将匿名上传到服务器，用于全站统计分布。
          所有原始输入（收入、工时等）不会上传，仅保留在你的浏览器中。
        </p>
        <div
          className="btn-row"
          data-qoder-id="qel-btn-row-679f4012"
          data-qoder-source='{"qoderId":"qel-btn-row-679f4012","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"btn-row","loc":{"line":640,"column":9}}'
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAccept}
            data-qoder-id="qel-btn-8c42fc37"
            data-qoder-source='{"qoderId":"qel-btn-8c42fc37","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"btn","loc":{"line":641,"column":11}}'
          >
            同意并上传
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDecline}
            data-qoder-id="qel-btn-8d42fdca"
            data-qoder-source='{"qoderId":"qel-btn-8d42fdca","filePath":"react-vite/src/App.jsx","componentName":"ConsentSheet","elementRole":"btn","loc":{"line":642,"column":11}}'
          >
            仅查看结果
          </button>
        </div>
      </div>
    </div>
  );
}
