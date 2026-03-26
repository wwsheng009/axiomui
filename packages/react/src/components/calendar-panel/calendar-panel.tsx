import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import { formatRangeSummaryBoundary, getDateCopy } from "./date-copy";
import {
  addCalendarDays,
  addCalendarMonths,
  buildCalendarWeeks,
  formatCalendarDate,
  getWeekdayLabels,
  getWeekStartsOn,
  isDateDisabled,
  isSameCalendarDay,
  isSameCalendarMonth,
  parseCalendarDate,
  startOfCalendarMonth,
  startOfCalendarWeek,
  toDateKey,
  type DateLike,
} from "./date-utils";

export interface CalendarPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  autoFocus?: boolean;
  defaultValue?: string;
  defaultVisibleMonth?: string;
  locale?: string;
  maxDate?: DateLike;
  minDate?: DateLike;
  onValueChange?: (value: string) => void;
  onVisibleMonthChange?: (value: string) => void;
  value?: string;
  visibleMonth?: string;
}

function getInitialMonth(
  visibleMonth: string | undefined,
  defaultVisibleMonth: string | undefined,
  value: string | undefined,
  defaultValue: string | undefined,
) {
  const resolvedDate =
    parseCalendarDate(visibleMonth) ??
    parseCalendarDate(defaultVisibleMonth) ??
    parseCalendarDate(value) ??
    parseCalendarDate(defaultValue) ??
    parseCalendarDate(new Date());

  return startOfCalendarMonth(resolvedDate!);
}

