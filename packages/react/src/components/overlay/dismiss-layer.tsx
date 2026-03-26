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
  insideRefs?: Array<RefObject<HTMLElement | null>>;
  isTopmost?: boolean;
  onDismiss?: () => void;
}

export function DismissLayer({
  active = true,
  contentRef,
  dismissOnEscape = true,
  dismissOnPointerDownOutside = true,
  insideRefs = [],
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
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Escape") {
        onDismiss?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, dismissOnEscape, isTopmost, onDismiss]);

  useEffect(() => {
    if (
      !active ||
      !dismissOnPointerDownOutside ||
      !isTopmost ||
      typeof document === "undefined"
    ) {
      return;
    }

    function handlePointerDown(event: MouseEvent | PointerEvent | TouchEvent) {
      const eventTarget =
        "target" in event ? event.target : null;
      const isWithinInsideRef = insideRefs.some(
        (insideRef) =>
          insideRef.current &&
          eventTarget instanceof Node &&
          insideRef.current.contains(eventTarget),
      );

      if (
        contentRef?.current &&
        eventTarget instanceof Node &&
        !contentRef.current.contains(eventTarget) &&
        !isWithinInsideRef
      ) {
        onDismiss?.();
      }
    }

    document.addEventListener("mousedown", handlePointerDown, true);
    document.addEventListener("touchstart", handlePointerDown, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, [
    active,
    contentRef,
    dismissOnPointerDownOutside,
    insideRefs,
    isTopmost,
    onDismiss,
  ]);

  function handleMouseDown(event: ReactMouseEvent<HTMLDivElement>) {
    onMouseDown?.(event);
  }

  return <div onMouseDown={handleMouseDown} {...props} />;
}
