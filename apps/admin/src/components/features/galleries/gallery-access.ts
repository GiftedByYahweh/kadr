export const AccessTerm = {
  DAYS_7: '7',
  DAYS_14: '14',
  DAYS_30: '30',
  DAYS_60: '60',
  CUSTOM: 'custom',
  UNLIMITED: 'unlimited',
} as const;

export type AccessTerm = (typeof AccessTerm)[keyof typeof AccessTerm];

export const ACCESS_TERMS = [
  { value: AccessTerm.DAYS_7, label: '7 днів', days: 7 },
  { value: AccessTerm.DAYS_14, label: '14 днів', days: 14 },
  { value: AccessTerm.DAYS_30, label: '30 днів', days: 30 },
  { value: AccessTerm.DAYS_60, label: '60 днів', days: 60 },
  { value: AccessTerm.CUSTOM, label: 'Своя дата', days: null },
  { value: AccessTerm.UNLIMITED, label: 'Без терміну', days: null },
];

const DEFAULT_ACCESS_TERM = AccessTerm.DAYS_30;
const DATE_INPUT_SEPARATOR = '-';

export interface AccessTermValue {
  term: AccessTerm;
  customDate: string;
}

function endOfDay(date: Date): string {
  const result = new Date(date);
  result.setHours(23, 59, 59, 0);
  return result.toISOString();
}

function dateInputToExpiry(value: string): string | null {
  const [year, month, day] = value.split(DATE_INPUT_SEPARATOR).map(Number);
  if (!year || !month || !day) return null;
  return endOfDay(new Date(year, month - 1, day));
}

export function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return [String(date.getFullYear()), month, day].join(DATE_INPUT_SEPARATOR);
}

export function accessTermExpiry(
  value: AccessTermValue,
  now: Date,
): string | null {
  if (value.term === AccessTerm.CUSTOM) {
    return dateInputToExpiry(value.customDate);
  }
  const option = ACCESS_TERMS.find((term) => term.value === value.term);
  if (!option?.days) return null;
  const date = new Date(now);
  date.setDate(date.getDate() + option.days);
  return endOfDay(date);
}

export function isAccessTermComplete(value: AccessTermValue): boolean {
  if (value.term !== AccessTerm.CUSTOM) return true;
  return dateInputToExpiry(value.customDate) !== null;
}

export function accessTermOf(expiresAt: string | null): AccessTermValue {
  if (expiresAt === null) return { term: AccessTerm.UNLIMITED, customDate: '' };
  const customDate = toDateInput(new Date(expiresAt));
  return { term: AccessTerm.CUSTOM, customDate };
}

export function defaultAccessTerm(): AccessTermValue {
  return { term: DEFAULT_ACCESS_TERM, customDate: '' };
}

export function isExpired(expiresAt: string | null, now: Date): boolean {
  if (expiresAt === null) return false;
  return new Date(expiresAt) <= now;
}
