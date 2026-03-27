import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  type ChartTone,
} from "../_shared/chart-utils";

export interface BulletMicroChartRange {
  key: string;
  label?: ReactNode;
  tone?: ChartTone;
  value: number;
}

export interface BulletMicroChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  actual?: number | null;
  actualLabel?: ReactNode;
  actualTone?: ChartTone;
  ariaLabel?: string;
  footer?: ReactNode;
  forecast?: number | null;
  forecastLabel?: ReactNode;
  forecastTone?: ChartTone;
  formatValue?: (value: number) => string;
  heading?: ReactNode;
  max?: number;
  min?: number;
  ranges?: BulletMicroChartRange[];
  showLabels?: boolean;
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  target?: number | null;
  targetLabel?: ReactNode;
  trend?: ReactNode;
  value?: ReactNode;
}

interface BulletSummaryItem {
  key: "actual" | "forecast" | "target";
  label: ReactNode;
  tone?: ChartTone;
  valueText: string;
}

interface BulletRangeSegment {
  key: string;
  tone: ChartTone;
  width: string;
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveTextAttribute(value: ReactNode) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function defaultFormatValue(value: number) {
  return formatChartValueText(value, {
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
  });
}

function getSafeScale(
  min: number | undefined,
  max: number | undefined,
  actual: number | undefined,
  forecast: number | undefined,
  target: number | undefined,
  ranges: BulletMicroChartRange[],
) {
  const resolvedMin = isFiniteNumber(min) ? min : 0;
  const derivedMax = Math.max(
    resolvedMin,
    actual ?? resolvedMin,
    forecast ?? resolvedMin,
    target ?? resolvedMin,
    ...ranges
      .map((range) => range.value)
      .filter((value): value is number => Number.isFinite(value)),
  );
  const candidateMax = isFiniteNumber(max) ? max : derivedMax;
  const resolvedMax = candidateMax > resolvedMin ? candidateMax : resolvedMin + 1;

  return {
    resolvedMax,
    resolvedMin,
    scaleSpan: resolvedMax - resolvedMin,
  };
}

function toPercent(value: number, min: number, span: number) {
  return `${((clamp(value, min, min + span) - min) / span) * 100}%`;
}

function buildRangeSegments(
  ranges: BulletMicroChartRange[],
  min: number,
  max: number,
  span: number,
) {
  const normalizedRanges = ranges
    .filter((range) => Number.isFinite(range.value))
    .sort((left, right) => left.value - right.value);

  if (!normalizedRanges.length) {
    return [
      {
        key: "default-range",
        tone: "neutral" as const,
        width: "100%",
      },
    ];
  }

  const segments: BulletRangeSegment[] = [];
  let previous = min;

  normalizedRanges.forEach((range) => {
    const stop = clamp(range.value, min, max);

    if (stop <= previous) {
      return;
    }

    segments.push({
      key: range.key,
      tone: range.tone ?? "neutral",
      width: `${((stop - previous) / span) * 100}%`,
    });

    previous = stop;
  });

  if (!segments.length) {
    return [
      {
        key: "default-range",
        tone: "neutral" as const,
        width: "100%",
      },
    ];
  }

  if (previous < max) {
    const lastTone = normalizedRanges[normalizedRanges.length - 1]?.tone ?? "neutral";

    segments.push({
      key: "tail-range",
      tone: lastTone,
      width: `${((max - previous) / span) * 100}%`,
    });
  }

  return segments;
}

export function BulletMicroChart({
  actual,
  actualLabel = "Actual",
  actualTone = "brand",
  ariaLabel,
  className,
  footer,
  forecast,
  forecastLabel = "Forecast",
  forecastTone = "information",
  formatValue = defaultFormatValue,
  heading,
  max,
  min,
  ranges = [],
  showLabels = true,
  size = "md",
  supportingText,
  target,
  targetLabel = "Target",
  trend,
  value,
  ...props
}: BulletMicroChartProps) {
  const resolvedActual = isFiniteNumber(actual) ? actual : undefined;
  const resolvedForecast = isFiniteNumber(forecast) ? forecast : undefined;
  const resolvedTarget = isFiniteNumber(target) ? target : undefined;
  const { resolvedMax, resolvedMin, scaleSpan } = getSafeScale(
    min,
    max,
    resolvedActual,
    resolvedForecast,
    resolvedTarget,
    ranges,
  );

  const actualValueText =
    resolvedActual !== undefined ? formatValue(resolvedActual) : undefined;
  const forecastValueText =
    resolvedForecast !== undefined ? formatValue(resolvedForecast) : undefined;
  const targetValueText =
    resolvedTarget !== undefined ? formatValue(resolvedTarget) : undefined;
  const resolvedHeaderValue = value ?? actualValueText;
  const rangeSegments = buildRangeSegments(
    ranges,
    resolvedMin,
    resolvedMax,
    scaleSpan,
  );
  const summaryItems: BulletSummaryItem[] = [];

  if (actualValueText) {
    summaryItems.push({
      key: "actual",
      label: actualLabel,
      tone: actualTone,
      valueText: actualValueText,
    });
  }

  if (forecastValueText) {
    summaryItems.push({
      key: "forecast",
      label: forecastLabel,
      tone: forecastTone,
      valueText: forecastValueText,
    });
  }

  if (targetValueText) {
    summaryItems.push({
      key: "target",
      label: targetLabel,
      valueText: targetValueText,
    });
  }
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText: [
        actualValueText ? `Actual ${actualValueText}` : undefined,
        forecastValueText ? `Forecast ${forecastValueText}` : undefined,
      ]
        .filter(Boolean)
        .join(", "),
      footerText: targetValueText ? `Target ${targetValueText}` : undefined,
      trendText: resolveTextAttribute(trend),
    });

  return (
    <ChartSurface
      bodyClassName="ax-bullet-microchart__surface-body"
      className={cx("ax-bullet-microchart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={resolvedHeaderValue}
      {...props}
    >
      <div className="ax-bullet-microchart__plot">
        <div
          className="ax-bullet-microchart__track"
          aria-label={resolvedAriaLabel || undefined}
          role={resolvedAriaLabel ? "img" : undefined}
        >
          {rangeSegments.map((segment) => (
            <span
              key={segment.key}
              className="ax-bullet-microchart__range"
              data-tone={segment.tone}
              style={{ width: segment.width }}
            />
          ))}
          {resolvedForecast !== undefined ? (
            <span
              className="ax-bullet-microchart__forecast"
              data-tone={forecastTone}
              style={{
                width: toPercent(resolvedForecast, resolvedMin, scaleSpan),
              }}
            />
          ) : null}
          {resolvedActual !== undefined ? (
            <span
              className="ax-bullet-microchart__actual"
              data-tone={actualTone}
              style={{
                width: toPercent(resolvedActual, resolvedMin, scaleSpan),
              }}
            />
          ) : null}
          {resolvedTarget !== undefined ? (
            <span
              className="ax-bullet-microchart__target"
              style={{
                insetInlineStart: toPercent(resolvedTarget, resolvedMin, scaleSpan),
              }}
            />
          ) : null}
        </div>

        <div className="ax-bullet-microchart__axis" aria-hidden="true">
          <span className="ax-bullet-microchart__axis-value">
            {formatValue(resolvedMin)}
          </span>
          <span className="ax-bullet-microchart__axis-value">
            {formatValue(resolvedMax)}
          </span>
        </div>
      </div>

      {showLabels && summaryItems.length ? (
        <div className="ax-bullet-microchart__summary">
          {summaryItems.map((item) => (
            <div
              key={item.key}
              className="ax-bullet-microchart__summary-item"
              data-kind={item.key}
            >
              <span
                className="ax-bullet-microchart__summary-marker"
                data-tone={item.tone}
                aria-hidden="true"
              />
              <span className="ax-bullet-microchart__summary-copy">
                <span
                  className="ax-bullet-microchart__summary-label"
                  title={resolveTextAttribute(item.label)}
                >
                  {item.label}
                </span>
                <span className="ax-bullet-microchart__summary-value">
                  {item.valueText}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </ChartSurface>
  );
}
