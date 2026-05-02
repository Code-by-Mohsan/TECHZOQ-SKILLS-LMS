export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );

  const escape = (value: unknown) => {
    if (value === null || value === undefined) return "";
    const text = String(value);
    const escaped = text.replace(/"/g, "\"\"");
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
  };

  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ];
  return lines.join("\n");
}
