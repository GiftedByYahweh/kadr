type EnumValues<T extends Record<string, string>> = [
  T[keyof T],
  ...T[keyof T][],
];

export function pgEnumValues<T extends Record<string, string>>(
  dictionary: T,
): EnumValues<T> {
  return Object.values(dictionary) as EnumValues<T>;
}
