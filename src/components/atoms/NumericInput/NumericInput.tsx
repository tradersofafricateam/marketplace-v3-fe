"use client";

import { useLayoutEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { formatNumericInput, parseNumericInput } from "@/lib/helpers/numericInput";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: string | number; onValueChange: (value: string) => void; decimals?: boolean;
};

export default function NumericInput({ value, onValueChange, decimals = true, ...props }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const external = typeof value === "number" && !Number.isFinite(value) ? "" : String(value);
  const displayed = formatNumericInput(draft ?? external);
  useLayoutEffect(() => {
    if (caret.current !== null) {
      input.current?.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [displayed]);
  return <input {...props} ref={input} type="text" inputMode={decimals ? "decimal" : "numeric"} value={displayed}
    onFocus={(event) => { setDraft(external); props.onFocus?.(event); }}
    onBlur={(event) => { setDraft(null); props.onBlur?.(event); }}
    onChange={(event) => {
      // Commas already displayed by this component may move during insertion/deletion.
      const text = event.target.value.replaceAll(",", "");
      const raw = parseNumericInput(text, decimals);
      if (raw === null) return;
      const digitsBeforeCaret = event.target.value.slice(0, event.target.selectionStart ?? 0).replaceAll(",", "").length;
      const formatted = formatNumericInput(raw);
      let position = 0, count = 0;
      while (position < formatted.length && count < digitsBeforeCaret) { if (formatted[position] !== ",") count++; position++; }
      caret.current = position;
      setDraft(raw);
      onValueChange(raw);
    }}
    onPaste={(event) => {
      if (parseNumericInput(event.clipboardData.getData("text"), decimals) === null) event.preventDefault();
      props.onPaste?.(event);
    }}
  />;
}
