"use client";

import { Combobox } from "@base-ui/react/combobox";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = { value: string; label: string };

export default function SearchableSelect({ id, label, value, options, onChange, error, required }: {
  id: string; label: string; value: string; options: SelectOption[];
  onChange: (value: string) => void; error?: string; required?: boolean;
}) {
  return <div className="flex min-w-0 flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold">{label}{required && " *"}</label>
    <Combobox.Root items={options} value={options.find((item) => item.value === value) ?? null} onValueChange={(item) => onChange(item?.value ?? "")}>
      <div className="relative">
        <Combobox.Input id={id} placeholder={`Search ${label.toLowerCase()}…`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="h-11 w-full rounded-xl border border-border bg-background pl-3.5 pr-10 text-sm outline-none focus:border-(--orange) aria-invalid:border-destructive" />
        <Combobox.Trigger aria-label={`Show ${label.toLowerCase()}`} className="absolute inset-y-0 right-0 px-3"><ChevronDown size={16} /></Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={6} className="z-100">
          <Combobox.Popup className="w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border bg-background shadow-lg">
            <Combobox.Empty className="p-3 text-sm text-muted-foreground">No matches found</Combobox.Empty>
            <Combobox.List className="max-h-56 overflow-y-auto overscroll-contain p-1">
              {(item: SelectOption) => <Combobox.Item key={item.value} value={item} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm data-highlighted:bg-muted">
                {item.label}<Combobox.ItemIndicator><Check size={14} /></Combobox.ItemIndicator>
              </Combobox.Item>}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
    {error && <p id={`${id}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
  </div>;
}
