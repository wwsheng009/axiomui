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
import type { ValueState } from "../input/input";
import {
  getOverlayCopy,
  getOverlayEmptyState,
} from "../overlay/overlay-copy";
import { Popover } from "../popover/popover";

export interface ComboBoxItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export interface ComboBoxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  allowCustomValue?: boolean;
  defaultInputValue?: string;
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  inputValue?: string;
  items: ComboBoxItem[];
  label?: string;
  matchTriggerWidth?: boolean;
  message?: string;
  name?: string;
  onInputValueChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  valueState?: ValueState;
}

function getItemText(item: ComboBoxItem) {
  if (item.textValue) {
    return item.textValue;
  }

  if (typeof item.label === "string") {
    return item.label;
  }

  return item.value;
}

function getFirstEnabledIndex(items: ComboBoxItem[]) {
  return Math.max(
    0,
    items.findIndex((item) => !item.disabled),
  );
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(function ComboBox(
  {
    allowCustomValue = false,
    className,
    defaultInputValue,
    defaultValue,
    description,
    disabled,
    id,
    inputValue,
    items,
    label,
    matchTriggerWidth = true,
    message,
    name,
    onInputValueChange,
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
  const listboxId = `${inputId}-listbox`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const messageId = message ? `${inputId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
  const { locale } = useLocale();
  const copy = useMemo(() => getOverlayCopy(locale), [locale]);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const defaultSelectedItem = items.find((item) => item.value === defaultValue);
  const [internalInputValue, setInternalInputValue] = useState(
    defaultInputValue ?? (defaultSelectedItem ? getItemText(defaultSelectedItem) : ""),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);
  const resolvedValue = value ?? internalValue;
  const selectedItem = useMemo(
    () => items.find((item) => item.value === resolvedValue),
    [items, resolvedValue],
  );

  const selectedItemText = selectedItem ? getItemText(selectedItem) : "";
  const resolvedInputValue = inputValue ?? internalInputValue;
  const resolvedPlaceholder = placeholder ?? copy.searchPlaceholder;
  const shouldFilterOptions =
    resolvedInputValue.trim().length > 0 && resolvedInputValue !== selectedItemText;

  const filteredItems = useMemo(() => {
    if (!shouldFilterOptions) {
      return items;
    }

    const query = resolvedInputValue.trim().toLowerCase();

    return items.filter((item) => {
      const textValue = getItemText(item).toLowerCase();
      const descriptionValue =
        typeof item.description === "string" ? item.description.toLowerCase() : "";

      return textValue.includes(query) || descriptionValue.includes(query);
    });
  }, [items, resolvedInputValue, shouldFilterOptions]);

  useEffect(() => {
    if (inputValue !== undefined) {
      return;
    }

    if (selectedItem) {
      setInternalInputValue(getItemText(selectedItem));
      return;
    }

    if (value !== undefined && allowCustomValue) {
      setInternalInputValue(value);
    }
  }, [allowCustomValue, inputValue, selectedItem, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedIndex = filteredItems.findIndex(
      (item) => item.value === resolvedValue && !item.disabled,
    );

    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(filteredItems),
    );
  }, [filteredItems, open, resolvedValue]);

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
      restoreElementFocus(inputRef.current, [controlRef.current, inputRef.current]);
    });
  }

  function syncInputToSelection() {
    if (inputValue !== undefined) {
      return;
    }

    if (selectedItem) {
      setInternalInputValue(getItemText(selectedItem));
      return;
    }

    if (!allowCustomValue) {
      setInternalInputValue("");
    }
  }

  function updateOpen(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      syncInputToSelection();
      focusInput();
    }
  }

  function commitSelection(item: ComboBoxItem) {
    const nextText = getItemText(item);

    if (value === undefined) {
      setInternalValue(item.value);
    }

    if (inputValue === undefined) {
      setInternalInputValue(nextText);
    }

    onValueChange?.(item.value);
    onInputValueChange?.(nextText);
    updateOpen(false);
  }

  function clearSelectionIfNeeded(nextInputValue: string) {
    if (!selectedItem || nextInputValue === selectedItemText) {
      return;
    }

    if (value === undefined) {
      setInternalValue("");
    }

    onValueChange?.("");
  }

  function moveHighlight(step: number) {
    if (!filteredItems.length) {
      return;
    }

    let nextIndex = activeIndex;

    for (let attempt = 0; attempt < filteredItems.length; attempt += 1) {
      nextIndex = (nextIndex + step + filteredItems.length) % filteredItems.length;

      if (!filteredItems[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        return;
      }
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (disabled || readOnly) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }

      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
        return;
      }

      moveHighlight(-1);
      return;
    }

    if (event.key === "Enter") {
      if (!open) {
        return;
      }

      event.preventDefault();
      const highlightedItem = filteredItems[activeIndex];

      if (highlightedItem && !highlightedItem.disabled) {
        commitSelection(highlightedItem);
      } else if (allowCustomValue) {
        updateOpen(false);
      }

      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        updateOpen(false);
      }

      return;
    }

    if (event.key === "Tab" && open) {
      updateOpen(false);
    }
  }

  const hiddenValue =
    allowCustomValue && !selectedItem ? resolvedInputValue : resolvedValue;

  return (
    <div
      className={cx("ax-combo-box", className)}
      data-disabled={disabled}
      data-readonly={readOnly}
      data-value-state={valueState}
      {...props}
    >
      {label ? (
        <div className="ax-combo-box__label-row">
          <label className="ax-combo-box__label" htmlFor={inputId}>
            {label}
          </label>
          {description ? (
            <span className="ax-combo-box__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </div>
      ) : description ? (
        <span className="ax-combo-box__description" id={descriptionId}>
          {description}
        </span>
      ) : null}

      {name ? <input type="hidden" name={name} value={hiddenValue} /> : null}

      <div
        ref={controlRef}
        className="ax-combo-box__control"
        data-open={open}
        onMouseDown={(event) => {
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".ax-combo-box__toggle")
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
          className="ax-combo-box__native"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={open ? listboxId : undefined}
          aria-describedby={describedBy}
          aria-expanded={open}
          aria-invalid={valueState === "error" || undefined}
          aria-activedescendant={
            open && filteredItems[activeIndex]
              ? `${inputId}-option-${filteredItems[activeIndex].value}`
              : undefined
          }
          disabled={disabled}
          placeholder={resolvedPlaceholder}
          readOnly={readOnly}
          value={resolvedInputValue}
          onChange={(event) => {
            const nextInputValue = event.target.value;

            if (inputValue === undefined) {
              setInternalInputValue(nextInputValue);
            }

            clearSelectionIfNeeded(nextInputValue);
            onInputValueChange?.(nextInputValue);
            setOpen(true);
          }}
          onFocus={() => {
            if (!disabled && !readOnly) {
              setOpen(true);
            }
          }}
          onKeyDown={handleInputKeyDown}
        />
        <div className="ax-combo-box__toggle">
          <button
            type="button"
            className="ax-button"
            aria-label={open ? copy.closeSuggestions : copy.openSuggestions}
            data-variant="transparent"
            onClick={() => {
              if (!disabled && !readOnly) {
                updateOpen(!open);
              }
            }}
          >
            <span className="ax-button__icon" aria-hidden="true">
              <Icon name="chevron-down" />
            </span>
          </button>
        </div>
      </div>

      <Popover
        anchorRef={controlRef}
        matchTriggerWidth={matchTriggerWidth}
        onOpenChange={updateOpen}
        open={open}
      >
        {filteredItems.length ? (
          <div id={listboxId} className="ax-combo-box__list" role="listbox">
            {filteredItems.map((item, index) => {
              const selected = item.value === resolvedValue;

              return (
                <button
                  key={item.value}
                  id={`${inputId}-option-${item.value}`}
                  className="ax-combo-box__option"
                  type="button"
                  role="option"
                  data-highlighted={index === activeIndex}
                  data-selected={selected}
                  aria-selected={selected}
                  disabled={item.disabled}
                  onClick={() => commitSelection(item)}
                  onMouseEnter={() => {
                    if (!item.disabled) {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <span className="ax-combo-box__option-label">{item.label}</span>
                  {item.description ? (
                    <span className="ax-combo-box__option-description">
                      {item.description}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ax-combo-box__empty">
            {getOverlayEmptyState(locale, allowCustomValue)}
          </div>
        )}
      </Popover>

      {message ? (
        <span className="ax-combo-box__support" id={messageId}>
          {message}
        </span>
      ) : null}
    </div>
  );
});
