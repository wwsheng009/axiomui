import type { BreadcrumbsItem, ChartTone, ObjectStatusTone } from "@axiomui/react";

export interface ChartLabScenarioCard {
  description: string;
  eyebrow: string;
  heading: string;
  key: string;
}

export interface ChartLabObjectStatusItem {
  key: string;
  label: string;
  tone: ObjectStatusTone;
}

export interface ChartLabDonutSegment {
  description?: string;
  key: string;
  label: string;
  tone: ChartTone;
  value: number;
}

export interface ChartLabLinePoint {
  description?: string;
  key: string;
  label: string;
  tone?: ChartTone;
  value: number;
  valueDisplay?: string;
}

export interface ChartLabHarveySegment {
  description?: string;
  fraction: number;
  key: string;
  label: string;
  tone: ChartTone;
  valueDisplay?: string;
}

export interface ChartLabStackedSegment {
  description?: string;
  key: string;
  label: string;
  series?: number;
  tone?: ChartTone;
  value: number;
  valueDisplay?: string;
}

export interface ChartLabInlineRow {
  actual: number;
  coverageSegments: ChartLabHarveySegment[];
  customer: string;
  forecast: number;
  id: string;
  owner: string;
  readinessSegments: ChartLabDonutSegment[];
  slaDelta: number;
  stageLabel: string;
  status: string;
  statusTone: ObjectStatusTone;
  target: number;
  trendPoints: ChartLabLinePoint[];
  workstreamMix: ChartLabStackedSegment[];
}

export const chartLabWalkthroughSteps = [
  "先看 KPI cards wall，确认图表已经进入真实业务组合，而不是停留在单个组件样例。",
  "再看 Object Page Summary，检查头部摘要区在 theme、density 和 RTL 切换后仍然清晰。",
  "最后看 table/list inline indicators，确认紧凑行内图表不会把表格变成一排小卡片。",
];

export const chartLabScenarioCards: ChartLabScenarioCard[] = [
  {
    key: "kpi-wall",
    eyebrow: "Scenario 01",
    heading: "KPI cards wall",
    description:
      "把 Bullet、Radial、Delta 和 StackedBar 放进统一 KPI 组合层，验证卡片级信息层次。",
  },
  {
    key: "object-summary",
    eyebrow: "Scenario 02",
    heading: "Object page summary",
    description:
      "把 Donut、Line、HarveyBall 和 Radial 放进对象页摘要区，验证高密度头部场景。",
  },
  {
    key: "inline-indicators",
    eyebrow: "Scenario 03",
    heading: "Table and list inline indicators",
    description:
      "把微图表嵌进 DataTable 和 review list 行内，验证紧凑布局下的可读性和语义色稳定性。",
  },
];

export const chartLabObjectBreadcrumbItems: BreadcrumbsItem[] = [
  { key: "portfolio", label: "North America rollout", onClick: () => undefined },
  { key: "program", label: "Order execution", onClick: () => undefined },
  { key: "workspace", label: "Recovery workbench", onClick: () => undefined },
  { key: "object", label: "SO-48291", current: true },
];

export const chartLabObjectStatuses: ChartLabObjectStatusItem[] = [
  {
    key: "readiness",
    label: "In recovery",
    tone: "information",
  },
  {
    key: "hold",
    label: "Credit hold",
    tone: "warning",
  },
  {
    key: "escalation",
    label: "Escalated",
    tone: "error",
  },
];

export const chartLabObjectReadinessSegments: ChartLabDonutSegment[] = [
  {
    key: "ready",
    label: "Ready",
    description: "Fully staffed, quality checked and schedulable",
    tone: "success",
    value: 46,
  },
  {
    key: "watch",
    label: "Watch",
    description: "Recoverable if the owner keeps the current pace",
    tone: "warning",
    value: 34,
  },
  {
    key: "blocked",
    label: "Blocked",
    description: "Needs intervention before the release cut",
    tone: "error",
    value: 20,
  },
];

