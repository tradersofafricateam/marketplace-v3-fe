/** Keep selected files attached when option values change casing. */
export const variantImageKey = (attributes: Record<string, string>) => JSON.stringify(
  Object.entries(attributes)
    .map(([name, value]) => [name, value.trim().toLowerCase()])
    .sort(([a], [b]) => a.localeCompare(b)),
);
