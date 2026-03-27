import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { useTheme } from "../../providers/theme-provider";
import { Icon } from "../icon/icon";

export interface NavigationListItem {
  key: string;
  label: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  iconName?: string;
  disabled?: boolean;
  items?: NavigationListItem[];
}

export interface NavigationListGroup {
  key: string;
  label?: ReactNode;
  items: NavigationListItem[];
}

export interface NavigationListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items?: NavigationListItem[];
  groups?: NavigationListGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, item: NavigationListItem) => void;
  expandedKeys?: string[];
  defaultExpandedKeys?: string[];
  onExpandedKeysChange?: (expandedKeys: string[]) => void;
  collapsed?: boolean;
}

interface ItemMetaEntry {
  item: NavigationListItem;
  parentKey?: string;
  ancestorKeys: string[];
  depth: number;
  groupKey: string;
}

function uniq(values: string[]) {
  return Array.from(new Set(values));
}

function normalizeGroups(
  items: NavigationListItem[] | undefined,
  groups: NavigationListGroup[] | undefined,
) {
  if (groups?.length) {
    return groups;
  }

  if (items?.length) {
    return [{ key: "__root__", items }];
  }

  return [];
}

function findFirstItemKey(groups: NavigationListGroup[]) {
  for (const group of groups) {
    const firstItem = group.items[0];

    if (firstItem) {
      return firstItem.key;
    }
  }

  return "";
}

function buildItemMetaMap(groups: NavigationListGroup[]) {
  const itemMetaByKey = new Map<string, ItemMetaEntry>();

  function visitItems(
    items: NavigationListItem[],
    groupKey: string,
    depth: number,
    ancestorKeys: string[],
    parentKey?: string,
  ) {
    for (const item of items) {
      itemMetaByKey.set(item.key, {
        item,
        parentKey,
        ancestorKeys,
        depth,
        groupKey,
      });

      if (item.items?.length) {
        visitItems(
          item.items,
          groupKey,
          depth + 1,
          [...ancestorKeys, item.key],
          item.key,
        );
      }
    }
  }

  for (const group of groups) {
    visitItems(group.items, group.key, 1, []);
  }

  return itemMetaByKey;
}

function collectExpandedDescendantKeys(item: NavigationListItem | undefined) {
  const descendants: string[] = [];

  function visit(currentItem: NavigationListItem) {
    currentItem.items?.forEach((child) => {
      descendants.push(child.key);
      visit(child);
    });
  }

  if (item) {
    visit(item);
  }

  return descendants;
}

function buildVisibleItemKeys(
  groups: NavigationListGroup[],
  expandedKeySet: Set<string>,
  collapsed: boolean,
) {
  const visibleKeys: string[] = [];

  function visitItems(items: NavigationListItem[]) {
    for (const item of items) {
      visibleKeys.push(item.key);

      if (!collapsed && item.items?.length && expandedKeySet.has(item.key)) {
        visitItems(item.items);
      }
    }
  }

  for (const group of groups) {
    visitItems(group.items);
  }

  return visibleKeys;
}

