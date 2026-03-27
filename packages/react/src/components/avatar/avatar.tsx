import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";
import type { ObjectStatusTone } from "../object-status/object-status";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatusTone = ObjectStatusTone;

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  alt?: string;
  icon?: ReactNode;
  iconName?: string;
  initials?: string;
  name?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
  statusLabel?: string;
  statusTone?: AvatarStatusTone;
}

function normalizeInitials(value: string) {
  return Array.from(value.replace(/\s+/g, "").trim())
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getInitials(initials?: string, name?: string) {
  if (initials) {
    const normalizedInitials = normalizeInitials(initials);

    return normalizedInitials || undefined;
  }

  if (!name) {
    return undefined;
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return undefined;
  }

  if (parts.length === 1) {
    const normalizedInitials = normalizeInitials(parts[0]);

    return normalizedInitials || undefined;
  }

  const first = Array.from(parts[0])[0] ?? "";
  const last = Array.from(parts[parts.length - 1] ?? "")[0] ?? "";
  const normalizedInitials = `${first}${last}`.toUpperCase();

  return normalizedInitials || undefined;
}

export function Avatar({
  alt,
  className,
  icon,
  iconName,
  initials,
  name,
  shape = "circle",
  size = "md",
  src,
  statusLabel,
  statusTone,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const resolvedInitials = useMemo(
    () => getInitials(initials, name),
    [initials, name],
  );
  const resolvedIcon = icon ?? <Icon name={iconName ?? "person"} />;

  function renderContent() {
    if (src && !imageFailed) {
      return (
        <img
          className="ax-avatar__image"
          alt={alt ?? ""}
          src={src}
          onError={() => setImageFailed(true)}
        />
      );
    }

    if (resolvedInitials) {
      return (
        <span className="ax-avatar__fallback" aria-hidden="true">
          {resolvedInitials}
        </span>
      );
    }

    return (
      <span
        className="ax-avatar__fallback ax-avatar__fallback--icon"
        aria-hidden="true"
      >
        {resolvedIcon}
      </span>
    );
  }

  return (
    <span
      className={cx("ax-avatar", className)}
      data-shape={shape}
      data-size={size}
      {...props}
    >
      <span className="ax-avatar__frame">{renderContent()}</span>

      {statusTone ? (
        <span
          className="ax-avatar__status"
          data-tone={statusTone}
          aria-hidden={statusLabel ? undefined : "true"}
          aria-label={statusLabel}
          role={statusLabel ? "img" : undefined}
        />
      ) : null}
    </span>
  );
}
