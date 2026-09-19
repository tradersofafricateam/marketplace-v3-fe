const PreferenceSwitch = ({ checked, disabled, label, onChange }: { checked: boolean; disabled?: boolean; label: string; onChange: (checked: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-(--orange)" : "bg-muted-foreground/25"} disabled:cursor-not-allowed disabled:opacity-55`}
  >
    <span
      className={`pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
    />
  </button>
);

export default PreferenceSwitch;
