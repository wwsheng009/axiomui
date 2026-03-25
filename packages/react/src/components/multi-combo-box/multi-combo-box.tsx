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
import { Icon } from "../icon/icon";
import type { ValueState } from "../input/input";
import { Popover } from "../popover/popover";

export interface MultiComboBoxItem {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  textValue?: string;
}

export interface MultiComboBoxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  defaultInputValue?: string;
  defaultValues?: string[];
  description?: string;
  disabled?: boolean;
  inputValue?: string;
  items: MultiComboBoxItem[];
  label?: string;
  matchTriggerWidth?: boolean;
  maxVisibleValues?: number;
  message?: string;
  name?: string;
  onInputValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  valueState?: ValueState;
  values?: string[];
}

function getItemText(item: MultiComboBoxItem) {
  if (item.textValue) {
    return item.textValue;
  }

  if (typeof item.label === "string") {
    return item.label;
  }

  return item.value;
}

function getFirstEnabledIndex(items: MultiComboBoxItem[]) {
  return Math.max(
    0,
    items.findIndex((item) => !item.disabled),
  );
}

export const MultiComboBox = forwardRef<HTMLInputElement, MultiComboBoxProps>(
  function MultiComboBox(
    {
      className,
      defaultInputValue = "",
      defaultValues = [],
      description,
      disabled,
      id,
      inputValue,
      items,
      label,
      matchTriggerWidth = true,
      maxVisibleValues,
      message,
      name,
      onInputValueChange,
      onValuesChange,
      placeholder = "Type to search",
      readOnly,
      valueState = "none",
      values,
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
    const [open, setOpen] = useState(false);
    const [internalValues, setInternalValues] = useState(defaultValues);
    const [internalInputValue, setInternalInputValue] = useState(defaultInputValue);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);
    const resolvedValues = values ?? internalValues;
    const resolvedInputValue = inputValue ?? internalInputValue;
    const selectedValueSet = useMemo(() => new Set(resolvedValues), [resolvedValues]);
    const itemMap = useMemo(
      () => new Map(items.map((item) => [item.value, item])),
      [items],
    );

    const filteredItems = useMemo(() => {
      const query = resolvedInputValue.trim().toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter((item) => {
        const textValue = getItemText(item).toLowerCase();
        const descriptionValue =
          typeof item.description === "string" ? item.description.toLowerCase() : "";

        return textValue.includes(query) || descriptionValue.includes(query);
      });
    }, [items, resolvedInputValue]);

    const visibleValues = useMemo(() => {
      if (
        maxVisibleValues === undefined ||
        maxVisibleValues < 0 ||
        resolvedValues.length <= maxVisibleValues
      ) {
        return resolvedValues;
      }

      return resolvedValues.slice(0, maxVisibleValues);
    }, [maxVisibleValues, resolvedValues]);

    const overflowCount =
      maxVisibleValues !== undefined && maxVisibleValues >= 0
        ? Math.max(resolvedValues.length - maxVisibleValues, 0)
        : 0;

    useEffect(() => {
      if (!open) {
        return;
      }

      setActiveIndex(getFirstEnabledIndex(filteredItems));
    }, [filteredItems, open]);

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

    function setNextInputValue(nextValue: string) {
      if (inputValue === undefined) {
        setInternalInputValue(nextValue);
      }

      onInputValueChange?.(nextValue);
    }

    function setNextValues(nextValues: string[]) {
      if (values === undefined) {
        setInternalValues(nextValues);
      }

      onValuesChange?.(nextValues);
    }

    function focusInput() {
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }

    function updateOpen(nextOpen: boolean) {
      setOpen(nextOpen);

      if (!nextOpen) {
        focusInput();
      }
    }

    function toggleValue(nextValue: string) {
      if (disabled || readOnly) {
        return;
      }

      const nextValues = selectedValueSet.has(nextValue)
        ? resolvedValues.filter((valueItem) => valueItem !== nextValue)
        : [...resolvedValues, nextValue];

      setNextValues(nextValues);
      setNextInputValue("");
      setOpen(true);
      focusInput();
    }

    function removeValue(valueToRemove: string) {
      if (disabled || readOnly) {
        return;
      }

      setNextValues(resolvedValues.filter((valueItem) => valueItem !== valueToRemove));
      focusInput();
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

      if (event.key === "Enter" && open) {
        event.preventDefault();
        const highlightedItem = filteredItems[activeIndex];

        if (highlightedItem && !highlightedItem.disabled) {
          toggleValue(highlightedItem.value);
        }

        return;
      }

      if (
        event.key === "Backspace" &&
        !resolvedInputValue &&
        resolvedValues.length > 0
      ) {
        event.preventDefault();
        removeValue(resolvedValues[resolvedValues.length - 1]);
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
        className={cx("ax-multi-combo-box", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={valueState}
        {...props}
      >
        {label ? (
          <div className="ax-multi-combo-box__label-row">
            <label className="ax-multi-combo-box__label" htmlFor={inputId}>
              {label}
            </label>
            {description ? (
              <span className="ax-multi-combo-box__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-multi-combo-box__description" id={descriptionId}>
            {description}
          </span>
        ) : null}

        {name
          ? resolvedValues.map((itemValue, index) => (
              <input
                key={`${itemValue}-${index}`}
                type="hidden"
                name={name}
                value={itemValue}
              />
            ))
          : null}

        <div
          ref={controlRef}
          className="ax-multi-combo-box__control"
          data-open={open}
          onMouseDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              (event.target.closest(".ax-multi-combo-box__token-remove") ||
                event.target.closest(".ax-multi-combo-box__toggle"))
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
          {visibleValues.map((itemValue) => {
            const item = itemMap.get(itemValue);
            const itemText = item ? getItemText(item) : itemValue;

            return (
              <span key={itemValue} className="ax-multi-combo-box__token">
                <span className="ax-multi-combo-box__token-label">{itemText}</span>
                {!readOnly ? (
                  <button
                    type="button"
                    className="ax-multi-combo-box__token-remove"
                    aria-label={`Remove ${itemText}`}
                    disabled={disabled}
                    onClick={() => removeValue(itemValue)}
                  >
                    <Icon name="close" size="0.75rem" />
                  </button>
                ) : null}
              </span>
            );
          })}

          {overflowCount > 0 ? (
            <span className="ax-multi-combo-box__overflow">+{overflowCount}</span>
          ) : null}

          <input
            ref={assignInput}
            id={inputId}
            className="ax-multi-combo-box__input"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={open ? listboxId : undefined}
            aria-describedby={describedBy}
            aria-expanded={open}
            aria-activedescendant={
              open && filteredItems[activeIndex]
                ? `${inputId}-option-${filteredItems[activeIndex].value}`
                : undefined
            }
            disabled={disabled}
            placeholder={resolvedValues.length > 0 ? "" : placeholder}
            readOnly={readOnly}
            value={resolvedInputValue}
            onChange={(event) => {
              setNextInputValue(event.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (!disabled && !readOnly) {
                setOpen(true);
              }
            }}
            onKeyDown={handleInputKeyDown}
          />
          <div className="ax-multi-combo-box__toggle">
            <button
              type="button"
              className="ax-button"
              aria-label={open ? "Close suggestions" : "Open suggestions"}
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
            <div
              id={listboxId}
              className="ax-multi-combo-box__list"
              role="listbox"
              aria-multiselectable="true"
            >
              {filteredItems.map((item, index) => {
                const selected = selectedValueSet.has(item.value);

                return (
                  <button
                    key={item.value}
                    id={`${inputId}-option-${item.value}`}
                    className="ax-multi-combo-box__option"
                    type="button"
                    role="option"
                    data-highlighted={index === activeIndex}
                    data-selected={selected}
                    aria-selected={selected}
                    disabled={item.disabled}
                    onClick={() => toggleValue(item.value)}
                    onMouseEnter={() => {
                      if (!item.disabled) {
                        setActiveIndex(index);
                      }
                    }}
                  >
                    <span className="ax-multi-combo-box__option-copy">
                      <span className="ax-multi-combo-box__option-label">{item.label}</span>
                      {item.description ? (
                        <span className="ax-multi-combo-box__option-description">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <span className="ax-multi-combo-box__option-state">
                      {selected ? "Selected" : "Choose"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="ax-multi-combo-box__empty">No matching items.</div>
          )}
        </Popover>

        {message ? (
          <span className="ax-multi-combo-box__support" id={messageId}>
            {message}
          </span>
        ) : null}
      </div>
    );
  },
);
