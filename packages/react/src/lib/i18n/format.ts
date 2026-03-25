export interface LocaleFormatOptions {
  locale?: string;
  timeZone?: string;
}

function toDate(value: Date | number | string) {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  localeOptions?: LocaleFormatOptions,
) {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(localeOptions?.locale, {
    timeZone: localeOptions?.timeZone,
    ...options,
  }).format(date);
}

export function formatDateTime(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions,
  localeOptions?: LocaleFormatOptions,
) {
  return formatDate(value, options, localeOptions);
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  localeOptions?: LocaleFormatOptions,
) {
  return new Intl.NumberFormat(localeOptions?.locale, options).format(value);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  options?: Intl.RelativeTimeFormatOptions,
  localeOptions?: LocaleFormatOptions,
) {
  return new Intl.RelativeTimeFormat(localeOptions?.locale, options).format(
    value,
    unit,
  );
}
