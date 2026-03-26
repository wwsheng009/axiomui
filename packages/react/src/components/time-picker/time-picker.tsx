import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { restoreElementFocus } from "../../lib/overlay/focus-restore";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import type { ValueState } from "../input/input";
import { ResponsivePopover } from "../responsive-popover/responsive-popover";
import { getTimeCopy } from "./time-copy";
import {
  buildTimeUnitOptions,
  createDefaultTimeParts,
  createTimePlaceholder,
  formatTimeParts,
  formatTimeValue,
  getDayPeriodLabels,
  getDisplayHour,
  isTimeAllowed,
  parseTimeInput,
  parseTimeValue,
  resolveHourCycle,
  resolveTimeFormatOptions,
  serializeTimeParts,
  snapTimePartsToSteps,
  updateDayPeriod,
  updateHourFromDisplayValue,
  usesMeridiem,
  usesSeconds,
  type TimeParts,
} from "./time-utils";

export interface TimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  format?: Intl.DateTimeFormatOptions;
  label?: string;
  matchTriggerWidth?: boolean;
  message?: string;
  minuteStep?: number;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  secondStep?: number;
  smallScreenBreakpoint?: number;
  value?: string;
  valueState?: ValueState;
}

type TimePickerColumn = "hour" | "minute" | "second";
type TimePeriod = "am" | "pm";

interface TimePickerDialEntry {
  anchor: boolean;
  ariaLabel: string;
  dialIndex: number;
  label: string;
  ring: "outer" | "inner";
  selected: boolean;
  value: number;
}

interface TimePickerMobileDraft {
  hour: string;
  minute: string;
  period: TimePeriod;
  second: string;
}

function useIsSmallScreen(breakpoint: number) {
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function updateViewportState() {
      setIsSmallScreen(window.innerWidth <= breakpoint);
    }

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
    };
  }, [breakpoint]);

  return isSmallScreen;
}

function getPanelBaseValue(
  value: string,
  minuteStep: number | undefined,
  secondStep: number | undefined,
  includeSeconds: boolean,
) {
  const selectedValue = parseTimeValue(value);

  if (selectedValue) {
    return snapTimePartsToSteps(selectedValue, minuteStep, secondStep, includeSeconds);
  }

  return createDefaultTimeParts(minuteStep, secondStep, includeSeconds);
}

function createOptionLabel(value: number) {
  return String(value).padStart(2, "0");
}

function createMobileDraft(
  value: TimeParts,
  includeSeconds: boolean,
  meridiem: boolean,
): TimePickerMobileDraft {
  return {
    hour: createOptionLabel(meridiem ? getDisplayHour(value.hour, true) : value.hour),
    minute: createOptionLabel(value.minute),
    period: value.hour >= 12 ? "pm" : "am",
    second: includeSeconds ? createOptionLabel(value.second) : "",
  };
}

