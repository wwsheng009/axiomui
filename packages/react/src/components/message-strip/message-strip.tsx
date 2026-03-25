import { useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";

export type MessageTone =
  | "information"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export interface MessageStripProps extends HTMLAttributes<HTMLDivElement> {
  tone?: MessageTone;
  headline?: ReactNode;
  actions?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  icon?: ReactNode;
  iconName?: string;
}

function getDefaultIconName(tone: MessageTone) {
  if (tone === "success") {
    return "success";
  }

  if (tone === "warning") {
    return "warning";
  }

  if (tone === "error") {
    return "error";
  }

  return "information";
}

export function MessageStrip({
  actions,
  children,
  className,
  closable,
  headline,
  icon,
  iconName,
  onClose,
  tone = "information",
  ...props
}: MessageStripProps) {
  const [dismissed, setDismissed] = useState(false);
  const resolvedIcon =
    icon ?? <Icon name={iconName ?? getDefaultIconName(tone)} />;

  if (dismissed) {
    return null;
  }

  return (
    <div
      className={cx("ax-message-strip", className)}
      data-tone={tone}
      role="status"
      {...props}
    >
      <div className="ax-message-strip__icon" aria-hidden="true">
        {resolvedIcon}
      </div>
      <div className="ax-message-strip__content">
        {headline ? (
          <strong className="ax-message-strip__headline">{headline}</strong>
        ) : null}
        {children ? <div className="ax-message-strip__body">{children}</div> : null}
      </div>
      {actions ? <div className="ax-message-strip__actions">{actions}</div> : null}
      {closable ? (
        <Button
          aria-label="Close message"
          iconName="close"
          variant="transparent"
          onClick={() => {
            setDismissed(true);
            onClose?.();
          }}
        />
      ) : null}
    </div>
  );
}
