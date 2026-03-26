import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useLocale } from "../../providers/locale-provider";
import { ResponsivePopover } from "../responsive-popover/responsive-popover";
import type { PopoverPlacement } from "../popover/popover";
import type { MessageTone } from "../message-strip/message-strip";
import { getMessagePopoverCopy } from "./message-popover-copy";

export interface MessagePopoverItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  tone?: MessageTone;
  unread?: boolean;
}

export interface MessagePopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  anchorRef: RefObject<HTMLElement | null>;
  closable?: boolean;
  description?: ReactNode;
  emptyState?: ReactNode;
  items: MessagePopoverItem[];
  matchTriggerWidth?: boolean;
  onItemClick?: (item: MessagePopoverItem) => void;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  placement?: PopoverPlacement;
  smallScreenBreakpoint?: number;
  title?: ReactNode;
}

type GroupTone = MessageTone | "neutral";

const toneOrder: GroupTone[] = [
  "error",
  "warning",
  "success",
  "information",
  "neutral",
];

function getToneValue(item: MessagePopoverItem): GroupTone {
  return item.tone ?? "neutral";
}

export function MessagePopover({
  anchorRef,
  className,
  closable = true,
  description,
  emptyState,
  items,
  matchTriggerWidth = false,
  onItemClick,
  onOpenChange,
  open,
  placement = "bottom-end",
  smallScreenBreakpoint = 640,
  title,
  ...props
}: MessagePopoverProps) {
  const { locale } = useLocale();
  const copy = useMemo(() => getMessagePopoverCopy(locale), [locale]);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousOpenRef = useRef(open);

  const groupedItems = useMemo(
    () =>
      toneOrder
        .map((tone) => ({
          items: items.filter((item) => getToneValue(item) === tone),
          tone,
        }))
        .filter((group) => group.items.length > 0),
    [items],
  );

  useEffect(() => {
    if (!open || items.length === 0) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[0]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [items.length, open]);

  useEffect(() => {
    if (previousOpenRef.current && !open) {
      const frame = window.requestAnimationFrame(() => {
        anchorRef.current?.focus();
      });

      previousOpenRef.current = open;

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    previousOpenRef.current = open;
  }, [anchorRef, open]);

  const resolvedDescription =
    description ?? copy.messageCount(items.length);
  const resolvedTitle = title ?? copy.messagesLabel;

  let itemIndex = -1;

  return (
    <ResponsivePopover
      anchorRef={anchorRef}
      className={className}
      closable={closable}
      description={resolvedDescription}
      matchTriggerWidth={matchTriggerWidth}
      onOpenChange={onOpenChange}
      open={open}
      placement={placement}
      smallScreenBreakpoint={smallScreenBreakpoint}
      title={resolvedTitle}
      {...props}
    >
      <div className="ax-message-popover">
        <div className="ax-message-popover__summary" aria-hidden="true">
          <span className="ax-message-popover__count">{items.length}</span>
          <span className="ax-message-popover__summary-copy">
            {copy.messageCount(items.length)}
          </span>
        </div>

        {groupedItems.length > 0 ? (
          <div className="ax-message-popover__groups">
            {groupedItems.map((group) => (
              <section key={group.tone} className="ax-message-popover__group">
                <header className="ax-message-popover__group-header">
                  <span className="ax-message-popover__group-title">
                    {copy.toneLabel(group.tone)}
                  </span>
                  <span className="ax-message-popover__group-count">
                    {group.items.length}
                  </span>
                </header>

                <div className="ax-message-popover__list">
                  {group.items.map((item) => {
                    const currentItemIndex = itemIndex + 1;
                    itemIndex = currentItemIndex;

                    return (
                      <button
                        key={item.id}
                        ref={(node) => {
                          itemRefs.current[currentItemIndex] = node;
                        }}
                        className="ax-message-popover__item"
                        type="button"
                        data-tone={getToneValue(item)}
                        data-unread={item.unread}
                        onClick={() => onItemClick?.(item)}
                      >
                        <div className="ax-message-popover__item-body">
                          <div className="ax-message-popover__item-topline">
                            <strong className="ax-message-popover__item-title">
                              {item.title}
                            </strong>
                            {item.meta ? (
                              <span className="ax-message-popover__item-meta">
                                {item.meta}
                              </span>
                            ) : null}
                          </div>
                          {item.description ? (
                            <p className="ax-message-popover__item-description">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="ax-message-popover__empty">
            {emptyState ?? copy.emptyState}
          </div>
        )}
      </div>
    </ResponsivePopover>
  );
}
