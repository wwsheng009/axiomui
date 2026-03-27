import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";

export interface BreadcrumbsItem {
  key: string;
  label: ReactNode;
  href?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  current?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbsItem[];
  maxVisibleItems?: number;
  separator?: ReactNode;
  overflowLabel?: string;
}

interface OverflowEntry {
  hiddenItems: BreadcrumbsItem[];
  key: "__overflow__";
  kind: "overflow";
}

interface ItemEntry {
  item: BreadcrumbsItem;
  kind: "item";
}

type BreadcrumbsEntry = OverflowEntry | ItemEntry;

function findCurrentKey(items: BreadcrumbsItem[]) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];

    if (item?.current) {
      return item.key;
    }
  }

  return items[items.length - 1]?.key;
}

function buildEntries(
  items: BreadcrumbsItem[],
  expanded: boolean,
  maxVisibleItems: number,
) {
  const effectiveMaxVisibleItems = Math.max(3, maxVisibleItems);

  if (expanded || items.length <= effectiveMaxVisibleItems) {
    return items.map(
      (item): BreadcrumbsEntry => ({
        item,
        kind: "item",
      }),
    );
  }

  const trailingItemsCount = effectiveMaxVisibleItems - 2;
  const firstItem = items[0];
  const hiddenItems = items.slice(1, items.length - trailingItemsCount);
  const trailingItems = items.slice(-trailingItemsCount);
  const entries: BreadcrumbsEntry[] = [];

  if (firstItem) {
    entries.push({
      item: firstItem,
      kind: "item",
    });
  }

  if (hiddenItems.length) {
    entries.push({
      hiddenItems,
      key: "__overflow__",
      kind: "overflow",
    });
  }

  trailingItems.forEach((item) => {
    entries.push({
      item,
      kind: "item",
    });
  });

  return entries;
}

export function Breadcrumbs({
  className,
  items,
  maxVisibleItems = 4,
  overflowLabel = "Show full path",
  separator,
  ...props
}: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const currentKey = useMemo(() => findCurrentKey(items), [items]);
  const entries = useMemo(
    () => buildEntries(items, expanded, maxVisibleItems),
    [expanded, items, maxVisibleItems],
  );
  const resolvedSeparator = separator ?? <Icon name="chevron-right" />;

  function renderItem(item: BreadcrumbsItem) {
    const current = item.key === currentKey;

    if (current || item.disabled) {
      return (
        <span
          className="ax-breadcrumbs__link"
          data-current={current ? "true" : undefined}
          data-disabled={item.disabled ? "true" : undefined}
          aria-current={current ? "page" : undefined}
        >
          {item.label}
        </span>
      );
    }

    if (item.href) {
      return (
        <a
          className="ax-breadcrumbs__link"
          href={item.href}
          rel={item.rel}
          target={item.target}
        >
          {item.label}
        </a>
      );
    }

    if (item.onClick) {
      return (
        <button
          className="ax-breadcrumbs__link"
          type="button"
          onClick={item.onClick}
        >
          {item.label}
        </button>
      );
    }

    return <span className="ax-breadcrumbs__link">{item.label}</span>;
  }

  return (
    <nav
      className={cx("ax-breadcrumbs", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="ax-breadcrumbs__list">
        {entries.map((entry, index) => {
          const key = entry.kind === "overflow" ? entry.key : entry.item.key;

          return (
            <li key={key} className="ax-breadcrumbs__item">
              {entry.kind === "overflow" ? (
                <button
                  className="ax-breadcrumbs__overflow"
                  type="button"
                  aria-label={overflowLabel}
                  onClick={() => setExpanded(true)}
                >
                  ...
                </button>
              ) : (
                renderItem(entry.item)
              )}

              {index < entries.length - 1 ? (
                <span className="ax-breadcrumbs__separator" aria-hidden="true">
                  {resolvedSeparator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
