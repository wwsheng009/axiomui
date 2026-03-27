import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import {
  ChartLegend,
  type ChartLegendLayout,
} from "../_shared/chart-legend";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  type ChartTone,
} from "../_shared/chart-utils";

export interface HarveyBallMicroChartSegment {
  description?: ReactNode;
  fraction?: number | null;
  key: string;
  label: ReactNode;
  tone?: ChartTone;
  valueDisplay?: ReactNode;
}

export interface HarveyBallMicroChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ariaLabel?: string;
  footer?: ReactNode;
  formatValue?: (fraction: number) => string;
  heading?: ReactNode;
  legendLayout?: ChartLegendLayout;
  segments: HarveyBallMicroChartSegment[];
  showLegend?: boolean;
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  trend?: ReactNode;
  value?: ReactNode;
}

interface ResolvedHarveyBallSegment extends HarveyBallMicroChartSegment {
  fractionText: string;
  ratio: number;
  tone: ChartTone;
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

function defaultFormatValue(fraction: number) {
  return formatChartValueText(fraction * 100, {
    maximumFractionDigits: fraction === 0 || fraction === 1 ? 0 : 1,
    suffix: "%",
  });
}

function getBallStyle(ratio: number) {
  return {
    "--ax-harvey-fill": ratio.toString(),
  } as CSSProperties;
}

export function HarveyBallMicroChart({
  ariaLabel,
  className,
  footer,
  formatValue = defaultFormatValue,
  heading,
  legendLayout = "stack",
  segments,
  showLegend = false,
  size = "md",
  supportingText,
  trend,
  value,
  ...props
}: HarveyBallMicroChartProps) {
  const resolvedSegments: ResolvedHarveyBallSegment[] = segments.map((segment) => {
    const ratio = clamp(
      typeof segment.fraction === "number" && Number.isFinite(segment.fraction)
        ? segment.fraction
        : 0,
      0,
      1,
    );

    return {
      ...segment,
      fractionText:
        resolveTextAttribute(segment.valueDisplay) ?? formatValue(ratio),
      ratio,
      tone: segment.tone ?? "neutral",
    };
  });
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText: resolvedSegments
        .map((segment) => {
          const label = resolveTextAttribute(segment.label);

          return label
            ? `${label} ${segment.fractionText}`
            : segment.fractionText;
        })
        .filter(Boolean)
        .join(", "),
      trendText: resolveTextAttribute(trend),
    });

  return (
    <ChartSurface
      bodyClassName="ax-harvey-ball-microchart__surface-body"
      className={cx("ax-harvey-ball-microchart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={value}
      {...props}
    >
      <div
        className="ax-harvey-ball-microchart__grid"
        aria-label={resolvedAriaLabel || undefined}
        role={resolvedAriaLabel ? "img" : undefined}
      >
        {resolvedSegments.map((segment) => (
          <div
            key={segment.key}
            className="ax-harvey-ball-microchart__item"
            data-ratio={segment.ratio.toFixed(4)}
            data-tone={segment.tone}
          >
            <span
              className="ax-harvey-ball-microchart__ball"
              style={getBallStyle(segment.ratio)}
            />
            <span className="ax-harvey-ball-microchart__copy" aria-hidden="true">
              <span
                className="ax-harvey-ball-microchart__label"
                title={resolveTextAttribute(segment.label)}
              >
                {segment.label}
              </span>
              <span className="ax-harvey-ball-microchart__value">
                {segment.fractionText}
              </span>
              {segment.description ? (
                <span className="ax-harvey-ball-microchart__description">
                  {segment.description}
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>

      {showLegend && resolvedSegments.length ? (
        <ChartLegend
          className="ax-harvey-ball-microchart__legend"
          items={resolvedSegments.map((segment) => ({
            description: segment.description,
            key: segment.key,
            label: segment.label,
            tone: segment.tone,
            value: segment.fractionText,
          }))}
          layout={legendLayout}
        />
      ) : null}
    </ChartSurface>
  );
}
