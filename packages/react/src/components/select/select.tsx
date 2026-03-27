import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { restoreElementFocus } from "../../lib/overlay/focus-restore";
import { useLocale } from "../../providers/locale-provider";
import { Icon } from "../icon/icon";
import { getOverlayCopy } from "../overlay/overlay-copy";
import { Popover } from "../popover/popover";
import type { ValueState } from "../input/input";

export interface SelectItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  label?: string;
  matchTriggerWidth?: boolean;
  message?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  valueState?: ValueState;
  items: SelectItem[];
}

function getFirstEnabledIndex(items: SelectItem[]) {
  return Math.max(
    0,
    items.findIndex((item) => !item.disabled),
  );
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    className,
    defaultValue,
    description,
    disabled,
    id,
    items,
    label,
    matchTriggerWidth = true,
    message,
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
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const descriptionId = description ? `${triggerId}-description` : undefined;
  const messageId = message ? `${triggerId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
  const { locale } = useLocale();
  const copy = useMemo(() => getOverlayCopy(locale), [locale]);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [activeIndex, setActiveIndex] = useState(getFirstEnabledIndex(items));
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const resolvedValue = value ?? internalValue;

  const selectedItem = useMemo(
    () => items.find((item) => item.value === resolvedValue),
    [items, resolvedValue],
  );
  const resolvedPlaceholder = placeholder ?? copy.selectPlaceholder;

  function focusTrigger() {
    window.requestAnimationFrame(() => {
      restoreElementFocus(triggerRef.current, [triggerRef.current]);
    });
  }

  function updateOpen(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      focusTrigger();
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedIndex = items.findIndex(
      (item) => item.value === resolvedValue && !item.disabled,
    );
    const nextIndex = selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(items);

    setActiveIndex(nextIndex);

    const frame = window.requestAnimationFrame(() => {
      optionRefs.current[nextIndex]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [items, open, resolvedValue]);

  function assignTrigger(node: HTMLButtonElement | null) {
    triggerRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      (ref as { current: HTMLButtonElement | null }).current = node;
    }
  }

  function commitValue(nextValue: string) {
    if (readOnly || disabled) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    updateOpen(false);
  }

  function moveHighlight(step: number) {
    if (!items.length) {
      return;
    }

    let nextIndex = activeIndex;

    for (let attempt = 0; attempt < items.length; attempt += 1) {
      nextIndex = (nextIndex + step + items.length) % items.length;

      if (!items[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
        return;
      }
    }
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled || readOnly) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      updateOpen(true);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      updateOpen(!open);
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const nextIndex = getFirstEnabledIndex(items);
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      const nextIndex = [...items]
        .map((item, index) => ({ index, item }))
        .reverse()
        .find(({ item }) => !item.disabled)?.index;

      if (nextIndex !== undefined) {
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const highlightedItem = items[activeIndex];

      if (highlightedItem && !highlightedItem.disabled) {
        commitValue(highlightedItem.value);
      }
    }
  }

  return (
    <div
      className={cx("ax-select", className)}
      data-disabled={disabled}
      data-readonly={readOnly}
      data-value-state={valueState}
      {...props}
    >
      {label ? (
        <div className="ax-select__label-row">
          <label className="ax-select__label" htmlFor={triggerId}>
            {label}
          </label>
          {description ? (
            <span className="ax-select__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </div>
      ) : description ? (
        <span className="ax-select__description" id={descriptionId}>
          {description}
        </span>
      ) : null}

      {name ? <input type="hidden" name={name} value={resolvedValue} /> : null}

      <button
        ref={assignTrigger}
        id={triggerId}
        className="ax-select__trigger"
        type="button"
        data-open={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={valueState === "error" || undefined}
        disabled={disabled}
        onClick={() => {
          if (!readOnly) {
            updateOpen(!open);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span
          className="ax-select__value"
          data-placeholder={selectedItem ? undefined : "true"}
        >
          {selectedItem?.label ?? resolvedPlaceholder}
        </span>
        <span className="ax-select__icon" aria-hidden="true">
          <Icon name="chevron-down" />
        </span>
      </button>

      <Popover
        anchorRef={triggerRef}
        matchTriggerWidth={matchTriggerWidth}
        onOpenChange={updateOpen}
        open={open}
      >
        <div
          id={listboxId}
          className="ax-select__list"
          role="listbox"
          aria-labelledby={label ? triggerId : undefined}
          onKeyDown={handleListKeyDown}
        >
          {items.map((item, index) => {
            const selected = item.value === resolvedValue;

            return (
              <button
                key={item.value}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                className="ax-select__option"
                type="button"
                role="option"
                data-highlighted={index === activeIndex}
                data-selected={selected}
                aria-selected={selected}
                disabled={item.disabled}
                onClick={() => commitValue(item.value)}
                onMouseEnter={() => {
                  if (!item.disabled) {
                    setActiveIndex(index);
                  }
                }}
              >
                <span className="ax-select__option-label">{item.label}</span>
                {item.description ? (
                  <span className="ax-select__option-description">
                    {item.description}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Popover>

      {message ? (
        <span className="ax-select__support" id={messageId}>
          {message}
        </span>
      ) : null}
    </div>
  );
});
