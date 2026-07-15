/** Format a date as YYYY-MM-DD using UTC to avoid timezone drift. */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Content collection ids for `foo/index.md` become `foo/index`; strip it for clean URLs. */
export function toSlug(id: string): string {
  return id.replace(/\/index$/, '');
}
