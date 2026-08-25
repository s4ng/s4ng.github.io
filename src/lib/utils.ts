/** Format a date as YYYY-MM-DD using UTC to avoid timezone drift. */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a date as YYYY.MM.DD, for the flat post list. */
export function formatListDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** Content collection ids for `foo/index.md` become `foo/index`; strip it for clean URLs. */
export function toSlug(id: string): string {
  return id.replace(/\/index$/, '');
}

/** Strip markdown/HTML from a body and return a plain-text excerpt for meta descriptions. */
export function excerpt(markdown: string, maxLength = 160): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/<[^>]+>/g, ' ') // raw html tags
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> link text
    .replace(/[#>*_`~|]/g, ' ') // markdown symbols
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text;
}
