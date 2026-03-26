import { getFocusableElements } from "./focusable";

function getActiveElement() {
  if (typeof document === "undefined") {
    return null;
  }

  const activeElement = document.activeElement;

  if (
    !(activeElement instanceof HTMLElement) ||
    activeElement === document.body ||
    !document.contains(activeElement)
  ) {
    return null;
  }

  return activeElement;
}

export function shouldRestoreFocus(owners: Array<HTMLElement | null | undefined>) {
  const activeElement = getActiveElement();

  if (!activeElement) {
    return true;
  }

  return owners.some((owner) => owner?.contains(activeElement));
}

export function restoreElementFocus(
  target: HTMLElement | null | undefined,
  owners: Array<HTMLElement | null | undefined>,
) {
  if (!target || !shouldRestoreFocus(owners)) {
    return;
  }

  target.focus();
}

export function restoreAnchorFocus(anchor: HTMLElement | null) {
  if (!anchor) {
    return;
  }

  const anchorIsFocusable =
    !anchor.hasAttribute("disabled") &&
    anchor.getAttribute("aria-hidden") !== "true" &&
    anchor.tabIndex >= 0;
  const restoreTarget = anchorIsFocusable ? anchor : getFocusableElements(anchor)[0];

  restoreElementFocus(restoreTarget, [anchor, restoreTarget]);
}
