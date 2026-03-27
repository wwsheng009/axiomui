import {
  Fragment,
  cloneElement,
  type CSSProperties,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { useTheme } from "../../providers/theme-provider";
import { Icon } from "../icon/icon";

interface CollapsedAwareProps {
  collapsed?: boolean;
}

export interface SideNavigationProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  navigation?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  expandedWidth?: string;
  collapsedWidth?: string;
  toggleLabelCollapse?: string;
  toggleLabelExpand?: string;
}

function injectCollapsed(content: ReactNode, collapsed: boolean) {
  if (!isValidElement(content)) {
    return content;
  }

  if (typeof content.type === "string" || content.type === Fragment) {
    return content;
  }

  return cloneElement(
    content as ReactElement<CollapsedAwareProps>,
    { collapsed },
  );
}

export function SideNavigation({
  children,
  className,
  collapsed: collapsedProp,
  collapsedWidth = "4.5rem",
  collapsible = true,
  defaultCollapsed = false,
  expandedWidth = "18.5rem",
  footer,
  header,
  navigation,
  onCollapsedChange,
  style,
  toggleLabelCollapse = "Collapse navigation",
  toggleLabelExpand = "Expand navigation",
  ...props
}: SideNavigationProps) {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const { direction } = useTheme();
  const collapsed = collapsedProp ?? collapsedState;
  const resolvedNavigation = injectCollapsed(navigation ?? children, collapsed);
  const resolvedContent =
    navigation !== undefined ? injectCollapsed(children, collapsed) : null;
  const resolvedHeader = injectCollapsed(header, collapsed);
  const resolvedFooter = injectCollapsed(footer, collapsed);
  const toggleLabel = collapsed ? toggleLabelExpand : toggleLabelCollapse;
  const toggleIconName = collapsed
    ? direction === "rtl"
      ? "chevron-left"
      : "chevron-right"
    : direction === "rtl"
      ? "chevron-right"
      : "chevron-left";
  const resolvedStyle = {
    ...style,
    "--ax-side-navigation-collapsed-width": collapsedWidth,
    "--ax-side-navigation-expanded-width": expandedWidth,
  } as CSSProperties;

  function setCollapsed(nextCollapsed: boolean) {
    if (collapsedProp === undefined) {
      setCollapsedState(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  }

  return (
    <aside
      className={cx("ax-side-navigation", className)}
      data-collapsed={collapsed ? "true" : "false"}
      style={resolvedStyle}
      {...props}
    >
      {resolvedHeader !== undefined && resolvedHeader !== null ? (
        <div className="ax-side-navigation__header">{resolvedHeader}</div>
      ) : null}

      {collapsible ? (
        <div className="ax-side-navigation__controls">
          <button
            className="ax-side-navigation__toggle"
            type="button"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span className="ax-side-navigation__toggle-icon" aria-hidden="true">
              <Icon name={toggleIconName} />
            </span>
            <span className="ax-side-navigation__toggle-label">{toggleLabel}</span>
          </button>
        </div>
      ) : null}

      {resolvedNavigation !== undefined && resolvedNavigation !== null ? (
        <nav className="ax-side-navigation__navigation" aria-label="Primary navigation">
          {resolvedNavigation}
        </nav>
      ) : null}

      {resolvedContent !== undefined && resolvedContent !== null ? (
        <div className="ax-side-navigation__content">{resolvedContent}</div>
      ) : null}

      {resolvedFooter !== undefined && resolvedFooter !== null ? (
        <div className="ax-side-navigation__footer">{resolvedFooter}</div>
      ) : null}
    </aside>
  );
}
