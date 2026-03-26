import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { useTheme } from "../../providers/theme-provider";

export interface PortalHostProps {
  children?: ReactNode;
  container?: Element | DocumentFragment | null;
}

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function applyThemeAttributes(
  container: HTMLElement,
  {
    density,
    direction,
    theme,
  }: {
    density: string;
    direction: string;
    theme: string;
  },
) {
  container.dataset.axiomDensity = density;
  container.dataset.axiomTheme = theme;
  container.dir = direction;
}

export function PortalHost({ children, container }: PortalHostProps) {
  const { density, direction, theme } = useTheme();
  const [managedContainer] = useState<HTMLElement | null>(() => {
    if (container || typeof document === "undefined") {
      return null;
    }

    const element = document.createElement("div");
    element.className = "ax-theme-provider ax-portal-host";
    applyThemeAttributes(element, { density, direction, theme });
    return element;
  });

  useIsomorphicLayoutEffect(() => {
    if (!managedContainer) {
      return undefined;
    }

    document.body.appendChild(managedContainer);

    return () => {
      managedContainer.remove();
    };
  }, [managedContainer]);

  useIsomorphicLayoutEffect(() => {
    if (!managedContainer) {
      return;
    }

    applyThemeAttributes(managedContainer, { density, direction, theme });
  }, [density, direction, managedContainer, theme]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? managedContainer ?? document.body);
}
