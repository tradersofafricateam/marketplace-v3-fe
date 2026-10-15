import { useState } from "react";

import { cn } from "@/lib/utils";
import { CUSTOM_VARIANT_OPTION, VARIANT_OPTION_PRESETS } from "../../../constants/variantOptionPresets";
import { capitalizeFirst } from "../../../helpers/textFormatting";

const fieldClass = "h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-(--orange)";

const VariantOptionNameField = ({ name, onChange }: { name: string; onChange: (name: string) => void }) => {
  const isPreset = VARIANT_OPTION_PRESETS.includes(name);
  const [customSelected, setCustomSelected] = useState(name !== "" && !isPreset);
  const showCustomInput = customSelected && !isPreset;

  return (
    <div className={cn("flex flex-col gap-2", showCustomInput && "sm:w-64")}>
      <select
        value={isPreset ? name : customSelected ? CUSTOM_VARIANT_OPTION : ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === CUSTOM_VARIANT_OPTION) {
            setCustomSelected(true);
            onChange("");
          } else {
            setCustomSelected(false);
            onChange(value);
          }
        }}
        className={cn(fieldClass, "sm:w-40")}
      >
        <option value="" disabled>
          Option type
        </option>
        {VARIANT_OPTION_PRESETS.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
        <option value={CUSTOM_VARIANT_OPTION}>Custom…</option>
      </select>
      {showCustomInput && (
        <input
          autoFocus
          placeholder="Custom option name"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onChange(capitalizeFirst(name.trim()))}
          className={cn(fieldClass, "sm:w-40")}
        />
      )}
    </div>
  );
};

export default VariantOptionNameField;
