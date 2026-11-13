export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    const part = items.slice(start, start + size);
    chunks.push(part);
  }
  return chunks;
}
