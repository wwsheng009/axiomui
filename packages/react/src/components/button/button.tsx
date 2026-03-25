import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";

export type ButtonVariant =
  | "default"
  | "emphasized"
  | "positive"
  | "negative"
  | "attention"
  | "transparent";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconName?: string;
  iconPosition?: "start" | "end";
  selected?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    icon,
    iconName,
    iconPosition = "start",
    selected,
    fullWidth,
    type = "button",
    variant = "default",
    ...props
  },
  ref,
) {
  const resolvedIcon = icon ?? (iconName ? <Icon name={iconName} /> : null);
  const iconOnly = Boolean(resolvedIcon) && !children;

  return (
    <button
      ref={ref}
      className={cx("ax-button", className)}
      data-full-width={fullWidth}
      data-icon-only={iconOnly}
      data-selected={selected}
      data-variant={variant}
      aria-pressed={selected === undefined ? undefined : selected}
      type={type}
      {...props}
    >
      {resolvedIcon && iconPosition === "start" ? (
        <span className="ax-button__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      {children ? <span className="ax-button__label">{children}</span> : null}
      {resolvedIcon && iconPosition === "end" ? (
        <span className="ax-button__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
    </button>
  );
});
