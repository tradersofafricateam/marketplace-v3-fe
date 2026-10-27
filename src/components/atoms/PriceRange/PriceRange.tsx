const rangeClassName =
  "absolute inset-0 h-1.5 w-full appearance-none bg-transparent pointer-events-none focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:bg-brand disabled:opacity-50";

export default function PriceRange({
  min,
  max,
  limit,
  symbol,
  minLabel,
  maxLabel,
  anyLabel,
  disabled,
  onChange,
}: {
  min?: number;
  max?: number;
  limit: number;
  symbol: string;
  minLabel: string;
  maxLabel: string;
  anyLabel: string;
  disabled?: boolean;
  onChange: (range: { min?: number; max?: number }) => void;
}) {
  const low = min ?? 0;
  const high = max ?? limit;
  return (
    <div>
      <div className="relative mb-5 mt-2 h-1.5 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 rounded-full bg-brand"
          style={{
            left: `${(low / limit) * 100}%`,
            width: `${(Math.max(0, high - low) / limit) * 100}%`,
          }}
        />
        <input
          aria-label={minLabel}
          aria-valuetext={`${symbol} ${low}`}
          type="range"
          min={0}
          max={limit}
          step={Math.max(1, Math.round(limit / 100))}
          value={low}
          disabled={disabled}
          onChange={(e) =>
            onChange({ min: Math.min(Number(e.target.value), high), max })
          }
          className={`${rangeClassName} z-10`}
        />
        <input
          aria-label={maxLabel}
          aria-valuetext={max === undefined ? anyLabel : `${symbol} ${max}`}
          type="range"
          min={0}
          max={limit}
          step={Math.max(1, Math.round(limit / 100))}
          value={high}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              min,
              max:
                Number(e.target.value) === limit
                  ? undefined
                  : Math.max(Number(e.target.value), low),
            })
          }
          className={`${rangeClassName} z-20`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="min-w-0 text-xs text-muted-foreground">
          {minLabel}
          <input
            type="number"
            min={0}
            max={max}
            inputMode="decimal"
            value={min ?? ""}
            disabled={disabled}
            placeholder="0"
            onChange={(e) =>
              onChange({
                min:
                  e.target.value === ""
                    ? undefined
                    : Math.min(
                        Math.max(0, Number(e.target.value)),
                        max ?? Infinity,
                      ),
                max,
              })
            }
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
          />
        </label>
        <label className="min-w-0 text-xs text-muted-foreground">
          {maxLabel}
          <input
            type="number"
            min={min ?? 0}
            inputMode="decimal"
            value={max ?? ""}
            disabled={disabled}
            placeholder={anyLabel}
            onChange={(e) =>
              onChange({
                min,
                max:
                  e.target.value === ""
                    ? undefined
                    : Math.max(Number(e.target.value), min ?? 0),
              })
            }
            className="mt-2 h-11 w-full rounded-md border border-input bg-background px-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
          />
        </label>
      </div>
    </div>
  );
}
