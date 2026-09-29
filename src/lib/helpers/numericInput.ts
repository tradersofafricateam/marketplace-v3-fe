/** Reject invalid edits rather than silently changing their numeric meaning. */
export function parseNumericInput(value: string, decimals: boolean): string | null {
  if (value.includes(",") && !/^\d{1,3}(,\d{3})*(\.\d*)?$/.test(value)) return null;
  const raw = value.replaceAll(",", "");
  if (!(decimals ? /^\d*(\.\d*)?$/ : /^\d*$/).test(raw)) return null;
  if (raw && raw !== "." && (!Number.isFinite(Number(raw)) || Number(raw) > Number.MAX_SAFE_INTEGER)) return null;
  return raw;
}

export function formatNumericInput(value: string): string {
  const [whole, fraction] = value.split(".");
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (fraction === undefined ? "" : `.${fraction}`);
}