export const chartLabObjectTrendPoints: ChartLabLinePoint[] = [
  {
    key: "mon",
    label: "Mon",
    description: "Initial backlog before recovery work starts",
    value: 17,
    valueDisplay: "17 cases",
  },
  {
    key: "tue",
    label: "Tue",
    description: "Owner handoff clears the first wave of blockers",
    tone: "information",
    value: 14,
    valueDisplay: "14 cases",
  },
  {
    key: "wed",
    label: "Wed",
    description: "Warehouse slot resets create a temporary slowdown",
    tone: "warning",
    value: 16,
    valueDisplay: "16 cases",
  },
  {
    key: "thu",
    label: "Thu",
    description: "Credit review closes the largest blocking thread",
    tone: "success",
    value: 10,
    valueDisplay: "10 cases",
  },
  {
    key: "fri",
    label: "Fri",
    description: "The order is back within the release guardrail",
    tone: "brand",
    value: 7,
    valueDisplay: "7 cases",
  },
];

export const chartLabObjectCoverageSegments: ChartLabHarveySegment[] = [
  {
    key: "api",
    label: "API orchestration",
    description: "System driven execution path",
    fraction: 0.82,
    tone: "success",
    valueDisplay: "82%",
  },
  {
    key: "manual",
    label: "Manual fallback",
    description: "Specialist review coverage",
    fraction: 0.58,
    tone: "warning",
    valueDisplay: "58%",
  },
  {
    key: "carrier",
    label: "Carrier readiness",
    description: "Downstream logistics confirmation",
    fraction: 0.71,
    tone: "information",
    valueDisplay: "71%",
  },
];

