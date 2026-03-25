import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
  type RefObject,
  useEffect,
  useRef,
} from "react";

import { getFocusableElements } from "../../lib/overlay/focusable";

export interface FocusTrapProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    (ref as { current: T }).current = value;
  }
}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>(
  function FocusTrap(
    {
      active = true,
      initialFocusRef,
      onKeyDown,
      restoreFocus = true,
      tabIndex = -1,
      ...props
    },
    forwardedRef,
  ) {
    const internalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!active || typeof document === "undefined" || typeof window === "undefined") {
        return;
      }

      const container = internalRef.current;

      if (!container) {
        return;
      }

      const previousActiveElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      const frame = window.requestAnimationFrame(() => {
        const initialElement =
          initialFocusRef?.current ?? getFocusableElements(container)[0] ?? container;

        initialElement.focus();
      });

      return () => {
        window.cancelAnimationFrame(frame);

        if (
          restoreFocus &&
          previousActiveElement &&
          document.contains(previousActiveElement)
        ) {
          previousActiveElement.focus();
        }
      };
    }, [active, initialFocusRef, restoreFocus]);

    function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event);

      if (event.defaultPrevented || !active || event.key !== "Tab") {
        return;
      }

      const container = internalRef.current;

      if (!container) {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement =
        typeof document !== "undefined" && document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

      if (event.shiftKey) {
        if (activeElement === firstElement || activeElement === container) {
          event.preventDefault();
          lastElement.focus();
        }

        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    return (
      <div
        ref={(node) => {
          internalRef.current = node;
          assignRef(forwardedRef, node);
        }}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
