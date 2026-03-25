import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface ColumnManagerItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export interface ColumnManagerProps extends HTMLAttributes<HTMLDivElement> {
  items: ColumnManagerItem[];
  value: string[];
  heading?: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  onValueChange?: (value: string[]) => void;
}

function orderVisibleColumnIds(items: ColumnManagerItem[], value: string[]) {
  const visibleIds = new Set(value);

  return items
    .filter((item) => item.required || visibleIds.has(item.id))
    .map((item) => item.id);
}

export function ColumnManager({
  actions,
  className,
  description,
  heading = "Columns",
  items,
  onValueChange,
  summary,
  value,
  ...props
}: ColumnManagerProps) {
  const requiredIds = items.filter((item) => item.required).map((item) => item.id);
  const normalizedValue = orderVisibleColumnIds(items, [...requiredIds, ...value]);
  const selectedCount = normalizedValue.length;
  const resolvedSummary = summary ?? `${selectedCount} of ${items.length} columns visible`;

  function toggleItem(itemId: string) {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item || item.disabled || item.required) {
      return;
    }

    const nextValue = normalizedValue.includes(itemId)
      ? normalizedValue.filter((currentItemId) => currentItemId !== itemId)
      : [...normalizedValue, itemId];

    onValueChange?.(orderVisibleColumnIds(items, [...requiredIds, ...nextValue]));
  }

  return (
    <section className={cx("ax-column-manager", className)} {...props}>
      <header className="ax-column-manager__header">
        <div className="ax-column-manager__titles">
          <h3 className="ax-column-manager__heading">{heading}</h3>
          {description ? (
            <p className="ax-column-manager__description">{description}</p>
          ) : null}
        </div>

        <div className="ax-column-manager__meta">
          <span className="ax-column-manager__summary">{resolvedSummary}</span>
          {actions ? <div className="ax-column-manager__actions">{actions}</div> : null}
        </div>
      </header>

      <div className="ax-column-manager__list" role="list">
        {items.map((item) => {
          const selected = normalizedValue.includes(item.id) || item.required;
          const disabled = item.disabled || item.required;

          return (
            <label
              key={item.id}
              className="ax-column-manager__item"
              data-disabled={disabled}
              data-selected={selected}
              role="listitem"
            >
              <span className="ax-column-manager__item-main">
                <span className="ax-column-manager__item-text">
                  <span className="ax-column-manager__item-label">{item.label}</span>
                  {item.description ? (
                    <span className="ax-column-manager__item-description">
                      {item.description}
                    </span>
                  ) : null}
                </span>

                <span className="ax-column-manager__item-meta">
                  {item.meta ? (
                    <span className="ax-column-manager__item-meta-text">{item.meta}</span>
                  ) : null}
                  {item.required ? (
                    <span className="ax-column-manager__badge">Required</span>
                  ) : null}
                </span>
              </span>

              <span className="ax-column-manager__control">
                <input
                  checked={selected}
                  disabled={disabled}
                  type="checkbox"
                  onChange={() => toggleItem(item.id)}
                />
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
