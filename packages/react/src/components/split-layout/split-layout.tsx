import { useMemo, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";

export type SplitPaneKey = "primary" | "secondary" | "tertiary";
export type SplitPaneWidth = "narrow" | "regular" | "wide";

export interface SplitLayoutPane {
  title?: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  content: ReactNode;
}

export interface SplitLayoutProps extends HTMLAttributes<HTMLDivElement> {
  primary: SplitLayoutPane;
  secondary: SplitLayoutPane;
  tertiary?: SplitLayoutPane;
  activePane?: SplitPaneKey;
  secondaryWidth?: SplitPaneWidth;
}

function renderPane(pane: SplitLayoutPane, key: SplitPaneKey) {
  return (
    <section className="ax-split-layout__pane" data-pane={key}>
      {pane.title || pane.description || pane.toolbar ? (
        <header className="ax-split-layout__pane-header">
          <div className="ax-split-layout__pane-headline">
            {pane.title ? (
              <h3 className="ax-split-layout__pane-title">{pane.title}</h3>
            ) : null}
            {pane.description ? (
              <p className="ax-split-layout__pane-description">{pane.description}</p>
            ) : null}
          </div>
          {pane.toolbar ? (
            <div className="ax-split-layout__pane-toolbar">{pane.toolbar}</div>
          ) : null}
        </header>
      ) : null}
      <div className="ax-split-layout__pane-body">{pane.content}</div>
    </section>
  );
}

export function SplitLayout({
  activePane,
  className,
  primary,
  secondary,
  secondaryWidth = "regular",
  tertiary,
  ...props
}: SplitLayoutProps) {
  const paneCount = tertiary ? 3 : 2;
  const visiblePanes = useMemo(
    () => ({
      primary: !activePane || activePane === "primary",
      secondary: !activePane || activePane === "secondary",
      tertiary: !activePane || activePane === "tertiary",
    }),
    [activePane],
  );

  return (
    <div
      className={cx("ax-split-layout", className)}
      data-has-active-pane={Boolean(activePane)}
      data-pane-count={paneCount}
      data-secondary-width={secondaryWidth}
      {...props}
    >
      <div
        className="ax-split-layout__pane-wrap"
        data-mobile-hidden={!visiblePanes.primary}
      >
        {renderPane(primary, "primary")}
      </div>

      <div
        className="ax-split-layout__pane-wrap"
        data-mobile-hidden={!visiblePanes.secondary}
      >
        {renderPane(secondary, "secondary")}
      </div>

      {tertiary ? (
        <div
          className="ax-split-layout__pane-wrap"
          data-mobile-hidden={!visiblePanes.tertiary}
        >
          {renderPane(tertiary, "tertiary")}
        </div>
      ) : null}
    </div>
  );
}

