import type { DateRangeValue } from "@axiomui/react";

export interface WorklistScheduleLike {
  targetDate: string;
  targetTime: string;
}

const canonicalTimeValuePattern = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

function isChineseLocale(locale: string) {
  return locale.toLowerCase().startsWith("zh");
}

export function normalizeDateRangeValue(
  value: Partial<DateRangeValue> | null | undefined,
): DateRangeValue {
  return {
    end: typeof value?.end === "string" ? value.end : "",
    start: typeof value?.start === "string" ? value.start : "",
  };
}

export function areDateRangeValuesEqual(left: DateRangeValue, right: DateRangeValue) {
  return left.start === right.start && left.end === right.end;
}

export function normalizeTimeValue(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const normalizedValue = value.trim();

  return canonicalTimeValuePattern.test(normalizedValue) ? normalizedValue : "";
}

export function matchesDateRangeFilter(value: string, range: DateRangeValue) {
  if (!range.start && !range.end) {
    return true;
  }

  if (range.start && value < range.start) {
    return false;
  }

  if (range.end && value > range.end) {
    return false;
  }

  return true;
}

export function matchesTimeFromFilter(value: string, query: string) {
  if (!query) {
    return true;
  }

  return value >= query;
}

export function formatWorklistDateLabel(value: string, locale: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(Number.NaN);

  if (Number.isNaN(date.getTime())) {
    return isChineseLocale(locale) ? "未知日期" : "Unknown date";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatWorklistDateRangeLabel(value: DateRangeValue, locale: string) {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startDate = /^\d{4}-\d{2}-\d{2}$/.test(value.start)
    ? new Date(`${value.start}T12:00:00`)
    : new Date(Number.NaN);
  const endDate = /^\d{4}-\d{2}-\d{2}$/.test(value.end)
    ? new Date(`${value.end}T12:00:00`)
    : new Date(Number.NaN);
  const hasStart = !Number.isNaN(startDate.getTime());
  const hasEnd = !Number.isNaN(endDate.getTime());

  if (hasStart && hasEnd) {
    return isChineseLocale(locale)
      ? `${formatter.format(startDate)} 至 ${formatter.format(endDate)}`
      : `${formatter.format(startDate)} -> ${formatter.format(endDate)}`;
  }

  if (hasStart) {
    return isChineseLocale(locale)
      ? `从 ${formatter.format(startDate)}`
      : `From ${formatter.format(startDate)}`;
  }

  if (hasEnd) {
    return isChineseLocale(locale)
      ? `截至 ${formatter.format(endDate)}`
      : `Until ${formatter.format(endDate)}`;
  }

  return isChineseLocale(locale) ? "任意日期" : "Any";
}

export function formatWorklistTimeLabel(value: string, locale: string) {
  const match = value.match(canonicalTimeValuePattern);

  if (!match) {
    return isChineseLocale(locale) ? "任意时间" : "Any";
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    ...(match[3] ? { second: "2-digit" } : {}),
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, hour, minute, second)));
}

export function formatWorklistScheduleLabel(
  workItem: WorklistScheduleLike,
  locale: string,
) {
  return `${formatWorklistDateLabel(workItem.targetDate, locale)} · ${formatWorklistTimeLabel(workItem.targetTime, locale)}`;
}
