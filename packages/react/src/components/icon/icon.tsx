import type { HTMLAttributes } from "react";

import { cx } from "../../lib/cx";
import { getIconDefinition } from "../../lib/icon-registry";
import { useTheme } from "../../providers/theme-provider";

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  decorative?: boolean;
  fallback?: string;
  mirrorInRtl?: boolean;
  name: string;
  size?: number | string;
  title?: string;
}

export function Icon({
  className,
  decorative = true,
  fallback,
  mirrorInRtl,
  name,
  size = "1rem",
  title,
  ...props
}: IconProps) {
  const { direction } = useTheme();
  const definition = getIconDefinition(name);

  if (!definition) {
    if (!fallback) {
      return null;
    }

    return (
      <span
        className={cx("ax-icon", className)}
        aria-hidden={decorative ? true : undefined}
        role={decorative ? undefined : "img"}
        style={{ fontSize: size, height: size, width: size }}
        {...props}
      >
        {fallback}
      </span>
    );
  }

  const mirrored = (mirrorInRtl ?? definition.rtlMirror) && direction === "rtl";
  const paths = Array.isArray(definition.path) ? definition.path : [definition.path];

  return (
    <span
      className={cx("ax-icon", className)}
      data-mirrored={mirrored ? "true" : undefined}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      style={{ height: size, width: size }}
      {...props}
    >
      <svg
        className="ax-icon__svg"
        viewBox={definition.viewBox ?? "0 0 24 24"}
        fill="none"
        stroke="currentColor"
        strokeLinecap={definition.strokeLinecap ?? "round"}
        strokeLinejoin={definition.strokeLinejoin ?? "round"}
        strokeWidth={definition.strokeWidth ?? 1.8}
        aria-hidden="true"
      >
        {title && !decorative ? <title>{title}</title> : null}
        {paths.map((path, index) => (
          <path key={`${name}-${index}`} d={path} />
        ))}
      </svg>
    </span>
  );
}
