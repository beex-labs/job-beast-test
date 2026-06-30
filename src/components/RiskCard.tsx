export interface RiskCardProps {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function RiskCard({
  label,
  desc,
  checked,
  onChange,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: RiskCardProps) {
  return (
    <button
      type="button"
      className={["risk-card", className].filter(Boolean).join(" ")}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      data-component="RiskCard"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="risk-text"
        data-qoder-id="qel-risk-text-4282b34e"
        data-qoder-source='{"qoderId":"qel-risk-text-4282b34e","filePath":"react-vite/src/App.jsx","componentName":"RiskCard","elementRole":"risk-text","loc":{"line":589,"column":7}}'
      >
        <div
          className="risk-label"
          data-qoder-id="qel-risk-label-ce45ceac"
          data-qoder-source='{"qoderId":"qel-risk-label-ce45ceac","filePath":"react-vite/src/App.jsx","componentName":"RiskCard","elementRole":"risk-label","loc":{"line":590,"column":9}}'
        >
          {label}
        </div>
        {desc && (
          <div
            className="risk-desc"
            data-qoder-id="qel-risk-desc-4d1a0626"
            data-qoder-source='{"qoderId":"qel-risk-desc-4d1a0626","filePath":"react-vite/src/App.jsx","componentName":"RiskCard","elementRole":"risk-desc","loc":{"line":591,"column":18}}'
          >
            {desc}
          </div>
        )}
      </div>
    </button>
  );
}
