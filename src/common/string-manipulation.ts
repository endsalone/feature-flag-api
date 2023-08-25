export function slugify(text: string): string {
  return text
    .replace(/\s+$/, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
}
