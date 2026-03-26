import {
  useLocale,
  type DataTableColumn,
  type SavedVariant,
  type TableSort,
} from "@axiomui/react";

import {
  builtInWorklistVariantMeta,
  type MockRemoteVariantSnapshot,
  type WorkItem,
  type WorklistGroupKey,
  type WorklistVariantKey,
  type WorklistVariantPreset,
  worklistGroupItems,
  worklistSortItems,
} from "../demo-data";
import { formatWorklistScheduleLabel } from "./worklist-utils";
import { getPrioritySortValue, isBuiltInWorklistVariantKey } from "./worklist-state";

export const worklistColumns: DataTableColumn<WorkItem>[] = [
  {
    id: "object",
    header: "Object",
    sortAccessor: (row) => row.object,
    sortable: true,
    accessor: (row) => <WorklistObjectCell workItem={row} />,
  },
  {
    id: "owner",
    header: "Owner",
    accessor: "owner",
    sortable: true,
  },
  {
    id: "schedule",
    header: "Schedule",
    sortAccessor: (row) => `${row.targetDate}T${row.targetTime}`,
    sortable: true,
    accessor: (row) => <WorklistScheduleCell workItem={row} />,
  },
  {
    id: "priority",
    header: "Priority",
    sortAccessor: (row) => getPrioritySortValue(row.priority),
    sortable: true,
    accessor: (row) => (
      <span className="docs-status" data-tone={row.priority.toLowerCase()}>
        {row.priority}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessor: "status",
    sortable: true,
  },
];

export function formatWorklistVariantCount(count: number) {
  return count.toString().padStart(2, "0");
}

export function getWorklistVariantLabel(
  variantKey: WorklistVariantKey,
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  if (isBuiltInWorklistVariantKey(variantKey)) {
    return builtInWorklistVariantMeta[variantKey].label;
  }

  return savedVariants.find((variant) => variant.key === variantKey)?.label ?? variantKey;
}

export function getWorklistSortLabel(sort: TableSort | undefined) {
  if (!sort) {
    return "None";
  }

  const activeItem = worklistSortItems.find((item) => item.id === sort.columnId);

  return typeof activeItem?.label === "string" ? activeItem.label : sort.columnId;
}

export function getWorklistGroupLabel(groupBy: WorklistGroupKey | undefined) {
  if (!groupBy) {
    return "None";
  }

  const activeItem = worklistGroupItems.find((item) => item.id === groupBy);

  return typeof activeItem?.label === "string" ? activeItem.label : groupBy;
}

export function formatSavedVariantTimestamp(updatedAt: string) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Saved view";
  }

  return `Saved ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date)}`;
}

export function formatRemoteCheckTimestamp(checkedAt: string | undefined) {
  if (!checkedAt) {
    return "Not checked yet";
  }

  const date = new Date(checkedAt);

  if (Number.isNaN(date.getTime())) {
    return "Not checked yet";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

export function formatRemoteWatchLabel(intervalMs: number) {
  if (!intervalMs) {
    return "Off";
  }

  return intervalMs < 1000
    ? `${intervalMs} ms`
    : `${Math.trunc(intervalMs / 1000)}s`;
}

export function formatWorklistOwnersLabel(values: string[]) {
  if (values.length === 0) {
    return "All";
  }

  if (values.length <= 2) {
    return values.join(", ");
  }

  return `${values.slice(0, 2).join(", ")} +${values.length - 2}`;
}

function WorklistObjectCell({ workItem }: { workItem: WorkItem }) {
  const { locale } = useLocale();

  return (
    <div className="docs-table-object">
      <strong>{workItem.object}</strong>
      <span className="docs-table-subtext">
        {workItem.id} · {formatWorklistScheduleLabel(workItem, locale)}
      </span>
    </div>
  );
}

function WorklistScheduleCell({ workItem }: { workItem: WorkItem }) {
  const { locale } = useLocale();

  return (
    <span className="docs-table-subtext">
      {formatWorklistScheduleLabel(workItem, locale)}
    </span>
  );
}

export function DocsLocalePreview() {
  const { formatDate, formatNumber, formatRelativeTime, locale } = useLocale();

  return (
    <div className="docs-locale-preview">
      <span className="docs-filter-chip">Locale: {locale}</span>
      <span className="docs-filter-chip">
        Date: {formatDate("2026-03-25T09:30:00Z", { month: "short", day: "numeric" })}
      </span>
      <span className="docs-filter-chip">
        Number: {formatNumber(12750.42, { maximumFractionDigits: 1 })}
      </span>
      <span className="docs-filter-chip">Relative: {formatRelativeTime(-2, "day")}</span>
    </div>
  );
}

export function formatRemoteCheckTrigger(
  trigger: "automatic" | "initial" | "manual" | undefined,
) {
  if (!trigger) {
    return "Pending";
  }

  if (trigger === "automatic") {
    return "Automatic";
  }

  if (trigger === "initial") {
    return "Initial";
  }

  return "Manual";
}

export function formatRemoteSnapshotLabel(snapshot: MockRemoteVariantSnapshot | null) {
  if (!snapshot) {
    return "No remote snapshot";
  }

  const formattedDate = formatSavedVariantTimestamp(snapshot.updatedAt).replace(
    "Saved",
    "Remote",
  );

  return `${formattedDate} · ${snapshot.variants.length} view${snapshot.variants.length === 1 ? "" : "s"}`;
}
