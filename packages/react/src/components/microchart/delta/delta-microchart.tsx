import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  type ChartTone,
} from "../_shared/chart-utils";

export type DeltaMicroChartDirection = "auto" | "up" | "down" | "flat";
export type DeltaMicroChartStatus = ChartTone;

type ResolvedDeltaMicroChartDirection = Exclude<
  DeltaMicroChartDirection,
  "auto"
>;

export interface DeltaMicroChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ariaLabel?: string;
  direction?: DeltaMicroChartDirection;
  footer?: ReactNode;
  formatValue?: (value: number) => string;
  heading?: ReactNode;
  scaleMax?: number;
  size?: ChartSurfaceSize;
  status?: DeltaMicroChartStatus;
  supportingText?: ReactNode;
  trend?: ReactNode;
  value?: number | null;
  valueDisplay?: ReactNode;
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
    signDisplay: "exceptZero",
  });
}

function resolveDirection(
  direction: DeltaMicroChartDirection,
  value: number,
): ResolvedDeltaMicroChartDirection {
  if (direction !== "auto") {
    return direction;
  }

  if (value > 0) {
    return "up";
  }

  if (value < 0) {
    return "down";
  }

  return "flat";
}

function resolveDirectionLabel(direction: ResolvedDeltaMicroChartDirection) {
  switch (direction) {
    case "up":
      return "Increase";
    case "down":
      return "Decrease";
    default:
      return "Stable";
  }
}

function resolveTone(
  status: DeltaMicroChartStatus | undefined,
  direction: ResolvedDeltaMicroChartDirection,
) {
  if (status) {
    return status;
  }

  switch (direction) {
    case "up":
      return "success";
    case "down":
      return "error";
    default:
      return "neutral";
  }
}

function resolveScaleMax(scaleMax: number | undefined, value: number) {
  if (isFiniteNumber(scaleMax) && scaleMax > 0) {
    return scaleMax;
  }

  const absoluteValue = Math.abs(value);

  if (absoluteValue > 0) {
    return absoluteValue;
  }

  return 1;
}

function getFigureStyle(magnitude: number) {
  return {
    "--ax-delta-magnitude": magnitude.toString(),
  } as CSSProperties;
}

export function DeltaMicroChart({
  ariaLabel,
  className,
  direction = "auto",
  footer,
  formatValue = defaultFormatValue,
  heading,
  scaleMax,
  size = "md",
  status,
  supportingText,
  trend,
  value,
  valueDisplay,
  ...props
}: DeltaMicroChartProps) {
  const resolvedValue = isFiniteNumber(value) ? value : 0;
  const resolvedDirection = resolveDirection(direction, resolvedValue);
  const resolvedTone = resolveTone(status, resolvedDirection);
  const resolvedScaleMax = resolveScaleMax(scaleMax, resolvedValue);
  const magnitude =
    resolvedScaleMax > 0
      ? clamp(Math.abs(resolvedValue) / resolvedScaleMax, 0, 1)
      : 0;
  const directionLabel = resolveDirectionLabel(resolvedDirection);
  const valueText = formatValue(resolvedValue);
  const resolvedValueDisplay = valueDisplay ?? valueText;
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText: `${directionLabel} ${valueText}`.trim(),
      trendText: resolveTextAttribute(trend),
    });

  return (
    <ChartSurface
      bodyClassName="ax-delta-microchart__surface-body"
      className={cx("ax-delta-microchart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={resolvedValueDisplay}
      {...props}
    >
      <div
        className="ax-delta-microchart__figure"
        data-direction={resolvedDirection}
        data-magnitude={magnitude.toFixed(4)}
        data-tone={resolvedTone}
        style={getFigureStyle(magnitude)}
      >
        <div
          className="ax-delta-microchart__track"
          aria-label={resolvedAriaLabel || undefined}
          role={resolvedAriaLabel ? "img" : undefined}
        >
          <span className="ax-delta-microchart__axis" aria-hidden="true" />
          <span className="ax-delta-microchart__indicator" aria-hidden="true">
            <span className="ax-delta-microchart__shaft" />
            <span className="ax-delta-microchart__head" />
          </span>
        </div>

        <div className="ax-delta-microchart__summary" aria-hidden="true">
          <span className="ax-delta-microchart__summary-label">
            {directionLabel}
          </span>
          <span className="ax-delta-microchart__summary-value">{valueText}</span>
        </div>
      </div>
    </ChartSurface>
  );
}
