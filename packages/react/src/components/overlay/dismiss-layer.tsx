import {
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  useEffect,
} from "react";

export interface DismissLayerProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  contentRef?: RefObject<HTMLElement | null>;
  dismissOnEscape?: boolean;
  dismissOnPointerDownOutside?: boolean;
  isTopmost?: boolean;
  onDismiss?: () => void;
}

export function DismissLayer({
  active = true,
  contentRef,
  dismissOnEscape = true,
  dismissOnPointerDownOutside = true,
  isTopmost = true,
  onDismiss,
  onMouseDown,
  ...props
}: DismissLayerProps) {
  useEffect(() => {
    if (!active || !dismissOnEscape || !isTopmost || typeof document === "undefined") {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, dismissOnEscape, isTopmost, onDismiss]);

  function handleMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    onMouseDown?.(event);

    if (
      event.defaultPrevented ||
      !active ||
      !dismissOnPointerDownOutside ||
      !isTopmost
    ) {
      return;
    }

    const eventTarget = event.target;

    if (
      contentRef?.current &&
      eventTarget instanceof Node &&
      !contentRef.current.contains(eventTarget)
    ) {
      onDismiss?.();
    }
  }

  return <div onMouseDown={handleMouseDown} {...props} />;
}
