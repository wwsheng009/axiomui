import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocale } from "../../providers/locale-provider";
import { useTheme } from "../../providers/theme-provider";
import { Button } from "../button/button";
import { Icon } from "../icon/icon";
import { getMenuCopy } from "./menu-copy";
import { ResponsivePopover } from "../responsive-popover/responsive-popover";
import type { PopoverPlacement } from "../popover/popover";

export interface MenuItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  iconName?: string;
  items?: MenuItem[];
  onSelect?: () => void;
}

export interface MenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onSelect" | "title"> {
  anchorRef: RefObject<HTMLElement | null>;
  closeOnSelect?: boolean;
  closable?: boolean;
  description?: ReactNode;
  items: MenuItem[];
  matchTriggerWidth?: boolean;
  onAction?: (itemId: string, item: MenuItem) => void;
  onOpenChange?: (open: boolean) => void;
  open: boolean;
  placement?: PopoverPlacement;
  smallScreenBreakpoint?: number;
  title?: ReactNode;
}

interface MenuLevelState {
  currentItems: MenuItem[];
  parentItem?: MenuItem;
}

function getFirstEnabledIndex(items: MenuItem[]) {
  return Math.max(
    0,
    items.findIndex((item) => !item.disabled),
  );
}

function resolveMenuLevel(items: MenuItem[], path: string[]): MenuLevelState {
  let currentItems = items;
  let parentItem: MenuItem | undefined;

  for (const itemId of path) {
    const nextParentItem = currentItems.find((item) => item.id === itemId);

    if (!nextParentItem?.items?.length) {
      break;
    }

    parentItem = nextParentItem;
    currentItems = nextParentItem.items;
  }

  return { currentItems, parentItem };
}

export function Menu({
  anchorRef,
  className,
  closeOnSelect = true,
  closable = false,
  description,
  items,
  matchTriggerWidth = false,
  onAction,
  onOpenChange,
  open,
  placement = "bottom-start",
  smallScreenBreakpoint = 640,
  title,
  ...props
}: MenuProps) {
  const { locale } = useLocale();
  const { direction } = useTheme();
  const copy = useMemo(() => getMenuCopy(locale), [locale]);
  const [path, setPath] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousOpenRef = useRef(open);
  const { currentItems, parentItem } = useMemo(
    () => resolveMenuLevel(items, path),
    [items, path],
  );
  const openSubmenuKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
  const closeSubmenuKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextIndex = getFirstEnabledIndex(currentItems);
    setActiveIndex(nextIndex);

    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[nextIndex]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentItems, open]);

  useEffect(() => {
    if (previousOpenRef.current && !open) {
      setPath([]);
      setActiveIndex(getFirstEnabledIndex(items));

      window.requestAnimationFrame(() => {
        anchorRef.current?.focus();
      });
    }

    previousOpenRef.current = open;
  }, [anchorRef, items, open]);

  function updateOpen(nextOpen: boolean) {
    onOpenChange?.(nextOpen);
  }

  function closeSubmenu() {
    setPath((currentPath) => currentPath.slice(0, -1));
  }

  function moveHighlight(step: number) {
    if (!currentItems.length) {
      return;
    }

    let nextIndex = activeIndex;

    for (let attempt = 0; attempt < currentItems.length; attempt += 1) {
      nextIndex = (nextIndex + step + currentItems.length) % currentItems.length;

      if (!currentItems[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        itemRefs.current[nextIndex]?.focus();
        return;
      }
    }
  }

  function activateItem(item: MenuItem) {
    if (item.disabled) {
      return;
    }

    if (item.items?.length) {
      setPath((currentPath) => [...currentPath, item.id]);
      return;
    }

    item.onSelect?.();
    onAction?.(item.id, item);

    if (closeOnSelect) {
      updateOpen(false);
    }
  }

  function handleMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const highlightedItem = currentItems[activeIndex];

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      const nextIndex = getFirstEnabledIndex(currentItems);
      setActiveIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      const nextIndex = [...currentItems]
        .map((item, index) => ({ index, item }))
        .reverse()
        .find(({ item }) => !item.disabled)?.index;

      if (nextIndex !== undefined) {
        setActiveIndex(nextIndex);
        itemRefs.current[nextIndex]?.focus();
      }

      return;
    }

    if (event.key === openSubmenuKey) {
      if (highlightedItem?.items?.length) {
        event.preventDefault();
        activateItem(highlightedItem);
      }

      return;
    }

    if (event.key === closeSubmenuKey) {
      if (path.length > 0) {
        event.preventDefault();
        closeSubmenu();
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      if (highlightedItem) {
        event.preventDefault();
        activateItem(highlightedItem);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      if (path.length > 0) {
        closeSubmenu();
        return;
      }

      updateOpen(false);
      return;
    }

    if (event.key === "Tab") {
      updateOpen(false);
    }
  }

  return (
    <ResponsivePopover
      anchorRef={anchorRef}
      className={className}
      closable={closable}
      description={description}
      matchTriggerWidth={matchTriggerWidth}
      onOpenChange={updateOpen}
      open={open}
      placement={placement}
      smallScreenBreakpoint={smallScreenBreakpoint}
      title={title}
      {...props}
    >
      <div className="ax-menu">
        {path.length > 0 ? (
          <div className="ax-menu__pathbar">
            <Button
              className="ax-menu__back"
              iconName="chevron-left"
              variant="transparent"
              onClick={closeSubmenu}
            >
              {copy.back}
            </Button>
            <span className="ax-menu__path-label">{parentItem?.label}</span>
          </div>
        ) : null}

        <div className="ax-menu__list" role="menu" onKeyDown={handleMenuKeyDown}>
          {currentItems.map((item, index) => {
            const hasSubmenu = Boolean(item.items?.length);

            return (
              <button
                key={item.id}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="ax-menu__item"
                type="button"
                role="menuitem"
                data-active={index === activeIndex}
                data-destructive={item.destructive ? "true" : undefined}
                data-has-submenu={hasSubmenu ? "true" : undefined}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                aria-haspopup={hasSubmenu ? "menu" : undefined}
                onClick={() => activateItem(item)}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => {
                  if (!item.disabled) {
                    setActiveIndex(index);
                  }
                }}
              >
                <span className="ax-menu__item-main">
                  {item.iconName ? (
                    <span className="ax-menu__item-icon" aria-hidden="true">
                      <Icon name={item.iconName} />
                    </span>
                  ) : null}
                  <span className="ax-menu__item-copy">
                    <span className="ax-menu__item-label">{item.label}</span>
                    {item.description ? (
                      <span className="ax-menu__item-description">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </span>

                {hasSubmenu ? (
                  <span className="ax-menu__item-meta" aria-hidden="true">
                    <Icon name="chevron-right" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </ResponsivePopover>
  );
}
