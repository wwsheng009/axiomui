import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { useOverlayStack } from "../../lib/overlay/overlay-stack";
import { Button } from "../button/button";
import { DismissLayer } from "../overlay/dismiss-layer";
import { PortalHost } from "../overlay/portal-host";

export type PopoverPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

interface PopoverPosition {
  left: number;
  minWidth?: number;
  top: number;
}

export interface PopoverProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  actions?: ReactNode;
  anchorRef: RefObject<HTMLElement | null>;
  closable?: boolean;
  closeButtonLabel?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  description?: ReactNode;
  matchTriggerWidth?: boolean;
  offset?: number;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  placement?: PopoverPlacement;
  title?: ReactNode;
}

function resolvePopoverPosition({
  anchorRect,
  matchTriggerWidth,
  offset,
  placement,
  popoverRect,
}: {
  anchorRect: DOMRect;
  matchTriggerWidth: boolean;
  offset: number;
  placement: PopoverPlacement;
  popoverRect: DOMRect;
}): PopoverPosition {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const margin = 12;
  let side = placement.startsWith("top") ? "top" : "bottom";
  const align = placement.endsWith("end") ? "end" : "start";
  let top =
    side === "top"
      ? anchorRect.top - popoverRect.height - offset
      : anchorRect.bottom + offset;

  if (side === "top" && top < margin) {
    side = "bottom";
    top = anchorRect.bottom + offset;
  } else if (
    side === "bottom" &&
    top + popoverRect.height > viewportHeight - margin
  ) {
    side = "top";
    top = anchorRect.top - popoverRect.height - offset;
  }

  let left =
    align === "end"
      ? anchorRect.right - popoverRect.width
      : anchorRect.left;

  left = Math.min(
    Math.max(left, margin),
    viewportWidth - popoverRect.width - margin,
  );
  top = Math.min(
    Math.max(top, margin),
    viewportHeight - popoverRect.height - margin,
  );

  return {
    left,
    minWidth: matchTriggerWidth ? anchorRect.width : undefined,
    top,
  };
}

export function Popover({
  actions,
  anchorRef,
  children,
  className,
  closable = false,
  closeButtonLabel = "Close popover",
  closeOnEscape = true,
  closeOnOutsideClick = true,
  description,
  matchTriggerWidth,
  offset = 8,
  onOpenChange,
  open,
  placement = "bottom-start",
  style,
  title,
  ...props
}: PopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const overlayState = useOverlayStack(open);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useEffect(() => {
    if (!open || !anchorRef.current || !contentRef.current) {
      return;
    }

    function updatePosition() {
      if (!anchorRef.current || !contentRef.current) {
        return;
      }

      setPosition(
        resolvePopoverPosition({
          anchorRect: anchorRef.current.getBoundingClientRect(),
          matchTriggerWidth: Boolean(matchTriggerWidth),
          offset,
          placement,
          popoverRect: contentRef.current.getBoundingClientRect(),
        }),
      );
    }

    const frame = window.requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, matchTriggerWidth, offset, open, placement]);

  if (!open) {
    return null;
  }

  return (
    <PortalHost>
      <DismissLayer
        className="ax-popover"
        active={open}
        contentRef={contentRef}
        dismissOnEscape={closeOnEscape}
        dismissOnPointerDownOutside={closeOnOutsideClick}
        isTopmost={overlayState.isTopmost}
        onDismiss={() => onOpenChange?.(false)}
        role="presentation"
        style={{ zIndex: overlayState.zIndex }}
      >
        <div
          ref={contentRef}
          className={cx("ax-popover__shell", className)}
          role="dialog"
          aria-modal="false"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          style={{
            ...style,
            left: position?.left ?? 12,
            minWidth: position?.minWidth,
            top: position?.top ?? 12,
          }}
          {...props}
        >
          {title || description || (closable && onOpenChange) ? (
            <header className="ax-popover__header">
              <div className="ax-popover__headline">
                {title ? (
                  <span id={titleId} className="ax-popover__title">
                    {title}
                  </span>
                ) : null}
                {description ? (
                  <span id={descriptionId} className="ax-popover__description">
                    {description}
                  </span>
                ) : null}
              </div>
              {closable && onOpenChange ? (
                <Button
                  aria-label={closeButtonLabel}
                  iconName="close"
                  variant="transparent"
                  onClick={() => onOpenChange(false)}
                />
              ) : null}
            </header>
          ) : null}
          {children ? <div className="ax-popover__content">{children}</div> : null}
          {actions ? <footer className="ax-popover__footer">{actions}</footer> : null}
        </div>
      </DismissLayer>
    </PortalHost>
  );
}
