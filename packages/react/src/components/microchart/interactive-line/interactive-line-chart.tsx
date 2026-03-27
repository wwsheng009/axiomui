import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../../lib/cx";
import { ChartSurface, type ChartSurfaceSize } from "../_shared/chart-surface";
import {
  buildChartAriaLabel,
  formatChartValueText,
  getChartToneToken,
  type ChartTone,
} from "../_shared/chart-utils";

const chartWidth = 100;
const chartHeight = 60;
const chartPaddingX = 8;
const chartPaddingY = 8;

export interface InteractiveLineChartPoint {
  description?: ReactNode;
  key: string;
  label: ReactNode;
  tone?: ChartTone;
  value?: number | null;
  valueDisplay?: ReactNode;
}

export interface InteractiveLineChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  activeKey?: string;
  ariaLabel?: string;
  defaultActiveKey?: string;
  footer?: ReactNode;
  formatValue?: (value: number) => string;
  heading?: ReactNode;
  lineTone?: ChartTone;
  onActiveChange?: (
    key: string,
    point: InteractiveLineChartPoint,
  ) => void;
  onPointClick?: (point: InteractiveLineChartPoint) => void;
  points: InteractiveLineChartPoint[];
  showAxisLabels?: boolean;
  showExtremes?: boolean;
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  trend?: ReactNode;
  value?: ReactNode;
}

