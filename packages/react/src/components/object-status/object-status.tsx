import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";

export type ObjectStatusTone =
  | "information"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export interface ObjectStatusProps extends HTMLAttributes<HTMLSpanElement> {
  label: ReactNode;
  tone?: ObjectStatusTone;
  icon?: ReactNode;
  iconName?: string;
}

function getDefaultIconName(tone: ObjectStatusTone) {
  if (tone === "success") {
    return "success";
  }

  if (tone === "warning") {
    return "warning";
  }

  if (tone === "error") {
    return "error";
  }

  if (tone === "information") {
    return "information";
  }

  return undefined;
}

export function ObjectStatus({
  className,
  icon,
  iconName,
  label,
  tone = "neutral",
  ...props
}: ObjectStatusProps) {
  const resolvedIconName = iconName ?? getDefaultIconName(tone);
  const resolvedIcon =
    icon ?? (resolvedIconName ? <Icon name={resolvedIconName} /> : null);

  return (
    <span
      className={cx("ax-object-status", className)}
      data-tone={tone}
      {...props}
    >
      {resolvedIcon ? (
        <span className="ax-object-status__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}
      <span className="ax-object-status__label">{label}</span>
    </span>
  );
}
