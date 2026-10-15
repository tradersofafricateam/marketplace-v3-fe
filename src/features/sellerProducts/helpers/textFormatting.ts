/** Only the first character changes - safe for things like "10kg" or "XL" that shouldn't be title-cased. */
export const capitalizeFirst = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Trim and lowercase option values, dropping duplicates by case and spacing. */
export const normalizeVariantValues = (values: string[]): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((raw) => {
    const normalized = raw.trim().toLowerCase();
    const key = normalized.toLowerCase().replace(/\s+/g, "");
    if (!normalized || seen.has(key)) return;
    seen.add(key);
    result.push(normalized);
  });

  return result;
};
