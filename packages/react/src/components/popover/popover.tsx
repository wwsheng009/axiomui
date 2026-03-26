import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { restoreAnchorFocus } from "../../lib/overlay/focus-restore";
import { useLocale } from "../../providers/locale-provider";
import { useOverlayStack } from "../../lib/overlay/overlay-stack";
import { Button } from "../button/button";
import { DismissLayer } from "../overlay/dismiss-layer";
import { getOverlayCopy } from "../overlay/overlay-copy";
import { PortalHost } from "../overlay/portal-host";

export type PopoverPlacement =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end";

interface PopoverPosition {
  left: number;
  maxHeight: number;
  maxWidth: number;
  minWidth?: number;
  top: number;
}

function clampToViewport(value: number, size: number, viewportSize: number, margin: number) {
  const availableSize = viewportSize - margin * 2;

  if (size >= availableSize) {
    return margin;
  }

  return Math.min(Math.max(value, margin), viewportSize - size - margin);
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
  const maxHeight = Math.max(viewportHeight - margin * 2, 0);
  const maxWidth = Math.max(viewportWidth - margin * 2, 0);
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

  left = clampToViewport(left, popoverRect.width, viewportWidth, margin);
  top = clampToViewport(top, popoverRect.height, viewportHeight, margin);

  return {
    left,
    maxHeight,
    maxWidth,
    minWidth: matchTriggerWidth ? Math.min(anchorRect.width, maxWidth) : undefined,
    top,
  };
}

export function Popover({
  actions,
  anchorRef,
  children,
  className,
  closable = false,
  closeButtonLabel,
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
  const { locale } = useLocale();
  const copy = useMemo(() => getOverlayCopy(locale), [locale]);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const overlayState = useOverlayStack(open);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const previousOpenRef = useRef(open);

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

  useEffect(() => {
    if (previousOpenRef.current && !open) {
      const frame = window.requestAnimationFrame(() => {
        restoreAnchorFocus(anchorRef.current);
      });

      previousOpenRef.current = open;

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    previousOpenRef.current = open;
  }, [anchorRef, open]);

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
        insideRefs={[anchorRef]}
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
            maxHeight: position?.maxHeight,
            maxWidth: position?.maxWidth,
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
                  aria-label={closeButtonLabel ?? copy.closePopover}
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
