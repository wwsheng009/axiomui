import { useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface GroupManagerItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface GroupManagerProps extends HTMLAttributes<HTMLDivElement> {
  items: GroupManagerItem[];
  group?: string;
  defaultGroup?: string;
  heading?: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  allowClear?: boolean;
  onGroupChange?: (value: string | undefined) => void;
}

function isValidGroup(group: string | undefined, items: GroupManagerItem[]) {
  return Boolean(group && items.some((item) => item.id === group));
}

export function GroupManager({
  actions,
  allowClear = true,
  className,
  defaultGroup,
  description,
  group,
  heading = "Grouping",
  items,
  onGroupChange,
  summary,
  ...props
}: GroupManagerProps) {
  const [internalGroup, setInternalGroup] = useState(defaultGroup);
  const activeGroup = isValidGroup(group ?? internalGroup, items)
    ? group ?? internalGroup
    : undefined;
  const activeItem = activeGroup
    ? items.find((item) => item.id === activeGroup)
    : undefined;
  const resolvedSummary =
    summary ??
    (activeItem
      ? `Grouping by ${String(activeItem.label)} across the current result set.`
      : "No grouping is active. Results stay in a single flat list.");

  function updateGroup(nextGroup: string | undefined) {
    if (group === undefined) {
      setInternalGroup(nextGroup);
    }

    onGroupChange?.(nextGroup);
  }

  return (
    <section className={cx("ax-group-manager", className)} {...props}>
      <header className="ax-group-manager__header">
        <div className="ax-group-manager__titles">
          <h3 className="ax-group-manager__heading">{heading}</h3>
          {description ? (
            <p className="ax-group-manager__description">{description}</p>
          ) : null}
        </div>

        <div className="ax-group-manager__meta">
          <span className="ax-group-manager__summary">{resolvedSummary}</span>
          {actions ? <div className="ax-group-manager__actions">{actions}</div> : null}
        </div>
      </header>

      <div className="ax-group-manager__options" role="radiogroup" aria-label="Group field">
        {items.map((item) => {
          const selected = activeGroup === item.id;

          return (
            <button
              key={item.id}
              className="ax-group-manager__option"
              data-selected={selected}
              disabled={item.disabled}
              role="radio"
              type="button"
              aria-checked={selected}
              onClick={() => updateGroup(item.id)}
            >
              <span className="ax-group-manager__option-main">
                <span className="ax-group-manager__option-label">{item.label}</span>
                {item.description ? (
                  <span className="ax-group-manager__option-description">
                    {item.description}
                  </span>
                ) : null}
              </span>
              {selected ? (
                <span className="ax-group-manager__option-state">Active</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {allowClear ? (
        <footer className="ax-group-manager__footer">
          <button
            className="ax-group-manager__clear"
            disabled={!activeGroup}
            type="button"
            onClick={() => updateGroup(undefined)}
          >
            Clear grouping
          </button>
        </footer>
      ) : null}
    </section>
  );
}
