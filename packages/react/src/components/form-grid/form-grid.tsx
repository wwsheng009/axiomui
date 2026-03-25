import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
}

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  span?: 1 | 2 | 3;
  required?: boolean;
  htmlFor?: string;
}

export function FormGrid({
  children,
  className,
  columns = 2,
  ...props
}: FormGridProps) {
  return (
    <div
      className={cx("ax-form-grid", className)}
      data-columns={columns}
      {...props}
    >
      {children}
    </div>
  );
}

export function FormField({
  children,
  className,
  description,
  hint,
  htmlFor,
  label,
  required,
  span = 1,
  style,
  ...props
}: FormFieldProps) {
  return (
    <div
      className={cx("ax-form-field", className)}
      data-span={span}
      style={
        {
          ...style,
          "--ax-form-span": span,
        } as CSSProperties
      }
      {...props}
    >
      <div className="ax-form-field__meta">
        {htmlFor ? (
          <label className="ax-form-field__label" htmlFor={htmlFor}>
            {label}
            {required ? <span className="ax-form-field__required">*</span> : null}
          </label>
        ) : (
          <span className="ax-form-field__label">
            {label}
            {required ? <span className="ax-form-field__required">*</span> : null}
          </span>
        )}
        {description ? (
          <span className="ax-form-field__description">{description}</span>
        ) : null}
      </div>

      <div className="ax-form-field__control">{children}</div>

      {hint ? <div className="ax-form-field__hint">{hint}</div> : null}
    </div>
  );
}
