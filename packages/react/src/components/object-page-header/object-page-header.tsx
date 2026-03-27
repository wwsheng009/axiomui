import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

import { cx } from "../../lib/cx";

export interface ObjectPageHeaderProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  actions?: ReactNode;
  avatar?: ReactNode;
  breadcrumbs?: ReactNode;
  disabled?: boolean;
  meta?: ReactNode;
  onTitleClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  statuses?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
  titleHref?: string;
  titleRel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  titleTarget?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}

function resolveTitleAttribute(value: ReactNode) {
  return typeof value === "string" ? value : undefined;
}

export function ObjectPageHeader({
  actions,
  avatar,
  breadcrumbs,
  className,
  disabled,
  meta,
  onTitleClick,
  statuses,
  subtitle,
  title,
  titleHref,
  titleRel,
  titleTarget,
  ...props
}: ObjectPageHeaderProps) {
  const titleAttribute = resolveTitleAttribute(title);
  const subtitleAttribute = resolveTitleAttribute(subtitle);

  function renderTitle() {
    if (disabled) {
      return (
        <span
          className="ax-object-page-header__title-link"
          data-disabled="true"
          title={titleAttribute}
        >
          {title}
        </span>
      );
    }

    if (titleHref) {
      return (
        <a
          className="ax-object-page-header__title-link"
          href={titleHref}
          rel={titleRel}
          target={titleTarget}
          title={titleAttribute}
        >
          {title}
        </a>
      );
    }

    if (onTitleClick) {
      return (
        <button
          className="ax-object-page-header__title-link"
          type="button"
          title={titleAttribute}
          onClick={onTitleClick}
        >
          {title}
        </button>
      );
    }

    return (
      <span className="ax-object-page-header__title-link" title={titleAttribute}>
        {title}
      </span>
    );
  }

  return (
    <header className={cx("ax-object-page-header", className)} {...props}>
      {breadcrumbs ? (
        <div className="ax-object-page-header__breadcrumbs">{breadcrumbs}</div>
      ) : null}

      <div className="ax-object-page-header__main">
        {avatar ? <div className="ax-object-page-header__avatar">{avatar}</div> : null}

        <div className="ax-object-page-header__content">
          <div className="ax-object-page-header__headline">
            <h1 className="ax-object-page-header__title">{renderTitle()}</h1>

            {subtitle ? (
              <p
                className="ax-object-page-header__subtitle"
                title={subtitleAttribute}
              >
                {subtitle}
              </p>
            ) : null}

            {meta ? <div className="ax-object-page-header__meta">{meta}</div> : null}
          </div>

          {statuses ? (
            <div className="ax-object-page-header__statuses">{statuses}</div>
          ) : null}
        </div>

        {actions ? <div className="ax-object-page-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
