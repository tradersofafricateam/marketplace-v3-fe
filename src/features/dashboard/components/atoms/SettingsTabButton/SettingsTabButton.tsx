const SettingsTabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    onClick={onClick}
    className={`relative min-w-max px-1 pb-3 text-sm font-semibold transition-colors ${
      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
    <span
      className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-colors ${
        active ? "bg-(--orange)" : "bg-transparent"
      }`}
      aria-hidden="true"
    />
  </button>
);

export default SettingsTabButton;