export const CalendarPanel = forwardRef<HTMLDivElement, CalendarPanelProps>(
  function CalendarPanel(
    {
      autoFocus = false,
      className,
      defaultValue,
      defaultVisibleMonth,
      locale: localeProp,
      maxDate,
      minDate,
      onValueChange,
      onVisibleMonthChange,
      value,
      visibleMonth,
      ...props
    },
    ref,
  ) {
    const { locale: localeFromContext } = useLocale();
    const locale = localeProp ?? localeFromContext;
    const copy = useMemo(() => getDateCopy(locale), [locale]);
    const titleId = useId();
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [internalVisibleMonth, setInternalVisibleMonth] = useState(() =>
      toDateKey(
        getInitialMonth(visibleMonth, defaultVisibleMonth, value, defaultValue),
      ),
    );
    const selectedDate = parseCalendarDate(value ?? internalValue);
    const resolvedVisibleMonth =
      parseCalendarDate(visibleMonth ?? internalVisibleMonth) ??
      getInitialMonth(visibleMonth, defaultVisibleMonth, value, defaultValue);
    const visibleMonthDate = startOfCalendarMonth(resolvedVisibleMonth);
    const minCalendarDate = parseCalendarDate(minDate);
    const maxCalendarDate = parseCalendarDate(maxDate);
    const weekStartsOn = getWeekStartsOn(locale);
    const weeks = useMemo(
      () => buildCalendarWeeks(visibleMonthDate, weekStartsOn),
      [visibleMonthDate, weekStartsOn],
    );
    const today = useMemo(() => parseCalendarDate(new Date())!, []);
    const weekdayLabels = useMemo(
      () => getWeekdayLabels(locale, weekStartsOn),
      [locale, weekStartsOn],
    );
    const [focusedDateKey, setFocusedDateKey] = useState(() =>
      toDateKey(selectedDate ?? visibleMonthDate),
    );
    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
      if (visibleMonth !== undefined || !selectedDate) {
        return;
      }

      setInternalVisibleMonth(toDateKey(startOfCalendarMonth(selectedDate)));
    }, [selectedDate, visibleMonth]);

    useEffect(() => {
      if (selectedDate) {
        setFocusedDateKey(toDateKey(selectedDate));
      }
    }, [selectedDate]);

    useEffect(() => {
      const currentFocusDate = parseCalendarDate(focusedDateKey);

      if (!currentFocusDate || !weeks.some((week) => week.some((date) => toDateKey(date) === focusedDateKey))) {
        setFocusedDateKey(toDateKey(selectedDate ?? visibleMonthDate));
      }
    }, [focusedDateKey, selectedDate, visibleMonthDate, weeks]);

    useEffect(() => {
      if (!autoFocus) {
        return;
      }

      const frame = window.requestAnimationFrame(() => {
        buttonRefs.current[focusedDateKey]?.focus();
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [autoFocus, focusedDateKey, visibleMonthDate]);

    function updateVisibleMonth(nextVisibleMonth: Date) {
      const monthKey = toDateKey(startOfCalendarMonth(nextVisibleMonth));

      if (visibleMonth === undefined) {
        setInternalVisibleMonth(monthKey);
      }

      onVisibleMonthChange?.(monthKey);
    }

    function setNextValue(nextValue: string) {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    }

    function selectDate(nextDate: Date) {
      if (isDateDisabled(nextDate, minCalendarDate, maxCalendarDate)) {
        return;
      }

      setFocusedDateKey(toDateKey(nextDate));
      setNextValue(toDateKey(nextDate));
    }

    function moveFocus(nextDate: Date) {
      setFocusedDateKey(toDateKey(nextDate));

      if (!isSameCalendarMonth(nextDate, visibleMonthDate)) {
        updateVisibleMonth(nextDate);
      }
    }

    return (
      <div
        ref={ref}
        className={cx("ax-calendar-panel", className)}
        role="group"
        aria-labelledby={titleId}
        {...props}
      >
        <div className="ax-calendar-panel__header">
          <div className="ax-calendar-panel__nav">
            <Button
              aria-label={copy.previousMonth}
              iconName="chevron-left"
              variant="transparent"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                const nextMonth = addCalendarMonths(visibleMonthDate, -1);

                updateVisibleMonth(nextMonth);
                setFocusedDateKey(toDateKey(nextMonth));
              }}
            />
            <Button
              aria-label={copy.nextMonth}
              iconName="chevron-right"
              variant="transparent"
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => {
                const nextMonth = addCalendarMonths(visibleMonthDate, 1);

                updateVisibleMonth(nextMonth);
                setFocusedDateKey(toDateKey(nextMonth));
              }}
            />
          </div>
          <strong className="ax-calendar-panel__title" id={titleId}>
            {formatCalendarDate(visibleMonthDate, locale, {
              month: "long",
              year: "numeric",
            })}
          </strong>
        </div>

        <div className="ax-calendar-panel__weekdays" aria-hidden="true">
          {weekdayLabels.map((weekdayLabel) => (
            <span key={weekdayLabel} className="ax-calendar-panel__weekday">
              {weekdayLabel}
            </span>
          ))}
        </div>

        <div className="ax-calendar-panel__weeks" role="grid" aria-labelledby={titleId}>
          {weeks.map((week) => (
            <div
              key={week.map((date) => toDateKey(date)).join("|")}
              className="ax-calendar-panel__week"
              role="row"
            >
              {week.map((date) => {
                const dateKey = toDateKey(date);
                const selected =
                  selectedDate !== null && isSameCalendarDay(date, selectedDate);
                const inVisibleMonth = isSameCalendarMonth(date, visibleMonthDate);
                const disabled = isDateDisabled(
                  date,
                  minCalendarDate,
                  maxCalendarDate,
                );
                const current = isSameCalendarDay(date, today);

                return (
                  <div
                    key={dateKey}
                    className="ax-calendar-panel__day-cell"
                    role="gridcell"
                    aria-selected={selected}
                    aria-disabled={disabled}
                  >
                    <button
                      ref={(node) => {
                        buttonRefs.current[dateKey] = node;
                      }}
                      type="button"
                      className="ax-calendar-panel__day"
                      data-current={current}
                      data-disabled={disabled}
                      data-focused={focusedDateKey === dateKey}
                      data-outside-month={!inVisibleMonth}
                      data-selected={selected}
                      aria-current={current ? "date" : undefined}
                      aria-label={formatCalendarDate(date, locale, {
                        day: "numeric",
                        month: "long",
                        weekday: "long",
                        year: "numeric",
                      })}
                      tabIndex={focusedDateKey === dateKey ? 0 : -1}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => selectDate(date)}
                      onFocus={() => setFocusedDateKey(dateKey)}
                      onKeyDown={(event) => {
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
                      }}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {(minCalendarDate || maxCalendarDate) && (
          <div className="ax-calendar-panel__range-note">
            {[
              minCalendarDate
                ? formatRangeSummaryBoundary(
                    "min",
                    formatCalendarDate(minCalendarDate, locale),
                    locale,
                  )
                : undefined,
              maxCalendarDate
                ? formatRangeSummaryBoundary(
                    "max",
                    formatCalendarDate(maxCalendarDate, locale),
                    locale,
                  )
                : undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>
    );
  },
);
