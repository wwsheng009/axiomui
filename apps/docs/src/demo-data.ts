import type {
  ColumnManagerItem,
  DateRangeValue,
  GroupManagerItem,
  SortManagerItem,
  TableSort,
  VariantSyncSnapshot,
} from "@axiomui/react";

export interface WorkItem {
  id: string;
  object: string;
  owner: string;
  priority: "Positive" | "Information" | "Attention" | "Negative";
  status: string;
  targetDate: string;
  targetTime: string;
  wave: string;
  region: string;
}

export interface InboxItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone: "information" | "success" | "warning" | "error";
  unread?: boolean;
}

export type BuiltInWorklistVariantKey =
  | "standard"
  | "compact-review"
  | "attention-queue";
export type WorklistVariantKey = string;
export type WorklistGroupKey = "owner" | "priority" | "status" | "wave" | "region";
export type RemoteAdapterMode = "local-storage" | "session-storage" | "memory";

export interface WorklistFilters {
  search: string;
  keywords: string[];
  owners: string[];
  targetDateRange: DateRangeValue;
  targetTimeFrom: string;
  priority: string;
  status: string;
  wave: string;
  region: string;
  visibleColumnIds: string[];
}

export interface WorklistVariantPreset {
  filters: WorklistFilters;
  sort: TableSort | undefined;
  pageSize?: number;
  groupBy?: WorklistGroupKey;
}

export type MockRemoteVariantSnapshot = VariantSyncSnapshot<
  WorklistVariantPreset,
  WorklistVariantKey
>;

export const workItems: WorkItem[] = [
  {
    id: "AX-1024",
    object: "Dynamic Page shell migration",
    owner: "Mia Chen",
    priority: "Information",
    status: "Ready for review",
    targetDate: "2026-04-08",
    targetTime: "09:30",
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
    targetTime: "13:30",
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
    targetTime: "17:00",
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
    targetTime: "11:15",
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
    targetTime: "15:45",
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
    targetTime: "08:00",
    wave: "Q2 2026",
    region: "NA rollout",
  },
];

export const inboxItems: InboxItem[] = [
  {
    id: "N-100",
    title: "Shell header review available",
    description:
      "The second-level workspace header now aligns with the page action rhythm.",
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
    description:
      "Anchor labels are structurally correct but still need content review.",
    meta: "1 hour ago",
    tone: "warning",
    unread: true,
  },
];

export const releaseChannelSelectItems = [
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

export const releaseStatusSelectItems = [
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

export const priorityFilterSelectItems = [
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

export const ownerComboBoxItems = [
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

export const builtInWorklistVariantKeys: BuiltInWorklistVariantKey[] = [
  "standard",
  "compact-review",
  "attention-queue",
];

export const builtInWorklistVariantMeta: Record<
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

export const variantPresets: Record<
  BuiltInWorklistVariantKey,
  WorklistVariantPreset
> = {
  standard: {
    filters: {
      search: "",
      keywords: [],
      owners: [],
      targetDateRange: { start: "", end: "" },
      targetTimeFrom: "",
      priority: "",
      status: "",
      wave: "Q2 2026",
      region: "",
      visibleColumnIds: ["object", "owner", "schedule", "priority", "status"],
    },
    sort: { columnId: "object", direction: "asc" },
    pageSize: 3,
  },
  "compact-review": {
    filters: {
      search: "",
      keywords: [],
      owners: ["Avery Kim"],
      targetDateRange: { start: "", end: "" },
      targetTimeFrom: "",
      priority: "Positive",
      status: "Stable",
      wave: "",
      region: "",
      visibleColumnIds: ["object", "schedule", "priority", "status"],
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
      targetDateRange: { start: "", end: "" },
      targetTimeFrom: "",
      priority: "Attention",
      status: "",
      wave: "Q2 2026",
      region: "",
      visibleColumnIds: ["object", "owner", "schedule", "priority"],
    },
    sort: { columnId: "priority", direction: "desc" },
    pageSize: 2,
    groupBy: "priority",
  },
};

export const worklistPageSizeOptions = [2, 3, 5];
export const worklistPersistenceStorageKey = "axiomui-docs-worklist-state";
export const worklistPersistenceVersion = 1;
export const worklistGroupStorageKey = "axiomui-docs-worklist-group";
export const worklistSavedVariantsStorageKey =
  "axiomui-docs-worklist-saved-variants";
export const worklistSavedVariantsVersion = 1;
export const worklistStartupVariantStorageKey =
  "axiomui-docs-worklist-startup-variant";
export const worklistMockRemoteVariantsStorageKey =
  "axiomui-docs-worklist-mock-remote-variants";
export const worklistMockSessionVariantsStorageKey =
  "axiomui-docs-worklist-session-remote-variants";
export const worklistSyncActivityStorageKeys: Record<RemoteAdapterMode, string> =
  {
    "local-storage": "axiomui-docs-worklist-sync-activity-local",
    "session-storage": "axiomui-docs-worklist-sync-activity-session",
    memory: "axiomui-docs-worklist-sync-activity-memory",
  };
export const worklistSyncActivityVersion = 1;
export const remoteAutoRefreshOptions = [0, 5000, 15000];
export const worklistGroupIds: WorklistGroupKey[] = [
  "owner",
  "priority",
  "status",
  "wave",
  "region",
];
export const worklistColumnItems: ColumnManagerItem[] = [
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
    id: "schedule",
    label: "Schedule",
    description: "Target date and time for the work item.",
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
export const worklistSortItems: SortManagerItem[] = [
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
    id: "schedule",
    label: "Schedule",
    description: "Chronological ordering by scheduled date and time.",
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
export const worklistGroupItems: GroupManagerItem[] = [
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
export const allWorklistColumnIds = worklistColumnItems.map((item) => item.id);
