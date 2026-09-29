import { CalendarDays, ChevronDown } from "lucide-react";

const AnalyticsDateRangeTrigger = ({
  label,
  dateRange,
  open,
  onClick,
}: {
  label: string;
  dateRange: string;
  open: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={open}
    aria-haspopup="dialog"
    className="group flex min-h-16 w-full items-center gap-3 rounded-2xl border border-border bg-background p-2.5 text-left shadow-sm transition-[border-color,box-shadow] hover:border-(--orange)/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--orange)/15 aria-expanded:border-(--orange)/50 aria-expanded:ring-4 aria-expanded:ring-(--orange)/10 sm:w-auto"
  >
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--brown) text-white transition-colors group-hover:bg-(--orange) group-aria-expanded:bg-(--orange)">
      <CalendarDays aria-hidden="true" size={19} strokeWidth={1.7} />
    </span>
    <span className="min-w-0 flex-1 pr-1">
      <span className="block text-[11px] font-medium leading-4 text-muted-foreground">
        {label}
      </span>
      <span className="mt-0.5 block text-xs font-semibold leading-5 text-foreground tabular-nums sm:text-sm">
        {dateRange}
      </span>
    </span>
    <span className="flex h-8 shrink-0 items-center border-l border-border pl-2.5 pr-1 text-muted-foreground group-hover:text-(--orange)">
      <ChevronDown
        aria-hidden="true"
        size={16}
        className="transition-transform duration-200 group-aria-expanded:rotate-180 motion-reduce:transition-none"
      />
    </span>
  </button>
);

export default AnalyticsDateRangeTrigger;
