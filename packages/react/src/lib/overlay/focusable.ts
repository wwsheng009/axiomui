const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "[contenteditable]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>(focusableSelector)].filter(
    (element) => {
      if (element.hasAttribute("disabled")) {
        return false;
      }

      if (element.getAttribute("aria-hidden") === "true") {
        return false;
      }

      return element.tabIndex >= 0;
    },
  );
}
