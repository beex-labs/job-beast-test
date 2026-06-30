export interface ToggleCardProps {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function ToggleCard({
  label,
  desc,
  checked,
  onChange,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ToggleCardProps) {
  return (
    <button
      type="button"
      className={["toggle-card", className].filter(Boolean).join(" ")}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      data-component="ToggleCard"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <div
        className="toggle-text"
        data-qoder-id="qel-toggle-text-f639f8d1"
        data-qoder-source='{"qoderId":"qel-toggle-text-f639f8d1","filePath":"react-vite/src/App.jsx","componentName":"ToggleCard","elementRole":"toggle-text","loc":{"line":572,"column":7}}'
      >
        <div
          className="toggle-label"
          data-qoder-id="qel-toggle-label-915bcd71"
          data-qoder-source='{"qoderId":"qel-toggle-label-915bcd71","filePath":"react-vite/src/App.jsx","componentName":"ToggleCard","elementRole":"toggle-label","loc":{"line":573,"column":9}}'
        >
          {label}
        </div>
        {desc && (
          <div
            className="toggle-desc"
            data-qoder-id="qel-toggle-desc-15dfc1f9"
            data-qoder-source='{"qoderId":"qel-toggle-desc-15dfc1f9","filePath":"react-vite/src/App.jsx","componentName":"ToggleCard","elementRole":"toggle-desc","loc":{"line":574,"column":18}}'
          >
            {desc}
          </div>
        )}
      </div>
    </button>
  );
}