interface ResolvedInteractiveLineChartPoint
  extends Omit<InteractiveLineChartPoint, "value"> {
  cx: number;
  cy: number;
  normalizedTone: ChartTone;
  value: number;
  valueText: string;
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

function buildPath(points: ResolvedInteractiveLineChartPoint[]) {
  if (!points.length) {
    return "";
  }

  return points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.cx.toFixed(2)} ${point.cy.toFixed(2)}`,
    )
    .join(" ");
}

function normalizePointValue(
  rawValue: number,
  minValue: number,
  maxValue: number,
) {
  if (maxValue <= minValue) {
    return chartHeight / 2;
  }

  const drawableHeight = chartHeight - chartPaddingY * 2;
  const ratio = clamp((rawValue - minValue) / (maxValue - minValue), 0, 1);

  return chartHeight - chartPaddingY - ratio * drawableHeight;
}

export function InteractiveLineChart({
  activeKey,
  ariaLabel,
  className,
  defaultActiveKey,
  footer,
  formatValue = defaultFormatValue,
  heading,
  lineTone = "brand",
  onActiveChange,
  onPointClick,
  points,
  showAxisLabels = true,
  showExtremes = true,
  size = "md",
  supportingText,
  trend,
  value,
  ...props
}: InteractiveLineChartProps) {
  const normalizedValues = useMemo(
    () =>
      points.map((point) =>
        isFiniteNumber(point.value) ? point.value : 0,
      ),
    [points],
  );
  const minValue = normalizedValues.length ? Math.min(...normalizedValues) : 0;
  const maxValue = normalizedValues.length ? Math.max(...normalizedValues) : 0;
  const resolvedPoints = useMemo(() => {
    const drawableWidth = chartWidth - chartPaddingX * 2;
    const step =
      points.length > 1 ? drawableWidth / (points.length - 1) : 0;

    return points.map((point, index) => {
      const resolvedValue = normalizedValues[index] ?? 0;

      return {
        ...point,
        cx: chartPaddingX + step * index,
        cy: normalizePointValue(resolvedValue, minValue, maxValue),
        normalizedTone: point.tone ?? lineTone,
        value: resolvedValue,
        valueText:
          resolveTextAttribute(point.valueDisplay) ?? formatValue(resolvedValue),
      } satisfies ResolvedInteractiveLineChartPoint;
    });
  }, [formatValue, lineTone, maxValue, minValue, normalizedValues, points]);
  const pathDefinition = useMemo(() => buildPath(resolvedPoints), [resolvedPoints]);
  const firstPointKey = resolvedPoints[0]?.key;
  const [hoveredKey, setHoveredKey] = useState<string | undefined>();
  const [uncontrolledActiveKey, setUncontrolledActiveKey] = useState<
    string | undefined
  >(defaultActiveKey);
  const [focusKey, setFocusKey] = useState<string | undefined>(defaultActiveKey);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (activeKey !== undefined) {
      return;
    }

    if (
      uncontrolledActiveKey &&
      resolvedPoints.some((point) => point.key === uncontrolledActiveKey)
    ) {
      return;
    }

    setUncontrolledActiveKey(firstPointKey);
  }, [activeKey, firstPointKey, resolvedPoints, uncontrolledActiveKey]);

  useEffect(() => {
    if (focusKey && resolvedPoints.some((point) => point.key === focusKey)) {
      return;
    }

    setFocusKey(activeKey ?? uncontrolledActiveKey ?? firstPointKey);
  }, [activeKey, firstPointKey, focusKey, resolvedPoints, uncontrolledActiveKey]);

  const resolvedActiveKey = activeKey ?? uncontrolledActiveKey ?? firstPointKey;
  const visualActiveKey = hoveredKey ?? resolvedActiveKey;
  const activePoint =
    resolvedPoints.find((point) => point.key === visualActiveKey) ??
    resolvedPoints[0];
  const minPoint =
    resolvedPoints.find((point) => point.value === minValue) ?? resolvedPoints[0];
  const maxPoint =
    resolvedPoints.find((point) => point.value === maxValue) ?? resolvedPoints[0];
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText:
        resolvedPoints.length > 0
          ? resolvedPoints
              .map((point) => {
                const label = resolveTextAttribute(point.label);

                return label ? `${label} ${point.valueText}` : point.valueText;
              })
              .filter(Boolean)
              .join(", ")
          : "No point data",
      trendText: resolveTextAttribute(trend),
    });

  function setActivePoint(point: ResolvedInteractiveLineChartPoint) {
    if (activeKey === undefined) {
      setUncontrolledActiveKey(point.key);
    }

    onActiveChange?.(point.key, point);
  }

  function moveFocus(step: number) {
    if (!resolvedPoints.length) {
      return;
    }

    const currentIndex = Math.max(
      0,
      resolvedPoints.findIndex((point) => point.key === focusKey),
    );
    const nextIndex =
      (currentIndex + step + resolvedPoints.length) % resolvedPoints.length;
    const nextPoint = resolvedPoints[nextIndex];

    if (!nextPoint) {
      return;
    }

    setFocusKey(nextPoint.key);
    buttonRefs.current[nextIndex]?.focus();
  }

  function handlePointKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    point: ResolvedInteractiveLineChartPoint,
    index: number,
  ) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setFocusKey(resolvedPoints[0]?.key);
      buttonRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = resolvedPoints.length - 1;
      setFocusKey(resolvedPoints[lastIndex]?.key);
      buttonRefs.current[lastIndex]?.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActivePoint(point);
      onPointClick?.(point);
      return;
    }

    if (event.key === "Tab") {
      setFocusKey(point.key);
    }

    if (index >= 0) {
      return;
    }
  }

  return (
    <ChartSurface
      bodyClassName="ax-interactive-line-chart__surface-body"
      className={cx("ax-interactive-line-chart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={value}
      {...props}
    >
      <div className="ax-interactive-line-chart__plot">
        <svg
          className="ax-interactive-line-chart__svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role={resolvedAriaLabel ? "img" : undefined}
          aria-label={resolvedAriaLabel || undefined}
        >
          <line
            className="ax-interactive-line-chart__baseline"
            x1={chartPaddingX}
            x2={chartWidth - chartPaddingX}
            y1={chartHeight - chartPaddingY}
            y2={chartHeight - chartPaddingY}
          />
          {pathDefinition ? (
            <path
              className="ax-interactive-line-chart__path"
              d={pathDefinition}
              style={
                {
                  "--ax-interactive-line-color": getChartToneToken(lineTone),
                } as CSSProperties
              }
            />
          ) : null}

          {resolvedPoints.map((point) => {
            const isActive = point.key === visualActiveKey;
            const extreme =
              point.key === minPoint?.key
                ? "min"
                : point.key === maxPoint?.key
                  ? "max"
                  : undefined;

            return (
              <circle
                key={point.key}
                className="ax-interactive-line-chart__point"
                cx={point.cx}
                cy={point.cy}
                r={isActive ? 4.5 : 3.25}
                data-active={isActive}
                data-extreme={showExtremes ? extreme : undefined}
                data-tone={point.normalizedTone}
                onClick={() => {
                  setActivePoint(point);
                  onPointClick?.(point);
                }}
                onMouseEnter={() => setHoveredKey(point.key)}
                onMouseLeave={() => setHoveredKey(undefined)}
              />
            );
          })}
        </svg>

        {showAxisLabels && resolvedPoints.length > 0 ? (
          <div className="ax-interactive-line-chart__axis" aria-hidden="true">
            <span className="ax-interactive-line-chart__axis-label">
              {resolvedPoints[0]?.label}
            </span>
            <span className="ax-interactive-line-chart__axis-label">
              {resolvedPoints[resolvedPoints.length - 1]?.label}
            </span>
          </div>
        ) : null}
      </div>

      {activePoint ? (
        <div
          className="ax-interactive-line-chart__detail"
          data-tone={activePoint.normalizedTone}
        >
          <span className="ax-interactive-line-chart__detail-label">
            {activePoint.label}
          </span>
          <span className="ax-interactive-line-chart__detail-value">
            {activePoint.valueText}
          </span>
          {activePoint.description ? (
            <span className="ax-interactive-line-chart__detail-description">
              {activePoint.description}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="ax-interactive-line-chart__empty">No point data</div>
      )}

      <div className="ax-interactive-line-chart__points">
        {resolvedPoints.length > 0 ? (
          resolvedPoints.map((point, index) => (
            <button
              key={point.key}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              className="ax-interactive-line-chart__point-button"
              type="button"
              data-active={point.key === visualActiveKey}
              data-tone={point.normalizedTone}
              aria-pressed={point.key === visualActiveKey}
              onClick={() => {
                setActivePoint(point);
                onPointClick?.(point);
              }}
              onFocus={() => {
                setFocusKey(point.key);
                setHoveredKey(point.key);
              }}
              onBlur={() => setHoveredKey(undefined)}
              onKeyDown={(event) => handlePointKeyDown(event, point, index)}
              onMouseEnter={() => setHoveredKey(point.key)}
              onMouseLeave={() => setHoveredKey(undefined)}
              tabIndex={point.key === focusKey ? 0 : -1}
            >
              <span className="ax-interactive-line-chart__point-copy">
                <span
                  className="ax-interactive-line-chart__point-label"
                  title={resolveTextAttribute(point.label)}
                >
                  {point.label}
                </span>
                <span className="ax-interactive-line-chart__point-value">
                  {point.valueText}
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="ax-interactive-line-chart__empty">No point data</div>
        )}
      </div>
    </ChartSurface>
  );
}
