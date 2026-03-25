export type DateLike = Date | number | string;

export const defaultDateFormat = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

function createLooseLocalDate(year: number, monthIndex: number, day: number) {
  const date = new Date(year, monthIndex, day, 12);

  return Number.isNaN(date.getTime()) ? null : date;
}

function createStrictLocalDate(year: number, monthIndex: number, day: number) {
  const date = createLooseLocalDate(year, monthIndex, day);

  if (
    !date ||
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function normalizeCalendarDate(value: Date) {
  return createLooseLocalDate(value.getFullYear(), value.getMonth(), value.getDate());
}

export function parseCalendarDate(value: DateLike | null | undefined) {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date) {
    return normalizeCalendarDate(value);
  }

  if (typeof value === "number") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : normalizeCalendarDate(date);
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue);

  if (isoDateMatch) {
    return createStrictLocalDate(
      Number(isoDateMatch[1]),
      Number(isoDateMatch[2]) - 1,
      Number(isoDateMatch[3]),
    );
  }

  const isoMonthMatch = /^(\d{4})-(\d{2})$/.exec(trimmedValue);

  if (isoMonthMatch) {
    return createStrictLocalDate(
      Number(isoMonthMatch[1]),
      Number(isoMonthMatch[2]) - 1,
      1,
    );
  }

  const parsedDate = new Date(trimmedValue);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : normalizeCalendarDate(parsedDate);
}

export function toDateKey(value: Date) {
  return [
    value.getFullYear().toString().padStart(4, "0"),
    (value.getMonth() + 1).toString().padStart(2, "0"),
    value.getDate().toString().padStart(2, "0"),
  ].join("-");
}

export function compareCalendarDates(left: Date, right: Date) {
  const leftTime = left.getTime();
  const rightTime = right.getTime();

  if (leftTime === rightTime) {
    return 0;
  }

  return leftTime < rightTime ? -1 : 1;
}

export function isSameCalendarDay(left: Date, right: Date) {
  return compareCalendarDates(left, right) === 0;
}

export function isSameCalendarMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function startOfCalendarMonth(value: Date) {
  return createLooseLocalDate(value.getFullYear(), value.getMonth(), 1)!;
}

export function endOfCalendarMonth(value: Date) {
  return createLooseLocalDate(value.getFullYear(), value.getMonth() + 1, 0)!;
}

export function addCalendarDays(value: Date, amount: number) {
  return createLooseLocalDate(
    value.getFullYear(),
    value.getMonth(),
    value.getDate() + amount,
  )!;
}

export function addCalendarMonths(value: Date, amount: number) {
  const targetMonthStart = createLooseLocalDate(
    value.getFullYear(),
    value.getMonth() + amount,
    1,
  )!;
  const targetMonthEnd = endOfCalendarMonth(targetMonthStart);
  const targetDay = Math.min(value.getDate(), targetMonthEnd.getDate());

  return createLooseLocalDate(
    targetMonthStart.getFullYear(),
    targetMonthStart.getMonth(),
    targetDay,
  )!;
}

export function startOfCalendarWeek(value: Date, weekStartsOn: number) {
  const dayOffset = (value.getDay() - weekStartsOn + 7) % 7;

  return addCalendarDays(value, -dayOffset);
}

export function endOfCalendarWeek(value: Date, weekStartsOn: number) {
  return addCalendarDays(startOfCalendarWeek(value, weekStartsOn), 6);
}

export function buildCalendarWeeks(visibleMonth: Date, weekStartsOn: number) {
  const monthStart = startOfCalendarMonth(visibleMonth);
  const monthEnd = endOfCalendarMonth(visibleMonth);
  const gridStart = startOfCalendarWeek(monthStart, weekStartsOn);
  const gridEnd = endOfCalendarWeek(monthEnd, weekStartsOn);
  const weeks: Date[][] = [];
  let cursor = gridStart;

  while (compareCalendarDates(cursor, gridEnd) <= 0) {
    const week: Date[] = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      week.push(cursor);
      cursor = addCalendarDays(cursor, 1);
    }

    weeks.push(week);
  }

  return weeks;
}

