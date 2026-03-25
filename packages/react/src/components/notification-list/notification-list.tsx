import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";
import type { MessageTone } from "../message-strip/message-strip";

export interface NotificationItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  unread?: boolean;
  tone?: MessageTone;
}

export interface NotificationListProps extends HTMLAttributes<HTMLDivElement> {
  heading?: ReactNode;
  items: NotificationItem[];
  emptyState?: ReactNode;
}

export function NotificationList({
  className,
  emptyState = "No notifications.",
  heading,
  items,
  ...props
}: NotificationListProps) {
  return (
    <section className={cx("ax-notification-list", className)} {...props}>
      {heading ? <header className="ax-notification-list__header">{heading}</header> : null}
      {items.length > 0 ? (
        <div className="ax-notification-list__items">
          {items.map((item) => (
            <article
              key={item.id}
              className="ax-notification-list__item"
              data-tone={item.tone ?? "neutral"}
              data-unread={item.unread}
            >
              <div className="ax-notification-list__body">
                <div className="ax-notification-list__topline">
                  <strong className="ax-notification-list__title">{item.title}</strong>
                  {item.meta ? (
                    <span className="ax-notification-list__meta">{item.meta}</span>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="ax-notification-list__description">
                    {item.description}
                  </p>
                ) : null}
              </div>
              {item.action ? (
                <div className="ax-notification-list__action">{item.action}</div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="ax-notification-list__empty">{emptyState}</div>
      )}
    </section>
  );
}

