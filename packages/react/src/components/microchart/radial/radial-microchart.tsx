import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cx } from "../../../lib/cx";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  type ChartTone,
} from "../_shared/chart-utils";

const radialRadius = 42;
const radialCircumference = 2 * Math.PI * radialRadius;

export type RadialMicroChartStatus = ChartTone;

export interface RadialMicroChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  ariaLabel?: string;
  centerLabel?: ReactNode;
  centerValue?: ReactNode;
  footer?: ReactNode;
  formatValue?: (value: number, total: number, ratio: number) => string;
  heading?: ReactNode;
  size?: ChartSurfaceSize;
  status?: RadialMicroChartStatus;
  supportingText?: ReactNode;
  total?: number | null;
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

function defaultFormatValue(_value: number, _total: number, ratio: number) {
  return formatChartValueText(ratio * 100, {
    maximumFractionDigits: 1,
    suffix: "%",
  });
}

function getResolvedTotal(total?: number | null) {
  if (!isFiniteNumber(total)) {
    return 100;
  }

  if (total <= 0) {
    return 0;
  }

  return total;
}

function getFigureStyle(ratio: number) {
  return {
    "--ax-radial-progress": ratio.toString(),
    "--ax-radial-circumference": radialCircumference.toString(),
  } as CSSProperties;
}

export function RadialMicroChart({
  ariaLabel,
  centerLabel,
  centerValue,
  className,
  footer,
  formatValue = defaultFormatValue,
  heading,
  size = "md",
  status = "brand",
  supportingText,
  total,
  trend,
  value,
  valueDisplay,
  ...props
}: RadialMicroChartProps) {
  const resolvedTotal = getResolvedTotal(total);
  const rawValue = isFiniteNumber(value) ? value : 0;
  const clampedValue =
    resolvedTotal > 0 ? clamp(rawValue, 0, resolvedTotal) : 0;
  const ratio = resolvedTotal > 0 ? clampedValue / resolvedTotal : 0;
  const ratioText = formatValue(clampedValue, resolvedTotal, ratio);
  const rawValueText = formatChartValueText(clampedValue, {
    maximumFractionDigits: Math.abs(clampedValue) >= 100 ? 0 : 1,
  });
  const totalText = formatChartValueText(resolvedTotal, {
    maximumFractionDigits: Math.abs(resolvedTotal) >= 100 ? 0 : 1,
  });
  const resolvedCenterValue = centerValue ?? ratioText;
  const resolvedValueDisplay = valueDisplay ?? undefined;
  const resolvedDescription = [
    resolveTextAttribute(supportingText),
    resolveTextAttribute(centerLabel),
  ]
    .filter(Boolean)
    .join(", ");
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolvedDescription || undefined,
      valueText: `${rawValueText} of ${totalText} (${ratioText})`,
      trendText: resolveTextAttribute(trend),
    });

  return (
    <ChartSurface
      bodyClassName="ax-radial-microchart__surface-body"
      className={cx("ax-radial-microchart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={resolvedValueDisplay}
      {...props}
    >
      <div
        className="ax-radial-microchart__figure"
        data-ratio={ratio.toFixed(4)}
        data-status={status}
        style={getFigureStyle(ratio)}
      >
        <svg
          className="ax-radial-microchart__svg"
          viewBox="0 0 100 100"
          role={resolvedAriaLabel ? "img" : undefined}
          aria-label={resolvedAriaLabel || undefined}
        >
          <circle
            className="ax-radial-microchart__track"
            cx="50"
            cy="50"
            r={radialRadius}
          />
          <circle
            className="ax-radial-microchart__progress"
            cx="50"
            cy="50"
            r={radialRadius}
          />
        </svg>

        <span className="ax-radial-microchart__center" aria-hidden="true">
          <span
            className="ax-radial-microchart__center-value"
            title={resolveTextAttribute(resolvedCenterValue)}
          >
            {resolvedCenterValue}
          </span>
          {centerLabel ? (
            <span
              className="ax-radial-microchart__center-label"
              title={resolveTextAttribute(centerLabel)}
            >
              {centerLabel}
            </span>
          ) : null}
        </span>
      </div>
    </ChartSurface>
  );
}
