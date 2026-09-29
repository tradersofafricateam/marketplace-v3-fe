import NumericInput from "@/components/atoms/NumericInput/NumericInput";

export default function ProductNumberField({ id, label, value, onValueChange, error, required, decimals = true }: {
  id: string; label: string; value: string; onValueChange: (value: string) => void; error?: string; required?: boolean; decimals?: boolean;
}) {
  return <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold">{label}{required && " *"}</label>
    <NumericInput id={id} name={id} value={value} onValueChange={onValueChange} decimals={decimals} required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm outline-none focus:border-(--orange) aria-invalid:border-destructive" />
    {error && <p id={`${id}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
  </div>;
}
