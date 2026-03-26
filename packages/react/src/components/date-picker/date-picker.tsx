import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { restoreElementFocus } from "../../lib/overlay/focus-restore";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import { getDateCopy } from "../calendar-panel/date-copy";
import { CalendarPanel } from "../calendar-panel/calendar-panel";
import {
  createDatePlaceholder,
  formatCalendarDate,
  isDateDisabled,
  parseCalendarDate,
  parseDateInput,
  resolveDateFormatOptions,
  toDateKey,
  type DateLike,
} from "../calendar-panel/date-utils";
import type { ValueState } from "../input/input";
import { Popover } from "../popover/popover";

export interface DatePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  format?: Intl.DateTimeFormatOptions;
  label?: string;
  matchTriggerWidth?: boolean;
  maxDate?: DateLike;
  message?: string;
  minDate?: DateLike;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  valueState?: ValueState;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      className,
      defaultValue,
      description,
      disabled,
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
      value,
      valueState = "none",
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const messageId = message ? `${inputId}-message` : undefined;
    const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
    const { locale } = useLocale();
    const resolvedFormat = resolveDateFormatOptions(format);
    const copy = getDateCopy(locale);
    const resolvedPlaceholder =
      placeholder ?? createDatePlaceholder(locale, resolvedFormat);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const [internalInputValue, setInternalInputValue] = useState("");
    const [parseError, setParseError] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const lastCommittedValueRef = useRef(value ?? defaultValue ?? "");
    const resolvedValue = value ?? internalValue;
    const selectedDate = parseCalendarDate(resolvedValue);
    const minCalendarDate = parseCalendarDate(minDate);
    const maxCalendarDate = parseCalendarDate(maxDate);
    const resolvedValueState = parseError ? "error" : valueState;

    useEffect(() => {
      const nextInputValue = selectedDate
        ? formatCalendarDate(selectedDate, locale, resolvedFormat)
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
    }, [locale, resolvedFormat, resolvedValue, selectedDate]);

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

    function updateOpen(nextOpen: boolean) {
      setOpen(nextOpen);

      if (!nextOpen) {
        focusInput();
      }
    }

    function commitValue(nextValue: string) {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
      lastCommittedValueRef.current = nextValue;
      setParseError(false);
      setInternalInputValue(
        nextValue
          ? formatCalendarDate(parseCalendarDate(nextValue)!, locale, resolvedFormat)
          : "",
      );
    }

    function commitInputValue(sourceValue: string) {
      const trimmedValue = sourceValue.trim();

      if (!trimmedValue) {
        commitValue("");
        return true;
      }

      const parsedDate = parseDateInput(trimmedValue, locale, resolvedFormat);

      if (
        !parsedDate ||
        isDateDisabled(parsedDate, minCalendarDate, maxCalendarDate)
      ) {
        setParseError(true);
        return false;
      }

      commitValue(toDateKey(parsedDate));
      return true;
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

        commitInputValue(internalInputValue);
      });
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (disabled || readOnly) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
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

    return (
      <div
        className={cx("ax-date-picker", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={resolvedValueState}
        {...props}
      >
        {label ? (
          <div className="ax-date-picker__label-row">
            <label className="ax-date-picker__label" htmlFor={inputId}>
              {label}
            </label>
            {description ? (
              <span className="ax-date-picker__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-date-picker__description" id={descriptionId}>
            {description}
          </span>
        ) : null}

        {name ? <input type="hidden" name={name} value={resolvedValue} /> : null}

        <div
          ref={controlRef}
          className="ax-date-picker__control"
          data-open={open}
          onMouseDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.closest(".ax-date-picker__toggle")
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
            className="ax-date-picker__native"
            aria-controls={open ? `${inputId}-calendar` : undefined}
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
          <div className="ax-date-picker__toggle">
            <Button
              aria-label={open ? copy.closeCalendar : copy.openCalendar}
              iconName="calendar"
              variant="transparent"
              onClick={() => {
                if (!disabled && !readOnly) {
                  setOpen((currentValue) => !currentValue);
                }
              }}
            />
          </div>
        </div>

        <Popover
          anchorRef={controlRef}
          matchTriggerWidth={matchTriggerWidth}
          onOpenChange={updateOpen}
          open={open}
        >
          <CalendarPanel
            ref={panelRef}
            id={`${inputId}-calendar`}
            autoFocus
            maxDate={maxDate}
            minDate={minDate}
            value={resolvedValue}
            onValueChange={(nextValue) => {
              commitValue(nextValue);
              updateOpen(false);
            }}
          />
        </Popover>

        {message ? (
          <span className="ax-date-picker__support" id={messageId}>
            {message}
          </span>
        ) : null}
      </div>
    );
  },
);