function parseUnitNumber(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue || !/^\d{1,2}$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function getColumnLabel(column: TimePickerColumn, copy: ReturnType<typeof getTimeCopy>) {
  if (column === "hour") {
    return copy.hourColumn;
  }

  if (column === "minute") {
    return copy.minuteColumn;
  }

  return copy.secondColumn;
}

function getColumnValueLabel(
  column: TimePickerColumn,
  value: TimeParts,
  meridiem: boolean,
) {
  if (column === "hour") {
    return createOptionLabel(meridiem ? getDisplayHour(value.hour, true) : value.hour);
  }

  if (column === "minute") {
    return createOptionLabel(value.minute);
  }

  return createOptionLabel(value.second);
}

function buildDenseDialValues(options: number[], selectedValue: number) {
  const stride = Math.max(1, Math.ceil(options.length / 12));
  const values = options.filter((_, index) => index % stride === 0);

  if (!values.includes(selectedValue)) {
    values.push(selectedValue);
  }

  return [...new Set(values)].sort((left, right) => left - right);
}

function buildHourDialEntries(
  value: TimeParts,
  copy: ReturnType<typeof getTimeCopy>,
  meridiem: boolean,
) {
  if (meridiem) {
    const selectedHour = getDisplayHour(value.hour, true);

    return Array.from({ length: 12 }, (_, index) => {
      const optionValue = index + 1;

      return {
        anchor: true,
        ariaLabel: copy.selectHour(createOptionLabel(optionValue)),
        dialIndex: index,
        label: createOptionLabel(optionValue),
        ring: "outer" as const,
        selected: selectedHour === optionValue,
        value: optionValue,
      } satisfies TimePickerDialEntry;
    });
  }

  return Array.from({ length: 24 }, (_, index) => ({
    anchor: true,
    ariaLabel: copy.selectHour(createOptionLabel(index)),
    dialIndex: index,
    label: createOptionLabel(index),
    ring: index < 12 ? ("outer" as const) : ("inner" as const),
    selected: value.hour === index,
    value: index,
  }));
}

function buildUnitDialEntries({
  activeValue,
  column,
  copy,
  options,
}: {
  activeValue: number;
  column: "minute" | "second";
  copy: ReturnType<typeof getTimeCopy>;
  options: number[];
}) {
  const directSelection = options.length <= 24;
  const values = directSelection ? options : buildDenseDialValues(options, activeValue);
  const createAriaLabel =
    column === "minute" ? copy.selectMinute : copy.selectSecond;

  return values.map((optionValue, index) => ({
    anchor: !directSelection && optionValue === activeValue,
    ariaLabel: createAriaLabel(createOptionLabel(optionValue)),
    dialIndex: index,
    label: createOptionLabel(optionValue),
    ring: "outer" as const,
    selected: activeValue === optionValue,
    value: optionValue,
  }));
}

function getDialPositionStyle(
  entry: TimePickerDialEntry,
  column: TimePickerColumn,
  directSelection: boolean,
) {
  if (column === "hour") {
    const angle = ((entry.value % 12) / 12) * Math.PI * 2 - Math.PI / 2;
    const radius = entry.ring === "outer" ? 6.3 : 4.35;

    return {
      left: `calc(50% + ${Math.cos(angle) * radius}rem)`,
      top: `calc(50% + ${Math.sin(angle) * radius}rem)`,
    } satisfies CSSProperties;
  }

  const angle = (entry.value / 60) * Math.PI * 2 - Math.PI / 2;
  const radius = directSelection ? 6.25 : 6;

  return {
    left: `calc(50% + ${Math.cos(angle) * radius}rem)`,
    top: `calc(50% + ${Math.sin(angle) * radius}rem)`,
  } satisfies CSSProperties;
}

function getDialHandStyle(
  column: TimePickerColumn,
  value: TimeParts,
  directSelection: boolean,
) {
  let angle = -90;
  let length = 5.3;

  if (column === "hour") {
    angle = ((value.hour % 12) / 12) * 360 - 90;
    length = value.hour < 12 ? 5.1 : 3.4;
  } else if (column === "minute") {
    angle = (value.minute / 60) * 360 - 90;
    length = directSelection ? 5.2 : 4.9;
  } else {
    angle = (value.second / 60) * 360 - 90;
    length = directSelection ? 5.2 : 4.9;
  }

  return {
    "--ax-time-picker-hand-angle": `${angle}deg`,
    "--ax-time-picker-hand-length": `${length}rem`,
  } as CSSProperties;
}

function moveAllowedValue(options: number[], currentValue: number, step: number) {
  const currentIndex = Math.max(0, options.indexOf(currentValue));
  const nextIndex = (currentIndex + step + options.length) % options.length;

  return options[nextIndex] ?? currentValue;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(
    {
      className,
      defaultValue,
      description,
      disabled,
      format,
      id,
      label,
      matchTriggerWidth = true,
      message,
      minuteStep = 1,
      name,
      onValueChange,
      placeholder,
      readOnly,
      secondStep,
      smallScreenBreakpoint = 640,
      value,
      valueState = "none",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const { locale } = useLocale();
    const resolvedFormat = useMemo(
      () => resolveTimeFormatOptions(format, secondStep),
      [format, secondStep],
    );
    const copy = useMemo(() => getTimeCopy(locale), [locale]);
    const includeSeconds = usesSeconds(resolvedFormat);
    const hourCycle = resolveHourCycle(locale, resolvedFormat);
    const meridiem = usesMeridiem(hourCycle);
    const dayPeriodLabels = getDayPeriodLabels(locale, resolvedFormat);
    const resolvedPlaceholder =
      placeholder ?? createTimePlaceholder(locale, resolvedFormat);
    const isSmallScreen = useIsSmallScreen(smallScreenBreakpoint);
    const [open, setOpen] = useState(false);
    const [activeColumn, setActiveColumn] = useState<TimePickerColumn>("hour");
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [internalInputValue, setInternalInputValue] = useState("");
    const [parseError, setParseError] = useState(false);
    const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);
    const [panelTouched, setPanelTouched] = useState(
      Boolean(parseTimeValue(value ?? defaultValue ?? "")),
    );
    const [panelValue, setPanelValue] = useState(() =>
      getPanelBaseValue(value ?? defaultValue ?? "", minuteStep, secondStep, includeSeconds),
    );
    const [mobileDraft, setMobileDraft] = useState(() =>
      createMobileDraft(
        getPanelBaseValue(value ?? defaultValue ?? "", minuteStep, secondStep, includeSeconds),
        includeSeconds,
        meridiem,
      ),
    );
    const inputRef = useRef<HTMLInputElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const lastCommittedValueRef = useRef(value ?? defaultValue ?? "");
    const resolvedValue = value ?? internalValue;
    const minuteOptions = useMemo(
      () => buildTimeUnitOptions(59, minuteStep),
      [minuteStep],
    );
    const secondOptions = useMemo(
      () => buildTimeUnitOptions(59, secondStep ?? 1),
      [secondStep],
    );
    const columnOrder = useMemo<TimePickerColumn[]>(() => {
      const columns: TimePickerColumn[] = ["hour", "minute"];

      if (includeSeconds) {
        columns.push("second");
      }

      return columns;
    }, [includeSeconds]);
    const dialEntriesByColumn = useMemo(
      () => ({
        hour: buildHourDialEntries(panelValue, copy, meridiem),
        minute: buildUnitDialEntries({
          activeValue: panelValue.minute,
          column: "minute",
          copy,
          options: minuteOptions,
        }),
        second: includeSeconds
          ? buildUnitDialEntries({
              activeValue: panelValue.second,
              column: "second",
              copy,
              options: secondOptions,
            })
          : [],
      }),
      [copy, includeSeconds, meridiem, minuteOptions, panelValue, secondOptions],
    );
    const activeDialEntries = dialEntriesByColumn[activeColumn];
    const activeDialDirectSelection =
      activeColumn === "hour"
        ? true
        : (activeColumn === "minute" ? minuteOptions.length : secondOptions.length) <= 24;
    const supportText = parseError ? copy.invalidTime : message;
    const messageId = supportText ? `${inputId}-message` : undefined;
    const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
    const resolvedValueState = parseError ? "error" : valueState;
    const panelDisplayValue = panelTouched
      ? formatTimeParts(panelValue, locale, resolvedFormat)
      : copy.selectTime;
    const activeColumnLabel = getColumnLabel(activeColumn, copy);
    const activeColumnValueLabel = getColumnValueLabel(
      activeColumn,
      panelValue,
      meridiem,
    );

    useEffect(() => {
      const nextInputValue = resolvedValue
        ? formatTimeValue(resolvedValue, locale, resolvedFormat)
        : "";

      if (
        typeof document !== "undefined" &&
        document.activeElement === inputRef.current &&
        lastCommittedValueRef.current === resolvedValue
      ) {
        return;
      }

      setInternalInputValue(nextInputValue);
      setParseError(false);
      lastCommittedValueRef.current = resolvedValue;
    }, [locale, resolvedFormat, resolvedValue]);

    useEffect(() => {
      if (columnOrder.includes(activeColumn)) {
        return;
      }

      setActiveColumn("hour");
    }, [activeColumn, columnOrder]);

    useEffect(() => {
      if (open || resolvedValue === lastCommittedValueRef.current) {
        return;
      }

      const nextPanelValue = getPanelBaseValue(
        resolvedValue,
        minuteStep,
        secondStep,
        includeSeconds,
      );

      setPanelValue(nextPanelValue);
      setMobileDraft(createMobileDraft(nextPanelValue, includeSeconds, meridiem));
      setPanelTouched(Boolean(parseTimeValue(resolvedValue)));
    }, [includeSeconds, meridiem, minuteStep, open, resolvedValue, secondStep]);

    useEffect(() => {
      if (!open || isSmallScreen || !panelRef.current) {
        return;
      }

      const frame = window.requestAnimationFrame(() => {
        const activeOption =
          panelRef.current?.querySelector<HTMLButtonElement>(
            `.ax-time-picker__dial-option[data-column="${activeColumn}"][data-selected="true"]`,
          ) ??
          panelRef.current?.querySelector<HTMLButtonElement>(
            `.ax-time-picker__dial-option[data-column="${activeColumn}"][data-anchor="true"]`,
          ) ??
          panelRef.current?.querySelector<HTMLButtonElement>(
            `.ax-time-picker__dial-option[data-column="${activeColumn}"]`,
          );

        activeOption?.focus();
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [activeColumn, activeDialEntries, isSmallScreen, open]);

    function assignInput(node: HTMLInputElement | null) {
      inputRef.current = node;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref) {
        (ref as { current: HTMLInputElement | null }).current = node;
      }
    }

    function focusInput() {
      window.requestAnimationFrame(() => {
        restoreElementFocus(inputRef.current, [
          controlRef.current,
          panelRef.current,
          inputRef.current,
        ]);
      });
    }

    function syncPanelState(nextValue: TimeParts) {
      setPanelValue(nextValue);
      setMobileDraft(createMobileDraft(nextValue, includeSeconds, meridiem));
      setPanelTouched(true);
      setParseError(false);
    }

    function updatePanelWidth() {
      if (!matchTriggerWidth || isSmallScreen || !controlRef.current) {
        setPanelWidth(undefined);
        return;
      }

      const nextWidth =
        controlRef.current.getBoundingClientRect().width || controlRef.current.offsetWidth || 0;

      if (nextWidth > 0) {
        setPanelWidth(Math.min(nextWidth, window.innerWidth - 24));
        return;
      }

      setPanelWidth(undefined);
    }

    function updateOpen(nextOpen: boolean) {
      setOpen(nextOpen);

      if (!nextOpen) {
        focusInput();
      }
    }

    function openPanel() {
      updatePanelWidth();

      const nextPanelValue = getPanelBaseValue(
        resolvedValue,
        minuteStep,
        secondStep,
        includeSeconds,
      );

      setPanelValue(nextPanelValue);
      setMobileDraft(createMobileDraft(nextPanelValue, includeSeconds, meridiem));
      setPanelTouched(Boolean(parseTimeValue(resolvedValue)));
      setActiveColumn("hour");
      setParseError(false);
      setOpen(true);
    }

    useEffect(() => {
      if (!open) {
        return;
      }

      updatePanelWidth();

      if (!matchTriggerWidth || isSmallScreen) {
        return;
      }

      function handleViewportChange() {
        updatePanelWidth();
      }

      window.addEventListener("resize", handleViewportChange);

      return () => {
        window.removeEventListener("resize", handleViewportChange);
      };
    }, [isSmallScreen, matchTriggerWidth, open]);

    function commitValue(nextValue: string) {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
      lastCommittedValueRef.current = nextValue;
      setParseError(false);
      setInternalInputValue(
        nextValue ? formatTimeValue(nextValue, locale, resolvedFormat) : "",
      );
    }

    function commitTimeParts(nextValue: TimeParts) {
      const normalizedValue = snapTimePartsToSteps(
        nextValue,
        minuteStep,
        secondStep,
        includeSeconds,
      );

      syncPanelState(normalizedValue);
      commitValue(serializeTimeParts(normalizedValue, includeSeconds));
    }

    function commitInputValue(sourceValue: string) {
      const trimmedValue = sourceValue.trim();

      if (!trimmedValue) {
        commitValue("");
        setPanelTouched(false);
        return true;
      }

      const parsedValue = parseTimeInput(trimmedValue, locale, resolvedFormat);

      if (
        !parsedValue ||
        !isTimeAllowed(parsedValue, minuteStep, secondStep, includeSeconds)
      ) {
        setParseError(true);
        return false;
      }

      commitTimeParts(parsedValue);
      return true;
    }

    function handleInputBlur() {
      window.requestAnimationFrame(() => {
        if (open) {
          return;
        }

        const activeElement =
          typeof document === "undefined" ? null : document.activeElement;

        if (
          activeElement instanceof HTMLElement &&
          controlRef.current?.contains(activeElement)
        ) {
          return;
        }

        commitInputValue(internalInputValue);
      });
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (disabled || readOnly) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        openPanel();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();

        if (commitInputValue(internalInputValue)) {
          updateOpen(false);
        }

        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        updateOpen(false);
        return;
      }

      if (event.key === "Tab" && open) {
        updateOpen(false);
      }
    }

    function selectHour(nextDisplayHour: number) {
      commitTimeParts(updateHourFromDisplayValue(panelValue, nextDisplayHour, meridiem));
    }

    function selectMinute(nextMinute: number) {
      commitTimeParts({
        ...panelValue,
        minute: nextMinute,
      });
    }

    function selectSecond(nextSecond: number) {
      commitTimeParts({
        ...panelValue,
        second: nextSecond,
      });
    }

    function selectPeriod(nextPeriod: TimePeriod) {
      commitTimeParts(updateDayPeriod(panelValue, nextPeriod));
    }

    function moveDenseColumnValue(column: "minute" | "second", direction: number) {
      const options = column === "minute" ? minuteOptions : secondOptions;
      const currentValue = column === "minute" ? panelValue.minute : panelValue.second;
      const nextValue = moveAllowedValue(options, currentValue, direction);

      if (column === "minute") {
        selectMinute(nextValue);
        return;
      }

      selectSecond(nextValue);
    }

    function setActiveDesktopColumn(nextColumn: TimePickerColumn) {
      setActiveColumn(nextColumn);

      window.requestAnimationFrame(() => {
        panelRef.current
          ?.querySelector<HTMLButtonElement>(
            `.ax-time-picker__dial-option[data-column="${nextColumn}"][data-selected="true"]`,
          )
          ?.focus();
      });
    }

    function focusDialOption(column: TimePickerColumn, dialIndex: number) {
      const targetOption = panelRef.current?.querySelector<HTMLButtonElement>(
        `.ax-time-picker__dial-option[data-column="${column}"][data-dial-index="${dialIndex}"]`,
      );

      targetOption?.focus();
    }

    function handleDialOptionKeyDown(
      event: KeyboardEvent<HTMLButtonElement>,
      dialIndex: number,
    ) {
      if (event.key === "Escape") {
        event.preventDefault();
        updateOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusDialOption(
          activeColumn,
          Math.min(dialIndex + 1, Math.max(activeDialEntries.length - 1, 0)),
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusDialOption(activeColumn, Math.max(dialIndex - 1, 0));
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusDialOption(activeColumn, 0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusDialOption(activeColumn, Math.max(activeDialEntries.length - 1, 0));
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextColumn = columnOrder[columnOrder.indexOf(activeColumn) + direction];

      if (!nextColumn) {
        return;
      }

      event.preventDefault();
      setActiveDesktopColumn(nextColumn);
    }

    function handleMobileFieldChange(column: TimePickerColumn, nextValue: string) {
      const normalizedValue = nextValue.replace(/\D/g, "").slice(0, 2);

      setMobileDraft((currentDraft) => ({
        ...currentDraft,
        [column]: normalizedValue,
      }));
      setParseError(false);
    }

    function applyMobileDraft() {
      const nextHour = parseUnitNumber(mobileDraft.hour);
      const nextMinute = parseUnitNumber(mobileDraft.minute);
      const nextSecond = includeSeconds ? parseUnitNumber(mobileDraft.second) : 0;

      if (
        nextHour === null ||
        nextMinute === null ||
        (includeSeconds && nextSecond === null)
      ) {
        setParseError(true);
        return false;
      }

      if (nextMinute < 0 || nextMinute > 59 || (includeSeconds && nextSecond! > 59)) {
        setParseError(true);
        return false;
      }

      let nextValue = {
        ...panelValue,
        minute: nextMinute,
        second: includeSeconds ? nextSecond! : 0,
      } satisfies TimeParts;

      if (meridiem) {
        if (nextHour < 1 || nextHour > 12) {
          setParseError(true);
          return false;
        }

        nextValue = updateDayPeriod(nextValue, mobileDraft.period);
        nextValue = updateHourFromDisplayValue(nextValue, nextHour, true);
      } else {
        if (nextHour < 0 || nextHour > 23) {
          setParseError(true);
          return false;
        }

        nextValue = {
          ...nextValue,
          hour: nextHour,
        };
      }

      if (!isTimeAllowed(nextValue, minuteStep, secondStep, includeSeconds)) {
        setParseError(true);
        return false;
      }

      commitTimeParts(nextValue);
      updateOpen(false);
      return true;
    }

    return (
      <div
        className={cx("ax-time-picker", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={resolvedValueState}
        {...props}
      >
        {label ? (
          <div className="ax-time-picker__label-row">
            <label className="ax-time-picker__label" htmlFor={inputId}>
              {label}
            </label>
            {description ? (
              <span className="ax-time-picker__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-time-picker__description" id={descriptionId}>
            {description}
          </span>
        ) : null}

        {name ? <input type="hidden" name={name} value={resolvedValue} /> : null}

        <div
          ref={controlRef}
          className="ax-time-picker__control"
          data-open={open}
          onMouseDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.closest(".ax-time-picker__toggle")
            ) {
              return;
            }

            if (!disabled && !readOnly) {
              window.requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }
          }}
        >
          <input
            ref={assignInput}
            id={inputId}
            className="ax-time-picker__native"
            aria-controls={open ? `${inputId}-time-panel` : undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={resolvedValueState === "error" || undefined}
            disabled={disabled}
            placeholder={resolvedPlaceholder}
            readOnly={readOnly}
            value={internalInputValue}
            onBlur={handleInputBlur}
            onChange={(event) => {
              setInternalInputValue(event.target.value);
              setParseError(false);
            }}
            onKeyDown={handleInputKeyDown}
          />
          <div className="ax-time-picker__toggle">
            <Button
              aria-label={open ? copy.closeTimePicker : copy.openTimePicker}
              disabled={disabled}
              iconName="clock"
              variant="transparent"
              onClick={() => {
                if (disabled || readOnly) {
                  return;
                }

                if (open) {
                  updateOpen(false);
                  return;
                }

                openPanel();
              }}
            />
          </div>
        </div>

        <ResponsivePopover
          actions={
            isSmallScreen ? (
              <Button fullWidth variant="emphasized" onClick={applyMobileDraft}>
                {copy.applyTime}
              </Button>
            ) : undefined
          }
          anchorRef={controlRef}
          closable={isSmallScreen}
          description={isSmallScreen ? panelDisplayValue : undefined}
          matchTriggerWidth={matchTriggerWidth}
          onOpenChange={updateOpen}
          open={open}
          smallScreenBreakpoint={smallScreenBreakpoint}
          style={
            !isSmallScreen && matchTriggerWidth && panelWidth
              ? { width: `${panelWidth}px` }
              : undefined
          }
          title={isSmallScreen ? label ?? copy.selectTime : undefined}
        >
          {isSmallScreen ? (
            <div
              ref={panelRef}
              id={`${inputId}-time-panel`}
              className="ax-time-picker__mobile-panel"
            >
              <div className="ax-time-picker__panel-header">
                <div className="ax-time-picker__panel-summary">{copy.selectTime}</div>
                <div className="ax-time-picker__panel-value">{panelDisplayValue}</div>
              </div>

              <div className="ax-time-picker__mobile-grid">
                <label className="ax-time-picker__mobile-card" htmlFor={`${inputId}-hour-field`}>
                  <span className="ax-time-picker__mobile-label">{copy.hourColumn}</span>
                  <input
                    id={`${inputId}-hour-field`}
                    className="ax-time-picker__mobile-input"
                    aria-label={copy.numericInput(copy.hourColumn)}
                    inputMode="numeric"
                    maxLength={2}
                    value={mobileDraft.hour}
                    onChange={(event) => handleMobileFieldChange("hour", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyMobileDraft();
                      }
                    }}
                  />
                </label>

                <label className="ax-time-picker__mobile-card" htmlFor={`${inputId}-minute-field`}>
                  <span className="ax-time-picker__mobile-label">{copy.minuteColumn}</span>
                  <input
                    id={`${inputId}-minute-field`}
                    className="ax-time-picker__mobile-input"
                    aria-label={copy.numericInput(copy.minuteColumn)}
                    inputMode="numeric"
                    maxLength={2}
                    value={mobileDraft.minute}
                    onChange={(event) => handleMobileFieldChange("minute", event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyMobileDraft();
                      }
                    }}
                  />
                </label>

                {includeSeconds ? (
                  <label
                    className="ax-time-picker__mobile-card"
                    htmlFor={`${inputId}-second-field`}
                  >
                    <span className="ax-time-picker__mobile-label">{copy.secondColumn}</span>
                    <input
                      id={`${inputId}-second-field`}
                      className="ax-time-picker__mobile-input"
                      aria-label={copy.numericInput(copy.secondColumn)}
                      inputMode="numeric"
                      maxLength={2}
                      value={mobileDraft.second}
                      onChange={(event) =>
                        handleMobileFieldChange("second", event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          applyMobileDraft();
                        }
                      }}
                    />
                  </label>
                ) : null}
              </div>

              {meridiem ? (
                <div className="ax-time-picker__mobile-periods" role="group">
                  {[
                    { label: dayPeriodLabels.am, value: "am" as const },
                    { label: dayPeriodLabels.pm, value: "pm" as const },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="ax-time-picker__mobile-period"
                      aria-pressed={mobileDraft.period === option.value}
                      data-selected={mobileDraft.period === option.value}
                      onClick={() => {
                        setMobileDraft((currentDraft) => ({
                          ...currentDraft,
                          period: option.value,
                        }));
                        setParseError(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {parseError ? (
                <div className="ax-time-picker__panel-error">{copy.invalidTime}</div>
              ) : null}
            </div>
          ) : (
            <div
              ref={panelRef}
              id={`${inputId}-time-panel`}
              className="ax-time-picker__desktop-panel"
              style={matchTriggerWidth ? { width: "100%" } : undefined}
            >
              <div className="ax-time-picker__panel-header">
                <div className="ax-time-picker__panel-summary">{copy.selectTime}</div>
                <div className="ax-time-picker__panel-value">{panelDisplayValue}</div>
              </div>

              <div className="ax-time-picker__dial-tabs" role="tablist">
                {columnOrder.map((column) => (
                  <button
                    key={column}
                    type="button"
                    className="ax-time-picker__dial-tab"
                    role="tab"
                    aria-selected={activeColumn === column}
                    data-active={activeColumn === column}
                    onClick={() => setActiveDesktopColumn(column)}
                  >
                    <span className="ax-time-picker__dial-tab-label">
                      {getColumnLabel(column, copy)}
                    </span>
                    <strong className="ax-time-picker__dial-tab-value">
                      {getColumnValueLabel(column, panelValue, meridiem)}
                    </strong>
                  </button>
                ))}
              </div>

              {meridiem ? (
                <div className="ax-time-picker__period-strip" role="group">
                  {[
                    { label: dayPeriodLabels.am, value: "am" as const },
                    { label: dayPeriodLabels.pm, value: "pm" as const },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="ax-time-picker__period-chip"
                      aria-pressed={
                        option.value === "pm" ? panelValue.hour >= 12 : panelValue.hour < 12
                      }
                      data-selected={
                        option.value === "pm" ? panelValue.hour >= 12 : panelValue.hour < 12
                      }
                      onClick={() => selectPeriod(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="ax-time-picker__dial-shell">
                <div
                  className="ax-time-picker__dial-face"
                  data-column={activeColumn}
                  data-dense={!activeDialDirectSelection}
                >
                  <div
                    className="ax-time-picker__dial-hand"
                    style={getDialHandStyle(activeColumn, panelValue, activeDialDirectSelection)}
                  />
                  <div className="ax-time-picker__dial-center">
                    <span className="ax-time-picker__dial-center-label">{activeColumnLabel}</span>
                    <strong className="ax-time-picker__dial-center-value">
                      {activeColumnValueLabel}
                    </strong>
                  </div>

                  {activeDialEntries.map((entry) => (
                    <button
                      key={`${activeColumn}-${entry.value}`}
                      type="button"
                      className="ax-time-picker__dial-option"
                      aria-label={entry.ariaLabel}
                      aria-pressed={entry.selected}
                      data-anchor={entry.anchor}
                      data-column={activeColumn}
                      data-dial-index={entry.dialIndex}
                      data-ring={entry.ring}
                      data-selected={entry.selected}
                      style={getDialPositionStyle(
                        entry,
                        activeColumn,
                        activeDialDirectSelection,
                      )}
                      onClick={() => {
                        if (activeColumn === "hour") {
                          selectHour(entry.value);
                          return;
                        }

                        if (activeColumn === "minute") {
                          selectMinute(entry.value);
                          return;
                        }

                        selectSecond(entry.value);
                      }}
                      onKeyDown={(event) => handleDialOptionKeyDown(event, entry.dialIndex)}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>

                {!activeDialDirectSelection ? (
                  <div className="ax-time-picker__fine-tune">
                    <span className="ax-time-picker__fine-tune-label">
                      {activeColumnLabel}
                    </span>
                    <div className="ax-time-picker__fine-tune-controls">
                      <Button
                        aria-label={copy.decrementUnit(activeColumnLabel)}
                        iconName="chevron-left"
                        variant="transparent"
                        onClick={() =>
                          moveDenseColumnValue(
                            activeColumn as "minute" | "second",
                            -1,
                          )
                        }
                      />
                      <strong className="ax-time-picker__fine-tune-value">
                        {activeColumnValueLabel}
                      </strong>
                      <Button
                        aria-label={copy.incrementUnit(activeColumnLabel)}
                        iconName="chevron-right"
                        variant="transparent"
                        onClick={() =>
                          moveDenseColumnValue(
                            activeColumn as "minute" | "second",
                            1,
                          )
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              {parseError ? (
                <div className="ax-time-picker__panel-error">{copy.invalidTime}</div>
              ) : null}
            </div>
          )}
        </ResponsivePopover>

        {supportText ? (
          <span className="ax-time-picker__support" id={messageId}>
            {supportText}
          </span>
        ) : null}
      </div>
    );
  },
);