export function NavigationList({
  className,
  collapsed = false,
  defaultExpandedKeys = [],
  defaultValue,
  expandedKeys: expandedKeysProp,
  groups,
  items,
  onExpandedKeysChange,
  onValueChange,
  value,
  ...props
}: NavigationListProps) {
  const normalizedGroups = normalizeGroups(items, groups);
  const itemMetaByKey = buildItemMetaMap(normalizedGroups);
  const firstItemKey = findFirstItemKey(normalizedGroups);
  const initialValue = value ?? defaultValue ?? firstItemKey;
  const { direction } = useTheme();
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const [internalValue, setInternalValue] = useState(initialValue);
  const [internalExpandedKeys, setInternalExpandedKeys] = useState(() =>
    uniq([
      ...defaultExpandedKeys,
      ...(itemMetaByKey.get(initialValue)?.ancestorKeys ?? []),
    ]),
  );
  const [focusKey, setFocusKey] = useState(initialValue);
  const activeValue = value ?? internalValue;
  const activeAncestorKeys = itemMetaByKey.get(activeValue)?.ancestorKeys ?? [];
  const activeAncestorKeySet = new Set(activeAncestorKeys);
  const expandedKeySet = new Set(
    uniq([
      ...(expandedKeysProp ?? internalExpandedKeys),
      ...activeAncestorKeys,
    ]),
  );
  const visibleItemKeys = buildVisibleItemKeys(
    normalizedGroups,
    expandedKeySet,
    collapsed,
  );
  const preferredFocusKey =
    visibleItemKeys.find((key) => key === focusKey) ??
    visibleItemKeys.find((key) => key === activeValue || activeAncestorKeySet.has(key)) ??
    visibleItemKeys[0] ??
    "";
  const openKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
  const closeKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

  function setExpandedKeys(nextExpandedKeys: string[]) {
    if (expandedKeysProp === undefined) {
      setInternalExpandedKeys(nextExpandedKeys);
    }

    onExpandedKeysChange?.(nextExpandedKeys);
  }

  function updateItemExpandedState(itemKey: string, expanded: boolean) {
    const currentExpandedKeys = expandedKeysProp ?? internalExpandedKeys;
    const currentExpandedKeySet = new Set(currentExpandedKeys);

    if (expanded) {
      currentExpandedKeySet.add(itemKey);
      setExpandedKeys(Array.from(currentExpandedKeySet));
      return;
    }

    currentExpandedKeySet.delete(itemKey);

    for (const descendantKey of collectExpandedDescendantKeys(
      itemMetaByKey.get(itemKey)?.item,
    )) {
      currentExpandedKeySet.delete(descendantKey);
    }

    setExpandedKeys(Array.from(currentExpandedKeySet));
  }

  function selectItem(item: NavigationListItem) {
    setFocusKey(item.key);

    if (value === undefined) {
      setInternalValue(item.key);
    }

    onValueChange?.(item.key, item);
  }

  function focusItem(itemKey: string) {
    setFocusKey(itemKey);
    itemRefs.current.get(itemKey)?.focus();
  }

  function moveFocus(currentKey: string, offset: -1 | 1) {
    const currentIndex = visibleItemKeys.indexOf(currentKey);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = Math.max(
      0,
      Math.min(visibleItemKeys.length - 1, currentIndex + offset),
    );
    const nextKey = visibleItemKeys[nextIndex];

    if (nextKey) {
      focusItem(nextKey);
    }
  }

  function activateItem(item: NavigationListItem) {
    if (item.disabled) {
      return;
    }

    selectItem(item);

    if (item.items?.length) {
      updateItemExpandedState(item.key, !expandedKeySet.has(item.key));
    }
  }

  function handleItemKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    item: NavigationListItem,
  ) {
    const meta = itemMetaByKey.get(item.key);

    if (!meta) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(item.key, 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(item.key, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const firstVisibleItemKey = visibleItemKeys[0];

      if (firstVisibleItemKey) {
        focusItem(firstVisibleItemKey);
      }
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastVisibleItemKey = visibleItemKeys[visibleItemKeys.length - 1];

      if (lastVisibleItemKey) {
        focusItem(lastVisibleItemKey);
      }
      return;
    }

    if (event.key === openKey) {
      if (!item.items?.length) {
        return;
      }

      event.preventDefault();

      if (!expandedKeySet.has(item.key)) {
        updateItemExpandedState(item.key, true);
        return;
      }

      if (!collapsed) {
        const firstChildKey = item.items[0]?.key;

        if (firstChildKey) {
          focusItem(firstChildKey);
        }
      }

      return;
    }

    if (event.key === closeKey) {
      if (item.items?.length && expandedKeySet.has(item.key) && !collapsed) {
        event.preventDefault();
        updateItemExpandedState(item.key, false);
        return;
      }

      if (meta.parentKey) {
        event.preventDefault();
        focusItem(meta.parentKey);
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateItem(item);
    }
  }

  function renderItems(itemsToRender: NavigationListItem[]) {
    return itemsToRender.map((item) => {
      const meta = itemMetaByKey.get(item.key);

      if (!meta) {
        return null;
      }

      const expanded = expandedKeySet.has(item.key);
      const hasChildren = Boolean(item.items?.length);
      const selected = item.key === activeValue;
      const activeBranch = !selected && activeAncestorKeySet.has(item.key);
      const resolvedIcon =
        item.icon ?? (item.iconName ? <Icon name={item.iconName} /> : null);
      const title =
        collapsed && typeof item.label === "string" ? item.label : undefined;
      const rowStyle = {
        "--ax-navigation-depth": String(meta.depth - 1),
      } as CSSProperties;

      return (
        <div
          key={item.key}
          className="ax-navigation-list__item"
          data-depth={meta.depth}
        >
          <button
            ref={(node) => {
              if (node) {
                itemRefs.current.set(item.key, node);
                return;
              }

              itemRefs.current.delete(item.key);
            }}
            className="ax-navigation-list__item-row"
            data-active-branch={activeBranch ? "true" : undefined}
            data-expanded={expanded ? "true" : undefined}
            data-has-children={hasChildren ? "true" : undefined}
            data-selected={selected ? "true" : undefined}
            tabIndex={item.key === preferredFocusKey ? 0 : -1}
            title={title}
            type="button"
            style={rowStyle}
            aria-current={selected ? "page" : undefined}
            aria-expanded={hasChildren ? expanded : undefined}
            aria-label={title}
            aria-level={meta.depth}
            aria-selected={selected}
            disabled={item.disabled}
            onClick={() => activateItem(item)}
            onFocus={() => setFocusKey(item.key)}
            onKeyDown={(event) => handleItemKeyDown(event, item)}
          >
            <span className="ax-navigation-list__item-main">
              <span
                className="ax-navigation-list__item-icon"
                data-empty={resolvedIcon ? undefined : "true"}
                aria-hidden="true"
              >
                {resolvedIcon}
              </span>

              <span className="ax-navigation-list__item-copy">
                <span className="ax-navigation-list__item-label-row">
                  <span className="ax-navigation-list__item-label">{item.label}</span>
                  {item.badge !== undefined ? (
                    <span className="ax-navigation-list__item-badge">
                      {item.badge}
                    </span>
                  ) : null}
                </span>

                {item.description !== undefined || item.meta !== undefined ? (
                  <span className="ax-navigation-list__item-support">
                    {item.description !== undefined ? (
                      <span className="ax-navigation-list__item-description">
                        {item.description}
                      </span>
                    ) : null}
                    {item.meta !== undefined ? (
                      <span className="ax-navigation-list__item-meta">
                        {item.meta}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </span>
            </span>

            {hasChildren ? (
              <span className="ax-navigation-list__item-expander" aria-hidden="true">
                <Icon name={expanded ? "chevron-down" : "chevron-right"} />
              </span>
            ) : null}
          </button>

          {!collapsed && hasChildren && expanded ? (
            <div className="ax-navigation-list__children">
              {renderItems(item.items ?? [])}
            </div>
          ) : null}
        </div>
      );
    });
  }

  return (
    <div
      className={cx("ax-navigation-list", className)}
      data-collapsed={collapsed ? "true" : "false"}
      role="tree"
      {...props}
    >
      {normalizedGroups.map((group) => (
        <section key={group.key} className="ax-navigation-list__group">
          {group.label !== undefined ? (
            <div className="ax-navigation-list__group-label">{group.label}</div>
          ) : null}
          <div className="ax-navigation-list__group-items">
            {renderItems(group.items)}
          </div>
        </section>
      ))}
    </div>
  );
}
