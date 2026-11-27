import type { Currency } from '@kadr/shared';
import { computed, reactive, ref } from 'vue';
import {
  accessTermExpiry,
  isAccessTermComplete,
  type AccessTermValue,
} from '@/components/features/galleries/gallery-access.ts';
import type { GallerySettingsInput } from '@/services/galleries.types.ts';

const WHOLE_NUMBER_PATTERN = /^\d+$/;
const TITLE_ERROR = 'Вкажіть назву галереї';
const NUMBER_ERROR = 'Ціле число від 0';
const DATE_ERROR = 'Оберіть дату доступу';

export interface GalleryFormValues {
  title: string;
  includedCount: string;
  extraPrice: string;
  currency: Currency;
  access: AccessTermValue;
}

export type GalleryFormErrors = Record<
  'title' | 'includedCount' | 'extraPrice' | 'access',
  string
>;

const NO_ERRORS: GalleryFormErrors = {
  title: '',
  includedCount: '',
  extraPrice: '',
  access: '',
};

function parseWholeNumber(value: string): number | null {
  const trimmed = value.trim();
  const isWholeNumber = WHOLE_NUMBER_PATTERN.test(trimmed);
  if (!isWholeNumber) return null;
  return Number(trimmed);
}

function validate(values: GalleryFormValues): GalleryFormErrors {
  const accessComplete = isAccessTermComplete(values.access);
  return {
    title: values.title.trim() === '' ? TITLE_ERROR : '',
    includedCount:
      parseWholeNumber(values.includedCount) === null ? NUMBER_ERROR : '',
    extraPrice:
      parseWholeNumber(values.extraPrice) === null ? NUMBER_ERROR : '',
    access: accessComplete ? '' : DATE_ERROR,
  };
}

export function useGalleryForm(initial: GalleryFormValues) {
  const values = reactive<GalleryFormValues>(initial);
  const submitted = ref(false);

  const errors = computed(() =>
    submitted.value ? validate(values) : NO_ERRORS,
  );

  function toInput(): GallerySettingsInput | null {
    submitted.value = true;
    const hasErrors = Object.values(errors.value).some(Boolean);
    if (hasErrors) return null;
    return {
      title: values.title.trim(),
      expiresAt: accessTermExpiry(values.access, new Date()),
      includedCount: Number(values.includedCount.trim()),
      extraPrice: Number(values.extraPrice.trim()),
      currency: values.currency,
    };
  }

  return { values, errors, toInput };
}
