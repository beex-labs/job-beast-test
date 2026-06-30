export interface ChoiceOption<T> {
  value: T;
  label: string;
  desc?: string;
}

export interface ChoiceGroupProps<T> {
  options: ChoiceOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  segmented?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: string | Record<string, string>;
  "data-qoder-id"?: string;
  "data-qoder-source"?: string;
}

export function ChoiceGroup<T extends string | number>({
  options,
  value,
  onChange,
  segmented = false,
  ariaLabel,
  className,
  style,
  "data-qoder-id": qoderId,
  "data-qoder-source": qoderSource,
}: ChoiceGroupProps<T>) {
  return (
    <div
      className={["choice-group" + (segmented ? " segmented" : ""), className]
        .filter(Boolean)
        .join(" ")}
      role="radiogroup"
      aria-label={ariaLabel}
      data-component="ChoiceGroup"
      style={style}
      data-qoder-id={qoderId}
      data-qoder-source={qoderSource}
    >
      {options.map((opt) => (
        <button
          type="button"
          key={opt.value}
          className="choice"
          role="radio"
          aria-checked={value === opt.value}
          aria-pressed={value === opt.value}
          data-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          data-qoder-id="qel-choice-6be32169"
          data-qoder-source='{"qoderId":"qel-choice-6be32169","filePath":"react-vite/src/App.jsx","componentName":"ChoiceGroup","elementRole":"choice","loc":{"line":523,"column":9}}'
        >
          <span
            className="choice-label"
            data-qoder-id="qel-choice-label-c1bba932"
            data-qoder-source='{"qoderId":"qel-choice-label-c1bba932","filePath":"react-vite/src/App.jsx","componentName":"ChoiceGroup","elementRole":"choice-label","loc":{"line":531,"column":11}}'
          >
            {opt.label}
          </span>
          {opt.desc && (
            <span
              className="choice-desc"
              data-qoder-id="qel-choice-desc-f6cd6ff2"
              data-qoder-source='{"qoderId":"qel-choice-desc-f6cd6ff2","filePath":"react-vite/src/App.jsx","componentName":"ChoiceGroup","elementRole":"choice-desc","loc":{"line":532,"column":24}}'
            >
              {opt.desc}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
