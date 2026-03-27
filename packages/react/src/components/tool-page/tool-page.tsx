import {
  Fragment,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { cx } from "../../lib/cx";

interface CollapsedAwareProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export interface ToolPageProps extends HTMLAttributes<HTMLElement> {
  header?: ReactNode;
  sideNavigation?: ReactNode;
  sideContent?: ReactNode;
  contentClassName?: string;
  sideClassName?: string;
  stickyHeader?: boolean;
  contentScrollable?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobileBreakpoint?: number;
}

function getIsMobile(mobileBreakpoint: number) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth <= mobileBreakpoint;
}

function injectCollapsedState(content: ReactNode, collapsed: boolean) {
  if (!isValidElement(content)) {
    return content;
  }

  if (typeof content.type === "string" || content.type === Fragment) {
    return content;
  }

  return cloneElement(content as ReactElement<CollapsedAwareProps>, {
    collapsed,
  });
}

function injectCollapsedControl(
  content: ReactNode,
  collapsed: boolean,
  onCollapsedChange: (collapsed: boolean) => void,
) {
  if (!isValidElement(content)) {
    return content;
  }

  if (typeof content.type === "string" || content.type === Fragment) {
    return content;
  }

  const element = content as ReactElement<CollapsedAwareProps>;
  const existingOnCollapsedChange = element.props.onCollapsedChange;

  return cloneElement(element, {
    collapsed,
    onCollapsedChange: (nextCollapsed: boolean) => {
      onCollapsedChange(nextCollapsed);
      existingOnCollapsedChange?.(nextCollapsed);
    },
  });
}

export function ToolPage({
  children,
  className,
  collapsed: collapsedProp,
  contentClassName,
  contentScrollable = true,
  defaultCollapsed = false,
  header,
  mobileBreakpoint = 960,
  onCollapsedChange,
  sideClassName,
  sideContent,
  sideNavigation,
  stickyHeader = true,
  ...props
}: ToolPageProps) {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed);
  const [mobile, setMobile] = useState(() => getIsMobile(mobileBreakpoint));
  const collapsed = collapsedProp ?? collapsedState;
  const hasSide = Boolean(sideNavigation || sideContent);

  useEffect(() => {
    function handleResize() {
      setMobile(getIsMobile(mobileBreakpoint));
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileBreakpoint]);

  function setCollapsed(nextCollapsed: boolean) {
    if (collapsedProp === undefined) {
      setCollapsedState(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  }

  const resolvedSideNavigation = injectCollapsedControl(
    sideNavigation,
    collapsed,
    setCollapsed,
  );
  const resolvedSideContent = injectCollapsedState(sideContent, collapsed);

  return (
    <section
      className={cx("ax-tool-page", className)}
      data-collapsed={collapsed ? "true" : "false"}
      data-has-side={hasSide ? "true" : "false"}
      data-mobile={mobile ? "true" : "false"}
      {...props}
    >
      {header ? (
        <div className="ax-tool-page__header" data-sticky={stickyHeader ? "true" : "false"}>
          {header}
        </div>
      ) : null}

      <div className="ax-tool-page__body">
        {hasSide ? (
          <aside className={cx("ax-tool-page__side", sideClassName)}>
            {resolvedSideNavigation}
            {resolvedSideContent !== undefined && resolvedSideContent !== null ? (
              <div className="ax-tool-page__side-content">{resolvedSideContent}</div>
            ) : null}
          </aside>
        ) : null}

        <main
          className={cx("ax-tool-page__main", contentClassName)}
          data-scrollable={contentScrollable ? "true" : "false"}
        >
          {children}
        </main>
      </div>
    </section>
  );
}
