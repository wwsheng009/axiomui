import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";

export interface ObjectIdentifierProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
  iconName?: string;
  titleHref?: string;
  titleTarget?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  titleRel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  onTitleClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
}

function resolveTitleAttribute(value: ReactNode) {
  return typeof value === "string" ? value : undefined;
}

export function ObjectIdentifier({
  className,
  disabled,
  icon,
  iconName,
  meta,
  onTitleClick,
  subtitle,
  title,
  titleHref,
  titleRel,
  titleTarget,
  ...props
}: ObjectIdentifierProps) {
  const resolvedIcon =
    icon ?? (iconName ? <Icon name={iconName} /> : null);
  const titleAttribute = resolveTitleAttribute(title);
  const subtitleAttribute = resolveTitleAttribute(subtitle);

  function renderTitle() {
    if (disabled) {
      return (
        <span
          className="ax-object-identifier__title"
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
          className="ax-object-identifier__title"
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
          className="ax-object-identifier__title"
          type="button"
          title={titleAttribute}
          onClick={onTitleClick}
        >
          {title}
        </button>
      );
    }

    return (
      <span className="ax-object-identifier__title" title={titleAttribute}>
        {title}
      </span>
    );
  }

  return (
    <div className={cx("ax-object-identifier", className)} {...props}>
      {resolvedIcon ? (
        <span className="ax-object-identifier__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      ) : null}

      <div className="ax-object-identifier__copy">
        <div className="ax-object-identifier__headline">{renderTitle()}</div>

        {subtitle ? (
          <div
            className="ax-object-identifier__subtitle"
            title={subtitleAttribute}
          >
            {subtitle}
          </div>
        ) : null}

        {meta ? <div className="ax-object-identifier__meta">{meta}</div> : null}
      </div>
    </div>
  );
}
