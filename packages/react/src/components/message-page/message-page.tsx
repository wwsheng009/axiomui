import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";
import type { MessageTone } from "../message-strip/message-strip";

export interface MessagePageProps extends HTMLAttributes<HTMLDivElement> {
  tone?: MessageTone;
  headline: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
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

export function MessagePage({
  actions,
  className,
  description,
  headline,
  icon,
  iconName,
  tone = "information",
  ...props
}: MessagePageProps) {
  const resolvedIcon =
    icon ?? <Icon name={iconName ?? getDefaultIconName(tone)} size="1.75rem" />;

  return (
    <section
      className={cx("ax-message-page", className)}
      data-tone={tone}
      {...props}
    >
      <div className="ax-message-page__icon" aria-hidden="true">
        {resolvedIcon}
      </div>
      <div className="ax-message-page__content">
        <h2 className="ax-message-page__headline">{headline}</h2>
        {description ? (
          <p className="ax-message-page__description">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="ax-message-page__actions">{actions}</div> : null}
    </section>
  );
}
