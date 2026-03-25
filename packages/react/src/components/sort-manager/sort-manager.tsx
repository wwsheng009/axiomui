import { useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";
import type { SortDirection, TableSort } from "../../lib/table-sort";

export interface SortManagerItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface SortManagerProps extends HTMLAttributes<HTMLDivElement> {
  items: SortManagerItem[];
  sort?: TableSort;
  defaultSort?: TableSort;
  heading?: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  allowClear?: boolean;
  onSortChange?: (value: TableSort | undefined) => void;
}

function isValidSort(
  sort: TableSort | undefined,
  items: SortManagerItem[],
): sort is TableSort {
  return Boolean(sort && items.some((item) => item.id === sort.columnId));
}

export function SortManager({
  actions,
  allowClear = true,
  className,
  defaultSort,
  description,
  heading = "Sorting",
  items,
  onSortChange,
  sort,
  summary,
  ...props
}: SortManagerProps) {
  const [internalSort, setInternalSort] = useState(defaultSort);
  const activeValue = isValidSort(sort ?? internalSort, items)
    ? sort ?? internalSort
    : undefined;
  const activeItem = activeValue
    ? items.find((item) => item.id === activeValue.columnId)
    : undefined;
  const resolvedSummary =
    summary ??
    (activeValue && activeItem
      ? `Sorting by ${String(activeItem.label)} in ${activeValue.direction} order.`
      : "No active sorting. The result list follows its base item order.");

  function updateValue(nextValue: TableSort | undefined) {
    if (sort === undefined) {
      setInternalSort(nextValue);
    }

    onSortChange?.(nextValue);
  }

  function selectItem(itemId: string) {
    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item || item.disabled) {
      return;
    }

    updateValue({
      columnId: item.id,
      direction: activeValue?.direction ?? "asc",
    });
  }

  function selectDirection(direction: SortDirection) {
    if (!activeValue) {
      return;
    }

    updateValue({
      columnId: activeValue.columnId,
      direction,
    });
  }

  return (
    <section className={cx("ax-sort-manager", className)} {...props}>
      <header className="ax-sort-manager__header">
        <div className="ax-sort-manager__titles">
          <h3 className="ax-sort-manager__heading">{heading}</h3>
          {description ? (
            <p className="ax-sort-manager__description">{description}</p>
          ) : null}
        </div>

        <div className="ax-sort-manager__meta">
          <span className="ax-sort-manager__summary">{resolvedSummary}</span>
          {actions ? <div className="ax-sort-manager__actions">{actions}</div> : null}
        </div>
      </header>

      <div className="ax-sort-manager__options" role="radiogroup" aria-label="Sort field">
        {items.map((item) => {
          const selected = activeValue?.columnId === item.id;

          return (
            <button
              key={item.id}
              className="ax-sort-manager__option"
              data-selected={selected}
              disabled={item.disabled}
              role="radio"
              type="button"
              aria-checked={selected}
              onClick={() => selectItem(item.id)}
            >
              <span className="ax-sort-manager__option-main">
                <span className="ax-sort-manager__option-label">{item.label}</span>
                {item.description ? (
                  <span className="ax-sort-manager__option-description">
                    {item.description}
                  </span>
                ) : null}
              </span>
              {selected ? (
                <span className="ax-sort-manager__option-state">
                  {activeValue?.direction === "desc" ? "Descending" : "Ascending"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <footer className="ax-sort-manager__footer">
        <div className="ax-sort-manager__direction" role="group" aria-label="Sort direction">
          <button
            className="ax-sort-manager__direction-button"
            data-selected={activeValue?.direction === "asc"}
            disabled={!activeValue}
            type="button"
            onClick={() => selectDirection("asc")}
          >
            Ascending
          </button>
          <button
            className="ax-sort-manager__direction-button"
            data-selected={activeValue?.direction === "desc"}
            disabled={!activeValue}
            type="button"
            onClick={() => selectDirection("desc")}
          >
            Descending
          </button>
        </div>

        {allowClear ? (
          <button
            className="ax-sort-manager__clear"
            disabled={!activeValue}
            type="button"
            onClick={() => updateValue(undefined)}
          >
            Clear sort
          </button>
        ) : null}
      </footer>
    </section>
  );
}
