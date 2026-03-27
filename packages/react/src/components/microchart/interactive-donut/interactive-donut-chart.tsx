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
  type ChartTone,
} from "../_shared/chart-utils";

const donutRadius = 38;
const donutCircumference = 2 * Math.PI * donutRadius;

export interface InteractiveDonutChartSegment {
  description?: ReactNode;
  key: string;
  label: ReactNode;
  tone?: ChartTone;
  value?: number | null;
  valueDisplay?: ReactNode;
}

export interface InteractiveDonutChartProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  activeKey?: string;
  ariaLabel?: string;
  centerLabel?: ReactNode;
  centerValue?: ReactNode;
  defaultActiveKey?: string;
  footer?: ReactNode;
  formatValue?: (value: number, total: number, ratio: number) => string;
  heading?: ReactNode;
  onActiveChange?: (
    key: string,
    segment: InteractiveDonutChartSegment,
  ) => void;
  onSegmentClick?: (segment: InteractiveDonutChartSegment) => void;
  segments: InteractiveDonutChartSegment[];
  size?: ChartSurfaceSize;
  supportingText?: ReactNode;
  total?: number | null;
  trend?: ReactNode;
  value?: ReactNode;
}

interface ResolvedInteractiveDonutChartSegment
  extends Omit<InteractiveDonutChartSegment, "value"> {
  ratio: number;
  strokeDasharray: string;
  strokeDashoffset: number;
  tone: ChartTone;
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

function defaultFormatValue(value: number, total: number, ratio: number) {
  if (total <= 0) {
    return formatChartValueText(value, {
      maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 1,
    });
  }

  return formatChartValueText(ratio * 100, {
    maximumFractionDigits: ratio === 0 || ratio === 1 ? 0 : 1,
    suffix: "%",
  });
}

function resolveTotal(
  total: number | null | undefined,
  segmentValues: number[],
) {
  if (isFiniteNumber(total) && total > 0) {
    return total;
  }

  const derivedTotal = segmentValues.reduce((sum, value) => sum + value, 0);

  if (derivedTotal > 0) {
    return derivedTotal;
  }

  return 0;
}

function getSegmentStyle() {
  return {
    "--ax-interactive-donut-circumference": donutCircumference.toString(),
  } as CSSProperties;
}

export function InteractiveDonutChart({
  activeKey,
  ariaLabel,
  centerLabel,
  centerValue,
  className,
  defaultActiveKey,
  footer,
  formatValue = defaultFormatValue,
  heading,
  onActiveChange,
  onSegmentClick,
  segments,
  size = "md",
  supportingText,
  total,
  trend,
  value,
  ...props
}: InteractiveDonutChartProps) {
  const segmentValues = useMemo(
    () =>
      segments.map((segment) =>
        isFiniteNumber(segment.value) ? Math.max(segment.value, 0) : 0,
      ),
    [segments],
  );
  const resolvedTotal = useMemo(
    () => resolveTotal(total, segmentValues),
    [segmentValues, total],
  );
  const resolvedSegments = useMemo(() => {
    let consumedRatio = 0;

    return segments.map((segment, index) => {
      const resolvedValue = segmentValues[index] ?? 0;
      const ratio =
        resolvedTotal > 0 ? clamp(resolvedValue / resolvedTotal, 0, 1) : 0;
      const strokeDasharray = `${ratio * donutCircumference} ${donutCircumference}`;
      const strokeDashoffset = donutCircumference * (1 - consumedRatio);
      const resolvedSegment: ResolvedInteractiveDonutChartSegment = {
        ...segment,
        ratio,
        strokeDasharray,
        strokeDashoffset,
        tone: segment.tone ?? "neutral",
        value: resolvedValue,
        valueText:
          resolveTextAttribute(segment.valueDisplay) ??
          formatValue(resolvedValue, resolvedTotal, ratio),
      };

      consumedRatio += ratio;

      return resolvedSegment;
    });
  }, [formatValue, resolvedTotal, segmentValues, segments]);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [hoveredKey, setHoveredKey] = useState<string | undefined>();
  const [uncontrolledActiveKey, setUncontrolledActiveKey] = useState<
    string | undefined
  >(defaultActiveKey);
  const [focusKey, setFocusKey] = useState<string | undefined>(defaultActiveKey);
  const firstSegmentKey = resolvedSegments[0]?.key;

  useEffect(() => {
    if (activeKey !== undefined) {
      return;
    }

    if (
      uncontrolledActiveKey &&
      resolvedSegments.some((segment) => segment.key === uncontrolledActiveKey)
    ) {
      return;
    }

    setUncontrolledActiveKey(firstSegmentKey);
  }, [activeKey, firstSegmentKey, resolvedSegments, uncontrolledActiveKey]);

  useEffect(() => {
    if (
      focusKey &&
      resolvedSegments.some((segment) => segment.key === focusKey)
    ) {
      return;
    }

    setFocusKey(activeKey ?? uncontrolledActiveKey ?? firstSegmentKey);
  }, [activeKey, firstSegmentKey, focusKey, resolvedSegments, uncontrolledActiveKey]);

  const resolvedActiveKey = activeKey ?? uncontrolledActiveKey ?? firstSegmentKey;
  const visualActiveKey = hoveredKey ?? resolvedActiveKey;
  const activeSegment =
    resolvedSegments.find((segment) => segment.key === visualActiveKey) ??
    resolvedSegments[0];
  const resolvedCenterValue =
    centerValue ?? activeSegment?.valueText ?? "No data";
  const resolvedCenterLabel =
    centerLabel ?? activeSegment?.label ?? "Segments";
  const resolvedAriaLabel =
    ariaLabel ??
    buildChartAriaLabel({
      title: resolveTextAttribute(heading),
      description: resolveTextAttribute(supportingText),
      valueText:
        resolvedSegments.length > 0
          ? resolvedSegments
              .map((segment) => {
                const label = resolveTextAttribute(segment.label);

                return label ? `${label} ${segment.valueText}` : segment.valueText;
              })
              .filter(Boolean)
              .join(", ")
          : "No segment data",
      trendText: resolveTextAttribute(trend),
    });

  function setActiveSegment(segment: ResolvedInteractiveDonutChartSegment) {
    if (activeKey === undefined) {
      setUncontrolledActiveKey(segment.key);
    }

    onActiveChange?.(segment.key, segment);
  }

  function moveFocus(step: number) {
    if (!resolvedSegments.length) {
      return;
    }

    const currentIndex = Math.max(
      0,
      resolvedSegments.findIndex((segment) => segment.key === focusKey),
    );
    const nextIndex =
      (currentIndex + step + resolvedSegments.length) % resolvedSegments.length;
    const nextSegment = resolvedSegments[nextIndex];

    if (!nextSegment) {
      return;
    }

    setFocusKey(nextSegment.key);
    buttonRefs.current[nextIndex]?.focus();
  }

  function handleButtonKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    segment: ResolvedInteractiveDonutChartSegment,
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
      setFocusKey(resolvedSegments[0]?.key);
      buttonRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = resolvedSegments.length - 1;
      setFocusKey(resolvedSegments[lastIndex]?.key);
      buttonRefs.current[lastIndex]?.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveSegment(segment);
      onSegmentClick?.(segment);
      return;
    }

    if (event.key === "Tab") {
      setFocusKey(segment.key);
    }

    if (index >= 0) {
      return;
    }
  }

  return (
    <ChartSurface
      bodyClassName="ax-interactive-donut-chart__surface-body"
      className={cx("ax-interactive-donut-chart", className)}
      footer={footer}
      heading={heading}
      size={size}
      supportingText={supportingText}
      trend={trend}
      value={value}
      {...props}
    >
      <div className="ax-interactive-donut-chart__layout">
        <div className="ax-interactive-donut-chart__figure-shell">
          <div
            className="ax-interactive-donut-chart__figure"
            style={getSegmentStyle()}
          >
            <svg
              className="ax-interactive-donut-chart__svg"
              viewBox="0 0 100 100"
              role={resolvedAriaLabel ? "img" : undefined}
              aria-label={resolvedAriaLabel || undefined}
            >
              <circle
                className="ax-interactive-donut-chart__track"
                cx="50"
                cy="50"
                r={donutRadius}
              />
              {resolvedSegments.length > 0 ? (
                resolvedSegments.map((segment) => (
                  <circle
                    key={segment.key}
                    className="ax-interactive-donut-chart__segment"
                    cx="50"
                    cy="50"
                    r={donutRadius}
                    data-active={segment.key === visualActiveKey}
                    data-tone={segment.tone}
                    strokeDasharray={segment.strokeDasharray}
                    strokeDashoffset={segment.strokeDashoffset}
                    onClick={() => {
                      setActiveSegment(segment);
                      onSegmentClick?.(segment);
                    }}
                    onMouseEnter={() => setHoveredKey(segment.key)}
                    onMouseLeave={() => setHoveredKey(undefined)}
                  />
                ))
              ) : (
                <text
                  className="ax-interactive-donut-chart__empty-copy"
                  x="50"
                  y="50"
                >
                  No data
                </text>
              )}
            </svg>

            <span className="ax-interactive-donut-chart__center" aria-hidden="true">
              <span
                className="ax-interactive-donut-chart__center-value"
                title={resolveTextAttribute(resolvedCenterValue)}
              >
                {resolvedCenterValue}
              </span>
              <span
                className="ax-interactive-donut-chart__center-label"
                title={resolveTextAttribute(resolvedCenterLabel)}
              >
                {resolvedCenterLabel}
              </span>
            </span>
          </div>
        </div>

        <div className="ax-interactive-donut-chart__segments">
          {resolvedSegments.length > 0 ? (
            resolvedSegments.map((segment, index) => (
              <button
                key={segment.key}
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                className="ax-interactive-donut-chart__segment-button"
                type="button"
                data-active={segment.key === visualActiveKey}
                data-tone={segment.tone}
                aria-pressed={segment.key === visualActiveKey}
                onClick={() => {
                  setActiveSegment(segment);
                  onSegmentClick?.(segment);
                }}
                onFocus={() => {
                  setFocusKey(segment.key);
                  setHoveredKey(segment.key);
                }}
                onBlur={() => setHoveredKey(undefined)}
                onKeyDown={(event) => handleButtonKeyDown(event, segment, index)}
                onMouseEnter={() => setHoveredKey(segment.key)}
                onMouseLeave={() => setHoveredKey(undefined)}
                tabIndex={segment.key === focusKey ? 0 : -1}
              >
                <span
                  className="ax-interactive-donut-chart__segment-marker"
                  aria-hidden="true"
                />
                <span className="ax-interactive-donut-chart__segment-copy">
                  <span
                    className="ax-interactive-donut-chart__segment-label"
                    title={resolveTextAttribute(segment.label)}
                  >
                    {segment.label}
                  </span>
                  {segment.description ? (
                    <span className="ax-interactive-donut-chart__segment-description">
                      {segment.description}
                    </span>
                  ) : null}
                </span>
                <span className="ax-interactive-donut-chart__segment-value">
                  {segment.valueText}
                </span>
              </button>
            ))
          ) : (
            <div className="ax-interactive-donut-chart__empty">
              No segment data
            </div>
          )}
        </div>
      </div>
    </ChartSurface>
  );
}
