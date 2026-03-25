import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

import { cx } from "../../lib/cx";

export type ValueState = "none" | "error" | "warning" | "success" | "information";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  message?: string;
  valueState?: ValueState;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    description,
    disabled,
    endAdornment,
    id,
    inputClassName,
    label,
    message,
    readOnly,
    startAdornment,
    valueState = "none",
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={cx("ax-input", className)}
      data-disabled={disabled}
      data-readonly={readOnly}
      data-value-state={valueState}
    >
      {label ? (
        <div className="ax-input__label-row">
          <label className="ax-input__label" htmlFor={controlId}>
            {label}
          </label>
          {description ? (
            <span className="ax-input__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </div>
      ) : description ? (
        <span className="ax-input__description" id={descriptionId}>
          {description}
        </span>
      ) : null}

      <div className="ax-input__control">
        {startAdornment ? (
          <span className="ax-input__adornment" aria-hidden="true">
            {startAdornment}
          </span>
        ) : null}
        <input
          ref={ref}
          id={controlId}
          className={cx("ax-input__native", inputClassName)}
          aria-describedby={describedBy}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
        {endAdornment ? (
          <span className="ax-input__adornment" aria-hidden="true">
            {endAdornment}
          </span>
        ) : null}
      </div>

      {message ? (
        <span className="ax-input__support" id={messageId}>
          {message}
        </span>
      ) : null}
    </div>
  );
});

