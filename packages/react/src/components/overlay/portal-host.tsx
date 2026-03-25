import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalHostProps {
  children?: ReactNode;
  container?: Element | DocumentFragment | null;
}

export function PortalHost({ children, container }: PortalHostProps) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? document.body);
}
