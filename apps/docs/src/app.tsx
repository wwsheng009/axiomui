import { useEffect, useRef, useState } from "react";

import {
  AppShell,
  LocaleProvider,
  ThemeProvider,
  Button,
  Card,
  ComboBox,
  ColumnManager,
  DataTable,
  DatePicker,
  DynamicPage,
  Dialog,
  FilterBar,
  FormField,
  FormGrid,
  GroupManager,
  Input,
  MessagePage,
  MessageStrip,
  MultiComboBox,
  MultiInput,
  NotificationList,
  ObjectPageNav,
  ObjectPageSection,
  PageSection,
  Pagination,
  Popover,
  Select,
  SplitLayout,
  SortManager,
  ToolHeader,
  Toolbar,
  Tabs,
  VariantSyncActivityList,
  VariantSyncComparisonSummary,
  VariantSyncDialog,
  VariantSyncPanel,
  VariantSyncSnapshotList,
  VariantManager,
  createMemoryVariantPersistenceAdapter,
  createLocalStorageVariantPersistenceAdapter,
  createSessionStorageVariantPersistenceAdapter,
  createVariantSyncSnapshot,
  getVariantSyncEntryFreshness,
  useLocale,
  useSavedVariants,
  useVariantSync,
  useWorklistState,
  withLatencyVariantPersistenceAdapter,
  type AxiomDensity,
  type AxiomDirection,
  type AxiomThemeName,
  type ColumnManagerItem,
  type DataTableColumn,
  type GroupManagerItem,
  type SavedVariant,
  type SortManagerItem,
  type TableSort,
  type VariantSyncSnapshot,
  type VariantSyncReviewSection,
  type VariantSyncReviewWorkspaceCard,
} from "@axiomui/react";

interface WorkItem {
  id: string;
  object: string;
  owner: string;
  priority: "Positive" | "Information" | "Attention" | "Negative";
  status: string;
  targetDate: string;
  wave: string;
  region: string;
}

interface InboxItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone: "information" | "success" | "warning" | "error";
  unread?: boolean;
}

type BuiltInWorklistVariantKey = "standard" | "compact-review" | "attention-queue";
type WorklistVariantKey = string;
type WorklistGroupKey = "owner" | "priority" | "status" | "wave" | "region";
type RemoteAdapterMode = "local-storage" | "session-storage" | "memory";
type LocaleCode = "en-US" | "zh-CN";

const themeOptions: Array<{ label: string; value: AxiomThemeName }> = [
  { label: "Horizon", value: "horizon" },
  { label: "Horizon Dark", value: "horizon_dark" },
  { label: "Horizon HCB", value: "horizon_hcb" },
  { label: "Horizon HCW", value: "horizon_hcw" },
  { label: "Fiori 3", value: "fiori_3" },
  { label: "Fiori 3 Dark", value: "fiori_3_dark" },
];

const themeLabelByValue: Record<AxiomThemeName, string> = {
  horizon: "Horizon",
  horizon_dark: "Horizon Dark",
  horizon_hcb: "Horizon HCB",
  horizon_hcw: "Horizon HCW",
  fiori_3: "Fiori 3",
  fiori_3_dark: "Fiori 3 Dark",
};

const localeOptions: Array<{ label: string; value: LocaleCode }> = [
  { label: "English", value: "en-US" },
  { label: "简体中文", value: "zh-CN" },
];

const localeLabelByValue: Record<LocaleCode, string> = {
  "en-US": "English",
  "zh-CN": "简体中文",
};

interface WorklistFilters {
  search: string;
  keywords: string[];
  owners: string[];
  targetDate: string;
  priority: string;
  status: string;
  wave: string;
  region: string;
  visibleColumnIds: string[];
}

interface WorklistVariantPreset {
  filters: WorklistFilters;
  sort: TableSort | undefined;
  pageSize?: number;
  groupBy?: WorklistGroupKey;
}

interface VariantFormState {
  key?: string;
  label: string;
  description: string;
}

interface VariantTransferState {
  mode: "export" | "import";
  value: string;
  error?: string;
}

type MockRemoteVariantSnapshot = VariantSyncSnapshot<
  WorklistVariantPreset,
  WorklistVariantKey
>;

const workItems: WorkItem[] = [
  {
    id: "AX-1024",
    object: "Dynamic Page shell migration",
    owner: "Mia Chen",
    priority: "Information",
    status: "Ready for review",
    targetDate: "2026-04-08",
    wave: "Q2 2026",
    region: "Global workspace",
  },
  {
    id: "AX-1031",
    object: "Toolbar overflow alignment",
    owner: "Noah Patel",
    priority: "Attention",
    status: "Needs interaction pass",
    targetDate: "2026-04-18",
    wave: "Q2 2026",
    region: "Global workspace",
  },
  {
    id: "AX-1045",
    object: "Compact density field states",
    owner: "Avery Kim",
    priority: "Positive",
    status: "Stable",
    targetDate: "2026-07-12",
    wave: "Q3 2026",
    region: "APJ rollout",
  },
  {
    id: "AX-1050",
    object: "Table selection regressions",
    owner: "Lena Wu",
    priority: "Negative",
    status: "Fix in progress",
    targetDate: "2026-05-03",
    wave: "Q2 2026",
    region: "EU rollout",
  },
  {
    id: "AX-1057",
    object: "Object section anchor cleanup",
    owner: "Mia Chen",
    priority: "Information",
    status: "Stable",
    targetDate: "2026-07-28",
    wave: "Q3 2026",
    region: "Global workspace",
  },
  {
    id: "AX-1062",
    object: "Attention queue validation",
    owner: "Noah Patel",
    priority: "Attention",
    status: "Ready for review",
    targetDate: "2026-06-11",
    wave: "Q2 2026",
    region: "NA rollout",
  },
];

const inboxItems: InboxItem[] = [
  {
    id: "N-100",
    title: "Shell header review available",
    description: "The second-level workspace header now aligns with the page action rhythm.",
    meta: "5 min ago",
    tone: "information",
    unread: true,
  },
  {
    id: "N-101",
    title: "Density regression resolved",
    description: "Compact object sections and toolbar heights are back in sync.",
    meta: "22 min ago",
    tone: "success",
  },
  {
    id: "N-102",
    title: "Section navigation needs copy pass",
    description: "Anchor labels are structurally correct but still need content review.",
    meta: "1 hour ago",
    tone: "warning",
    unread: true,
  },
];

const releaseChannelSelectItems = [
  {
    value: "core",
    label: "Core package",
    description: "Default component stream for shared foundations.",
  },
  {
    value: "labs",
    label: "Labs package",
    description: "Exploratory work before public promotion.",
  },
  {
    value: "partner",
    label: "Partner extension",
    description: "Downstream integration and extension surfaces.",
  },
];

const releaseStatusSelectItems = [
  {
    value: "planned",
    label: "Planned",
    description: "Scope is aligned but implementation has not started yet.",
  },
  {
    value: "active",
    label: "Active",
    description: "The field package is in active delivery and review.",
  },
  {
    value: "ready",
    label: "Ready",
    description: "The flow is stable enough for rollout and validation.",
  },
];

const priorityFilterSelectItems = [
  {
    value: "",
    label: "All priorities",
    description: "Do not constrain the worklist by semantic severity.",
  },
  {
    value: "Positive",
    label: "Positive",
    description: "Stable or healthy work items.",
  },
  {
    value: "Information",
    label: "Information",
    description: "Informational rows and neutral work items.",
  },
  {
    value: "Attention",
    label: "Attention",
    description: "Critical review and triage queue.",
  },
  {
    value: "Negative",
    label: "Negative",
    description: "Regressions, failures or blocked work.",
  },
];

const ownerComboBoxItems = [
  {
    value: "Mia Chen",
    label: "Mia Chen",
    description: "Foundation and object page stream.",
  },
  {
    value: "Noah Patel",
    label: "Noah Patel",
    description: "Worklist triage and shell rhythm.",
  },
  {
    value: "Avery Kim",
    label: "Avery Kim",
    description: "Density and form state alignment.",
  },
  {
    value: "Lena Wu",
    label: "Lena Wu",
    description: "Regression and selection workflow stabilization.",
  },
];

const builtInWorklistVariantKeys: BuiltInWorklistVariantKey[] = [
  "standard",
  "compact-review",
  "attention-queue",
];

const builtInWorklistVariantMeta: Record<
  BuiltInWorklistVariantKey,
  {
    label: string;
    description: string;
  }
> = {
  standard: {
    label: "Standard",
    description: "Balanced worklist",
  },
  "compact-review": {
    label: "Compact review",
    description: "Dense triage",
  },
  "attention-queue": {
    label: "Attention queue",
    description: "Critical focus",
  },
};

const variantPresets: Record<BuiltInWorklistVariantKey, WorklistVariantPreset> = {
  standard: {
    filters: {
      search: "",
      keywords: [],
      owners: [],
      targetDate: "",
      priority: "",
      status: "",
      wave: "Q2 2026",
      region: "",
      visibleColumnIds: ["object", "owner", "priority", "status"],
    },
    sort: { columnId: "object", direction: "asc" },
    pageSize: 3,
  },
  "compact-review": {
    filters: {
      search: "",
      keywords: [],
      owners: ["Avery Kim"],
      targetDate: "",
      priority: "Positive",
      status: "Stable",
      wave: "",
      region: "",
      visibleColumnIds: ["object", "priority", "status"],
    },
    sort: { columnId: "status", direction: "asc" },
    pageSize: 2,
    groupBy: "status",
  },
  "attention-queue": {
    filters: {
      search: "",
      keywords: [],
      owners: [],
      targetDate: "",
      priority: "Attention",
      status: "",
      wave: "Q2 2026",
      region: "",
      visibleColumnIds: ["object", "owner", "priority"],
    },
    sort: { columnId: "priority", direction: "desc" },
    pageSize: 2,
    groupBy: "priority",
  },
};

const worklistPageSizeOptions = [2, 3, 5];
const worklistPersistenceStorageKey = "axiomui-docs-worklist-state";
const worklistPersistenceVersion = 1;
const worklistGroupStorageKey = "axiomui-docs-worklist-group";
const worklistSavedVariantsStorageKey = "axiomui-docs-worklist-saved-variants";
const worklistSavedVariantsVersion = 1;
const worklistStartupVariantStorageKey = "axiomui-docs-worklist-startup-variant";
const worklistMockRemoteVariantsStorageKey = "axiomui-docs-worklist-mock-remote-variants";
const worklistMockSessionVariantsStorageKey = "axiomui-docs-worklist-session-remote-variants";
const worklistSyncActivityStorageKeys: Record<RemoteAdapterMode, string> = {
  "local-storage": "axiomui-docs-worklist-sync-activity-local",
  "session-storage": "axiomui-docs-worklist-sync-activity-session",
  memory: "axiomui-docs-worklist-sync-activity-memory",
};
const worklistSyncActivityVersion = 1;
const remoteAutoRefreshOptions = [0, 5000, 15000];
const worklistGroupIds: WorklistGroupKey[] = [
  "owner",
  "priority",
  "status",
  "wave",
  "region",
];
const worklistColumnItems: ColumnManagerItem[] = [
  {
    id: "object",
    label: "Object",
    description: "Primary work item identity and row headline.",
    meta: "Pinned",
    required: true,
  },
  {
    id: "owner",
    label: "Owner",
    description: "Responsible stream or delivery owner.",
    meta: "Optional",
  },
  {
    id: "priority",
    label: "Priority",
    description: "Semantic triage state for worklist scanning.",
    meta: "Optional",
  },
  {
    id: "status",
    label: "Status",
    description: "Execution state shown beside the object details.",
    meta: "Optional",
  },
];
const worklistSortItems: SortManagerItem[] = [
  {
    id: "object",
    label: "Object",
    description: "Alphabetical object headline ordering.",
  },
  {
    id: "owner",
    label: "Owner",
    description: "Assigned owner or stream ordering.",
  },
  {
    id: "priority",
    label: "Priority",
    description: "Semantic triage ordering for attention queues.",
  },
  {
    id: "status",
    label: "Status",
    description: "Execution state ordering for review workflows.",
  },
];
const worklistGroupItems: GroupManagerItem[] = [
  {
    id: "owner",
    label: "Owner",
    description: "Cluster results by responsible stream.",
  },
  {
    id: "priority",
    label: "Priority",
    description: "Separate attention work from stable delivery.",
  },
  {
    id: "status",
    label: "Status",
    description: "Organize rows by execution state.",
  },
  {
    id: "wave",
    label: "Wave",
    description: "Split results by release slot.",
  },
  {
    id: "region",
    label: "Region",
    description: "Group by regional rollout context.",
  },
];
const allWorklistColumnIds = worklistColumnItems.map((item) => item.id);
function normalizeOwnerValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function cloneFilters(filters: WorklistFilters): WorklistFilters {
  return {
    ...filters,
    keywords: [...(filters.keywords ?? [])],
    owners: [...(filters.owners ?? [])],
    visibleColumnIds: [...(filters.visibleColumnIds ?? [])],
  };
}

function cloneWorklistVariantPreset(
  preset: WorklistVariantPreset,
): WorklistVariantPreset {
  return {
    filters: cloneFilters(preset.filters),
    sort: preset.sort ? { ...preset.sort } : undefined,
    pageSize: preset.pageSize,
    groupBy: preset.groupBy,
  };
}

function createWorklistVariantPreset({
  filters,
  groupBy,
  pageSize,
  sort,
}: WorklistVariantPreset): WorklistVariantPreset {
  return {
    filters: cloneFilters(filters),
    groupBy,
    pageSize,
    sort: sort ? { ...sort } : undefined,
  };
}

function isBuiltInWorklistVariantKey(
  value: string,
): value is BuiltInWorklistVariantKey {
  return Object.prototype.hasOwnProperty.call(variantPresets, value);
}

function isWorklistVariantKey(
  value: string | undefined,
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
): value is WorklistVariantKey {
  return Boolean(value && Object.prototype.hasOwnProperty.call(variants, value));
}

function buildWorklistVariantMap(
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  const savedVariantEntries = savedVariants.map((variant) => [
    variant.key,
    cloneWorklistVariantPreset(variant.preset),
  ]);

  return {
    ...variantPresets,
    ...Object.fromEntries(savedVariantEntries),
  } as Record<WorklistVariantKey, WorklistVariantPreset>;
}

function areStringArraysEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function areWorklistFiltersEqual(
  left: WorklistFilters,
  right: WorklistFilters,
) {
  return (
    left.search === right.search &&
    areStringArraysEqual(left.keywords ?? [], right.keywords ?? []) &&
    areStringArraysEqual(left.owners ?? [], right.owners ?? []) &&
    left.targetDate === right.targetDate &&
    left.priority === right.priority &&
    left.status === right.status &&
    left.wave === right.wave &&
    left.region === right.region &&
    areStringArraysEqual(left.visibleColumnIds, right.visibleColumnIds)
  );
}

