import { useState } from "react";

import { normalizeVariantValues } from "../../../helpers/textFormatting";

const parseValues = (text: string) =>
  text.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);

/**
 * The input's displayed text is kept as its own local state rather than
 * re-derived from the parsed `values` array on every keystroke - otherwise a
 * trailing comma (or space) produces an empty segment that the parser drops,
 * which would erase the very character the seller just typed.
 */
const VariantOptionValuesField = ({
  values,
  onChange,
  className,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}) => {
  const [text, setText] = useState(() => values.map((value) => value.toLowerCase()).join(", "));

  return (
    <input
      placeholder="Values, comma-separated, e.g. red, blue"
      value={text}
      onChange={(e) => {
        setText(e.target.value.toLowerCase());
        onChange(parseValues(e.target.value));
      }}
      onBlur={() => {
        const normalized = normalizeVariantValues(parseValues(text));
        setText(normalized.join(", "));
        onChange(normalized);
      }}
      className={className}
    />
  );
};

export default VariantOptionValuesField;
