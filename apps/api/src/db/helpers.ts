export function firstRowOrThrow<T>(rows: T[]): T {
  const row = rows[0];
  if (!row) throw new Error('Query returned no rows');
  return row;
}
