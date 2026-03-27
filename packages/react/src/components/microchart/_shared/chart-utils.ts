import { formatNumber } from "../../../lib/i18n/format";

export type ChartTone =
  | "brand"
  | "information"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export interface BuildChartAriaLabelInput {
  description?: string;
  footerText?: string;
  title?: string;
  trendText?: string;
  valueText?: string;
}

export interface FormatChartValueTextOptions extends Intl.NumberFormatOptions {
  locale?: string;
  prefix?: string;
  suffix?: string;
}

const chartSeriesCount = 6;

function normalizeText(value?: string | null) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export function normalizeChartSeriesIndex(index: number) {
  if (!Number.isFinite(index)) {
    return 1;
  }

  const normalized = Math.abs(Math.trunc(index));

  if (normalized === 0) {
    return 1;
  }

  return ((normalized - 1) % chartSeriesCount) + 1;
}

export function formatChartValueText(
  value: number | string | null | undefined,
  options: FormatChartValueTextOptions = {},
) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const { locale, prefix = "", suffix = "", ...numberOptions } = options;
  const resolvedValue =
    typeof value === "number"
      ? Number.isFinite(value)
        ? formatNumber(value, numberOptions, { locale })
        : ""
      : normalizeText(value);

  if (!resolvedValue) {
    return "";
  }

  return `${prefix}${resolvedValue}${suffix}`.trim();
}

export function buildChartAriaLabel({
  description,
  footerText,
  title,
  trendText,
  valueText,
}: BuildChartAriaLabelInput) {
  return [title, description, valueText, trendText, footerText]
    .map(normalizeText)
    .filter(Boolean)
    .join(", ");
}

export function getChartToneToken(tone: ChartTone, soft = false) {
  return soft
    ? `var(--ax-chart-tone-${tone}-soft)`
    : `var(--ax-chart-tone-${tone})`;
}

export function getChartSeriesToken(index: number) {
  return `var(--ax-chart-series-${normalizeChartSeriesIndex(index)})`;
}
