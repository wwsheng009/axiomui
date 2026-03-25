import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  formatDate,
  formatDateTime,
  formatNumber,
  formatRelativeTime,
} from "../lib/i18n/format";

export interface LocaleContextValue {
  formatDate: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatDateTime: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatRelativeTime: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) => string;
  locale: string;
  setLocale: (locale: string) => void;
  timeZone?: string;
}

export interface LocaleProviderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  defaultLocale?: string;
  locale?: string;
  onLocaleChange?: (locale: string) => void;
  timeZone?: string;
}

const defaultLocaleContextValue: LocaleContextValue = {
  formatDate: (value, options) => formatDate(value, options),
  formatDateTime: (value, options) => formatDateTime(value, options),
  formatNumber: (value, options) => formatNumber(value, options),
  formatRelativeTime: (value, unit, options) =>
    formatRelativeTime(value, unit, options),
  locale: "en-US",
  setLocale: () => undefined,
  timeZone: undefined,
};

export const LocaleContext = createContext<LocaleContextValue>(
  defaultLocaleContextValue,
);

export function LocaleProvider({
  children,
  defaultLocale = "en-US",
  locale: localeProp,
  onLocaleChange,
  timeZone,
  ...props
}: LocaleProviderProps) {
  const [localeState, setLocaleState] = useState(defaultLocale);
  const locale = localeProp ?? localeState;

  function setLocale(nextLocale: string) {
    if (localeProp === undefined) {
      setLocaleState(nextLocale);
    }

    onLocaleChange?.(nextLocale);
  }

  const value = useMemo<LocaleContextValue>(
    () => ({
      formatDate: (dateValue, options) =>
        formatDate(dateValue, options, { locale, timeZone }),
      formatDateTime: (dateValue, options) =>
        formatDateTime(dateValue, options, { locale, timeZone }),
      formatNumber: (numberValue, options) =>
        formatNumber(numberValue, options, { locale, timeZone }),
      formatRelativeTime: (numberValue, unit, options) =>
        formatRelativeTime(numberValue, unit, options, { locale, timeZone }),
      locale,
      setLocale,
      timeZone,
    }),
    [locale, timeZone],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div data-axiom-locale={locale} {...props}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