export function isDateDisabled(
  value: Date,
  minDate: Date | null,
  maxDate: Date | null,
) {
  if (minDate && compareCalendarDates(value, minDate) < 0) {
    return true;
  }

  if (maxDate && compareCalendarDates(value, maxDate) > 0) {
    return true;
  }

  return false;
}

export function resolveDateFormatOptions(format?: Intl.DateTimeFormatOptions) {
  return {
    ...defaultDateFormat,
    ...format,
  } satisfies Intl.DateTimeFormatOptions;
}

export function formatCalendarDate(
  value: Date,
  locale: string,
  format?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(
    locale,
    resolveDateFormatOptions(format),
  ).format(value);
}

function getDatePartOrder(
  locale: string,
  format?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(locale, resolveDateFormatOptions(format))
    .formatToParts(createStrictLocalDate(2006, 10, 23)!)
    .filter(
      (part): part is Intl.DateTimeFormatPart & {
        type: "day" | "month" | "year";
      } => part.type === "day" || part.type === "month" || part.type === "year",
    )
    .map((part) => part.type);
}

export function parseDateInput(
  value: string,
  locale: string,
  format?: Intl.DateTimeFormatOptions,
) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const isoDate = parseCalendarDate(trimmedValue);

  if (isoDate) {
    return isoDate;
  }

  const digitGroups = trimmedValue.match(/\d+/g);
  const partOrder = getDatePartOrder(locale, format);

  if (digitGroups?.length === 3 && partOrder.length === 3) {
    const partValues = Object.fromEntries(
      partOrder.map((part, index) => [part, Number(digitGroups[index])]),
    ) as Record<"day" | "month" | "year", number>;
    const resolvedYear =
      partValues.year < 100 ? 2000 + partValues.year : partValues.year;
    const parsedDate = createStrictLocalDate(
      resolvedYear,
      partValues.month - 1,
      partValues.day,
    );

    if (parsedDate) {
      return parsedDate;
    }
  }

  const fallbackDate = new Date(trimmedValue);

  return Number.isNaN(fallbackDate.getTime())
    ? null
    : normalizeCalendarDate(fallbackDate);
}

export function createDatePlaceholder(
  locale: string,
  format?: Intl.DateTimeFormatOptions,
) {
  const resolvedFormat = resolveDateFormatOptions(format);

  return new Intl.DateTimeFormat(locale, resolvedFormat)
    .formatToParts(createStrictLocalDate(2006, 10, 23)!)
    .map((part) => {
      if (part.type === "day") {
        return resolvedFormat.day === "2-digit" ? "DD" : "D";
      }

      if (part.type === "month") {
        return resolvedFormat.month === "2-digit" ? "MM" : "M";
      }

      if (part.type === "year") {
        return resolvedFormat.year === "2-digit" ? "YY" : "YYYY";
      }

      return part.value;
    })
    .join("");
}

export function getWeekStartsOn(locale: string) {
  try {
    const localeInfo = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: {
        firstDay?: number;
      };
    };
    const firstDay = localeInfo.weekInfo?.firstDay;

    if (typeof firstDay === "number") {
      return firstDay % 7;
    }
  } catch {
    // Fall back to a minimal region heuristic when Intl.Locale data is unavailable.
  }

  const localeParts = locale.split(/[-_]/);
  const region = localeParts[1]?.toUpperCase();

  if (
    region &&
    new Set([
      "AU",
      "CA",
      "JP",
      "MX",
      "NZ",
      "PH",
      "TW",
      "US",
    ]).has(region)
  ) {
    return 0;
  }

  if (
    region &&
    new Set([
      "AE",
      "AF",
      "BH",
      "DJ",
      "DZ",
      "EG",
      "IQ",
      "IR",
      "JO",
      "KW",
      "LY",
      "OM",
      "QA",
      "SA",
      "SD",
      "SY",
    ]).has(region)
  ) {
    return 6;
  }

  return 1;
}

export function getWeekdayLabels(locale: string, weekStartsOn: number) {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const referenceSunday = createStrictLocalDate(2026, 2, 1)!;

  return Array.from({ length: 7 }, (_, index) => {
    const weekday = addCalendarDays(referenceSunday, (weekStartsOn + index) % 7);

    return formatter.format(weekday);
  });
}
