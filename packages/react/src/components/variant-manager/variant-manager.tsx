import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface VariantOption {
  key: string;
  label: ReactNode;
  description?: ReactNode;
  count?: ReactNode;
  modified?: boolean;
}

export interface VariantManagerProps extends HTMLAttributes<HTMLDivElement> {
  variants: VariantOption[];
  value: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  actions?: ReactNode;
}

export function VariantManager({
  actions,
  className,
  label = "Variants",
  onValueChange,
  value,
  variants,
  ...props
}: VariantManagerProps) {
  return (
    <div className={cx("ax-variant-manager", className)} {...props}>
      <div className="ax-variant-manager__header">
        <span className="ax-variant-manager__label">{label}</span>
        {actions ? <div className="ax-variant-manager__actions">{actions}</div> : null}
      </div>

      <div className="ax-variant-manager__list" role="tablist" aria-orientation="horizontal">
        {variants.map((variant) => {
          const selected = variant.key === value;

          return (
            <button
              key={variant.key}
              className="ax-variant-manager__item"
              data-selected={selected}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => onValueChange?.(variant.key)}
            >
              <span className="ax-variant-manager__item-main">
                <span className="ax-variant-manager__item-label">{variant.label}</span>
                {variant.modified ? (
                  <span className="ax-variant-manager__modified">Edited</span>
                ) : null}
              </span>
              {variant.description || variant.count !== undefined ? (
                <span className="ax-variant-manager__item-meta">
                  {variant.description ? (
                    <span className="ax-variant-manager__item-description">
                      {variant.description}
                    </span>
                  ) : null}
                  {variant.count !== undefined ? (
                    <span className="ax-variant-manager__count">{variant.count}</span>
                  ) : null}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

