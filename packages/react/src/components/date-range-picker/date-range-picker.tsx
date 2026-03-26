import {
  forwardRef,
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
import {
  formatRangeSummaryBoundary,
  getDateCopy,
  getLabeledDateFieldName,
  getRangeEndpointButtonLabel,
} from "../calendar-panel/date-copy";
import {
  addCalendarDays,
  addCalendarMonths,
  buildCalendarWeeks,
  compareCalendarDates,
  createDatePlaceholder,
  formatCalendarDate,
  getWeekdayLabels,
  getWeekStartsOn,
  isDateDisabled,
  isSameCalendarDay,
  isSameCalendarMonth,
  parseCalendarDate,
  parseDateInput,
  resolveDateFormatOptions,
  startOfCalendarMonth,
  startOfCalendarWeek,
  toDateKey,
  type DateLike,
} from "../calendar-panel/date-utils";
import type { ValueState } from "../input/input";
import { Popover } from "../popover/popover";

export interface DateRangeValue {
  end: string;
  start: string;
}

export interface DateRangePickerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "defaultValue" | "onChange" | "value"
  > {
  defaultValue?: Partial<DateRangeValue>;
  description?: string;
  disabled?: boolean;
  endName?: string;
  endPlaceholder?: string;
  format?: Intl.DateTimeFormatOptions;
  label?: string;
  matchTriggerWidth?: boolean;
  maxDate?: DateLike;
  message?: string;
  minDate?: DateLike;
  name?: string;
  onValueChange?: (value: DateRangeValue) => void;
  placeholder?: string;
  readOnly?: boolean;
  startName?: string;
  startPlaceholder?: string;
  value?: Partial<DateRangeValue>;
  valueState?: ValueState;
}

type ActiveInput = "start" | "end";
type ValidationError = "none" | "parse" | "range";

const emptyDateRangeValue: DateRangeValue = { end: "", start: "" };

function normalizeDateRangeValue(value: Partial<DateRangeValue> | null | undefined) {
  return {
    end: typeof value?.end === "string" ? value.end : "",
    start: typeof value?.start === "string" ? value.start : "",
  } satisfies DateRangeValue;
}

function serializeDateRangeValue(value: DateRangeValue) {
  return `${value.start}|${value.end}`;
}

function getInitialVisibleMonth(
  value: DateRangeValue,
  defaultValue: Partial<DateRangeValue> | undefined,
) {
  return startOfCalendarMonth(
    parseCalendarDate(value.start) ??
      parseCalendarDate(value.end) ??
      parseCalendarDate(defaultValue?.start) ??
      parseCalendarDate(defaultValue?.end) ??
      parseCalendarDate(new Date())!,
  );
}

function formatDateInputValue(
  value: Date | null,
  locale: string,
  format: Intl.DateTimeFormatOptions,
) {
  return value ? formatCalendarDate(value, locale, format) : "";
}

function formatRangeSummary(
  start: Date | null,
  end: Date | null,
  locale: string,
  format: Intl.DateTimeFormatOptions,
  selectDateRangeLabel: string,
) {
  if (start && end) {
    return `${formatDateInputValue(start, locale, format)} - ${formatDateInputValue(end, locale, format)}`;
  }

  if (start) {
    return formatRangeSummaryBoundary(
      "start",
      formatDateInputValue(start, locale, format),
      locale,
    );
  }

  if (end) {
    return formatRangeSummaryBoundary(
      "end",
      formatDateInputValue(end, locale, format),
      locale,
    );
  }

  return selectDateRangeLabel;
}

function isDateWithinRange(value: Date, start: Date | null, end: Date | null) {
  if (!start || !end) {
    return false;
  }

  return (
    compareCalendarDates(value, start) >= 0 &&
    compareCalendarDates(value, end) <= 0
  );
}

function resolveVisibleMonthForDate(date: Date, firstVisibleMonth: Date) {
  const monthStart = startOfCalendarMonth(date);
  const secondVisibleMonth = startOfCalendarMonth(addCalendarMonths(firstVisibleMonth, 1));

  if (
    isSameCalendarMonth(monthStart, firstVisibleMonth) ||
    isSameCalendarMonth(monthStart, secondVisibleMonth)
  ) {
    return firstVisibleMonth;
  }

  if (compareCalendarDates(monthStart, firstVisibleMonth) < 0) {
    return monthStart;
  }

  return startOfCalendarMonth(addCalendarMonths(monthStart, -1));
}

export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(
  function DateRangePicker(
    {
      className,
      defaultValue,
      description,
      disabled,
      endName,
      endPlaceholder,
      format,
      id,
      label,
      matchTriggerWidth = true,
      maxDate,
      message,
      minDate,
      name,
      onValueChange,
      placeholder,
      readOnly,
      startName,
      startPlaceholder,
      value,
      valueState = "none",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const messageId = `${inputId}-message`;
    const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
    const { locale } = useLocale();
    const copy = useMemo(() => getDateCopy(locale), [locale]);
    const resolvedFormat = useMemo(
      () => resolveDateFormatOptions(format),
      [format],
    );
    const sharedPlaceholder =
      placeholder ?? createDatePlaceholder(locale, resolvedFormat);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<DateRangeValue>(() =>
      normalizeDateRangeValue(defaultValue),
    );
    const resolvedValue = normalizeDateRangeValue(value ?? internalValue);
    const selectedStartDate = parseCalendarDate(resolvedValue.start);
    const selectedEndDate = parseCalendarDate(resolvedValue.end);
    const [startInputValue, setStartInputValue] = useState(() =>
      formatDateInputValue(selectedStartDate, locale, resolvedFormat),
    );
    const [endInputValue, setEndInputValue] = useState(() =>
      formatDateInputValue(selectedEndDate, locale, resolvedFormat),
    );
    const [validationError, setValidationError] =
      useState<ValidationError>("none");
    const [activeInput, setActiveInput] = useState<ActiveInput>("start");
    const [visibleMonth, setVisibleMonth] = useState(() =>
      toDateKey(getInitialVisibleMonth(resolvedValue, defaultValue)),
    );
    const visibleMonthDate =
      parseCalendarDate(visibleMonth) ??
      getInitialVisibleMonth(resolvedValue, defaultValue);
    const secondVisibleMonthDate = useMemo(
      () => startOfCalendarMonth(addCalendarMonths(visibleMonthDate, 1)),
      [visibleMonthDate],
    );
    const visibleMonths = useMemo(
      () => [visibleMonthDate, secondVisibleMonthDate],
      [secondVisibleMonthDate, visibleMonthDate],
    );
    const weekStartsOn = getWeekStartsOn(locale);
    const monthEntries = useMemo(
      () =>
        visibleMonths.map((monthDate) => ({
          key: toDateKey(monthDate),
          monthDate,
          weeks: buildCalendarWeeks(monthDate, weekStartsOn),
        })),
      [visibleMonths, weekStartsOn],
    );
    const weekdayLabels = useMemo(
      () => getWeekdayLabels(locale, weekStartsOn),
      [locale, weekStartsOn],
    );
    const today = useMemo(() => parseCalendarDate(new Date())!, []);
    const [focusedDateKey, setFocusedDateKey] = useState(() =>
      toDateKey(
        selectedEndDate ??
          selectedStartDate ??
          getInitialVisibleMonth(resolvedValue, defaultValue),
      ),
    );
    const controlRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const startInputRef = useRef<HTMLInputElement | null>(null);
    const endInputRef = useRef<HTMLInputElement | null>(null);
    const lastCommittedValueRef = useRef(serializeDateRangeValue(resolvedValue));
    const minCalendarDate = parseCalendarDate(minDate);
    const maxCalendarDate = parseCalendarDate(maxDate);
    const resolvedValueState = validationError === "none" ? valueState : "error";
    const resolvedMessage =
      validationError === "parse"
        ? copy.parseRangeError
        : validationError === "range"
          ? copy.rangeOrderError
          : message;
    const showClear =
      !disabled &&
      !readOnly &&
      Boolean(
        resolvedValue.start || resolvedValue.end || startInputValue || endInputValue,
      );
    const resolvedStartName = startName ?? (name ? `${name}Start` : undefined);
    const resolvedEndName = endName ?? (name ? `${name}End` : undefined);
    const panelSummary = formatRangeSummary(
      selectedStartDate,
      selectedEndDate,
      locale,
      resolvedFormat,
      copy.selectDateRange,
    );

    useEffect(() => {
      const nextValue = serializeDateRangeValue(resolvedValue);
      const activeElement =
        typeof document === "undefined" ? null : document.activeElement;

      if (
        nextValue === lastCommittedValueRef.current &&
        (activeElement === startInputRef.current ||
          activeElement === endInputRef.current)
      ) {
        return;
      }

      setStartInputValue(
        formatDateInputValue(selectedStartDate, locale, resolvedFormat),
      );
      setEndInputValue(formatDateInputValue(selectedEndDate, locale, resolvedFormat));
      setValidationError("none");
      lastCommittedValueRef.current = nextValue;
    }, [locale, resolvedFormat, resolvedValue, selectedEndDate, selectedStartDate]);

    useEffect(() => {
      if (!open) {
        return;
      }

      const frame = window.requestAnimationFrame(() => {
        const focusedButton =
          panelRef.current?.querySelector<HTMLButtonElement>(
            `.ax-date-range-picker__day[data-date-key="${focusedDateKey}"][data-outside-month="false"]`,
          ) ??
          panelRef.current?.querySelector<HTMLButtonElement>(
            `.ax-date-range-picker__day[data-date-key="${focusedDateKey}"]`,
          ) ??
          panelRef.current?.querySelector<HTMLButtonElement>(
            '.ax-date-range-picker__day[data-disabled="false"]',
          );

        focusedButton?.focus();
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [focusedDateKey, open, visibleMonth]);

    function assignStartInput(node: HTMLInputElement | null) {
      startInputRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as { current: HTMLInputElement | null }).current = node;
      }
    }

    function focusInput(which = activeInput) {
      window.requestAnimationFrame(() => {
        const restoreOwners = [
          controlRef.current,
          panelRef.current,
          startInputRef.current,
          endInputRef.current,
        ];

        if (which === "end") {
          restoreElementFocus(endInputRef.current, restoreOwners);
          return;
        }

        restoreElementFocus(startInputRef.current, restoreOwners);
      });
    }

    function updateOpen(nextOpen: boolean) {
      setOpen(nextOpen);

      if (!nextOpen) {
        focusInput();
      }
    }

    function getAnchorDate(which: ActiveInput) {
      if (which === "end") {
        return selectedEndDate ?? selectedStartDate ?? visibleMonthDate;
      }

      return selectedStartDate ?? selectedEndDate ?? visibleMonthDate;
    }

    function setEditingInput(which: ActiveInput) {
      const anchorDate = getAnchorDate(which);

      setActiveInput(which);
      setFocusedDateKey(toDateKey(anchorDate));
      setVisibleMonth(
        toDateKey(resolveVisibleMonthForDate(anchorDate, visibleMonthDate)),
      );
    }

    function getPreferredOpenInput(which?: ActiveInput) {
      if (which) {
        return which;
      }

      if (selectedStartDate && !selectedEndDate) {
        return "end" as const;
      }

      if (!selectedStartDate && selectedEndDate) {
        return "start" as const;
      }

      return activeInput;
    }

    function openCalendar(which?: ActiveInput) {
      if (disabled || readOnly) {
        return;
      }

      setEditingInput(getPreferredOpenInput(which));
      setOpen(true);
    }

    function commitValue(nextValue: DateRangeValue) {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
      setValidationError("none");
      setStartInputValue(
        formatDateInputValue(parseCalendarDate(nextValue.start), locale, resolvedFormat),
      );
      setEndInputValue(
        formatDateInputValue(parseCalendarDate(nextValue.end), locale, resolvedFormat),
      );
      lastCommittedValueRef.current = serializeDateRangeValue(nextValue);
    }

    function parseInputValue(sourceValue: string) {
      const trimmedValue = sourceValue.trim();

      if (!trimmedValue) {
        return { date: null, valid: true };
      }

      const parsedDate = parseDateInput(trimmedValue, locale, resolvedFormat);

      if (
        !parsedDate ||
        isDateDisabled(parsedDate, minCalendarDate, maxCalendarDate)
      ) {
        return { date: null, valid: false };
      }

      return { date: parsedDate, valid: true };
    }

    function commitInputValues() {
      const nextStart = parseInputValue(startInputValue);
      const nextEnd = parseInputValue(endInputValue);

      if (!nextStart.valid || !nextEnd.valid) {
        setValidationError("parse");
        return false;
      }

      if (
        nextStart.date &&
        nextEnd.date &&
        compareCalendarDates(nextStart.date, nextEnd.date) > 0
      ) {
        setValidationError("range");
        return false;
      }

      commitValue({
        end: nextEnd.date ? toDateKey(nextEnd.date) : "",
        start: nextStart.date ? toDateKey(nextStart.date) : "",
      });
      return true;
    }

    function clearValue() {
      setActiveInput("start");
      commitValue(emptyDateRangeValue);
      updateOpen(false);
    }

    function handleInputBlur() {
      window.requestAnimationFrame(() => {
        const activeElement =
          typeof document === "undefined" ? null : document.activeElement;

        if (
          activeElement instanceof HTMLElement &&
          (controlRef.current?.contains(activeElement) ||
            panelRef.current?.contains(activeElement))
        ) {
          return;
        }

        commitInputValues();
      });
    }

    function moveFocus(nextDate: Date) {
      setFocusedDateKey(toDateKey(nextDate));
      setVisibleMonth(
        toDateKey(resolveVisibleMonthForDate(nextDate, visibleMonthDate)),
      );
    }

    function selectDate(nextDate: Date) {
      if (isDateDisabled(nextDate, minCalendarDate, maxCalendarDate)) {
        return;
      }

      const nextDateKey = toDateKey(nextDate);
      setFocusedDateKey(nextDateKey);
      setVisibleMonth(
        toDateKey(resolveVisibleMonthForDate(nextDate, visibleMonthDate)),
      );

      if (activeInput === "start") {
        if (
          selectedEndDate &&
          compareCalendarDates(nextDate, selectedEndDate) > 0
        ) {
          commitValue({ end: "", start: nextDateKey });
          setActiveInput("end");
          return;
        }

        commitValue({
          end: selectedEndDate ? resolvedValue.end : "",
          start: nextDateKey,
        });

        if (selectedEndDate) {
          updateOpen(false);
          return;
        }

        setActiveInput("end");
        return;
      }

      if (
        selectedStartDate &&
        compareCalendarDates(nextDate, selectedStartDate) < 0
      ) {
        commitValue({ end: nextDateKey, start: "" });
        setActiveInput("start");
        return;
      }

      commitValue({
        end: nextDateKey,
        start: selectedStartDate ? resolvedValue.start : "",
      });

      if (selectedStartDate) {
        updateOpen(false);
        return;
      }

      setActiveInput("start");
    }

    function handleInputKeyDown(
      which: ActiveInput,
      event: KeyboardEvent<HTMLInputElement>,
    ) {
      if (disabled || readOnly) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        openCalendar(which);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        setActiveInput(which);

        if (commitInputValues()) {
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

    function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, date: Date) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveFocus(addCalendarDays(date, 1));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveFocus(addCalendarDays(date, -1));
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveFocus(addCalendarDays(date, 7));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveFocus(addCalendarDays(date, -7));
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveFocus(startOfCalendarWeek(date, weekStartsOn));
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        moveFocus(addCalendarDays(startOfCalendarWeek(date, weekStartsOn), 6));
        return;
      }

      if (event.key === "PageDown") {
        event.preventDefault();
        moveFocus(addCalendarMonths(date, 1));
        return;
      }

      if (event.key === "PageUp") {
        event.preventDefault();
        moveFocus(addCalendarMonths(date, -1));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDate(date);
      }
    }

    return (
      <div
        className={cx("ax-date-range-picker", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={resolvedValueState}
        {...props}
      >
        {label ? (
          <div className="ax-date-range-picker__label-row">
            <label className="ax-date-range-picker__label" htmlFor={`${inputId}-start`}>
              {label}
            </label>
            {description ? (
              <span className="ax-date-range-picker__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-date-range-picker__description" id={descriptionId}>
            {description}
          </span>
        ) : null}

        {resolvedStartName ? (
          <input type="hidden" name={resolvedStartName} value={resolvedValue.start} />
        ) : null}
        {resolvedEndName ? (
          <input type="hidden" name={resolvedEndName} value={resolvedValue.end} />
        ) : null}

        <div
          ref={controlRef}
          className="ax-date-range-picker__control"
          data-open={open}
          onMouseDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.closest(
                ".ax-date-range-picker__clear, .ax-date-range-picker__toggle",
              )
            ) {
              return;
            }

            if (!disabled && !readOnly) {
              focusInput();
            }
          }}
        >
          <input
            ref={assignStartInput}
            id={`${inputId}-start`}
            className="ax-date-range-picker__native"
            aria-controls={open ? `${inputId}-calendar` : undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={resolvedValueState === "error" || undefined}
            aria-label={getLabeledDateFieldName(label, "start", locale)}
            disabled={disabled}
            placeholder={startPlaceholder ?? sharedPlaceholder}
            readOnly={readOnly}
            value={startInputValue}
            onBlur={handleInputBlur}
            onChange={(event) => {
              setStartInputValue(event.target.value);
              setValidationError("none");
            }}
            onFocus={() => setActiveInput("start")}
            onKeyDown={(event) => handleInputKeyDown("start", event)}
          />
          <span className="ax-date-range-picker__separator" aria-hidden="true">
            {copy.rangeSeparator}
          </span>
          <input
            ref={endInputRef}
            id={`${inputId}-end`}
            className="ax-date-range-picker__native"
            aria-controls={open ? `${inputId}-calendar` : undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-invalid={resolvedValueState === "error" || undefined}
            aria-label={getLabeledDateFieldName(label, "end", locale)}
            disabled={disabled}
            placeholder={endPlaceholder ?? sharedPlaceholder}
            readOnly={readOnly}
            value={endInputValue}
            onBlur={handleInputBlur}
            onChange={(event) => {
              setEndInputValue(event.target.value);
              setValidationError("none");
            }}
            onFocus={() => setActiveInput("end")}
            onKeyDown={(event) => handleInputKeyDown("end", event)}
          />
          {showClear ? (
            <div className="ax-date-range-picker__clear">
              <Button
                aria-label={copy.clearDateRange}
                iconName="close"
                variant="transparent"
                onClick={clearValue}
              />
            </div>
          ) : null}
          <div className="ax-date-range-picker__toggle">
            <Button
              aria-label={open ? copy.closeCalendar : copy.openCalendar}
              iconName="calendar"
              variant="transparent"
              onClick={() => (open ? updateOpen(false) : openCalendar())}
            />
          </div>
        </div>

        <Popover
          anchorRef={controlRef}
          matchTriggerWidth={matchTriggerWidth}
          onOpenChange={updateOpen}
          open={open}
        >
          <div
            ref={panelRef}
            id={`${inputId}-calendar`}
            className="ax-date-range-picker__panel"
          >
            <div className="ax-date-range-picker__panel-header">
              <div className="ax-date-range-picker__endpoint-group">
                <button
                  type="button"
                  className="ax-date-range-picker__endpoint"
                  aria-label={getRangeEndpointButtonLabel(
                    "start",
                    selectedStartDate
                      ? formatDateInputValue(selectedStartDate, locale, resolvedFormat)
                      : copy.selectStartDate,
                    locale,
                  )}
                  data-active={activeInput === "start"}
                  aria-pressed={activeInput === "start"}
                  onClick={() => setEditingInput("start")}
                >
                  <span className="ax-date-range-picker__endpoint-label">{copy.startLabel}</span>
                  <strong className="ax-date-range-picker__endpoint-value">
                    {selectedStartDate
                      ? formatDateInputValue(selectedStartDate, locale, resolvedFormat)
                      : copy.selectStartDate}
                  </strong>
                </button>
                <span className="ax-date-range-picker__endpoint-separator" aria-hidden="true">
                  {copy.rangeSeparator}
                </span>
                <button
                  type="button"
                  className="ax-date-range-picker__endpoint"
                  aria-label={getRangeEndpointButtonLabel(
                    "end",
                    selectedEndDate
                      ? formatDateInputValue(selectedEndDate, locale, resolvedFormat)
                      : copy.selectEndDate,
                    locale,
                  )}
                  data-active={activeInput === "end"}
                  aria-pressed={activeInput === "end"}
                  onClick={() => setEditingInput("end")}
                >
                  <span className="ax-date-range-picker__endpoint-label">{copy.endLabel}</span>
                  <strong className="ax-date-range-picker__endpoint-value">
                    {selectedEndDate
                      ? formatDateInputValue(selectedEndDate, locale, resolvedFormat)
                      : copy.selectEndDate}
                  </strong>
                </button>
              </div>

              <div className="ax-date-range-picker__calendar-nav">
                <Button
                  aria-label={copy.previousMonth}
                  iconName="chevron-left"
                  variant="transparent"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    const nextMonth = startOfCalendarMonth(
                      addCalendarMonths(visibleMonthDate, -1),
                    );

                    setVisibleMonth(toDateKey(nextMonth));
                    setFocusedDateKey(toDateKey(getAnchorDate(activeInput)));
                  }}
                />
                <Button
                  aria-label={copy.nextMonth}
                  iconName="chevron-right"
                  variant="transparent"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    const nextMonth = startOfCalendarMonth(
                      addCalendarMonths(visibleMonthDate, 1),
                    );

                    setVisibleMonth(toDateKey(nextMonth));
                    setFocusedDateKey(toDateKey(getAnchorDate(activeInput)));
                  }}
                />
              </div>
            </div>

            <div className="ax-date-range-picker__months">
              {monthEntries.map(({ key, monthDate, weeks }) => {
                const monthTitleId = `${inputId}-${key}-title`;

                return (
                  <section key={key} className="ax-date-range-picker__month">
                    <strong className="ax-date-range-picker__month-title" id={monthTitleId}>
                      {formatCalendarDate(monthDate, locale, {
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>

                    <div className="ax-date-range-picker__weekdays" aria-hidden="true">
                      {weekdayLabels.map((weekdayLabel) => (
                        <span
                          key={`${key}-${weekdayLabel}`}
                          className="ax-date-range-picker__weekday"
                        >
                          {weekdayLabel}
                        </span>
                      ))}
                    </div>

                    <div
                      className="ax-date-range-picker__weeks"
                      role="grid"
                      aria-labelledby={monthTitleId}
                    >
                      {weeks.map((week) => (
                        <div
                          key={`${key}-${week.map((date) => toDateKey(date)).join("|")}`}
                          className="ax-date-range-picker__week"
                          role="row"
                        >
                          {week.map((date) => {
                            const dateKey = toDateKey(date);
                            const inCurrentMonth = isSameCalendarMonth(date, monthDate);
                            const inRange = isDateWithinRange(
                              date,
                              selectedStartDate,
                              selectedEndDate,
                            );
                            const isRangeStart =
                              selectedStartDate !== null &&
                              isSameCalendarDay(date, selectedStartDate);
                            const isRangeEnd =
                              selectedEndDate !== null &&
                              isSameCalendarDay(date, selectedEndDate);
                            const disabledDate = isDateDisabled(
                              date,
                              minCalendarDate,
                              maxCalendarDate,
                            );

                            return (
                              <div
                                key={`${key}-${dateKey}`}
                                className="ax-date-range-picker__day-cell"
                                role="gridcell"
                              >
                                <button
                                  type="button"
                                  className="ax-date-range-picker__day"
                                  data-current={isSameCalendarDay(date, today)}
                                  data-date-key={dateKey}
                                  data-disabled={disabledDate}
                                  data-focused={focusedDateKey === dateKey}
                                  data-in-range={inRange}
                                  data-outside-month={!inCurrentMonth}
                                  data-range-end={isRangeEnd}
                                  data-range-start={isRangeStart}
                                  aria-current={
                                    isSameCalendarDay(date, today) ? "date" : undefined
                                  }
                                  aria-label={formatCalendarDate(date, locale, {
                                    day: "numeric",
                                    month: "long",
                                    weekday: "long",
                                    year: "numeric",
                                  })}
                                  aria-selected={inRange || isRangeStart || isRangeEnd}
                                  tabIndex={focusedDateKey === dateKey ? 0 : -1}
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => selectDate(date)}
                                  onFocus={() => setFocusedDateKey(dateKey)}
                                  onKeyDown={(event) => handleDayKeyDown(event, date)}
                                >
                                  {date.getDate()}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="ax-date-range-picker__panel-footer">
              <span className="ax-date-range-picker__panel-summary">
                {activeInput === "start"
                  ? copy.editingStartDate
                  : copy.editingEndDate}
              </span>
              <span className="ax-date-range-picker__panel-summary">
                {panelSummary}
              </span>
            </div>
          </div>
        </Popover>

        <span className="ax-date-range-picker__support" id={messageId}>
          {resolvedMessage}
        </span>
      </div>
    );
  },
);