function areTableSortEqual(
  left: TableSort | undefined,
  right: TableSort | undefined,
) {
  if (!left && !right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return left.columnId === right.columnId && left.direction === right.direction;
}

function areWorklistVariantPresetsEqual(
  left: WorklistVariantPreset,
  right: WorklistVariantPreset,
) {
  return (
    areWorklistFiltersEqual(left.filters, right.filters) &&
    areTableSortEqual(left.sort, right.sort) &&
    (left.pageSize ?? undefined) === (right.pageSize ?? undefined) &&
    (left.groupBy ?? undefined) === (right.groupBy ?? undefined)
  );
}

function normalizeVisibleColumnIds(visibleColumnIds: string[]) {
  const visibleColumnIdSet = new Set(visibleColumnIds);

  return worklistColumnItems
    .filter((item) => item.required || visibleColumnIdSet.has(item.id))
    .map((item) => item.id);
}

function includesFilter(value: string, query: string) {
  if (!query.trim()) {
    return true;
  }

  return value.toLowerCase().includes(query.trim().toLowerCase());
}

function matchesStringArrayFilter(value: string, queries: string[]) {
  if (!queries.length) {
    return true;
  }

  return queries.includes(value);
}

function matchesDateFilter(value: string, query: string) {
  if (!query) {
    return true;
  }

  return value === query;
}

function getPrioritySortValue(priority: WorkItem["priority"]) {
  if (priority === "Negative") {
    return 4;
  }
  if (priority === "Attention") {
    return 3;
  }
  if (priority === "Information") {
    return 2;
  }

  return 1;
}

const worklistColumns: DataTableColumn<WorkItem>[] = [
  {
    id: "object",
    header: "Object",
    sortAccessor: (row) => row.object,
    sortable: true,
    accessor: (row) => (
      <div className="docs-table-object">
        <strong>{row.object}</strong>
        <span className="docs-table-subtext">{row.id}</span>
      </div>
    ),
  },
  {
    id: "owner",
    header: "Owner",
    accessor: "owner",
    sortable: true,
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

function filterWorkItem(workItem: WorkItem, filters: WorklistFilters) {
  const searchMatch =
    includesFilter(workItem.object, filters.search) ||
    includesFilter(workItem.id, filters.search);
  const combinedSearchText = [
    workItem.object,
    workItem.id,
    workItem.owner,
    workItem.priority,
    workItem.status,
    workItem.targetDate,
    workItem.wave,
    workItem.region,
  ]
    .join(" ")
    .toLowerCase();
  const keywordsMatch = (filters.keywords ?? []).every((keyword) =>
    combinedSearchText.includes(keyword.toLowerCase()),
  );

  return (
    searchMatch &&
    keywordsMatch &&
    matchesStringArrayFilter(workItem.owner, filters.owners ?? []) &&
    matchesDateFilter(workItem.targetDate, filters.targetDate) &&
    includesFilter(workItem.priority, filters.priority) &&
    includesFilter(workItem.status, filters.status) &&
    includesFilter(workItem.wave, filters.wave) &&
    includesFilter(workItem.region, filters.region)
  );
}

function getVisibleColumnIds(filters: WorklistFilters) {
  return filters.visibleColumnIds;
}

function isSortableWorklistColumnId(value: string) {
  return worklistSortItems.some((item) => item.id === value);
}

function countWorkItemsForFilters(filters: WorklistFilters) {
  return workItems.filter((workItem) => filterWorkItem(workItem, filters)).length;
}

function formatWorklistVariantCount(count: number) {
  return count.toString().padStart(2, "0");
}

function getWorklistVariantLabel(
  variantKey: WorklistVariantKey,
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  if (isBuiltInWorklistVariantKey(variantKey)) {
    return builtInWorklistVariantMeta[variantKey].label;
  }

  return savedVariants.find((variant) => variant.key === variantKey)?.label ?? variantKey;
}

function getWorklistSortLabel(sort: TableSort | undefined) {
  if (!sort) {
    return "None";
  }

  const activeItem = worklistSortItems.find((item) => item.id === sort.columnId);

  return typeof activeItem?.label === "string" ? activeItem.label : sort.columnId;
}

function getWorklistGroupLabel(groupBy: WorklistGroupKey | undefined) {
  if (!groupBy) {
    return "None";
  }

  const activeItem = worklistGroupItems.find((item) => item.id === groupBy);

  return typeof activeItem?.label === "string" ? activeItem.label : groupBy;
}

function isWorklistGroupKey(value: string | undefined): value is WorklistGroupKey {
  return Boolean(value && worklistGroupIds.includes(value as WorklistGroupKey));
}

function formatSavedVariantTimestamp(updatedAt: string) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Saved view";
  }

  return `Saved ${new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date)}`;
}

function formatRemoteCheckTimestamp(checkedAt: string | undefined) {
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

function formatRemoteWatchLabel(intervalMs: number) {
  if (!intervalMs) {
    return "Off";
  }

  return intervalMs < 1000
    ? `${intervalMs} ms`
    : `${Math.trunc(intervalMs / 1000)}s`;
}

function formatWorklistOwnersLabel(values: string[]) {
  if (values.length === 0) {
    return "All";
  }

  if (values.length <= 2) {
    return values.join(", ");
  }

  return `${values.slice(0, 2).join(", ")} +${values.length - 2}`;
}

function formatWorklistDateLabel(value: string, locale: string) {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(Number.NaN);

  if (Number.isNaN(date.getTime())) {
    return "Any";
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function DocsLocalePreview() {
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

function formatRemoteCheckTrigger(trigger: "automatic" | "initial" | "manual" | undefined) {
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

function readStoredStartupVariant(
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
) {
  if (typeof window === "undefined") {
    return "standard" as WorklistVariantKey;
  }

  try {
    const storedVariant = window.localStorage.getItem(worklistStartupVariantStorageKey) ?? undefined;

    if (isWorklistVariantKey(storedVariant, variants)) {
      return storedVariant;
    }
  } catch {
    return "standard";
  }

  return "standard";
}

function readStoredWorklistGroupBy(
  variants: Record<WorklistVariantKey, WorklistVariantPreset>,
) {
  if (typeof window === "undefined") {
    return variantPresets.standard.groupBy;
  }

  try {
    const storedGroup = window.localStorage.getItem(worklistGroupStorageKey) ?? undefined;

    if (isWorklistGroupKey(storedGroup)) {
      return storedGroup;
    }

    const storedWorklistState = window.localStorage.getItem(worklistPersistenceStorageKey);

    if (!storedWorklistState) {
      return variantPresets.standard.groupBy;
    }

    const parsedState = JSON.parse(storedWorklistState) as {
      activeVariant?: string;
      version?: number;
    };

    if (
      parsedState.version === worklistPersistenceVersion &&
      typeof parsedState.activeVariant === "string" &&
      parsedState.activeVariant in variants
    ) {
      return variants[parsedState.activeVariant].groupBy;
    }
  } catch {
    return variantPresets.standard.groupBy;
  }

  return variantPresets.standard.groupBy;
}

function compareWorklistGroupValues(
  groupBy: WorklistGroupKey,
  left: string,
  right: string,
) {
  if (groupBy === "priority") {
    return getPrioritySortValue(left as WorkItem["priority"]) - getPrioritySortValue(right as WorkItem["priority"]);
  }

  return left.localeCompare(right, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function groupWorkItems(items: WorkItem[], groupBy: WorklistGroupKey | undefined) {
  if (!groupBy) {
    return [];
  }

  const groups = new Map<string, WorkItem[]>();

  items.forEach((item) => {
    const groupValue = item[groupBy];
    const groupItems = groups.get(groupValue);

    if (groupItems) {
      groupItems.push(item);
      return;
    }

    groups.set(groupValue, [item]);
  });

  return [...groups.entries()]
    .sort(([left], [right]) => compareWorklistGroupValues(groupBy, left, right))
    .map(([key, groupItems]) => ({
      key,
      label: key,
      rows: groupItems,
      count: `${groupItems.length} items`,
    }));
}

function parseImportedWorklistFilters(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Record<keyof WorklistFilters, unknown>> & {
    owner?: unknown;
  };
  const visibleColumnIds = Array.isArray(candidate.visibleColumnIds)
    ? normalizeVisibleColumnIds(
        candidate.visibleColumnIds.filter(
          (columnId): columnId is string => typeof columnId === "string",
        ),
      )
    : variantPresets.standard.filters.visibleColumnIds;
  const owners = Array.isArray(candidate.owners)
    ? normalizeOwnerValues(
        candidate.owners.filter(
          (owner): owner is string => typeof owner === "string",
        ),
      )
    : typeof candidate.owner === "string" && candidate.owner.trim()
      ? normalizeOwnerValues([candidate.owner])
      : [];

  return {
    search: typeof candidate.search === "string" ? candidate.search : "",
    keywords: Array.isArray(candidate.keywords)
      ? candidate.keywords.filter(
          (keyword): keyword is string =>
            typeof keyword === "string" && keyword.trim().length > 0,
        )
      : [],
    owners,
    targetDate:
      typeof candidate.targetDate === "string" ? candidate.targetDate : "",
    priority: typeof candidate.priority === "string" ? candidate.priority : "",
    status: typeof candidate.status === "string" ? candidate.status : "",
    wave: typeof candidate.wave === "string" ? candidate.wave : "",
    region: typeof candidate.region === "string" ? candidate.region : "",
    visibleColumnIds:
      visibleColumnIds.length > 0
        ? visibleColumnIds
        : variantPresets.standard.filters.visibleColumnIds,
  } satisfies WorklistFilters;
}

function parseImportedWorklistSort(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const candidate = value as {
    columnId?: unknown;
    direction?: unknown;
  };

  if (
    typeof candidate.columnId !== "string" ||
    !isSortableWorklistColumnId(candidate.columnId) ||
    (candidate.direction !== "asc" && candidate.direction !== "desc")
  ) {
    return undefined;
  }

  return {
    columnId: candidate.columnId,
    direction: candidate.direction,
  } satisfies TableSort;
}

function parseImportedWorklistVariantPreset(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    filters?: unknown;
    groupBy?: unknown;
    pageSize?: unknown;
    sort?: unknown;
  };
  const filters = parseImportedWorklistFilters(candidate.filters);

  if (!filters) {
    return null;
  }

  return {
    filters,
    groupBy:
      typeof candidate.groupBy === "string" && isWorklistGroupKey(candidate.groupBy)
        ? candidate.groupBy
        : undefined,
    pageSize:
      typeof candidate.pageSize === "number" && candidate.pageSize > 0
        ? Math.trunc(candidate.pageSize)
        : undefined,
    sort: parseImportedWorklistSort(candidate.sort),
  } satisfies WorklistVariantPreset;
}

function parseImportedSavedWorklistVariant(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    key?: unknown;
    label?: unknown;
    description?: unknown;
    preset?: unknown;
    createdAt?: unknown;
    updatedAt?: unknown;
  };
  const preset = parseImportedWorklistVariantPreset(candidate.preset);

  if (
    typeof candidate.key !== "string" ||
    !candidate.key.trim() ||
    typeof candidate.label !== "string" ||
    !candidate.label.trim() ||
    !preset
  ) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return {
    key: candidate.key.trim(),
    label: candidate.label.trim(),
    description:
      typeof candidate.description === "string" && candidate.description.trim()
        ? candidate.description.trim()
        : undefined,
    preset,
    createdAt:
      typeof candidate.createdAt === "string" ? candidate.createdAt : timestamp,
    updatedAt:
      typeof candidate.updatedAt === "string" ? candidate.updatedAt : timestamp,
  } satisfies SavedVariant<WorklistVariantPreset>;
}

const mockRemoteVariantStorageAdapter =
  createLocalStorageVariantPersistenceAdapter<WorklistVariantPreset, WorklistVariantKey>({
    fallbackStartupVariantKey: "standard",
    parseVariant: parseImportedSavedWorklistVariant,
    storageKey: worklistMockRemoteVariantsStorageKey,
    version: worklistSavedVariantsVersion,
  });

const mockRemoteSessionVariantStorageAdapter =
  createSessionStorageVariantPersistenceAdapter<WorklistVariantPreset, WorklistVariantKey>({
    fallbackStartupVariantKey: "standard",
    parseVariant: parseImportedSavedWorklistVariant,
    storageKey: worklistMockSessionVariantsStorageKey,
    version: worklistSavedVariantsVersion,
  });

const mockRemoteMemoryVariantStorageAdapter =
  createMemoryVariantPersistenceAdapter<WorklistVariantPreset, WorklistVariantKey>();

const mockRemoteVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

const mockRemoteSessionVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteSessionVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

const mockRemoteMemoryVariantAdapter = withLatencyVariantPersistenceAdapter(
  mockRemoteMemoryVariantStorageAdapter,
  {
    readDelayMs: 210,
    writeDelayMs: 210,
  },
);

const remoteAdapterLabels: Record<RemoteAdapterMode, string> = {
  "local-storage": "localStorage mock cloud",
  "session-storage": "sessionStorage mock cloud",
  memory: "in-memory mock cloud",
};

function mergeSavedWorklistVariants(
  currentVariants: Array<SavedVariant<WorklistVariantPreset>>,
  importedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  const mergedVariants = new Map(
    currentVariants.map((variant) => [variant.key, variant] as const),
  );

  importedVariants.forEach((variant) => {
    mergedVariants.set(variant.key, variant);
  });

  return [...new Set([...importedVariants.map((variant) => variant.key), ...currentVariants.map((variant) => variant.key)])]
    .map((variantKey) => mergedVariants.get(variantKey))
    .filter(
      (
        variant,
      ): variant is SavedVariant<WorklistVariantPreset> => variant !== undefined,
    );
}

function formatRemoteSnapshotLabel(snapshot: MockRemoteVariantSnapshot | null) {
  if (!snapshot) {
    return "No remote snapshot";
  }

  const formattedDate = formatSavedVariantTimestamp(snapshot.updatedAt).replace(
    "Saved",
    "Remote",
  );

  return `${formattedDate} · ${snapshot.variants.length} view${snapshot.variants.length === 1 ? "" : "s"}`;
}

function createSavedVariantsExportPayload(
  startupVariantKey: WorklistVariantKey,
  savedVariants: Array<SavedVariant<WorklistVariantPreset>>,
) {
  return JSON.stringify(
    {
      version: worklistSavedVariantsVersion,
      exportedAt: new Date().toISOString(),
      startupVariantKey,
      variants: savedVariants,
    },
    null,
    2,
  );
}

function parseSavedVariantsImportPayload(rawValue: string) {
  try {
    const parsedValue = JSON.parse(rawValue) as
      | {
          startupVariantKey?: unknown;
          variants?: unknown;
        }
      | unknown[];
    const variantSource = Array.isArray(parsedValue)
      ? parsedValue
      : Array.isArray(parsedValue?.variants)
        ? parsedValue.variants
        : null;

    if (!variantSource) {
      return {
        error: "JSON must be an array of saved views or an object with a variants array.",
      };
    }

    const importedVariants = variantSource.flatMap((variant) => {
      const parsedVariant = parseImportedSavedWorklistVariant(variant);

      return parsedVariant ? [parsedVariant] : [];
    });

    if (importedVariants.length === 0) {
      return {
        error: "No valid saved views were found in the imported JSON payload.",
      };
    }

    return {
      startupVariantKey:
        !Array.isArray(parsedValue) && typeof parsedValue.startupVariantKey === "string"
          ? parsedValue.startupVariantKey
          : undefined,
      variants: importedVariants,
    };
  } catch {
    return {
      error: "The import payload is not valid JSON yet. Check commas and quotes, then try again.",
    };
  }
}

export function App() {
  const [theme, setTheme] = useState<AxiomThemeName>("horizon");
  const [density, setDensity] = useState<AxiomDensity>("cozy");
  const [direction, setDirection] = useState<AxiomDirection>("ltr");
  const [locale, setLocale] = useState<LocaleCode>("en-US");
  const [fieldDemoDate, setFieldDemoDate] = useState("2026-04-18");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveVariantDialogOpen, setSaveVariantDialogOpen] = useState(false);
  const [manageVariantsDialogOpen, setManageVariantsDialogOpen] = useState(false);
  const [remoteAdapterMode, setRemoteAdapterMode] =
    useState<RemoteAdapterMode>("local-storage");
  const [remoteAutoRefreshMs, setRemoteAutoRefreshMs] = useState(0);
  const [remoteDriftNotice, setRemoteDriftNotice] = useState<string | undefined>(
    undefined,
  );
  const [renameVariantFormState, setRenameVariantFormState] = useState<VariantFormState | null>(
    null,
  );
  const [variantTransferState, setVariantTransferState] = useState<VariantTransferState | null>(
    null,
  );
  const [variantFormState, setVariantFormState] = useState<VariantFormState>({
    label: "",
    description: "",
  });
  const [pendingVariantSelection, setPendingVariantSelection] = useState<
    string | undefined
  >(undefined);
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const {
    getVariant: getSavedWorklistVariant,
    removeVariant: removeSavedWorklistVariant,
    replaceVariants: replaceSavedWorklistVariants,
    saveVariant: saveWorklistVariant,
    variants: savedWorklistVariants,
  } = useSavedVariants<WorklistVariantPreset>({
    clonePreset: cloneWorklistVariantPreset,
    persistence: {
      storageKey: worklistSavedVariantsStorageKey,
      version: worklistSavedVariantsVersion,
    },
  });
  const worklistVariants = buildWorklistVariantMap(savedWorklistVariants);
  const [startupVariantKey, setStartupVariantKey] = useState<WorklistVariantKey>(
    () => readStoredStartupVariant(worklistVariants),
  );
  const [activeGroupBy, setActiveGroupBy] = useState<WorklistGroupKey | undefined>(
    () => readStoredWorklistGroupBy(worklistVariants),
  );
  const [activeObjectSection, setActiveObjectSection] = useState("summary");
  const {
    activeVariant,
    applyDraftFilters,
    applyVariant,
    appliedFilters,
    draftFilters,
    filteredItems,
    page,
    pageCount,
    pageEnd,
    pageSize,
    pageStart,
    paginatedItems,
    resetToVariant,
    selectedRowIds,
    setDraftFilters,
    setPage,
    setPageSize,
    setSelectedRowIds,
    setSort,
    sort: tableSort,
    totalItems,
    updateDraftFilter,
  } = useWorklistState<WorkItem, WorklistFilters, WorklistVariantKey>({
    cloneFilters,
    columns: worklistColumns,
    defaultPageSize: 3,
    defaultSelectedRowIds: ["AX-1031"],
    filterItem: filterWorkItem,
    getVisibleColumnIds,
    initialVariant: startupVariantKey,
    items: workItems,
    normalizeFilters: (filters) => {
      const legacyOwner = (filters as WorklistFilters & { owner?: unknown }).owner;

      return {
        ...filters,
        owners: normalizeOwnerValues(
          Array.isArray(filters.owners)
            ? filters.owners
            : typeof legacyOwner === "string" && legacyOwner.trim()
              ? [legacyOwner]
              : [],
        ),
        keywords: [...(filters.keywords ?? [])],
        targetDate:
          typeof filters.targetDate === "string" ? filters.targetDate : "",
        visibleColumnIds: normalizeVisibleColumnIds(
          filters.visibleColumnIds ?? allWorklistColumnIds,
        ),
      };
    },
    persistence: {
      storageKey: worklistPersistenceStorageKey,
      version: worklistPersistenceVersion,
    },
    variants: worklistVariants,
  });
  const [activeSplitPane, setActiveSplitPane] = useState<
    "primary" | "secondary" | "tertiary"
  >("primary");
  const [activeWorkItemId, setActiveWorkItemId] = useState("AX-1024");
  const activeVariantPreset = worklistVariants[activeVariant] ?? variantPresets.standard;
  const activeSavedVariant = getSavedWorklistVariant(activeVariant);
  const localVariantSnapshot = createVariantSyncSnapshot({
    startupVariantKey,
    variants: savedWorklistVariants,
    version: worklistSavedVariantsVersion,
  });
  const currentVariantPreset = createWorklistVariantPreset({
    filters: draftFilters,
    groupBy: activeGroupBy,
    pageSize,
    sort: tableSort,
  });
  const activeVariantDirty = !areWorklistVariantPresetsEqual(
    currentVariantPreset,
    activeVariantPreset,
  );
  const activeRemoteAdapterLabel = remoteAdapterLabels[remoteAdapterMode];
  const activeSyncActivityStorageKey =
    worklistSyncActivityStorageKeys[remoteAdapterMode];
  const activeMockRemoteAdapter =
    remoteAdapterMode === "session-storage"
      ? mockRemoteSessionVariantAdapter
      : remoteAdapterMode === "memory"
        ? mockRemoteMemoryVariantAdapter
        : mockRemoteVariantAdapter;
  const activeWorkItem =
    workItems.find((workItem) => workItem.id === activeWorkItemId) ?? workItems[0];
  const paginatedGroupedWorkItems = groupWorkItems(paginatedItems, activeGroupBy);

  function applyLocalVariantSnapshot(nextSnapshot: MockRemoteVariantSnapshot) {
    const nextVariantMap = buildWorklistVariantMap(nextSnapshot.variants);
    const nextStartupVariantKey = isWorklistVariantKey(
      nextSnapshot.startupVariantKey,
      nextVariantMap,
    )
      ? nextSnapshot.startupVariantKey
      : "standard";
    const nextActiveVariantKey = isWorklistVariantKey(activeVariant, nextVariantMap)
      ? activeVariant
      : nextStartupVariantKey;

    replaceSavedWorklistVariants(nextSnapshot.variants);
    setStartupVariantKey(nextStartupVariantKey);
    setPendingVariantSelection(nextActiveVariantKey);
  }

  const {
    activities: variantSyncActivities,
    applyReviewedMerge: applyVariantSyncReviewedMerge,
    clearActivities: clearVariantSyncActivities,
    clearRemoteSnapshot: clearVariantSyncRemoteSnapshot,
    closeReview: closeVariantSyncReview,
    overwriteRemoteSnapshot: overwriteVariantSyncRemoteSnapshot,
    pullSnapshot: pullSavedVariantsFromMockCloud,
    pushSnapshot: pushSavedVariantsToMockCloud,
    refreshRemoteSnapshot: refreshSavedVariantsFromMockCloud,
    remoteCheckState: variantSyncRemoteCheckState,
    remoteSnapshot: remoteVariantSnapshot,
    replaceLocalSnapshot: replaceVariantSyncLocalSnapshot,
    reviewEntries: variantSyncEntries,
    reviewState: variantSyncReviewState,
    syncState: variantSyncState,
    syncStatusLabel: remoteSyncStatusLabel,
    updateReviewSelection: updateVariantSyncReviewSelection,
    updateReviewWorkspaceSelection: updateVariantSyncReviewWorkspaceSelection,
  } = useVariantSync<WorklistVariantPreset, WorklistVariantKey>({
    adapter: activeMockRemoteAdapter,
    activityPersistence: {
      storageKey: activeSyncActivityStorageKey,
      version: worklistSyncActivityVersion,
    },
    autoRefreshIntervalMs: remoteAutoRefreshMs,
    comparePreset: areWorklistVariantPresetsEqual,
    fallbackStartupVariantKey: "standard",
    isValidStartupVariantKey: (candidate, variants) =>
      isWorklistVariantKey(candidate, buildWorklistVariantMap(variants)),
    localSnapshot: localVariantSnapshot,
    onApplyLocalSnapshot: applyLocalVariantSnapshot,
    sourceLabel: activeRemoteAdapterLabel,
  });
  const activeVariantSyncActivities = variantSyncActivities.filter(
    (activity) => activity.sourceLabel === activeRemoteAdapterLabel,
  );

  function cloneRemoteSnapshotVariant(variant: SavedVariant<WorklistVariantPreset>) {
    return {
      ...variant,
      preset: cloneWorklistVariantPreset(variant.preset),
    };
  }

  function createRemoteDriftVariant(index: number) {
    const timestamp = new Date().toISOString();
    const driftPreset = createWorklistVariantPreset({
      filters: {
        ...cloneFilters(currentVariantPreset.filters),
        priority:
          currentVariantPreset.filters.priority === "Attention"
            ? "Information"
            : "Attention",
      },
      groupBy: currentVariantPreset.groupBy ?? "priority",
      pageSize: currentVariantPreset.pageSize ?? 3,
      sort: currentVariantPreset.sort ?? { columnId: "priority", direction: "desc" },
    });

    return {
      createdAt: timestamp,
      description: "Simulated remote-only change used to validate watch and refresh flows.",
      key: `remote-drift-${timestamp.replace(/\D/g, "")}-${index + 1}`,
      label: `Remote drift ${index + 1}`,
      preset: driftPreset,
      updatedAt: timestamp,
    } satisfies SavedVariant<WorklistVariantPreset>;
  }

  async function simulateRemoteViewDrift() {
    try {
      const baseSnapshot =
        (await activeMockRemoteAdapter.readSnapshot()) ?? localVariantSnapshot;
      const nextVariants = [
        ...baseSnapshot.variants.map(cloneRemoteSnapshotVariant),
        createRemoteDriftVariant(baseSnapshot.variants.length),
      ];
      const nextVariantMap = buildWorklistVariantMap(nextVariants);
      const nextStartupVariantKey = isWorklistVariantKey(
        baseSnapshot.startupVariantKey,
        nextVariantMap,
      )
        ? baseSnapshot.startupVariantKey
        : nextVariants[0]?.key ?? "standard";

      await activeMockRemoteAdapter.writeSnapshot(
        createVariantSyncSnapshot({
          startupVariantKey: nextStartupVariantKey,
          updatedAt: new Date().toISOString(),
          variants: nextVariants,
          version: baseSnapshot.version,
        }),
      );
      setRemoteDriftNotice(
        `Simulated a remote-only view in ${activeRemoteAdapterLabel}. Use Refresh remote or Watch to detect the drift.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote drift simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  async function simulateRemoteStartupDrift() {
    try {
      const baseSnapshot =
        (await activeMockRemoteAdapter.readSnapshot()) ?? localVariantSnapshot;
      const nextVariants =
        baseSnapshot.variants.length > 0
          ? baseSnapshot.variants.map(cloneRemoteSnapshotVariant)
          : [createRemoteDriftVariant(0)];
      const currentStartupVariantKey = baseSnapshot.startupVariantKey;
      const nextStartupVariantKey =
        nextVariants.find((variant) => variant.key !== currentStartupVariantKey)?.key ??
        nextVariants[0]?.key ??
        "standard";

      await activeMockRemoteAdapter.writeSnapshot(
        createVariantSyncSnapshot({
          startupVariantKey: nextStartupVariantKey,
          updatedAt: new Date().toISOString(),
          variants: nextVariants,
          version: baseSnapshot.version,
        }),
      );
      setRemoteDriftNotice(
        `Simulated a remote startup switch in ${activeRemoteAdapterLabel}. Refresh or Watch will surface the change.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote startup drift simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  async function simulateRemoteClearDrift() {
    try {
      if (activeMockRemoteAdapter.clearSnapshot) {
        await activeMockRemoteAdapter.clearSnapshot();
      } else {
        await activeMockRemoteAdapter.writeSnapshot(
          createVariantSyncSnapshot({
            startupVariantKey: "standard",
            updatedAt: new Date().toISOString(),
            variants: [],
            version: worklistSavedVariantsVersion,
          }),
        );
      }

      setRemoteDriftNotice(
        `Simulated a remote snapshot clear in ${activeRemoteAdapterLabel}. Refresh remote or Watch to detect the reset.`,
      );
    } catch {
      setRemoteDriftNotice(
        `Remote clear simulation failed for ${activeRemoteAdapterLabel}.`,
      );
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (activeGroupBy) {
        window.localStorage.setItem(worklistGroupStorageKey, activeGroupBy);
      } else {
        window.localStorage.removeItem(worklistGroupStorageKey);
      }
    } catch {
      // Ignore localStorage write issues for the docs demo.
    }
  }, [activeGroupBy]);

  useEffect(() => {
    if (isWorklistVariantKey(startupVariantKey, worklistVariants)) {
      return;
    }

    setStartupVariantKey("standard");
  }, [startupVariantKey, worklistVariants]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(worklistStartupVariantStorageKey, startupVariantKey);
    } catch {
      // Ignore localStorage write issues for the docs demo.
    }
  }, [startupVariantKey]);

  useEffect(() => {
    if (!pendingVariantSelection) {
      return;
    }

    const nextPreset = worklistVariants[pendingVariantSelection];

    if (!nextPreset) {
      return;
    }

    applyVariant(pendingVariantSelection);
    setActiveGroupBy(nextPreset.groupBy);
    setPendingVariantSelection(undefined);
  }, [applyVariant, pendingVariantSelection, worklistVariants]);

  useEffect(() => {
    setRemoteDriftNotice(undefined);
  }, [remoteAdapterMode, variantSyncRemoteCheckState.checkedAt]);

  useEffect(() => {
    if (variantSyncReviewState) {
      setManageVariantsDialogOpen(false);
    }
  }, [variantSyncReviewState]);

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      description: "Theme chain",
      badge: "3",
      iconName: "information",
      content: (
        <div className="docs-tab-grid">
          <Card
            eyebrow="Foundation"
            heading="Token first"
            description="Theme, density and semantic color stay upstream from component styling."
            tone="brand"
          >
            <p className="docs-card-copy">
              This keeps future Horizon variants, high-contrast overrides and shell
              contexts manageable instead of spreading visual constants across
              component files.
            </p>
          </Card>
          <Card
            eyebrow="Interaction"
            heading="State first"
            description="Buttons, rows, tabs and dialogs share the same focus and feedback language."
          >
            <p className="docs-card-copy">
              Hover is restrained, selected remains explicit, and semantic tones stay
              readable in dense enterprise pages.
            </p>
          </Card>
        </div>
      ),
    },
    {
      key: "operations",
      label: "Operations",
      description: "Worklist flows",
      badge: selectedRowIds.length,
      iconName: "success",
      tone: "positive" as const,
      content: (
        <div className="docs-inline-stats">
          <div className="docs-inline-stat">
            <span className="docs-inline-stat__label">Selection</span>
            <strong className="docs-inline-stat__value">
              {selectedRowIds.length} row{selectedRowIds.length === 1 ? "" : "s"}
            </strong>
          </div>
          <div className="docs-inline-stat">
            <span className="docs-inline-stat__label">Mode</span>
            <strong className="docs-inline-stat__value">
              UI5-style worklist state core
            </strong>
          </div>
        </div>
      ),
    },
    {
      key: "alerts",
      label: "Alerts",
      description: "Dialog and feedback",
      badge: "2",
      iconName: "warning",
      tone: "critical" as const,
      content: (
        <div className="docs-tab-grid">
          <Card
            eyebrow="Modal shell"
            heading="Header, content, footer"
            description="Dialogs are structured containers, not floating white boxes."
            tone="attention"
          >
            <p className="docs-card-copy">
              Semantic emphasis sits in a restrained header accent while actions stay
              anchored in a dedicated footer.
            </p>
          </Card>
          <Card
            eyebrow="Responsive behavior"
            heading="Popover to dialog path"
            description="Small-screen workflows can move into stronger shells without changing their state language."
          >
            <p className="docs-card-copy">
              That lets us reuse field, button and message primitives across phone,
              tablet and desktop layouts.
            </p>
          </Card>
        </div>
      ),
    },
  ];

  const activeVariantLabel = getWorklistVariantLabel(activeVariant, savedWorklistVariants);
  const startupVariantLabel = getWorklistVariantLabel(
    startupVariantKey,
    savedWorklistVariants,
  );
  const variantSyncWorkspaceCards: VariantSyncReviewWorkspaceCard[] = [];

  if (variantSyncReviewState?.comparison.startupChanged) {
    variantSyncWorkspaceCards.push({
      key: "startup",
      title: "Startup view",
      meta: (
        <>
          <span className="docs-filter-chip">Local: {startupVariantLabel}</span>
          <span className="docs-filter-chip">
            Remote: {getWorklistVariantLabel(
              variantSyncReviewState.remoteSnapshot.startupVariantKey,
              variantSyncReviewState.remoteSnapshot.variants,
            )}
          </span>
        </>
      ),
      actions: (
        <>
          <Button
            selected={variantSyncReviewState.selections.startupSelection === "local"}
            variant="transparent"
            onClick={() =>
              updateVariantSyncReviewWorkspaceSelection("startupSelection", "local")
            }
          >
            Keep local startup
          </Button>
          <Button
            selected={variantSyncReviewState.selections.startupSelection === "remote"}
            variant="transparent"
            onClick={() =>
              updateVariantSyncReviewWorkspaceSelection("startupSelection", "remote")
            }
          >
            Use remote startup
          </Button>
        </>
      ),
    });
  }

  if (variantSyncReviewState?.comparison.orderChanged) {
    variantSyncWorkspaceCards.push({
      key: "order",
      title: "Saved view order",
      meta: (
        <>
          <span className="docs-filter-chip">Local order preserved</span>
          <span className="docs-filter-chip">Remote order available</span>
        </>
      ),
      actions: (
        <>
          <Button
            selected={variantSyncReviewState.selections.orderSelection === "local"}
            variant="transparent"
            onClick={() =>
              updateVariantSyncReviewWorkspaceSelection("orderSelection", "local")
            }
          >
            Keep local order
          </Button>
          <Button
            selected={variantSyncReviewState.selections.orderSelection === "remote"}
            variant="transparent"
            onClick={() =>
              updateVariantSyncReviewWorkspaceSelection("orderSelection", "remote")
            }
          >
            Use remote order
          </Button>
        </>
      ),
    });
  }

  const variantSyncSections: VariantSyncReviewSection[] = [];

  if (variantSyncEntries.changed.length > 0) {
    variantSyncSections.push({
      key: "changed",
      title: "Changed on both sides",
      entries: variantSyncEntries.changed.map((entry) => ({
        key: entry.key,
        title: entry.localLabel ?? entry.remoteLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="active">
            {getVariantSyncEntryFreshness(entry)}
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">
              Local: {entry.localLabel ?? entry.key}
            </span>
            <span className="docs-filter-chip">
              Remote: {entry.remoteLabel ?? entry.key}
            </span>
            <span className="docs-filter-chip">
              Local updated: {entry.localUpdatedAt
                ? formatSavedVariantTimestamp(entry.localUpdatedAt)
                : "Unknown"}
            </span>
            <span className="docs-filter-chip">
              Remote updated: {entry.remoteUpdatedAt
                ? formatSavedVariantTimestamp(entry.remoteUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "local"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "local")}
            >
              Use local
            </Button>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "remote"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "remote")}
            >
              Use remote
            </Button>
          </>
        ),
      })),
    });
  }

  if (variantSyncEntries.localOnly.length > 0) {
    variantSyncSections.push({
      key: "local-only",
      title: "Local-only views",
      entries: variantSyncEntries.localOnly.map((entry) => ({
        key: entry.key,
        title: entry.localLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="preset">
            Local only
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">Key: {entry.key}</span>
            <span className="docs-filter-chip">
              Updated: {entry.localUpdatedAt
                ? formatSavedVariantTimestamp(entry.localUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "local"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "local")}
            >
              Keep local
            </Button>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "none"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "none")}
            >
              Drop local
            </Button>
          </>
        ),
      })),
    });
  }

  if (variantSyncEntries.remoteOnly.length > 0) {
    variantSyncSections.push({
      key: "remote-only",
      title: "Remote-only views",
      entries: variantSyncEntries.remoteOnly.map((entry) => ({
        key: entry.key,
        title: entry.remoteLabel ?? entry.key,
        badge: (
          <span className="docs-variant-kind" data-kind="saved">
            Remote only
          </span>
        ),
        meta: (
          <>
            <span className="docs-filter-chip">Key: {entry.key}</span>
            <span className="docs-filter-chip">
              Updated: {entry.remoteUpdatedAt
                ? formatSavedVariantTimestamp(entry.remoteUpdatedAt)
                : "Unknown"}
            </span>
          </>
        ),
        actions: (
          <>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "remote"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "remote")}
            >
              Add remote
            </Button>
            <Button
              selected={
                variantSyncReviewState?.selections.variantSelections[entry.key] ===
                "none"
              }
              variant="transparent"
              onClick={() => updateVariantSyncReviewSelection(entry.key, "none")}
            >
              Ignore remote
            </Button>
          </>
        ),
      })),
    });
  }

  const variants = [
    ...builtInWorklistVariantKeys.map((variantKey) => ({
      key: variantKey,
      label: (
        <span className="docs-variant-label">
          <span>{builtInWorklistVariantMeta[variantKey].label}</span>
          <span className="docs-variant-kind" data-kind="preset">
            Preset
          </span>
        </span>
      ),
      description: builtInWorklistVariantMeta[variantKey].description,
      count: formatWorklistVariantCount(
        countWorkItemsForFilters(variantPresets[variantKey].filters),
      ),
      modified: variantKey === activeVariant && activeVariantDirty,
    })),
    ...savedWorklistVariants.map((variant) => ({
      key: variant.key,
      label: (
        <span className="docs-variant-label">
          <span>{variant.label}</span>
          <span className="docs-variant-kind" data-kind="saved">
            Local
          </span>
        </span>
      ),
      description: variant.description ?? formatSavedVariantTimestamp(variant.updatedAt),
      count: formatWorklistVariantCount(
        countWorkItemsForFilters(variant.preset.filters),
      ),
      modified: variant.key === activeVariant && activeVariantDirty,
    })),
  ];
  const canSaveVariant = Boolean(variantFormState.label.trim());
  const canRenameVariant = Boolean(renameVariantFormState?.label.trim());
  const canImportSavedVariants = Boolean(variantTransferState?.value.trim());

  function resolveWorklistVariantPreset(variantKey: WorklistVariantKey) {
    return worklistVariants[variantKey] ?? variantPresets.standard;
  }

  function updateVariantForm<Key extends keyof VariantFormState>(
    key: Key,
    value: VariantFormState[Key],
  ) {
    setVariantFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  }

  function openSaveVariantDialog() {
    setVariantFormState({
      key: activeSavedVariant?.key,
      label: activeSavedVariant?.label ?? `${activeVariantLabel} copy`,
      description: activeSavedVariant?.description ?? "",
    });
    setSaveVariantDialogOpen(true);
  }

  function closeSaveVariantDialog() {
    setSaveVariantDialogOpen(false);
    setVariantFormState({
      label: "",
      description: "",
    });
  }

  function saveCurrentVariant(mode: "create" | "update") {
    const nextVariantKey = saveWorklistVariant({
      key: mode === "update" ? variantFormState.key : undefined,
      label: variantFormState.label,
      description: variantFormState.description,
      preset: currentVariantPreset,
    });

    closeSaveVariantDialog();
    setPendingVariantSelection(nextVariantKey);
  }

  function duplicateSavedVariant(variant: SavedVariant<WorklistVariantPreset>) {
    const nextVariantKey = saveWorklistVariant({
      label: `${variant.label} copy`,
      description: variant.description,
      preset: variant.preset,
    });

    setPendingVariantSelection(nextVariantKey);
  }

  function updateRenameVariantForm<Key extends keyof VariantFormState>(
    key: Key,
    value: VariantFormState[Key],
  ) {
    setRenameVariantFormState((currentState) =>
      currentState
        ? {
            ...currentState,
            [key]: value,
          }
        : currentState,
    );
  }

  function openRenameVariantDialog(variant: SavedVariant<WorklistVariantPreset>) {
    setManageVariantsDialogOpen(false);
    setRenameVariantFormState({
      key: variant.key,
      label: variant.label,
      description: variant.description ?? "",
    });
  }

  function closeRenameVariantDialog() {
    setRenameVariantFormState(null);
    setManageVariantsDialogOpen(true);
  }

  function saveRenamedVariant() {
    if (!renameVariantFormState?.key) {
      return;
    }

    const trimmedLabel = renameVariantFormState.label.trim() || "Untitled view";
    const trimmedDescription = renameVariantFormState.description.trim() || undefined;
    const timestamp = new Date().toISOString();

    replaceSavedWorklistVariants(
      savedWorklistVariants.map((variant) =>
        variant.key === renameVariantFormState.key
          ? {
              ...variant,
              label: trimmedLabel,
              description: trimmedDescription,
              updatedAt: timestamp,
            }
          : variant,
      ),
    );
    closeRenameVariantDialog();
  }

  function moveSavedVariant(variantKey: string, direction: -1 | 1) {
    const currentIndex = savedWorklistVariants.findIndex(
      (variant) => variant.key === variantKey,
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= savedWorklistVariants.length) {
      return;
    }

    const nextVariants = [...savedWorklistVariants];
    const [movedVariant] = nextVariants.splice(currentIndex, 1);

    nextVariants.splice(nextIndex, 0, movedVariant);
    replaceSavedWorklistVariants(nextVariants);
  }

  function closeVariantSyncReviewDialog() {
    closeVariantSyncReview();
    setManageVariantsDialogOpen(true);
  }

  function applyReviewedVariantMerge() {
    if (applyVariantSyncReviewedMerge()) {
      setManageVariantsDialogOpen(true);
    }
  }

  async function overwriteRemoteAfterSyncReview() {
    if (await overwriteVariantSyncRemoteSnapshot()) {
      setManageVariantsDialogOpen(true);
    }
  }

  function replaceLocalAfterSyncReview() {
    if (replaceVariantSyncLocalSnapshot()) {
      setManageVariantsDialogOpen(true);
    }
  }

  function closeVariantTransferDialog() {
    setVariantTransferState(null);
    setManageVariantsDialogOpen(true);
  }

  function openExportVariantsDialog() {
    setManageVariantsDialogOpen(false);
    setVariantTransferState({
      mode: "export",
      value: createSavedVariantsExportPayload(startupVariantKey, savedWorklistVariants),
    });
  }

  function openImportVariantsDialog() {
    setManageVariantsDialogOpen(false);
    setVariantTransferState({
      mode: "import",
      value: "",
    });
  }

  function updateVariantTransferValue(value: string) {
    setVariantTransferState((currentState) =>
      currentState
        ? {
            ...currentState,
            error: undefined,
            value,
          }
        : currentState,
    );
  }

  function importSavedVariants() {
    if (!variantTransferState || variantTransferState.mode !== "import") {
      return;
    }

    const parsedPayload = parseSavedVariantsImportPayload(variantTransferState.value);

    if ("error" in parsedPayload) {
      setVariantTransferState((currentState) =>
        currentState
          ? {
              ...currentState,
              error: parsedPayload.error,
            }
          : currentState,
      );
      return;
    }

    const mergedVariants = mergeSavedWorklistVariants(
      savedWorklistVariants,
      parsedPayload.variants,
    );
    const mergedVariantMap = buildWorklistVariantMap(mergedVariants);

    replaceSavedWorklistVariants(mergedVariants);

    if (isWorklistVariantKey(parsedPayload.startupVariantKey, mergedVariantMap)) {
      setStartupVariantKey(parsedPayload.startupVariantKey);
    }

    closeVariantTransferDialog();
    setManageVariantsDialogOpen(true);
  }

  function deleteSavedVariant(variantKey: string) {
    const deletingActiveVariant = variantKey === activeVariant;
    const deletingStartupVariant = variantKey === startupVariantKey;

    removeSavedWorklistVariant(variantKey);

    if (deletingActiveVariant) {
      applyVariantSelection("standard");
    }

    if (deletingStartupVariant) {
      setStartupVariantKey("standard");
    }
  }

  function updateDraftVisibleColumns(visibleColumnIds: string[]) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      visibleColumnIds: normalizeVisibleColumnIds(visibleColumnIds),
    }));
  }

  function showAllDraftColumns() {
    updateDraftVisibleColumns(allWorklistColumnIds);
  }

  function resetDraftColumnsToVariant() {
    updateDraftVisibleColumns(resolveWorklistVariantPreset(activeVariant).filters.visibleColumnIds);
  }

  function resetSortToVariant() {
    const nextSort = resolveWorklistVariantPreset(activeVariant).sort;

    setSort(nextSort ? { ...nextSort } : undefined);
  }

  function resetGroupToVariant() {
    setActiveGroupBy(resolveWorklistVariantPreset(activeVariant).groupBy);
  }

  function applyVariantSelection(variantKey: WorklistVariantKey) {
    const nextPreset = resolveWorklistVariantPreset(variantKey);

    applyVariant(variantKey);
    setActiveGroupBy(nextPreset.groupBy);
  }

  function resetWorklistToVariant(variantKey: WorklistVariantKey = activeVariant) {
    const nextPreset = resolveWorklistVariantPreset(variantKey);

    resetToVariant(variantKey);
    setActiveGroupBy(nextPreset.groupBy);
  }

  return (
    <LocaleProvider locale={locale}>
      <ThemeProvider
        className="docs-app"
        density={density}
        direction={direction}
        theme={theme}
      >
      <AppShell
        brand={<span className="docs-brand-mark">AX</span>}
        primaryTitle="AxiomUI"
        secondaryTitle="React workspace inspired by SAP UI5 Horizon"
        search={
          <Input
            aria-label="Search AxiomUI"
            placeholder="Search tokens, layouts and components"
            endAdornment={<span className="docs-kbd">CTRL K</span>}
          />
        }
        actions={
          <>
            <Button variant="transparent">Tokens</Button>
            <Button variant="transparent">Layouts</Button>
            <Button variant="transparent">Patterns</Button>
            <Button variant="transparent">Inbox 3</Button>
          </>
        }
        meta={
          <div className="docs-shell-meta-group">
            <span className="docs-shell-indicator">{themeLabelByValue[theme]}</span>
            <span className="docs-shell-indicator docs-shell-indicator--brand">
              Workspace
            </span>
            <Button variant="transparent">Profile</Button>
          </div>
        }
      >
        <div className="docs-stack">
          <section className="docs-hero">
            <div className="docs-hero__content">
              <span className="docs-eyebrow">Horizon-inspired component system</span>
              <h1 className="docs-hero__title">
                Initialize a UI5-fluent workspace, not a pile of disconnected widgets.
              </h1>
              <p className="docs-hero__copy">
                AxiomUI now starts from the same layered idea we extracted from UI5:
                foundation tokens, semantic aliases, React primitives and a docs app
                to validate density, states and layout behavior together.
              </p>

              <div className="docs-action-row">
                <Button iconName="plus" variant="emphasized">
                  Create package
                </Button>
                <Button variant="default">Open analysis assets</Button>
              </div>

              <div className="docs-controls">
                <div className="docs-control-block">
                  <span className="docs-control-label">Theme</span>
                  <div className="docs-toggle-row">
                    {themeOptions.map((option) => (
                      <Button
                        key={option.value}
                        selected={theme === option.value}
                        variant="transparent"
                        onClick={() => setTheme(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="docs-control-block">
                  <span className="docs-control-label">Density</span>
                  <div className="docs-toggle-row">
                    <Button
                      selected={density === "cozy"}
                      variant="transparent"
                      onClick={() => setDensity("cozy")}
                    >
                      Cozy
                    </Button>
                    <Button
                      selected={density === "compact"}
                      variant="transparent"
                      onClick={() => setDensity("compact")}
                    >
                      Compact
                    </Button>
                  </div>
                </div>

                <div className="docs-control-block">
                  <span className="docs-control-label">Direction</span>
                  <div className="docs-toggle-row">
                    <Button
                      selected={direction === "ltr"}
                      variant="transparent"
                      onClick={() => setDirection("ltr")}
                    >
                      LTR
                    </Button>
                    <Button
                      selected={direction === "rtl"}
                      variant="transparent"
                      onClick={() => setDirection("rtl")}
                    >
                      RTL
                    </Button>
                  </div>
                </div>

                <div className="docs-control-block">
                  <span className="docs-control-label">Locale</span>
                  <div className="docs-toggle-row">
                    {localeOptions.map((option) => (
                      <Button
                        key={option.value}
                        selected={locale === option.value}
                        variant="transparent"
                        onClick={() => setLocale(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="docs-hero__aside">
              <div className="docs-metric">
                <span className="docs-metric__label">Workspace split</span>
                <strong className="docs-metric__value">tokens + react + docs</strong>
              </div>
              <div className="docs-metric">
                <span className="docs-metric__label">Theme matrix</span>
                <strong className="docs-metric__value">{themeLabelByValue[theme]}</strong>
              </div>
              <div className="docs-metric">
                <span className="docs-metric__label">Locale ready</span>
                <strong className="docs-metric__value">{localeLabelByValue[locale]}</strong>
              </div>
              <div className="docs-metric">
                <span className="docs-metric__label">Core components</span>
                <strong className="docs-metric__value">
                  Shell, Button, Input, Card, Tabs, Dialog, Table, Form Grid
                </strong>
              </div>
              <DocsLocalePreview />
            </div>
          </section>

          <PageSection
            heading="Theme architecture"
            description="The initial workspace mirrors the UI5 theme chain so future themes and component families can grow without rewiring the foundation."
            actions={
              <span className="docs-section-note">
                {"base -> semantic -> component"}
              </span>
            }
          >
            <div className="docs-grid docs-grid--three">
              <Card
                eyebrow="Layer 01"
                heading="Foundation tokens"
                description="Colors, typography, elevation, spacing and density live in @axiomui/tokens."
                tone="brand"
              >
                <p className="docs-card-copy">
                  The token package keeps the project aligned with the analysis docs
                  instead of hard-coding component colors file by file.
                </p>
              </Card>

              <Card
                eyebrow="Layer 02"
                heading="React primitives"
                description="The first components already consume tokens and shared state language."
              >
                <p className="docs-card-copy">
                  Buttons, field wrappers and cards share focus, border, density and
                  semantic state decisions so the system feels coherent from day one.
                </p>
              </Card>

              <Card
                eyebrow="Layer 03"
                heading="Docs workspace"
                description="The docs app is the living surface for density, RTL and layout verification."
                tone="attention"
              >
                <p className="docs-card-copy">
                  It gives us a fast place to preview component families before we add
                  more advanced navigation, feedback patterns and object pages.
                </p>
              </Card>
            </div>
          </PageSection>

          <PageSection
            heading="Button system"
            description="Default, emphasized, semantic and transparent buttons follow the same interaction model with UI5-like restraint."
          >
            <div className="docs-button-showcase">
              <Button variant="default">Default</Button>
              <Button variant="emphasized">Emphasized</Button>
              <Button variant="positive">Positive</Button>
              <Button variant="negative">Negative</Button>
              <Button variant="attention">Attention</Button>
              <Button selected variant="transparent">
                Selected transparent
              </Button>
              <Button iconName="plus">With icon</Button>
              <Button disabled variant="default">
                Disabled
              </Button>
            </div>
          </PageSection>

          <PageSection
            heading="Popover surface"
            description="Anchored overlays now reuse the shared portal, dismiss-layer and overlay-stack foundation instead of shipping one-off floating panels."
          >
            <div className="docs-popover-demo">
              <Button
                ref={popoverTriggerRef}
                iconName="menu"
                selected={popoverOpen}
                variant="default"
                onClick={() => setPopoverOpen((currentValue) => !currentValue)}
              >
                Open quick actions
              </Button>
              <span className="docs-card-copy">
                This is the next base layer for select, combo box, date picker and menu.
              </span>
            </div>

            <Popover
              actions={
                <div className="docs-popover-actions">
                  <Button variant="transparent" onClick={() => setPopoverOpen(false)}>
                    Dismiss
                  </Button>
                  <Button variant="emphasized" onClick={() => setPopoverOpen(false)}>
                    Apply
                  </Button>
                </div>
              }
              anchorRef={popoverTriggerRef}
              description="The popover stays lightweight: anchored, dismissible and ready for field-level overlays."
              matchTriggerWidth
              onOpenChange={setPopoverOpen}
              open={popoverOpen}
              title="Quick actions"
            >
              <div className="docs-popover-body">
                <Input
                  label="Workspace"
                  placeholder="AxiomUI Shell"
                  description="The trigger width can be matched when the overlay needs to feel field-bound."
                />
                <MessageStrip headline="Overlay base" tone="information">
                  Portal, outside click, escape close and overlay stack now come from shared primitives.
                </MessageStrip>
              </div>
            </Popover>
          </PageSection>

          <PageSection
            heading="Field and card primitives"
            description="Wrapper-driven field styling and restrained container components are the next foundation for enterprise pages."
          >
            <div className="docs-grid docs-grid--split">
              <div className="docs-input-stack">
                <Input
                  label="Project name"
                  placeholder="AxiomUI Shell"
                  description="Wrapper-driven fields keep adornments and focus states stable."
                />
                <ComboBox
                  description="Type to narrow owners while keeping the same field shell and anchored overlay pattern."
                  items={ownerComboBoxItems}
                  label="Suggested owner"
                  message="ComboBox adds filtering and free text entry on top of the same overlay foundation."
                  placeholder="Search owners"
                />
                <MultiComboBox
                  defaultValues={["Mia Chen", "Noah Patel"]}
                  description="MultiComboBox layers token sync and multi-select list behavior on top of the same search overlay."
                  items={ownerComboBoxItems}
                  label="Review owners"
                  message="Select multiple owners to stage an advanced filter or assignment view."
                  placeholder="All owners"
                />
                <MultiInput
                  defaultValues={["tokens", "overlay"]}
                  description="Tokenized input now shares the same field shell and can represent stacked filters or labels."
                  label="Focus areas"
                  message="Press Enter or comma to create tokens, and Backspace to remove the latest one."
                  placeholder="Add focus area"
                />
                <DatePicker
                  description="DatePicker now reuses the same field shell, adds locale-aware formatting, and keeps an ISO value behind the scenes."
                  label="Validation milestone"
                  maxDate="2026-09-30"
                  message={`Current value: ${fieldDemoDate || "None"}`}
                  minDate="2026-04-01"
                  value={fieldDemoDate}
                  onValueChange={setFieldDemoDate}
                />
                <Select
                  label="Release channel"
                  description="The same field shell can now drive an anchored listbox instead of free text input."
                  items={releaseChannelSelectItems}
                  message="Select shares the same semantic field language and form-grid behavior."
                  placeholder="Choose channel"
                  valueState="success"
                />
                <Input
                  label="Information state"
                  placeholder="Version 0.1.0"
                  valueState="information"
                  message="Information state stays neutral and supportive."
                  endAdornment={<span className="docs-pill">INFO</span>}
                />
                <Input
                  label="Validation"
                  placeholder="Button tokens are missing"
                  valueState="error"
                  message="Error, warning and success are modeled as first-class field states."
                />
              </div>

              <div className="docs-card-stack">
                <Card
                  eyebrow="Layout"
                  heading="Page shell card"
                  description="Use cards for structure, not decoration."
                  interactive
                  tone="brand"
                  footer={<Button variant="transparent">Inspect slots</Button>}
                >
                  <p className="docs-card-copy">
                    The card primitive inherits the same surface, border and elevation
                    language as the rest of the system, which keeps dashboard layouts
                    visually steady.
                  </p>
                </Card>

                <Card
                  eyebrow="Next step"
                  heading="Workspace ready"
                  description="Tokens, React package and docs app are already wired together."
                  tone="positive"
                  footer={<Button variant="default">Run pnpm dev</Button>}
                >
                  <p className="docs-card-copy">
                    From here we can extend the library toward dialogs, tables,
                    dynamic page sections and responsive form grids without replacing
                    the base architecture.
                  </p>
                </Card>
              </div>
            </div>
          </PageSection>

          <PageSection
            heading="Tabs and secondary navigation"
            description="The tab layer now behaves like a reusable navigation framework instead of a one-off segmented control."
          >
            <Tabs items={tabs} orientation="vertical" />
          </PageSection>

          <PageSection
            heading="Filter bar and variant management"
            description="This layer gives worklists and object pages a standard place for saved views, basic filters and expand-on-demand refinement."
          >
            <FilterBar
              actions={
                <div className="docs-toggle-row">
                  <Button variant="transparent">Adapt filters</Button>
                  <Button variant="default" onClick={applyDraftFilters}>
                    Go
                  </Button>
                </div>
              }
              description="Toolbar rhythm, responsive form fields and saved views now work together as a reusable operation layer."
              footer={
                <div className="docs-filter-footer">
                  <Button
                    variant="transparent"
                    onClick={() => resetWorklistToVariant(activeVariant)}
                  >
                    Reset
                  </Button>
                  <Button variant="transparent">Share view</Button>
                  <Button variant="emphasized" onClick={applyDraftFilters}>
                    Apply to worklist
                  </Button>
                </div>
              }
              heading="Worklist filters"
              summary={
                <div className="docs-filter-summary">
                  <span className="docs-filter-chip">Variant: {activeVariantLabel}</span>
                  <span className="docs-filter-chip">
                    Search: {appliedFilters.search || "All"}
                  </span>
                  <span className="docs-filter-chip">
                    Keywords: {appliedFilters.keywords.length || "None"}
                  </span>
                  <span className="docs-filter-chip">
                    Target date: {formatWorklistDateLabel(appliedFilters.targetDate, locale)}
                  </span>
                  <span className="docs-filter-chip">
                    Owners: {formatWorklistOwnersLabel(appliedFilters.owners)}
                  </span>
                  <span className="docs-filter-chip">
                    Priority: {appliedFilters.priority || "All"}
                  </span>
                  <span className="docs-filter-chip">
                    Visible columns: {appliedFilters.visibleColumnIds.length}
                  </span>
                  <span className="docs-filter-chip">
                    Sort: {tableSort ? `${getWorklistSortLabel(tableSort)} ${tableSort.direction}` : "None"}
                  </span>
                  <span className="docs-filter-chip">
                    Group: {getWorklistGroupLabel(activeGroupBy)}
                  </span>
                  <span className="docs-filter-chip">
                    Saved views: {savedWorklistVariants.length}
                  </span>
                  <span className="docs-filter-chip">
                    Startup: {startupVariantLabel}
                  </span>
                  <span className="docs-filter-chip">
                    Remote: {formatRemoteSnapshotLabel(remoteVariantSnapshot)}
                  </span>
                  <span className="docs-filter-chip">
                    Adapter: {activeRemoteAdapterLabel}
                  </span>
                  <span className="docs-filter-chip">Sync: {remoteSyncStatusLabel}</span>
                  <span className="docs-filter-chip">
                    {activeVariantDirty ? "Unsaved changes" : "Variant in sync"}
                  </span>
                  <span className="docs-filter-chip">Density: {density}</span>
                  <span className="docs-filter-chip">Theme: {themeLabelByValue[theme]}</span>
                  <span className="docs-filter-chip">Locale: {localeLabelByValue[locale]}</span>
                </div>
              }
              variant={
                <VariantManager
                  actions={
                    <>
                      <Button variant="transparent" onClick={openSaveVariantDialog}>
                        Save
                      </Button>
                      <Button
                        selected={startupVariantKey === activeVariant}
                        variant="transparent"
                        onClick={() => setStartupVariantKey(activeVariant)}
                      >
                        Set startup
                      </Button>
                      <Button
                        variant="transparent"
                        onClick={() => setManageVariantsDialogOpen(true)}
                      >
                        Manage
                      </Button>
                    </>
                  }
                  onValueChange={applyVariantSelection}
                  value={activeVariant}
                  variants={variants}
                />
              }
            >
              <FormGrid columns={3}>
                <FormField
                  description="Primary object search"
                  htmlFor="filter-search"
                  label="Search"
                >
                  <Input
                    id="filter-search"
                    value={draftFilters.search}
                    onChange={(event) => updateDraftFilter("search", event.target.value)}
                  />
                </FormField>

                <FormField
                  description="Responsible streams"
                  htmlFor="filter-owner"
                  label="Owners"
                >
                  <MultiComboBox
                    id="filter-owner"
                    items={ownerComboBoxItems}
                    placeholder="All owners"
                    values={draftFilters.owners}
                    onValuesChange={(values) => updateDraftFilter("owners", values)}
                  />
                </FormField>

                <FormField
                  description="Single-date planning slice"
                  htmlFor="filter-target-date"
                  label="Target date"
                >
                  <DatePicker
                    id="filter-target-date"
                    maxDate="2026-09-30"
                    message="Filter by the exact milestone date stored in the worklist state."
                    minDate="2026-04-01"
                    value={draftFilters.targetDate}
                    onValueChange={(value) => updateDraftFilter("targetDate", value)}
                  />
                </FormField>

                <FormField
                  description="Stacked token search"
                  htmlFor="filter-keywords"
                  label="Keywords"
                  span={2}
                >
                  <MultiInput
                    id="filter-keywords"
                    message="Each token is matched against the combined work item text."
                    placeholder="Add keywords"
                    values={draftFilters.keywords}
                    onValuesChange={(values) => updateDraftFilter("keywords", values)}
                  />
                </FormField>

                <FormField
                  description="Semantic triage"
                  htmlFor="filter-priority"
                  label="Priority"
                >
                  <Select
                    id="filter-priority"
                    items={priorityFilterSelectItems}
                    placeholder="All priorities"
                    value={draftFilters.priority}
                    onValueChange={(value) => updateDraftFilter("priority", value)}
                  />
                </FormField>

                <FormField
                  description="Execution state"
                  htmlFor="filter-status"
                  label="Status"
                >
                  <Input
                    id="filter-status"
                    value={draftFilters.status}
                    onChange={(event) => updateDraftFilter("status", event.target.value)}
                  />
                </FormField>

                <FormField
                  description="Release slot"
                  htmlFor="filter-wave"
                  label="Wave"
                >
                  <Input
                    id="filter-wave"
                    value={draftFilters.wave}
                    onChange={(event) => updateDraftFilter("wave", event.target.value)}
                  />
                </FormField>

                <FormField
                  description="Optional regional slice"
                  htmlFor="filter-region"
                  label="Region"
                >
                  <Input
                    id="filter-region"
                    value={draftFilters.region}
                    onChange={(event) => updateDraftFilter("region", event.target.value)}
                  />
                </FormField>
              </FormGrid>

              <div className="docs-personalization-grid">
                <ColumnManager
                  actions={
                    <>
                      <Button variant="transparent" onClick={showAllDraftColumns}>
                        Show all
                      </Button>
                      <Button
                        variant="transparent"
                        onClick={resetDraftColumnsToVariant}
                      >
                        Reset columns
                      </Button>
                    </>
                  }
                  description="Column visibility now lives in a dedicated personalization surface instead of a few one-off footer buttons."
                  heading="Column personalization"
                  items={worklistColumnItems}
                  summary={`${draftFilters.visibleColumnIds.length} staged columns for the active variant`}
                  value={draftFilters.visibleColumnIds}
                  onValueChange={updateDraftVisibleColumns}
                />

                <SortManager
                  actions={
                    <Button variant="transparent" onClick={resetSortToVariant}>
                      Reset sort
                    </Button>
                  }
                  description="Sorting now stays configurable even when a column is hidden from the current table view."
                  heading="Sort personalization"
                  items={worklistSortItems}
                  summary={
                    tableSort
                      ? `Active rule: ${getWorklistSortLabel(tableSort)} in ${tableSort.direction} order`
                      : "No active sort rule. The worklist follows its base item order."
                  }
                  sort={tableSort}
                  onSortChange={setSort}
                />

                <GroupManager
                  actions={
                    <Button variant="transparent" onClick={resetGroupToVariant}>
                      Reset grouping
                    </Button>
                  }
                  description="Grouping organizes the full filtered result set before pagination, so summary sections stay stable."
                  heading="Group personalization"
                  items={worklistGroupItems}
                  summary={
                    activeGroupBy
                      ? `Active grouping: ${getWorklistGroupLabel(activeGroupBy)}`
                      : "No grouping is active. Results stay in a single flat list."
                  }
                  group={activeGroupBy}
                  onGroupChange={(value) =>
                    setActiveGroupBy(value as WorklistGroupKey | undefined)
                  }
                />
              </div>
            </FilterBar>

            <Toolbar
              end={
                <>
                  <Button variant="transparent">Refresh</Button>
                  <Button selected={Boolean(activeGroupBy)} variant="transparent">
                    Grouping
                  </Button>
                  <Button variant="default">Export</Button>
                </>
              }
              headline="Filtered result context"
              middle={
                <div className="docs-toolbar-summary">
                  <span className="docs-toolbar-pill">
                    Active view: {activeVariantLabel}
                  </span>
                  <span className="docs-toolbar-pill">
                    Startup view: {startupVariantLabel}
                  </span>
                  <span className="docs-toolbar-pill">
                    Remote: {formatRemoteSnapshotLabel(remoteVariantSnapshot)}
                  </span>
                  <span className="docs-toolbar-pill">
                    Adapter: {activeRemoteAdapterLabel}
                  </span>
                  <span className="docs-toolbar-pill">Sync: {remoteSyncStatusLabel}</span>
                  <span className="docs-toolbar-pill">
                    {filteredItems.length} / {totalItems} visible items
                  </span>
                  <span className="docs-toolbar-pill">
                    Page: {page} / {pageCount}
                  </span>
                  <span className="docs-toolbar-pill">
                    Rows: {pageStart}-{pageEnd}
                  </span>
                  <span className="docs-toolbar-pill">
                    Sort: {tableSort ? `${getWorklistSortLabel(tableSort)} ${tableSort.direction}` : "none"}
                  </span>
                  <span className="docs-toolbar-pill">
                    Group: {getWorklistGroupLabel(activeGroupBy)}
                  </span>
                  <span className="docs-toolbar-pill">
                    Page groups: {activeGroupBy ? paginatedGroupedWorkItems.length : 0}
                  </span>
                  <span className="docs-toolbar-pill">
                    Columns: {appliedFilters.visibleColumnIds.join(", ")}
                  </span>
                </div>
              }
              start={<Button variant="transparent">Results</Button>}
              supportingText="A worklist can sit directly beneath the filter bar without inventing a new layout grammar, and local views can now define the startup workspace after refresh."
              variant="header"
            />
          </PageSection>

          <PageSection
            heading="Table, row state and pagination"
            description="Sorting, grouping, selection, semantic highlighting and page movement now share the same reusable worklist state model."
            actions={
              <Button variant="transparent" onClick={() => setDialogOpen(true)}>
                Open create dialog
              </Button>
            }
          >
            <div className="docs-table-stack">
              <DataTable
                caption={
                  filteredItems.length > 0
                    ? activeGroupBy
                      ? `Showing rows ${pageStart}-${pageEnd} of ${filteredItems.length} filtered work items. Current page is sectioned by ${getWorklistGroupLabel(activeGroupBy)}.`
                      : `Showing rows ${pageStart}-${pageEnd} of ${filteredItems.length} filtered work items. Click a sortable header to change ordering.`
                    : "No work items match the applied filters yet. Adjust the filter bar or switch to another variant."
                }
                columns={worklistColumns}
                emptyState="No work items match the applied filters. Adjust the filter bar or switch to another variant."
                getRowId={(row) => row.id}
                getRowMeta={(row) => ({
                  navigated: row.id === "AX-1024",
                  unread: row.id === "AX-1050",
                })}
                getRowTone={(row) => {
                  if (row.priority === "Positive") {
                    return "positive";
                  }
                  if (row.priority === "Information") {
                    return "information";
                  }
                  if (row.priority === "Attention") {
                    return "warning";
                  }
                  return "negative";
                }}
                manualSorting
                onSelectionChange={setSelectedRowIds}
                onSortChange={setSort}
                groups={activeGroupBy ? paginatedGroupedWorkItems : undefined}
                rows={paginatedItems}
                selectedRowIds={selectedRowIds}
                selectionMode="multiple"
                sort={tableSort}
                visibleColumnIds={appliedFilters.visibleColumnIds}
              />

              <Pagination
                label="Worklist paging"
                page={page}
                pageSize={pageSize}
                pageSizeOptions={worklistPageSizeOptions}
                summary={
                  filteredItems.length > 0
                    ? `Showing ${pageStart}-${pageEnd} of ${filteredItems.length} filtered items across ${pageCount} pages.`
                    : "No rows are available for the current filter combination."
                }
                total={filteredItems.length}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </PageSection>

          <PageSection
            heading="Form grid and dialog shell"
            description="The responsive form grid keeps labels, fields and helper text aligned while the dialog provides a proper modal workflow shell."
            actions={
              <span className="docs-section-note">
                {"phone -> tablet -> desktop"}
              </span>
            }
          >
            <div className="docs-form-surface">
              <FormGrid columns={3}>
                <FormField
                  description="Immutable identifier"
                  htmlFor="project-id"
                  label="Project ID"
                >
                  <Input id="project-id" defaultValue="AX-UI-001" readOnly />
                </FormField>

                <FormField
                  description="Shared owner vocabulary"
                  htmlFor="form-grid-owner"
                  label="Owner"
                  required
                >
                  <ComboBox
                    id="form-grid-owner"
                    items={ownerComboBoxItems}
                    placeholder="Assign a maintainer"
                  />
                </FormField>

                <FormField
                  description="Scheduling now shares the same grid contract"
                  hint="The calendar panel should align with sibling fields in cozy and compact modes."
                  htmlFor="form-grid-window"
                  label="Window"
                >
                  <DatePicker
                    id="form-grid-window"
                    defaultValue="2026-05-16"
                    maxDate="2026-09-30"
                    minDate="2026-04-01"
                  />
                </FormField>

                <FormField
                  description="Cross-team rollout"
                  htmlFor="summary"
                  label="Summary"
                  span={2}
                >
                  <Input
                    id="summary"
                    placeholder="Unify Horizon-inspired tokens, rows and shell behaviors"
                  />
                </FormField>

                <FormField
                  description="Validation stays close to the field"
                  hint="Compact mode still preserves label alignment and field focus."
                  htmlFor="status"
                  label="Release status"
                >
                  <Select
                    id="status"
                    items={releaseStatusSelectItems}
                    placeholder="Choose a release state"
                    valueState="success"
                    message="Value-state support is built into the field wrapper."
                  />
                </FormField>

                <FormField
                  description="Stack multiple concerns without leaving the same layout system."
                  hint="Use the same grid for object pages, dialogs and filter bars."
                  htmlFor="form-grid-tags"
                  label="Focus tags"
                  span={2}
                >
                  <MultiInput
                    id="form-grid-tags"
                    defaultValues={["filter-bar", "forms", "date-picker"]}
                    message="Token input remains stable when it spans across the full row."
                    placeholder="Add a capability"
                  />
                </FormField>

                <FormField
                  description="Field messages and outer hints can coexist."
                  hint="This stays aligned when the grid collapses from three columns to two."
                  htmlFor="form-grid-version"
                  label="Release line"
                >
                  <Input
                    id="form-grid-version"
                    defaultValue="0.2.0"
                    valueState="information"
                    message="Use component messages for inline state and field hints for broader layout guidance."
                  />
                </FormField>
              </FormGrid>

              <div className="docs-form-actions">
                <Button variant="default">Save draft</Button>
                <Button variant="emphasized" onClick={() => setDialogOpen(true)}>
                  Launch modal flow
                </Button>
              </div>
            </div>
          </PageSection>

          <PageSection
            heading="Dynamic page, toolbar and feedback"
            description="This layer brings the page title, structured header bar, inline feedback and floating footer into one enterprise page rhythm."
          >
            <DynamicPage
              actions={
                <>
                  <Button variant="transparent">Share</Button>
                  <Button variant="default">Simulate draft</Button>
                  <Button variant="emphasized">Primary action</Button>
                </>
              }
              eyebrow="Object page"
              footer={
                <>
                  <Button variant="transparent">Cancel</Button>
                  <Button variant="emphasized">Approve rollout</Button>
                </>
              }
              headerContent={
                <>
                  <MessageStrip
                    actions={<Button variant="transparent">Review</Button>}
                    closable
                    headline="Migration window is active"
                    tone="information"
                  >
                    Toolbar, page header and footer now keep explicit layering, so
                    dense worklist screens do not collapse into a single anonymous
                    flex row.
                  </MessageStrip>

                  <Toolbar
                    end={
                      <>
                        <Button variant="transparent">History</Button>
                        <Button variant="default">Export</Button>
                      </>
                    }
                    headline="Release coordination"
                    middle={
                      <div className="docs-toolbar-summary">
                        <span className="docs-toolbar-pill">12 components mapped</span>
                        <span className="docs-toolbar-pill">2 densities active</span>
                        <span className="docs-toolbar-pill">RTL preview ready</span>
                      </div>
                    }
                    start={
                      <>
                        <Button variant="transparent">Back</Button>
                        <Button selected variant="transparent">
                          Overview
                        </Button>
                      </>
                    }
                    supportingText="Structured start / middle / end slots for page-level actions"
                    variant="header"
                  />
                </>
              }
              heading="AxiomUI rollout workspace"
              subheading="A Dynamic Page layout keeps title, header summary, content area and floating footer in separate layers while still feeling cohesive."
            >
              <div className="docs-object-layout">
                <div className="docs-object-main">
                  <Toolbar
                    end={
                      <>
                        <Button variant="transparent">Refresh</Button>
                        <Button variant="default">Add filter</Button>
                      </>
                    }
                    middle={
                      <div className="docs-toolbar-summary">
                        <span className="docs-toolbar-pill">Object page</span>
                        <span className="docs-toolbar-pill">Header sticky</span>
                        <span className="docs-toolbar-pill">Footer reserved</span>
                      </div>
                    }
                    start={<Button variant="transparent">Filters</Button>}
                    variant="toolbar"
                  />

                  <Card
                    eyebrow="Execution summary"
                    heading="Cross-system rollout"
                    description="Page-level structure is now strong enough to host cards, forms, tables and inline alerts together."
                    tone="brand"
                  >
                    <div className="docs-kpi-grid">
                      <div className="docs-kpi">
                        <span className="docs-kpi__label">Packages</span>
                        <strong className="docs-kpi__value">3 live</strong>
                      </div>
                      <div className="docs-kpi">
                        <span className="docs-kpi__label">Core families</span>
                        <strong className="docs-kpi__value">12 mapped</strong>
                      </div>
                      <div className="docs-kpi">
                        <span className="docs-kpi__label">State coverage</span>
                        <strong className="docs-kpi__value">Growing</strong>
                      </div>
                    </div>
                  </Card>

                  <MessageStrip
                    actions={<Button variant="transparent">Inspect header</Button>}
                    headline="Header and content remain distinct"
                    tone="warning"
                  >
                    The page title area stays visually above the content zone, while
                    the floating footer reserves space and does not cover the work
                    area below it.
                  </MessageStrip>

                  <FormGrid columns={2}>
                    <FormField
                      description="Bound to object page title"
                      htmlFor="object-name"
                      label="Workspace name"
                    >
                      <Input id="object-name" defaultValue="AxiomUI rollout workspace" />
                    </FormField>
                    <FormField
                      description="Standard page owner field"
                      htmlFor="page-owner"
                      label="Coordinator"
                    >
                      <Input id="page-owner" defaultValue="Mia Chen" />
                    </FormField>
                    <FormField
                      description="Inline feedback stays in the normal content flow"
                      hint="Use message strips for contextual updates and message pages for higher-level empty or error states."
                      htmlFor="page-summary"
                      label="Rollout summary"
                      span={2}
                    >
                      <Input
                        id="page-summary"
                        defaultValue="Consolidate shell, feedback, navigation and page skeleton primitives."
                        valueState="information"
                        message="Message tone and field tone can coexist without fighting for visual priority."
                      />
                    </FormField>
                  </FormGrid>
                </div>

                <div className="docs-object-side">
                  <MessagePage
                    actions={
                      <>
                        <Button variant="default">Open inbox</Button>
                        <Button variant="transparent">View logs</Button>
                      </>
                    }
                    description="Higher-level feedback still uses the same surface, typography and action language as the rest of the system."
                    headline="No blocking notifications"
                    tone="success"
                  />

                  <Card
                    eyebrow="Feedback hierarchy"
                    heading="Escalate only when needed"
                    description="Inline message strips handle context. Message pages handle broader absence or recovery states."
                  >
                    <div className="docs-feedback-stack">
                      <span className="docs-feedback-line">
                        Inline strips for local warnings, info and success.
                      </span>
                      <span className="docs-feedback-line">
                        Dialogs for disruptive or confirmatory flows.
                      </span>
                      <span className="docs-feedback-line">
                        Message pages for empty, error or recovery surfaces.
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </DynamicPage>
          </PageSection>

          <PageSection
            heading="Shell context, notifications and object sections"
            description="The next layer connects a second-level shell header with a notification center and object-page style section navigation."
          >
            <div className="docs-shell-flow">
              <ToolHeader
                actions={
                  <>
                    <Button variant="transparent">Search scope</Button>
                    <Button variant="transparent">Favorites</Button>
                    <Button variant="default">Create ticket</Button>
                  </>
                }
                meta={
                  <>
                    <span className="docs-tool-meta">Inbox 3</span>
                    <Button variant="transparent">Profile</Button>
                  </>
                }
                navigation={
                  <div className="docs-tool-nav">
                    <Button selected variant="transparent">
                      Overview
                    </Button>
                    <Button variant="transparent">Delivery</Button>
                    <Button variant="transparent">Inbox</Button>
                  </div>
                }
                start={<Button variant="transparent">Menu</Button>}
                sticky
                title="AxiomUI Delivery Workspace"
              />

              <div className="docs-shell-layout">
                <div className="docs-shell-main">
                  <ObjectPageNav
                    items={[
                      { key: "summary", label: "Summary", count: "04" },
                      { key: "delivery", label: "Delivery", count: "03" },
                      { key: "inbox", label: "Inbox", count: "03" },
                    ]}
                    onValueChange={setActiveObjectSection}
                    value={activeObjectSection}
                  />

                  {activeObjectSection === "summary" ? (
                    <ObjectPageSection
                      actions={<Button variant="transparent">Open metrics</Button>}
                      description="A summary section can mix KPI cards, local feedback and action strips without losing page rhythm."
                      heading="Summary"
                      sectionKey="summary"
                    >
                      <div className="docs-kpi-grid">
                        <div className="docs-kpi">
                          <span className="docs-kpi__label">Rollout status</span>
                          <strong className="docs-kpi__value">On track</strong>
                        </div>
                        <div className="docs-kpi">
                          <span className="docs-kpi__label">Notifications</span>
                          <strong className="docs-kpi__value">3 active</strong>
                        </div>
                        <div className="docs-kpi">
                          <span className="docs-kpi__label">Open sections</span>
                          <strong className="docs-kpi__value">3 areas</strong>
                        </div>
                      </div>

                      <MessageStrip
                        actions={<Button variant="transparent">Inspect rollout</Button>}
                        headline="Section navigation is now reusable"
                        tone="information"
                      >
                        The object-page layer separates summary, delivery and inbox
                        concerns without forcing each business screen to invent its own
                        anchor bar.
                      </MessageStrip>
                    </ObjectPageSection>
                  ) : null}

                  {activeObjectSection === "delivery" ? (
                    <ObjectPageSection
                      actions={<Button variant="default">Sync states</Button>}
                      description="This section mirrors a delivery work area with fields, actions and bounded content groups."
                      heading="Delivery"
                      sectionKey="delivery"
                    >
                      <Toolbar
                        end={
                          <>
                            <Button variant="transparent">Variant</Button>
                            <Button variant="default">Run check</Button>
                          </>
                        }
                        middle={
                          <div className="docs-toolbar-summary">
                            <span className="docs-toolbar-pill">Header aligned</span>
                            <span className="docs-toolbar-pill">Notifications linked</span>
                            <span className="docs-toolbar-pill">Sections stable</span>
                          </div>
                        }
                        start={<Button variant="transparent">Scope</Button>}
                        variant="toolbar"
                      />

                      <FormGrid columns={2}>
                        <FormField
                          description="Shared object title"
                          htmlFor="delivery-name"
                          label="Delivery name"
                        >
                          <Input
                            id="delivery-name"
                            defaultValue="AxiomUI Platform Rollout"
                          />
                        </FormField>
                        <FormField
                          description="Assigned stream"
                          htmlFor="delivery-stream"
                          label="Stream"
                        >
                          <Input id="delivery-stream" defaultValue="Frontend foundation" />
                        </FormField>
                        <FormField
                          description="Stable section copy"
                          htmlFor="delivery-note"
                          hint="Sections can host fields, lists and feedback without changing their base container language."
                          label="Notes"
                          span={2}
                        >
                          <Input
                            id="delivery-note"
                            defaultValue="Shell, object navigation and notifications now share the same surface and spacing model."
                            valueState="information"
                            message="Section-level fields continue to inherit wrapper-driven value states."
                          />
                        </FormField>
                      </FormGrid>
                    </ObjectPageSection>
                  ) : null}

                  {activeObjectSection === "inbox" ? (
                    <ObjectPageSection
                      actions={<Button variant="transparent">Mark all read</Button>}
                      description="Notifications stay in the same design language as lists and message strips instead of becoming detached cards."
                      heading="Inbox"
                      sectionKey="inbox"
                    >
                      <NotificationList
                        heading="Latest updates"
                        items={inboxItems.map((item) => ({
                          ...item,
                          action: (
                            <Button variant="transparent">
                              {item.unread ? "Review" : "Open"}
                            </Button>
                          ),
                        }))}
                      />
                    </ObjectPageSection>
                  ) : null}
                </div>

                <div className="docs-shell-side">
                  <NotificationList
                    heading="Notification center"
                    items={inboxItems.map((item) => ({
                      ...item,
                      action: <Button variant="transparent">Open</Button>,
                    }))}
                  />

                  <Card
                    eyebrow="Shell alignment"
                    heading="Global to local"
                    description="App shell, tool header and object section nav now form a clearer hierarchy."
                    tone="brand"
                  >
                    <div className="docs-feedback-stack">
                      <span className="docs-feedback-line">
                        App shell handles application identity and global search.
                      </span>
                      <span className="docs-feedback-line">
                        Tool header scopes the current workspace and high-level actions.
                      </span>
                      <span className="docs-feedback-line">
                        Object navigation switches local sections without breaking the page flow.
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </PageSection>

          <PageSection
            heading="Split layout and master-detail"
            description="Split layouts give us a proper workbench shape for list, detail and context panes without forcing symmetric columns."
            actions={
              <div className="docs-toggle-row">
                <Button
                  selected={activeSplitPane === "primary"}
                  variant="transparent"
                  onClick={() => setActiveSplitPane("primary")}
                >
                  List
                </Button>
                <Button
                  selected={activeSplitPane === "secondary"}
                  variant="transparent"
                  onClick={() => setActiveSplitPane("secondary")}
                >
                  Detail
                </Button>
                <Button
                  selected={activeSplitPane === "tertiary"}
                  variant="transparent"
                  onClick={() => setActiveSplitPane("tertiary")}
                >
                  Context
                </Button>
              </div>
            }
          >
            <SplitLayout
              activePane={activeSplitPane}
              primary={{
                title: "Worklist",
                description: "A bounded list pane for fast scanning and selection.",
                toolbar: (
                  <Button variant="transparent" onClick={() => setActiveSplitPane("secondary")}>
                    Focus detail
                  </Button>
                ),
                content: (
                  <div className="docs-worklist-stack">
                    {workItems.map((workItem) => {
                      const selected = workItem.id === activeWorkItem.id;

                      return (
                        <button
                          key={workItem.id}
                          className="docs-worklist-item"
                          data-selected={selected}
                          type="button"
                          onClick={() => {
                            setActiveWorkItemId(workItem.id);
                            setActiveSplitPane("secondary");
                          }}
                        >
                          <div className="docs-worklist-item__topline">
                            <strong>{workItem.object}</strong>
                            <span
                              className="docs-status"
                              data-tone={workItem.priority.toLowerCase()}
                            >
                              {workItem.priority}
                            </span>
                          </div>
                          <span className="docs-worklist-item__meta">
                            {workItem.id} · {workItem.owner}
                          </span>
                          <span className="docs-worklist-item__meta">
                            {workItem.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ),
              }}
              secondary={{
                title: activeWorkItem.object,
                description: `${activeWorkItem.id} · ${activeWorkItem.status}`,
                toolbar: (
                  <div className="docs-toggle-row">
                    <Button variant="transparent" onClick={() => setActiveSplitPane("primary")}>
                      Back to list
                    </Button>
                    <Button variant="default">Edit item</Button>
                  </div>
                ),
                content: (
                  <div className="docs-split-detail">
                    <MessageStrip
                      actions={<Button variant="transparent">Track changes</Button>}
                      headline="Detail pane follows the same state language"
                      tone={
                        activeWorkItem.priority === "Negative"
                          ? "error"
                          : activeWorkItem.priority === "Attention"
                            ? "warning"
                            : activeWorkItem.priority === "Positive"
                              ? "success"
                              : "information"
                      }
                    >
                      Split layouts keep the detail pane visually distinct without
                      turning it into a separate design system.
                    </MessageStrip>

                    <FormGrid columns={2}>
                      <FormField
                        description="Primary object"
                        htmlFor="split-object"
                        label="Object"
                      >
                        <Input
                          id="split-object"
                          defaultValue={activeWorkItem.object}
                          readOnly
                        />
                      </FormField>
                      <FormField
                        description="Owner stream"
                        htmlFor="split-owner"
                        label="Owner"
                      >
                        <Input id="split-owner" defaultValue={activeWorkItem.owner} />
                      </FormField>
                      <FormField
                        description="Current delivery status"
                        htmlFor="split-status"
                        label="Status"
                        span={2}
                      >
                        <Input
                          id="split-status"
                          defaultValue={activeWorkItem.status}
                          valueState="information"
                          message="Detail forms continue to reuse the same field wrapper and value-state model."
                        />
                      </FormField>
                    </FormGrid>
                  </div>
                ),
              }}
              secondaryWidth="wide"
              tertiary={{
                title: "Context pane",
                description: "Related signals and follow-up work live beside the main detail, not inside it.",
                toolbar: (
                  <Button variant="transparent" onClick={() => setActiveSplitPane("tertiary")}>
                    Focus context
                  </Button>
                ),
                content: (
                  <div className="docs-split-context">
                    <NotificationList
                      heading="Related notifications"
                      items={inboxItems.map((item) => ({
                        ...item,
                        action: <Button variant="transparent">Open</Button>,
                      }))}
                    />

                    <Card
                      eyebrow="Pane rhythm"
                      heading="Asymmetric by default"
                      description="Primary, detail and context panes should not compete for equal emphasis."
                    >
                      <div className="docs-feedback-stack">
                        <span className="docs-feedback-line">
                          Primary pane for scan and selection.
                        </span>
                        <span className="docs-feedback-line">
                          Secondary pane for editing and review.
                        </span>
                        <span className="docs-feedback-line">
                          Tertiary pane for related signals and follow-up.
                        </span>
                      </div>
                    </Card>
                  </div>
                ),
              }}
            />
          </PageSection>
        </div>
      </AppShell>

      <Dialog
        actions={
          <>
            <Button variant="transparent" onClick={closeSaveVariantDialog}>
              Cancel
            </Button>
            {activeSavedVariant ? (
              <Button
                disabled={!canSaveVariant}
                variant="default"
                onClick={() => saveCurrentVariant("update")}
              >
                Update current
              </Button>
            ) : null}
            <Button
              disabled={!canSaveVariant}
              variant="emphasized"
              onClick={() => saveCurrentVariant("create")}
            >
              {activeSavedVariant ? "Save as new" : "Save view"}
            </Button>
          </>
        }
        closeOnOverlayClick
        description="Capture the current filter, column, sort, group and page-size state as a local worklist view."
        footerStart={
          <span className="docs-dialog-note">
            {activeSavedVariant
              ? "Updating keeps this saved view selected and refreshes its stored snapshot."
              : "Saved views stay in localStorage for this browser so refreshes keep the same workbench setup."}
          </span>
        }
        onClose={closeSaveVariantDialog}
        open={saveVariantDialogOpen}
        size="md"
        title="Save worklist view"
        tone="information"
      >
        <FormGrid columns={2}>
          <FormField
            description="Shown in the variant strip above the filter bar."
            htmlFor="variant-name"
            label="View name"
            required
          >
            <Input
              id="variant-name"
              message={!canSaveVariant ? "A saved view needs a name." : undefined}
              value={variantFormState.label}
              valueState={!canSaveVariant ? "error" : "none"}
              onChange={(event) => updateVariantForm("label", event.target.value)}
            />
          </FormField>

          <FormField
            description="Optional context for the saved queue or review mode."
            htmlFor="variant-description"
            label="Description"
          >
            <Input
              id="variant-description"
              placeholder="Compact handoff, release queue, morning review..."
              value={variantFormState.description}
              onChange={(event) => updateVariantForm("description", event.target.value)}
            />
          </FormField>

          <FormField
            description="This snapshot is taken from the current draft filter state and active table personalization."
            hint="Selecting the saved view later will restore these settings together."
            htmlFor="variant-snapshot"
            label="Snapshot"
            span={2}
          >
            <div className="docs-variant-snapshot" id="variant-snapshot">
              <span className="docs-filter-chip">
                Search: {currentVariantPreset.filters.search || "All"}
              </span>
              <span className="docs-filter-chip">
                Owners: {formatWorklistOwnersLabel(currentVariantPreset.filters.owners)}
              </span>
              <span className="docs-filter-chip">
                Priority: {currentVariantPreset.filters.priority || "All"}
              </span>
              <span className="docs-filter-chip">
                Columns: {currentVariantPreset.filters.visibleColumnIds.length}
              </span>
              <span className="docs-filter-chip">
                Sort: {tableSort ? `${getWorklistSortLabel(tableSort)} ${tableSort.direction}` : "None"}
              </span>
              <span className="docs-filter-chip">
                Group: {getWorklistGroupLabel(activeGroupBy)}
              </span>
              <span className="docs-filter-chip">Page size: {pageSize}</span>
            </div>
          </FormField>
        </FormGrid>
      </Dialog>

      <Dialog
        actions={
          <>
            <Button variant="transparent" onClick={openExportVariantsDialog}>
              Export JSON
            </Button>
            <Button variant="default" onClick={openImportVariantsDialog}>
              Import JSON
            </Button>
            <Button
              variant="emphasized"
              onClick={() => setManageVariantsDialogOpen(false)}
            >
              Close
            </Button>
          </>
        }
        closeOnOverlayClick
        description="Saved views are stored locally in this browser and can be re-applied or removed without touching the built-in presets."
        footerStart={
          <span className="docs-dialog-note">
            Built-in presets stay fixed. Local views capture your current worklist setup, and the startup view currently points to {startupVariantLabel}.
          </span>
        }
        onClose={() => setManageVariantsDialogOpen(false)}
        open={manageVariantsDialogOpen}
        size="lg"
        title="Manage local views"
        tone="information"
      >
        <VariantSyncPanel
          actions={
            <>
              <Button
                selected={remoteAdapterMode === "local-storage"}
                variant="transparent"
                onClick={() => setRemoteAdapterMode("local-storage")}
              >
                localStorage
              </Button>
              <Button
                selected={remoteAdapterMode === "session-storage"}
                variant="transparent"
                onClick={() => setRemoteAdapterMode("session-storage")}
              >
                sessionStorage
              </Button>
              <Button
                selected={remoteAdapterMode === "memory"}
                variant="transparent"
                onClick={() => setRemoteAdapterMode("memory")}
              >
                Memory
              </Button>
              {remoteAutoRefreshOptions.map((intervalMs) => (
                <Button
                  key={intervalMs}
                  selected={remoteAutoRefreshMs === intervalMs}
                  variant="transparent"
                  onClick={() => setRemoteAutoRefreshMs(intervalMs)}
                >
                  Watch {formatRemoteWatchLabel(intervalMs)}
                </Button>
              ))}
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={() => void simulateRemoteViewDrift()}
              >
                Drift view
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={() => void simulateRemoteStartupDrift()}
              >
                Drift startup
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={() => void simulateRemoteClearDrift()}
              >
                Drift clear
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="default"
                onClick={pushSavedVariantsToMockCloud}
              >
                Push to mock cloud
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={refreshSavedVariantsFromMockCloud}
              >
                Refresh remote
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={() => void clearVariantSyncRemoteSnapshot()}
              >
                Clear remote
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={clearVariantSyncActivities}
              >
                Clear history
              </Button>
              <Button
                disabled={variantSyncState.status !== "idle"}
                variant="transparent"
                onClick={pullSavedVariantsFromMockCloud}
              >
                Pull from mock cloud
              </Button>
            </>
          }
          meta={
            <>
              <span className="docs-filter-chip">
                Remote: {formatRemoteSnapshotLabel(remoteVariantSnapshot)}
              </span>
              <span className="docs-filter-chip">
                Adapter: {activeRemoteAdapterLabel}
              </span>
              <span className="docs-filter-chip">
                Checked: {formatRemoteCheckTimestamp(variantSyncRemoteCheckState.checkedAt)}
              </span>
              <span className="docs-filter-chip">
                Trigger: {formatRemoteCheckTrigger(variantSyncRemoteCheckState.trigger)}
              </span>
              <span className="docs-filter-chip">
                Watch: {formatRemoteWatchLabel(remoteAutoRefreshMs)}
              </span>
              {remoteDriftNotice ? (
                <span className="docs-filter-chip">Lab: Pending remote drift</span>
              ) : null}
              <span className="docs-filter-chip">
                Activity: {activeVariantSyncActivities.length}
              </span>
              <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
              <span className="docs-filter-chip">Sync: {remoteSyncStatusLabel}</span>
              <span className="docs-filter-chip">
                Status: {variantSyncState.status === "idle" ? "Ready" : variantSyncState.status}
              </span>
              {variantSyncRemoteCheckState.errorMessage ? (
                <span className="docs-filter-chip">
                  Check error: {variantSyncRemoteCheckState.errorMessage}
                </span>
              ) : null}
            </>
          }
          note={
            <span className="docs-dialog-note">
              {remoteDriftNotice ??
                variantSyncState.message ??
                `Use the mock cloud buttons to simulate syncing saved views through the ${activeRemoteAdapterLabel} adapter.`}
            </span>
          }
        />
        <VariantSyncActivityList
          activities={activeVariantSyncActivities}
          emptyState={`No sync activity has been logged for the ${activeRemoteAdapterLabel} adapter yet.`}
        />
        <VariantSyncComparisonSummary
          comparison={variantSyncReviewState?.comparison ?? undefined}
          heading="Current sync shape"
          localLabel="Local snapshot"
          localUpdatedAt={localVariantSnapshot.updatedAt}
          remoteLabel={activeRemoteAdapterLabel}
          remoteUpdatedAt={remoteVariantSnapshot?.updatedAt}
          statusLabel={remoteSyncStatusLabel}
        />
        <div className="docs-sync-snapshot-grid">
          <VariantSyncSnapshotList
            heading="Local snapshot"
            snapshot={localVariantSnapshot}
          />
          <VariantSyncSnapshotList
            emptyState={`No remote snapshot is currently stored in ${activeRemoteAdapterLabel}.`}
            heading={`Remote snapshot in ${activeRemoteAdapterLabel}`}
            snapshot={remoteVariantSnapshot}
          />
        </div>

        {savedWorklistVariants.length === 0 ? (
          <div className="docs-saved-variant-empty">
            Save the current worklist state to create your first local variant, or import a JSON payload from another browser profile.
          </div>
        ) : (
          <div className="docs-saved-variant-list">
            {savedWorklistVariants.map((variant, index) => {
              const selected = variant.key === activeVariant;
              const startup = variant.key === startupVariantKey;
              const canMoveUp = index > 0;
              const canMoveDown = index < savedWorklistVariants.length - 1;

              return (
                <article
                  key={variant.key}
                  className="docs-saved-variant-card"
                  data-selected={selected}
                >
                  <div className="docs-saved-variant-card__header">
                    <div className="docs-saved-variant-card__title">
                      <strong>{variant.label}</strong>
                      <span className="docs-variant-kind" data-kind="saved">
                        Local
                      </span>
                      {selected ? (
                        <span className="docs-variant-kind" data-kind="active">
                          Active
                        </span>
                      ) : null}
                      {startup ? (
                        <span className="docs-variant-kind" data-kind="startup">
                          Startup
                        </span>
                      ) : null}
                    </div>
                    <span className="docs-saved-variant-card__meta">
                      {formatSavedVariantTimestamp(variant.updatedAt)}
                    </span>
                  </div>

                  <p className="docs-saved-variant-card__description">
                    {variant.description || "No description added yet for this local worklist view."}
                  </p>

                  <div className="docs-saved-variant-card__chips">
                    <span className="docs-filter-chip">
                      Matches: {formatWorklistVariantCount(countWorkItemsForFilters(variant.preset.filters))}
                    </span>
                    <span className="docs-filter-chip">
                      Sort: {variant.preset.sort ? `${getWorklistSortLabel(variant.preset.sort)} ${variant.preset.sort.direction}` : "None"}
                    </span>
                    <span className="docs-filter-chip">
                      Group: {getWorklistGroupLabel(variant.preset.groupBy)}
                    </span>
                    <span className="docs-filter-chip">
                      Columns: {variant.preset.filters.visibleColumnIds.length}
                    </span>
                    <span className="docs-filter-chip">
                      Page size: {variant.preset.pageSize ?? 3}
                    </span>
                    <span className="docs-filter-chip">
                      Order: {index + 1} / {savedWorklistVariants.length}
                    </span>
                  </div>

                  <div className="docs-saved-variant-card__actions">
                    <Button
                      variant="default"
                      onClick={() => {
                        applyVariantSelection(variant.key);
                        setManageVariantsDialogOpen(false);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="transparent"
                      onClick={() => duplicateSavedVariant(variant)}
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="transparent"
                      onClick={() => openRenameVariantDialog(variant)}
                    >
                      Rename
                    </Button>
                    <Button
                      disabled={!canMoveUp}
                      variant="transparent"
                      onClick={() => moveSavedVariant(variant.key, -1)}
                    >
                      Move up
                    </Button>
                    <Button
                      disabled={!canMoveDown}
                      variant="transparent"
                      onClick={() => moveSavedVariant(variant.key, 1)}
                    >
                      Move down
                    </Button>
                    <Button
                      selected={startup}
                      variant="transparent"
                      onClick={() => setStartupVariantKey(variant.key)}
                    >
                      Set startup
                    </Button>
                    <Button
                      variant="negative"
                      onClick={() => deleteSavedVariant(variant.key)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Dialog>

      <VariantSyncDialog
        applyMergeLabel="Apply reviewed merge"
        closeOnOverlayClick
        description={
          variantSyncReviewState?.direction === "push"
            ? "Remote saved views changed since the last local snapshot. Review the differences before overwriting mock cloud state."
            : "Local saved views changed since the last remote snapshot. Review the differences before replacing your local workspace."
        }
        direction={variantSyncReviewState?.direction}
        footerNote={
          <span className="docs-dialog-note">
            Merge keeps your local working copy and adds remote changes on top. Overwrite or replace uses one side as the source of truth.
          </span>
        }
        open={variantSyncReviewState !== null}
        resolveLabel={
          variantSyncReviewState?.direction === "push"
            ? "Overwrite remote"
            : "Replace local"
        }
        reviewProps={{
          localPanelMeta: (
            <>
              <span className="docs-filter-chip">
                Views: {savedWorklistVariants.length}
              </span>
              <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
              <span className="docs-filter-chip">
                Last local update: {formatSavedVariantTimestamp(localVariantSnapshot.updatedAt)}
              </span>
            </>
          ),
          message:
            variantSyncReviewState?.direction === "push"
              ? "Overwriting remote will replace the mock cloud snapshot with your current local views and startup preference."
              : "Replacing local will swap your current saved views for the remote snapshot and update the startup preference if needed.",
          messageHeadline:
            variantSyncReviewState?.comparison.status === "diverged"
              ? "Local and remote both changed"
              : variantSyncReviewState?.direction === "push"
                ? "Remote contains newer differences"
                : "Local contains newer differences",
          meta: (
            <>
              <span className="docs-filter-chip">
                Direction: {variantSyncReviewState?.direction === "push" ? "Local -> Remote" : "Remote -> Local"}
              </span>
              <span className="docs-filter-chip">
                Local only: {variantSyncReviewState?.comparison.localOnlyKeys.length ?? 0}
              </span>
              <span className="docs-filter-chip">
                Remote only: {variantSyncReviewState?.comparison.remoteOnlyKeys.length ?? 0}
              </span>
              <span className="docs-filter-chip">
                Changed: {variantSyncReviewState?.comparison.changedKeys.length ?? 0}
              </span>
              <span className="docs-filter-chip">
                Startup changed: {variantSyncReviewState?.comparison.startupChanged ? "Yes" : "No"}
              </span>
              <span className="docs-filter-chip">
                Order changed: {variantSyncReviewState?.comparison.orderChanged ? "Yes" : "No"}
              </span>
            </>
          ),
          remotePanelMeta: (
            <>
              <span className="docs-filter-chip">
                Views: {variantSyncReviewState?.remoteSnapshot.variants.length ?? 0}
              </span>
              <span className="docs-filter-chip">
                Startup: {variantSyncReviewState
                  ? getWorklistVariantLabel(
                      variantSyncReviewState.remoteSnapshot.startupVariantKey,
                      variantSyncReviewState.remoteSnapshot.variants,
                    )
                  : "Standard"}
              </span>
              <span className="docs-filter-chip">
                Last remote update: {variantSyncReviewState
                  ? formatSavedVariantTimestamp(
                      variantSyncReviewState.remoteSnapshot.updatedAt,
                    )
                  : "Remote snapshot"}
              </span>
            </>
          ),
          remotePanelTitle: "Mock cloud",
          sections: variantSyncSections,
          workspaceCards: variantSyncWorkspaceCards,
        }}
        title={
          variantSyncReviewState?.direction === "push"
            ? "Review cloud overwrite"
            : "Review local overwrite"
        }
        onApplyMerge={applyReviewedVariantMerge}
        onClose={closeVariantSyncReviewDialog}
        onResolve={() =>
          variantSyncReviewState?.direction === "push"
            ? void overwriteRemoteAfterSyncReview()
            : replaceLocalAfterSyncReview()
        }
      />

      <Dialog
        actions={
          <>
            <Button variant="transparent" onClick={closeRenameVariantDialog}>
              Cancel
            </Button>
            <Button
              disabled={!canRenameVariant}
              variant="emphasized"
              onClick={saveRenamedVariant}
            >
              Save label
            </Button>
          </>
        }
        closeOnOverlayClick
        description="Rename the saved view and adjust its description without changing the stored filters, sort, grouping or page-size snapshot."
        footerStart={
          <span className="docs-dialog-note">
            Metadata updates keep the saved payload intact, so worklist behavior stays the same.
          </span>
        }
        onClose={closeRenameVariantDialog}
        open={renameVariantFormState !== null}
        size="md"
        title="Rename local view"
        tone="information"
      >
        <FormGrid columns={2}>
          <FormField
            description="Shown in the variant strip and management list."
            htmlFor="rename-variant-name"
            label="View name"
            required
          >
            <Input
              id="rename-variant-name"
              message={!canRenameVariant ? "A saved view needs a name." : undefined}
              value={renameVariantFormState?.label ?? ""}
              valueState={!canRenameVariant ? "error" : "none"}
              onChange={(event) => updateRenameVariantForm("label", event.target.value)}
            />
          </FormField>

          <FormField
            description="Optional context for the saved view."
            htmlFor="rename-variant-description"
            label="Description"
          >
            <Input
              id="rename-variant-description"
              placeholder="Morning handoff, release queue, attention triage..."
              value={renameVariantFormState?.description ?? ""}
              onChange={(event) =>
                updateRenameVariantForm("description", event.target.value)
              }
            />
          </FormField>
        </FormGrid>
      </Dialog>

      <Dialog
        actions={
          <>
            <Button variant="transparent" onClick={closeVariantTransferDialog}>
              Close
            </Button>
            {variantTransferState?.mode === "import" ? (
              <Button
                disabled={!canImportSavedVariants}
                variant="emphasized"
                onClick={importSavedVariants}
              >
                Merge saved views
              </Button>
            ) : null}
          </>
        }
        closeOnOverlayClick
        description={
          variantTransferState?.mode === "export"
            ? "Copy this payload to move your local views and startup preference into another AxiomUI workspace."
            : "Paste a JSON payload exported from another AxiomUI workspace. Imported keys will overwrite local views with the same key."
        }
        footerStart={
          <span className="docs-dialog-note">
            {variantTransferState?.mode === "export"
              ? "The export includes saved local views plus the current startup view key."
              : variantTransferState?.error ?? "Only valid saved view entries are merged into the current browser profile."}
          </span>
        }
        onClose={closeVariantTransferDialog}
        open={variantTransferState !== null}
        size="lg"
        title={
          variantTransferState?.mode === "export"
            ? "Export local views"
            : "Import local views"
        }
        tone={variantTransferState?.error ? "warning" : "information"}
      >
        <div className="docs-variant-transfer">
          <div className="docs-variant-transfer__meta">
            <span className="docs-filter-chip">Saved views: {savedWorklistVariants.length}</span>
            <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
            <span className="docs-filter-chip">
              Mode: {variantTransferState?.mode === "export" ? "Export" : "Import"}
            </span>
          </div>
          <textarea
            className="docs-variant-transfer__textarea"
            readOnly={variantTransferState?.mode === "export"}
            value={variantTransferState?.value ?? ""}
            onChange={(event) => updateVariantTransferValue(event.target.value)}
          />
        </div>
      </Dialog>

      <Dialog
        actions={
          <>
            <Button variant="transparent" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="emphasized" onClick={() => setDialogOpen(false)}>
              Save workspace
            </Button>
          </>
        }
        closeOnOverlayClick
        description="Header, content and footer are kept separate so dense business workflows do not collapse into one long content block."
        footerStart={<span className="docs-dialog-note">Draft is stored locally.</span>}
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
        size="lg"
        title="Create workspace flow"
        tone="information"
      >
        <FormGrid columns={2}>
          <FormField
            description="Primary workspace title"
            htmlFor="dialog-name"
            label="Name"
            required
          >
            <Input id="dialog-name" placeholder="AxiomUI Operations Shell" />
          </FormField>

          <FormField
            description="Header toolbar owner"
            htmlFor="dialog-team"
            label="Team"
          >
            <Input id="dialog-team" placeholder="Design Systems" />
          </FormField>

          <FormField
            description="Value-state and wrapper logic remain reusable inside the modal."
            htmlFor="dialog-scope"
            hint="Try the same form layout in a page section and a dialog without rewriting spacing rules."
            label="Scope"
            span={2}
          >
            <Input
              id="dialog-scope"
              placeholder="Buttons, rows, tabs, forms and layered layouts"
              valueState="information"
              message="Information accents stay gentle and enterprise-friendly."
            />
          </FormField>
        </FormGrid>
      </Dialog>
      </ThemeProvider>
    </LocaleProvider>
  );
}
