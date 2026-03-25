import {
  type HTMLAttributes,
  type ReactNode,
  useId,
  useState,
} from "react";

import { cx } from "../../lib/cx";
import { Icon } from "../icon/icon";

export type TabTone = "neutral" | "positive" | "critical" | "negative";

export interface TabsItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  iconName?: string;
  disabled?: boolean;
  tone?: TabTone;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  stretch?: boolean;
}

export function Tabs({
  className,
  defaultValue,
  items,
  onValueChange,
  orientation = "horizontal",
  stretch,
  value,
  ...props
}: TabsProps) {
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(
    value ?? defaultValue ?? items[0]?.key ?? "",
  );
  const activeValue = value ?? internalValue;
  const activeItem = items.find((item) => item.key === activeValue) ?? items[0];

  function selectTab(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <div
      className={cx("ax-tabs", className)}
      data-orientation={orientation}
      data-stretch={stretch}
      {...props}
    >
      <div className="ax-tabs__list" role="tablist" aria-orientation={orientation}>
        {items.map((item) => {
          const selected = item.key === activeItem?.key;
          const tabId = `${generatedId}-${item.key}-tab`;
          const panelId = `${generatedId}-${item.key}-panel`;
          const resolvedIcon =
            item.icon ?? (item.iconName ? <Icon name={item.iconName} /> : null);

          return (
            <button
              key={item.key}
              id={tabId}
              className="ax-tabs__tab"
              data-selected={selected}
              data-tone={item.tone ?? "neutral"}
              role="tab"
              type="button"
              aria-controls={panelId}
              aria-selected={selected}
              disabled={item.disabled}
              onClick={() => selectTab(item.key)}
            >
              {resolvedIcon ? (
                <span className="ax-tabs__icon" aria-hidden="true">
                  {resolvedIcon}
                </span>
              ) : null}
              <span className="ax-tabs__label-stack">
                <span className="ax-tabs__label">{item.label}</span>
                {item.description ? (
                  <span className="ax-tabs__description">{item.description}</span>
                ) : null}
              </span>
              {item.badge !== undefined ? (
                <span className="ax-tabs__badge" data-tone={item.tone ?? "neutral"}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {activeItem ? (
        <div
          id={`${generatedId}-${activeItem.key}-panel`}
          className="ax-tabs__panel"
          role="tabpanel"
          aria-labelledby={`${generatedId}-${activeItem.key}-tab`}
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
}
