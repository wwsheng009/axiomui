import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export type ToolbarVariant = "toolbar" | "header" | "shell";

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  start?: ReactNode;
  middle?: ReactNode;
  end?: ReactNode;
  headline?: ReactNode;
  supportingText?: ReactNode;
  variant?: ToolbarVariant;
  sticky?: boolean;
}

export function Toolbar({
  className,
  end,
  headline,
  middle,
  start,
  sticky,
  supportingText,
  variant = "toolbar",
  ...props
}: ToolbarProps) {
  const hasHeadline = headline || supportingText;

  return (
    <div
      className={cx("ax-toolbar", className)}
      data-sticky={sticky}
      data-variant={variant}
      {...props}
    >
      <div className="ax-toolbar__slot ax-toolbar__slot--start">{start}</div>

      <div className="ax-toolbar__slot ax-toolbar__slot--middle">
        {hasHeadline ? (
          <div className="ax-toolbar__headline">
            {headline ? <span className="ax-toolbar__title">{headline}</span> : null}
            {supportingText ? (
              <span className="ax-toolbar__supporting-text">{supportingText}</span>
            ) : null}
          </div>
        ) : null}
        {middle}
      </div>

      <div className="ax-toolbar__slot ax-toolbar__slot--end">{end}</div>
    </div>
  );
}

