import {
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "../../lib/cx";

export type FlexibleColumnLayoutColumnKey = "begin" | "mid" | "end";
export type FlexibleColumnLayoutMode =
  | "one-column"
  | "two-columns-begin-expanded"
  | "two-columns-mid-expanded"
  | "three-columns-mid-expanded"
  | "three-columns-end-expanded"
  | "three-columns-even";

export interface FlexibleColumnLayoutColumn {
  title?: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  content: ReactNode;
}

export interface FlexibleColumnLayoutProps
  extends HTMLAttributes<HTMLDivElement> {
  beginColumn: FlexibleColumnLayoutColumn;
  midColumn?: FlexibleColumnLayoutColumn;
  endColumn?: FlexibleColumnLayoutColumn;
  layout?: FlexibleColumnLayoutMode;
  mobileColumn?: FlexibleColumnLayoutColumnKey;
  mobileBreakpoint?: number;
  columnContentScrollable?: boolean;
}

function getIsMobile(mobileBreakpoint: number) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth <= mobileBreakpoint;
}

function resolveLayout(
  layout: FlexibleColumnLayoutMode | undefined,
  hasMid: boolean,
  hasEnd: boolean,
) {
  if (layout === undefined) {
    if (hasMid && hasEnd) {
      return "three-columns-mid-expanded" as const;
    }

    if (hasMid) {
      return "two-columns-begin-expanded" as const;
    }

    return "one-column" as const;
  }

  if (!hasMid) {
    return "one-column";
  }

  if (!hasEnd && layout.startsWith("three-columns")) {
    return "two-columns-mid-expanded";
  }

  return layout;
}

function getDesktopVisibility(
  layout: FlexibleColumnLayoutMode,
  hasMid: boolean,
  hasEnd: boolean,
) {
  if (layout === "one-column") {
    return { begin: true, mid: false, end: false };
  }

  if (
    layout === "two-columns-begin-expanded" ||
    layout === "two-columns-mid-expanded"
  ) {
    return { begin: true, mid: hasMid, end: false };
  }

  return { begin: true, mid: hasMid, end: hasEnd };
}

function inferMobileColumn(
  layout: FlexibleColumnLayoutMode,
  mobileColumn: FlexibleColumnLayoutColumnKey | undefined,
  hasMid: boolean,
  hasEnd: boolean,
) {
  if (mobileColumn === "end" && hasEnd) {
    return "end";
  }

  if (mobileColumn === "mid" && hasMid) {
    return "mid";
  }

  if (mobileColumn === "begin") {
    return "begin";
  }

  if (layout === "three-columns-end-expanded" && hasEnd) {
    return "end";
  }

  if (layout !== "one-column" && hasMid) {
    return "mid";
  }

  return "begin";
}

function renderColumn(
  key: FlexibleColumnLayoutColumnKey,
  column: FlexibleColumnLayoutColumn | undefined,
  visible: boolean,
  columnContentScrollable: boolean,
) {
  if (!column) {
    return null;
  }

  return (
    <section
      className="ax-flexible-column-layout__column-wrap"
      data-column={key}
      data-visible={visible ? "true" : "false"}
      hidden={!visible}
    >
      <article className="ax-flexible-column-layout__column">
        {column.title || column.description || column.toolbar ? (
          <header className="ax-flexible-column-layout__column-header">
            <div className="ax-flexible-column-layout__column-headline">
              {column.title ? (
                <h3 className="ax-flexible-column-layout__column-title">
                  {column.title}
                </h3>
              ) : null}
              {column.description ? (
                <p className="ax-flexible-column-layout__column-description">
                  {column.description}
                </p>
              ) : null}
            </div>
            {column.toolbar ? (
              <div className="ax-flexible-column-layout__column-toolbar">
                {column.toolbar}
              </div>
            ) : null}
          </header>
        ) : null}

        <div
          className="ax-flexible-column-layout__column-body"
          data-scrollable={columnContentScrollable ? "true" : "false"}
        >
          {column.content}
        </div>
      </article>
    </section>
  );
}

export function FlexibleColumnLayout({
  beginColumn,
  className,
  columnContentScrollable = true,
  endColumn,
  layout,
  mobileBreakpoint = 960,
  mobileColumn,
  midColumn,
  ...props
}: FlexibleColumnLayoutProps) {
  const hasMid = Boolean(midColumn);
  const hasEnd = Boolean(endColumn);
  const resolvedLayout = resolveLayout(layout, hasMid, hasEnd);
  const [mobile, setMobile] = useState(() => getIsMobile(mobileBreakpoint));

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

  const desktopVisibility = getDesktopVisibility(resolvedLayout, hasMid, hasEnd);
  const resolvedMobileColumn = inferMobileColumn(
    resolvedLayout,
    mobileColumn,
    hasMid,
    hasEnd,
  );
  const visibility = mobile
    ? {
        begin: resolvedMobileColumn === "begin",
        mid: resolvedMobileColumn === "mid",
        end: resolvedMobileColumn === "end",
      }
    : desktopVisibility;

  return (
    <div
      className={cx("ax-flexible-column-layout", className)}
      data-layout={resolvedLayout}
      data-mobile={mobile ? "true" : "false"}
      data-mobile-column={mobile ? resolvedMobileColumn : undefined}
      {...props}
    >
      {renderColumn("begin", beginColumn, visibility.begin, columnContentScrollable)}
      {renderColumn("mid", midColumn, visibility.mid, columnContentScrollable)}
      {renderColumn("end", endColumn, visibility.end, columnContentScrollable)}
    </div>
  );
}
