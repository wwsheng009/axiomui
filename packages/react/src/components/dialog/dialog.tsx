import {
  type HTMLAttributes,
  type ReactNode,
  useId,
  useRef,
} from "react";

import { cx } from "../../lib/cx";
import { useBodyScrollLock } from "../../lib/overlay/use-body-scroll-lock";
import { useOverlayStack } from "../../lib/overlay/overlay-stack";
import { Button } from "../button/button";
import { DismissLayer } from "../overlay/dismiss-layer";
import { FocusTrap } from "../overlay/focus-trap";
import { PortalHost } from "../overlay/portal-host";

export type DialogTone =
  | "default"
  | "information"
  | "success"
  | "warning"
  | "error";

export interface DialogProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footerStart?: ReactNode;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: DialogTone;
}

export function Dialog({
  actions,
  children,
  className,
  closeOnOverlayClick = true,
  description,
  footerStart,
  onClose,
  open,
  size = "md",
  style,
  title,
  tone = "default",
  ...props
}: DialogProps) {
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
        className={cx("ax-dialog", className)}
        active={open}
        contentRef={shellRef}
        dismissOnEscape
        dismissOnPointerDownOutside={closeOnOverlayClick}
        isTopmost={overlayState.isTopmost}
        onDismiss={onClose}
        role="presentation"
        style={{
          ...style,
          zIndex: overlayState.zIndex,
        }}
        {...props}
      >
        <div className="ax-dialog__backdrop" />
        <FocusTrap
          ref={shellRef}
          className="ax-dialog__shell"
          data-size={size}
          data-tone={tone}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
        >
          <header className="ax-dialog__header">
            <div className="ax-dialog__heading">
              <h2 id={titleId} className="ax-dialog__title">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="ax-dialog__description">
                  {description}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="Close dialog"
              iconName="close"
              variant="transparent"
              onClick={onClose}
            />
          </header>

          <div className="ax-dialog__content">{children}</div>

          {footerStart || actions ? (
            <footer className="ax-dialog__footer">
              <div className="ax-dialog__footer-start">{footerStart}</div>
              <div className="ax-dialog__footer-actions">{actions}</div>
            </footer>
          ) : null}
        </FocusTrap>
      </DismissLayer>
    </PortalHost>
  );
}
