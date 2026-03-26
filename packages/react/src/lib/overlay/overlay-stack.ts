import { useEffect, useId, useLayoutEffect, useState } from "react";

const overlayStack: string[] = [];
const listeners = new Set<() => void>();

function notifyOverlayListeners() {
  listeners.forEach((listener) => {
    listener();
  });
}

function addOverlayToStack(overlayId: string) {
  if (!overlayStack.includes(overlayId)) {
    overlayStack.push(overlayId);
    notifyOverlayListeners();
  }
}

function removeOverlayFromStack(overlayId: string) {
  const overlayIndex = overlayStack.indexOf(overlayId);

  if (overlayIndex !== -1) {
    overlayStack.splice(overlayIndex, 1);
    notifyOverlayListeners();
  }
}

function getOverlayIndex(overlayId: string) {
  return overlayStack.indexOf(overlayId);
}

export interface OverlayStackState {
  isTopmost: boolean;
  overlayId: string;
  overlayIndex: number;
  zIndex: number;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useOverlayStack(active: boolean): OverlayStackState {
  const overlayId = useId();
  const [, setVersion] = useState(0);

  useIsomorphicLayoutEffect(() => {
    function handleStackChange() {
      setVersion((version) => version + 1);
    }

    listeners.add(handleStackChange);

    return () => {
      listeners.delete(handleStackChange);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!active) {
      return;
    }

    addOverlayToStack(overlayId);

    return () => {
      removeOverlayFromStack(overlayId);
    };
  }, [active, overlayId]);

  const overlayIndex = getOverlayIndex(overlayId);

  return {
    isTopmost: overlayIndex !== -1 && overlayIndex === overlayStack.length - 1,
    overlayId,
    overlayIndex,
    zIndex: 60 + Math.max(overlayIndex, 0) * 2,
  };
}
