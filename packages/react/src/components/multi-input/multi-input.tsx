import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";
import type { ValueState } from "../input/input";

export interface MultiInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
  allowDuplicates?: boolean;
  commitOnBlur?: boolean;
  defaultInputValue?: string;
  defaultValues?: string[];
  delimiters?: string[];
  description?: string;
  disabled?: boolean;
  inputValue?: string;
  label?: string;
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

function normalizeTokenValue(value: string) {
  return value.trim();
}

export const MultiInput = forwardRef<HTMLInputElement, MultiInputProps>(
  function MultiInput(
    {
      allowDuplicates = false,
      className,
      commitOnBlur = true,
      defaultInputValue = "",
      defaultValues = [],
      delimiters = [","],
      description,
      disabled,
      id,
      inputValue,
      label,
      maxVisibleValues,
      message,
      name,
      onInputValueChange,
      onValuesChange,
      placeholder = "Type and press Enter",
      readOnly,
      valueState = "none",
      values,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const messageId = message ? `${inputId}-message` : undefined;
    const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;
    const [internalValues, setInternalValues] = useState(defaultValues);
    const [internalInputValue, setInternalInputValue] = useState(defaultInputValue);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const resolvedValues = values ?? internalValues;
    const resolvedInputValue = inputValue ?? internalInputValue;

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

    function commitToken(sourceValue: string) {
      if (disabled || readOnly) {
        return;
      }

      const nextToken = normalizeTokenValue(sourceValue);

      if (!nextToken) {
        setNextInputValue("");
        return;
      }

      if (!allowDuplicates && resolvedValues.includes(nextToken)) {
        setNextInputValue("");
        return;
      }

      setNextValues([...resolvedValues, nextToken]);
      setNextInputValue("");
    }

    function removeToken(index: number) {
      if (disabled || readOnly) {
        return;
      }

      setNextValues(resolvedValues.filter((_, itemIndex) => itemIndex !== index));
      focusInput();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
      if (disabled || readOnly) {
        return;
      }

      if (
        event.key === "Enter" ||
        delimiters.includes(event.key)
      ) {
        event.preventDefault();
        commitToken(resolvedInputValue);
        return;
      }

      if (
        event.key === "Backspace" &&
        !resolvedInputValue &&
        resolvedValues.length > 0
      ) {
        event.preventDefault();
        removeToken(resolvedValues.length - 1);
      }
    }

    return (
      <div
        className={cx("ax-multi-input", className)}
        data-disabled={disabled}
        data-readonly={readOnly}
        data-value-state={valueState}
        {...props}
      >
        {label ? (
          <div className="ax-multi-input__label-row">
            <label className="ax-multi-input__label" htmlFor={inputId}>
              {label}
            </label>
            {description ? (
              <span className="ax-multi-input__description" id={descriptionId}>
                {description}
              </span>
            ) : null}
          </div>
        ) : description ? (
          <span className="ax-multi-input__description" id={descriptionId}>
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
          className="ax-multi-input__control"
          onMouseDown={(event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.closest(".ax-multi-input__token-remove")
            ) {
              return;
            }

            if (!disabled) {
              window.requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }
          }}
        >
          {visibleValues.map((itemValue, index) => (
            <span key={`${itemValue}-${index}`} className="ax-multi-input__token">
              <span className="ax-multi-input__token-label">{itemValue}</span>
              {!readOnly ? (
                <button
                  type="button"
                  className="ax-multi-input__token-remove"
                  aria-label={`Remove ${itemValue}`}
                  disabled={disabled}
                  onClick={() => removeToken(index)}
                >
                  <Icon name="close" size="0.75rem" />
                </button>
              ) : null}
            </span>
          ))}

          {overflowCount > 0 ? (
            <span className="ax-multi-input__overflow">+{overflowCount}</span>
          ) : null}

          <input
            ref={assignInput}
            id={inputId}
            className="ax-multi-input__input"
            aria-describedby={describedBy}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={readOnly}
            value={resolvedInputValue}
            onBlur={() => {
              if (commitOnBlur && resolvedInputValue) {
                commitToken(resolvedInputValue);
              }
            }}
            onChange={(event) => setNextInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {message ? (
          <span className="ax-multi-input__support" id={messageId}>
            {message}
          </span>
        ) : null}
      </div>
    );
  },
);