export const chartLabInlineRows: ChartLabInlineRow[] = [
  {
    id: "SO-48291",
    customer: "ACME Retail Group",
    owner: "Mia Chen",
    stageLabel: "Escalation lane",
    status: "Credit hold",
    statusTone: "warning",
    actual: 68,
    target: 80,
    forecast: 74,
    slaDelta: -2.4,
    coverageSegments: [
      {
        key: "api",
        label: "API",
        fraction: 0.75,
        tone: "brand",
        valueDisplay: "75%",
      },
      {
        key: "ops",
        label: "Ops",
        fraction: 0.5,
        tone: "warning",
        valueDisplay: "50%",
      },
    ],
    workstreamMix: [
      {
        key: "committed",
        label: "Committed",
        tone: "success",
        value: 42,
        valueDisplay: "42%",
      },
      {
        key: "projected",
        label: "Projected",
        tone: "information",
        value: 26,
        valueDisplay: "26%",
      },
      {
        key: "watch",
        label: "Watch",
        tone: "warning",
        value: 14,
        valueDisplay: "14%",
      },
    ],
    readinessSegments: [
      {
        key: "ready",
        label: "Ready",
        tone: "success",
        value: 44,
      },
      {
        key: "watch",
        label: "Watch",
        tone: "warning",
        value: 31,
      },
      {
        key: "blocked",
        label: "Blocked",
        tone: "error",
        value: 25,
      },
    ],
    trendPoints: [
      { key: "d1", label: "D1", value: 19, valueDisplay: "19 items" },
      { key: "d2", label: "D2", value: 18, tone: "warning", valueDisplay: "18 items" },
      { key: "d3", label: "D3", value: 14, tone: "information", valueDisplay: "14 items" },
      { key: "d4", label: "D4", value: 11, tone: "success", valueDisplay: "11 items" },
    ],
  },
  {
    id: "SO-48312",
    customer: "Northwind Stores",
    owner: "Jordan Wu",
    stageLabel: "Release ready",
    status: "In process",
    statusTone: "information",
    actual: 82,
    target: 84,
    forecast: 87,
    slaDelta: 1.8,
    coverageSegments: [
      {
        key: "api",
        label: "API",
        fraction: 0.88,
        tone: "success",
        valueDisplay: "88%",
      },
      {
        key: "ops",
        label: "Ops",
        fraction: 0.7,
        tone: "information",
        valueDisplay: "70%",
      },
    ],
    workstreamMix: [
      {
        key: "committed",
        label: "Committed",
        tone: "success",
        value: 58,
        valueDisplay: "58%",
      },
      {
        key: "projected",
        label: "Projected",
        tone: "information",
        value: 19,
        valueDisplay: "19%",
      },
      {
        key: "watch",
        label: "Watch",
        tone: "warning",
        value: 8,
        valueDisplay: "8%",
      },
    ],
    readinessSegments: [
      {
        key: "ready",
        label: "Ready",
        tone: "success",
        value: 61,
      },
      {
        key: "watch",
        label: "Watch",
        tone: "warning",
        value: 24,
      },
      {
        key: "blocked",
        label: "Blocked",
        tone: "neutral",
        value: 15,
      },
    ],
    trendPoints: [
      { key: "d1", label: "D1", value: 11, valueDisplay: "11 items" },
      { key: "d2", label: "D2", value: 10, tone: "information", valueDisplay: "10 items" },
      { key: "d3", label: "D3", value: 8, tone: "success", valueDisplay: "8 items" },
      { key: "d4", label: "D4", value: 6, tone: "success", valueDisplay: "6 items" },
    ],
  },
  {
    id: "SO-48327",
    customer: "Alpine Medical",
    owner: "Nora Patel",
    stageLabel: "Wave picked",
    status: "On track",
    statusTone: "success",
    actual: 91,
    target: 88,
    forecast: 94,
    slaDelta: 4.6,
    coverageSegments: [
      {
        key: "api",
        label: "API",
        fraction: 0.92,
        tone: "success",
        valueDisplay: "92%",
      },
      {
        key: "ops",
        label: "Ops",
        fraction: 0.81,
        tone: "brand",
        valueDisplay: "81%",
      },
    ],
    workstreamMix: [
      {
        key: "committed",
        label: "Committed",
        tone: "success",
        value: 64,
        valueDisplay: "64%",
      },
      {
        key: "projected",
        label: "Projected",
        tone: "information",
        value: 20,
        valueDisplay: "20%",
      },
      {
        key: "watch",
        label: "Watch",
        tone: "neutral",
        value: 7,
        valueDisplay: "7%",
      },
    ],
    readinessSegments: [
      {
        key: "ready",
        label: "Ready",
        tone: "success",
        value: 69,
      },
      {
        key: "watch",
        label: "Watch",
        tone: "information",
        value: 19,
      },
      {
        key: "blocked",
        label: "Blocked",
        tone: "neutral",
        value: 12,
      },
    ],
    trendPoints: [
      { key: "d1", label: "D1", value: 8, valueDisplay: "8 items" },
      { key: "d2", label: "D2", value: 6, tone: "success", valueDisplay: "6 items" },
      { key: "d3", label: "D3", value: 5, tone: "success", valueDisplay: "5 items" },
      { key: "d4", label: "D4", value: 4, tone: "brand", valueDisplay: "4 items" },
    ],
  },
  {
    id: "SO-48339",
    customer: "Contoso Distribution",
    owner: "Elias Romero",
    stageLabel: "Manual review",
    status: "Escalated",
    statusTone: "error",
    actual: 54,
    target: 72,
    forecast: 61,
    slaDelta: -6.2,
    coverageSegments: [
      {
        key: "api",
        label: "API",
        fraction: 0.41,
        tone: "warning",
        valueDisplay: "41%",
      },
      {
        key: "ops",
        label: "Ops",
        fraction: 0.33,
        tone: "error",
        valueDisplay: "33%",
      },
    ],
    workstreamMix: [
      {
        key: "committed",
        label: "Committed",
        tone: "success",
        value: 26,
        valueDisplay: "26%",
      },
      {
        key: "projected",
        label: "Projected",
        tone: "warning",
        value: 21,
        valueDisplay: "21%",
      },
      {
        key: "watch",
        label: "Watch",
        tone: "error",
        value: 18,
        valueDisplay: "18%",
      },
    ],
    readinessSegments: [
      {
        key: "ready",
        label: "Ready",
        tone: "success",
        value: 29,
      },
      {
        key: "watch",
        label: "Watch",
        tone: "warning",
        value: 27,
      },
      {
        key: "blocked",
        label: "Blocked",
        tone: "error",
        value: 44,
      },
    ],
    trendPoints: [
      { key: "d1", label: "D1", value: 24, valueDisplay: "24 items" },
      { key: "d2", label: "D2", value: 22, tone: "warning", valueDisplay: "22 items" },
      { key: "d3", label: "D3", value: 21, tone: "warning", valueDisplay: "21 items" },
      { key: "d4", label: "D4", value: 18, tone: "information", valueDisplay: "18 items" },
    ],
  },
];
