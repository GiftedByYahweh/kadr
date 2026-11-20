export const Currency = {
  UAH: 'UAH',
  EUR: 'EUR',
  USD: 'USD',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];
