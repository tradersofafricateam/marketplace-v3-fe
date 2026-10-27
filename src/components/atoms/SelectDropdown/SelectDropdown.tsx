"use client";

import { navigationItem } from "@/lib/constants/navigationStyles";

import { Check } from "lucide-react";
import type { SelectDropdownProps } from "@/lib/types";
import NavigationPopover from "@/components/molecules/NavigationPopover/NavigationPopover";

export default function SelectDropdown({ trigger, options, onSelect, selected, align = "left", side = "bottom" }: SelectDropdownProps) {
  return <NavigationPopover trigger={trigger} align={align} side={side}>{close => options.map(option => (
    <button key={option.value} data-navigation-option type="button" aria-pressed={selected === option.value} onClick={() => { onSelect(option.value); close(); }} className={navigationItem}>
      <span>{option.flag && <span aria-hidden="true" className="mr-2">{option.flag}</span>}{option.label}</span>
      {selected === option.value && <Check size={15} aria-hidden="true" className="shrink-0" />}
    </button>
  ))}</NavigationPopover>;
}
