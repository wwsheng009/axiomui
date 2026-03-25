import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface ToolHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  start?: ReactNode;
  title?: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  sticky?: boolean;
}

export function ToolHeader({
  actions,
  className,
  meta,
  navigation,
  start,
  sticky,
  title,
  ...props
}: ToolHeaderProps) {
  return (
    <div className={cx("ax-tool-header", className)} data-sticky={sticky} {...props}>
      <div className="ax-tool-header__start">
        {start}
        {title ? <div className="ax-tool-header__title">{title}</div> : null}
      </div>
      {navigation ? <div className="ax-tool-header__nav">{navigation}</div> : null}
      <div className="ax-tool-header__end">
        {actions ? <div className="ax-tool-header__actions">{actions}</div> : null}
        {meta ? <div className="ax-tool-header__meta">{meta}</div> : null}
      </div>
    </div>
  );
}
