export interface RangeControlProps {
  label: string;
  unit?: string;
  help?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  onCommit?: () => void;
  formatValue?: (v: number) => string;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function RangeControl({
  label,
  unit,
  help,
  min,
  max,
  step = 1,
  value,
  onChange,
  onCommit,
  formatValue,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: RangeControlProps) {
  const displayValue = formatValue ? formatValue(value) : value.toLocaleString();

  const handleInput = (e: Event) => {
    const val = Number((e.target as HTMLInputElement).value);
    onChange(val);
  };

  const handleChange = () => {
    if (onCommit) {
      onCommit();
    }
  };

  return (
    <div
      className={["field", className].filter(Boolean).join(" ")}
      data-component="RangeControl"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      <label
        className="field-label"
        data-qoder-id="qel-field-label-42b19db2"
        data-qoder-source='{"qoderId":"qel-field-label-42b19db2","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"field-label","loc":{"line":542,"column":7}}'
      >
        {label}
      </label>
      {help && (
        <p
          className="field-help"
          data-qoder-id="qel-field-help-fbabc926"
          data-qoder-source='{"qoderId":"qel-field-help-fbabc926","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"field-help","loc":{"line":543,"column":16}}'
        >
          {help}
        </p>
      )}
      <div
        className="range"
        data-qoder-id="qel-range-81acf2a5"
        data-qoder-source='{"qoderId":"qel-range-81acf2a5","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"range","loc":{"line":544,"column":7}}'
      >
        <div
          className="range-value"
          data-qoder-id="qel-range-value-8a1266e0"
          data-qoder-source='{"qoderId":"qel-range-value-8a1266e0","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"range-value","loc":{"line":545,"column":9}}'
        >
          <span
            className="value-main"
            data-qoder-id="qel-value-main-acd17d02"
            data-qoder-source='{"qoderId":"qel-value-main-acd17d02","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"value-main","loc":{"line":546,"column":11}}'
          >
            {displayValue}
          </span>
          {unit && (
            <span
              className="value-unit"
              data-qoder-id="qel-value-unit-688c5056"
              data-qoder-source='{"qoderId":"qel-value-unit-688c5056","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"value-unit","loc":{"line":547,"column":11}}'
            >
              {unit}
            </span>
          )}
        </div>
        <input
          className="range-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={handleInput}
          onChange={handleChange}
          aria-label={label}
          data-qoder-id="qel-range-input-d71fac6f"
          data-qoder-source='{"qoderId":"qel-range-input-d71fac6f","filePath":"react-vite/src/App.jsx","componentName":"RangeControl","elementRole":"range-input","loc":{"line":549,"column":9}}'
        />
      </div>
    </div>
  );
}
