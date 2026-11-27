import { Currency } from '../gallery/types.ts';

function priceFormat(currency: Currency): Intl.NumberFormat {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  });
}

const PRICE_FORMATS: Record<Currency, Intl.NumberFormat> = {
  [Currency.UAH]: priceFormat(Currency.UAH),
  [Currency.EUR]: priceFormat(Currency.EUR),
  [Currency.USD]: priceFormat(Currency.USD),
};

export function formatPrice(
  amount: number,
  currency: Currency = Currency.UAH,
): string {
  return PRICE_FORMATS[currency].format(amount);
}

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDateTime(isoDate: string): string {
  return DATE_TIME_FORMAT.format(new Date(isoDate));
}

const DATE_FORMAT = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
});

const DATE_WITH_YEAR_FORMAT = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(value: string | Date, now: Date): string {
  const date = new Date(value);
  const isCurrentYear = date.getFullYear() === now.getFullYear();
  if (isCurrentYear) return DATE_FORMAT.format(date);
  return DATE_WITH_YEAR_FORMAT.format(date);
}
