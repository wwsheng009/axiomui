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
import { useBodyScrollLock } from "../../lib/overlay/use-body-scroll-lock";
import { useOverlayStack } from "../../lib/overlay/overlay-stack";
import { useLocale } from "../../providers/locale-provider";
import { Button } from "../button/button";
import { DismissLayer } from "../overlay/dismiss-layer";
import { FocusTrap } from "../overlay/focus-trap";
import { getOverlayCopy } from "../overlay/overlay-copy";
import { PortalHost } from "../overlay/portal-host";
import { Popover, type PopoverPlacement } from "../popover/popover";

function useIsSmallScreen(breakpoint: number) {
  const [isSmallScreen, setIsSmallScreen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function updateViewportState() {
      setIsSmallScreen(window.innerWidth <= breakpoint);
    }

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
    };
  }, [breakpoint]);

  return isSmallScreen;
}

interface ResponsivePopoverSheetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  actions?: ReactNode;
  closable?: boolean;
  closeButtonLabel?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  description?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  title?: ReactNode;
}

function ResponsivePopoverSheet({
  actions,
  children,
  className,
  closable = false,
  closeButtonLabel,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  description,
  onOpenChange,
  open,
  style,
  title,
  ...props
}: ResponsivePopoverSheetProps) {
  const { locale } = useLocale();
  const copy = useMemo(() => getOverlayCopy(locale), [locale]);
  const titleId = useId();
  const descriptionId = useId();
  const shellRef = useRef<HTMLDivElement>(null);
  const overlayState = useOverlayStack(open);

  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <PortalHost>
      <DismissLayer
        className="ax-responsive-popover"
        active={open}
        contentRef={shellRef}
        dismissOnEscape={closeOnEscape}
        dismissOnPointerDownOutside={closeOnOutsideClick}
        isTopmost={overlayState.isTopmost}
        onDismiss={() => onOpenChange?.(false)}
        role="presentation"
        style={{ zIndex: overlayState.zIndex }}
      >
        <div className="ax-responsive-popover__backdrop" />
        <FocusTrap
          ref={shellRef}
          className={cx("ax-responsive-popover__sheet", className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          style={style}
          {...props}
        >
          <div className="ax-responsive-popover__grabber" aria-hidden="true" />

          {title || description || (closable && onOpenChange) ? (
            <header className="ax-responsive-popover__header">
              <div className="ax-responsive-popover__headline">
                {title ? (
                  <span id={titleId} className="ax-responsive-popover__title">
                    {title}
                  </span>
                ) : null}
                {description ? (
                  <span
                    id={descriptionId}
                    className="ax-responsive-popover__description"
                  >
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

          {children ? (
            <div className="ax-responsive-popover__content">{children}</div>
          ) : null}
          {actions ? (
            <footer className="ax-responsive-popover__footer">{actions}</footer>
          ) : null}
        </FocusTrap>
      </DismissLayer>
    </PortalHost>
  );
}

export interface ResponsivePopoverProps
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
  smallScreenBreakpoint?: number;
  title?: ReactNode;
}

export function ResponsivePopover({
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
  smallScreenBreakpoint = 640,
  style,
  title,
  ...props
}: ResponsivePopoverProps) {
  const isSmallScreen = useIsSmallScreen(smallScreenBreakpoint);

  if (isSmallScreen) {
    return (
      <ResponsivePopoverSheet
        actions={actions}
        className={className}
        closable={closable}
        closeButtonLabel={closeButtonLabel}
        closeOnEscape={closeOnEscape}
        closeOnOutsideClick={closeOnOutsideClick}
        description={description}
        onOpenChange={onOpenChange}
        open={open}
        style={style}
        title={title}
        {...props}
      >
        {children}
      </ResponsivePopoverSheet>
    );
  }

  return (
    <Popover
      actions={actions}
      anchorRef={anchorRef}
      className={className}
      closable={closable}
      closeButtonLabel={closeButtonLabel}
      closeOnEscape={closeOnEscape}
      closeOnOutsideClick={closeOnOutsideClick}
      description={description}
      matchTriggerWidth={matchTriggerWidth}
      offset={offset}
      onOpenChange={onOpenChange}
      open={open}
      placement={placement}
      style={style}
      title={title}
      {...props}
    >
      {children}
    </Popover>
  );
}
