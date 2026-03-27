import { useState } from "react";

import {
  Avatar,
  Breadcrumbs,
  BulletMicroChart,
  Button,
  Card,
  DataTable,
  DeltaMicroChart,
  HarveyBallMicroChart,
  InteractiveDonutChart,
  InteractiveLineChart,
  KpiCard,
  ObjectIdentifier,
  ObjectPageHeader,
  ObjectStatus,
  PageSection,
  RadialMicroChart,
  StackedBarMicroChart,
  formatChartValueText,
  type DataTableColumn,
  type TableRowTone,
} from "@axiomui/react";

import {
  chartLabInlineRows,
  chartLabObjectBreadcrumbItems,
  chartLabObjectCoverageSegments,
  chartLabObjectReadinessSegments,
  chartLabObjectStatuses,
  chartLabObjectTrendPoints,
  chartLabScenarioCards,
  chartLabWalkthroughSteps,
  type ChartLabInlineRow,
} from "./chart-lab-data";

function getRowTone(statusTone: ChartLabInlineRow["statusTone"]): TableRowTone {
  if (statusTone === "success") {
    return "positive";
  }

  if (statusTone === "warning") {
    return "warning";
  }

  if (statusTone === "error") {
    return "negative";
  }

  if (statusTone === "information") {
    return "information";
  }

  return "default";
}

function renderInlineBullet(row: ChartLabInlineRow) {
  return (
    <div className="docs-chart-lab-inline-chart" data-kind="bullet">
      <BulletMicroChart
        actual={row.actual}
        ariaLabel={`${row.id} attainment actual ${row.actual} target ${row.target} forecast ${row.forecast}`}
        forecast={row.forecast}
        max={100}
        ranges={[
          {
            key: "risk",
            tone: "error",
            value: 45,
          },
          {
            key: "watch",
            tone: "warning",
            value: 75,
          },
          {
            key: "healthy",
            tone: "success",
            value: 100,
          },
        ]}
        showLabels={false}
        size="sm"
        target={row.target}
        value={formatChartValueText(row.actual, { suffix: "%" })}
      />
    </div>
  );
}

function renderInlineCoverage(row: ChartLabInlineRow) {
  return (
    <div className="docs-chart-lab-inline-chart" data-kind="coverage">
      <HarveyBallMicroChart
        ariaLabel={`${row.id} coverage indicators`}
        segments={row.coverageSegments}
        size="sm"
        value={`${row.coverageSegments.length} lanes`}
      />
    </div>
  );
}

function renderInlineMix(row: ChartLabInlineRow) {
  return (
    <div className="docs-chart-lab-inline-chart" data-kind="mix">
      <StackedBarMicroChart
        ariaLabel={`${row.id} workstream mix`}
        labelMode="none"
        segments={row.workstreamMix}
        size="sm"
        total={100}
        value="Mix"
      />
    </div>
  );
}

function renderInlineDelta(row: ChartLabInlineRow) {
  return (
    <div className="docs-chart-lab-inline-chart" data-kind="delta">
      <DeltaMicroChart
        ariaLabel={`${row.id} SLA delta ${row.slaDelta}`}
        scaleMax={8}
        size="sm"
        status={row.slaDelta >= 0 ? "success" : "warning"}
        value={row.slaDelta}
        valueDisplay={formatChartValueText(row.slaDelta, {
          maximumFractionDigits: 1,
          signDisplay: "exceptZero",
          suffix: " hrs",
        })}
      />
    </div>
  );
}

const inlineIndicatorColumns: Array<DataTableColumn<ChartLabInlineRow>> = [
  {
    id: "object",
    header: "Object",
    width: "20rem",
    accessor: (row) => (
      <div className="docs-chart-lab-object-cell">
        <ObjectIdentifier
          meta={`${row.owner} · ${row.stageLabel}`}
          subtitle={row.customer}
          title={row.id}
        />
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    width: "10rem",
    accessor: (row) => (
      <div className="docs-chart-lab-status-cell">
        <ObjectStatus label={row.status} tone={row.statusTone} />
      </div>
    ),
  },
  {
    id: "attainment",
    header: "Attainment",
    width: "12rem",
    accessor: renderInlineBullet,
  },
  {
    id: "coverage",
    header: "Coverage",
    width: "11rem",
    accessor: renderInlineCoverage,
  },
  {
    id: "mix",
    header: "Mix",
    width: "11rem",
    accessor: renderInlineMix,
  },
  {
    id: "delta",
    header: "SLA delta",
    width: "10rem",
    accessor: renderInlineDelta,
  },
];

export function ChartLabDemoSections() {
  const [activeInlineRowId, setActiveInlineRowId] = useState(
    chartLabInlineRows[0]?.id ?? "",
  );
  const activeInlineRow =
    chartLabInlineRows.find((row) => row.id === activeInlineRowId) ??
    chartLabInlineRows[0];

  return (
    <>
      <PageSection
        heading="Chart Lab"
        description="独立 Chart Lab 开始承接 Sprint 5 的业务验收场景。这里不再只展示单个组件，而是直接验证 KPI cards、对象页摘要和 table/list inline indicators。"
        actions={
          <div className="docs-toggle-row">
            <span className="docs-pill">3 business scenarios</span>
            <span className="docs-pill">Theme and density aware</span>
            <span className="docs-pill">RTL ready</span>
          </div>
        }
      >
        <div className="docs-chart-lab-hero">
          <Card
            description="切换 theme、density 和 direction 后，再看每个场景里的语义色、层次和交互路径是否仍然稳定。"
            eyebrow="Walkthrough"
            heading="How to review this lab"
            tone="brand"
          >
            <div className="docs-chart-lab-walkthrough">
              {chartLabWalkthroughSteps.map((step, index) => (
                <div key={step} className="docs-chart-lab-step">
                  <span className="docs-chart-lab-step__index">
                    {index + 1}
                  </span>
                  <span className="docs-chart-lab-step__copy">{step}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="docs-chart-lab-scenario-grid">
            {chartLabScenarioCards.map((scenario) => (
              <Card
                key={scenario.key}
                description={scenario.description}
                eyebrow={scenario.eyebrow}
                heading={scenario.heading}
              >
                <div className="docs-feedback-stack">
                  <span className="docs-feedback-line">
                    Semantic tones stay readable in both light and dark themes.
                  </span>
                  <span className="docs-feedback-line">
                    Dense layouts keep chart surfaces compact without hiding key values.
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection
        description="这组卡片把图表真正放进 summary tile，而不是让图表自己长成页面。重点验证主值、趋势、侧指标和嵌入图形之间的层次关系。"
        heading="KPI cards wall"
      >
        <div className="docs-chart-lab-kpi-grid">
          <KpiCard
            chart={
              <BulletMicroChart
                actual={74}
                forecast={86}
                showLabels={false}
                size="sm"
                target={80}
              />
            }
            className="docs-chart-lab-kpi-grid__lead"
            description="Quarter-close coverage across the current pipeline."
            eyebrow="Revenue execution"
            heading="Attainment and forecast"
            indicators={[
              {
                key: "target",
                label: "Target",
                tone: "success",
                value: "80%",
              },
              {
                key: "forecast",
                label: "Forecast",
                tone: "information",
                value: "86%",
              },
              {
                key: "risk",
                label: "Risk",
                tone: "warning",
                value: "3 accounts",
              },
            ]}
            mainValue="74%"
            secondaryValue="Quarter close"
            status="On plan"
            statusTone="success"
            tone="positive"
            trend="+12 pts forecast runway"
          />

          <KpiCard
            chart={
              <RadialMicroChart
                centerLabel="Healthy"
                size="sm"
                status="success"
                total={128}
                value={103}
                valueDisplay="80.5%"
              />
            }
            description="Cross-team readiness for the next release train."
            eyebrow="Delivery health"
            heading="Deployment readiness"
            indicators={[
              {
                key: "squads",
                label: "Squads",
                tone: "brand",
                value: "18 active",
              },
              {
                key: "blocked",
                label: "Blocked",
                tone: "warning",
                value: "2 squads",
              },
            ]}
            mainValue="80.5%"
            secondaryValue="Release train"
            status="Healthy"
            statusTone="success"
            trend="+9 pts week over week"
          />

          <KpiCard
            chart={
              <DeltaMicroChart
                scaleMax={12}
                size="sm"
                status="information"
                value={8.4}
              />
            }
            description="Net movement after the last recovery checkpoint."
            eyebrow="Recovery delta"
            heading="Backlog burn"
            indicators={[
              {
                key: "resolved",
                label: "Resolved",
                tone: "success",
                value: "28 items",
              },
              {
                key: "new",
                label: "New",
                tone: "warning",
                value: "9 items",
              },
            ]}
            interactive
            mainValue="+8.4 pts"
            secondaryValue="Sprint delta"
            status="Recovering"
            statusTone="information"
            tone="brand"
            trend="vs prior checkpoint"
          />

          <KpiCard
            chart={
              <StackedBarMicroChart
                labelMode="none"
                segments={[
                  {
                    key: "committed",
                    label: "Committed",
                    tone: "success",
                    value: 48,
                  },
                  {
                    key: "projected",
                    label: "Projected",
                    tone: "information",
                    value: 26,
                  },
                  {
                    key: "watch",
                    label: "Watch",
                    tone: "warning",
                    value: 14,
                  },
                ]}
                size="sm"
                total={100}
              />
            }
            description="Composition-first summary card for quarter coverage."
            eyebrow="Pipeline composition"
            footer={
              <span className="docs-chart-note">
                Composition-heavy tiles rely on chart shape for the first read,
                then use side indicators to anchor the exact numbers.
              </span>
            }
            heading="Planned coverage"
            indicators={[
              {
                key: "committed",
                label: "Committed",
                tone: "success",
                value: "48%",
              },
              {
                key: "projected",
                label: "Projected",
                tone: "information",
                value: "26%",
              },
              {
                key: "watch",
                label: "Watch",
                tone: "warning",
                value: "14%",
              },
            ]}
            mainValue="88% covered"
            secondaryValue="Quarter mix"
            status="Needs attention"
            statusTone="warning"
            trend="+6 pts confidence"
          />
        </div>
      </PageSection>

      <PageSection
        description="对象页摘要区不适合堆很多大卡片，所以这里重点验证图表如何嵌进 header 下方的 summary band，同时保留对象状态、动作和上下文。"
        heading="Object page summary"
      >
        <div className="docs-chart-lab-object-shell">
          <ObjectPageHeader
            actions={
              <>
                <Button variant="transparent">Share object</Button>
                <Button variant="transparent">Assign owner</Button>
                <Button variant="default">Release hold</Button>
              </>
            }
            avatar={
              <Avatar
                name="Mia Chen"
                size="xl"
                statusLabel="Coordinator online"
                statusTone="success"
              />
            }
            breadcrumbs={<Breadcrumbs items={chartLabObjectBreadcrumbItems} />}
            meta="Sales order · High value · Recovery workbench"
            statuses={
              <>
                {chartLabObjectStatuses.map((status) => (
                  <ObjectStatus
                    key={status.key}
                    label={status.label}
                    tone={status.tone}
                  />
                ))}
              </>
            }
            subtitle="North America downstream fulfillment handover"
            title="SO-48291"
          />

          <div className="docs-chart-lab-object-band">
            <InteractiveDonutChart
              centerLabel="Ready"
              heading="Execution readiness"
              segments={chartLabObjectReadinessSegments}
              supportingText="Readiness split for the current recovery wave"
              trend="+4 pts ready vs yesterday"
              value="3 active states"
            />

            <InteractiveLineChart
              heading="Issue burn-down"
              points={chartLabObjectTrendPoints}
              supportingText="Daily checkpoint view for blocking cases"
              trend="-10 cases vs Monday"
              value="5-day trend"
            />
          </div>

          <div className="docs-chart-lab-object-summary">
            <Card
              description="A compact radial keeps the first-read percentage visible."
              eyebrow="Summary lane"
              heading="Coverage posture"
            >
              <RadialMicroChart
                centerLabel="Healthy"
                size="sm"
                status="information"
                total={100}
                trend="+7 pts"
                value={72}
                valueDisplay="72%"
              />
            </Card>

            <Card
              description="Delta works well when the object page needs one fast direction signal."
              eyebrow="Summary lane"
              heading="SLA movement"
            >
              <DeltaMicroChart
                scaleMax={8}
                size="sm"
                status="warning"
                trend="Last 24 hours"
                value={-2.4}
                valueDisplay="-2.4 hrs"
              />
            </Card>

            <Card
              description="HarveyBall keeps multi-lane coverage readable without consuming too much width."
              eyebrow="Summary lane"
              heading="Playbook coverage"
            >
              <HarveyBallMicroChart
                segments={chartLabObjectCoverageSegments}
                size="sm"
                value="3 monitored lanes"
              />
            </Card>
          </div>
        </div>
      </PageSection>

      <PageSection
        description="同一批图表既要能放进表格单元格，也要能在 review list 里做紧凑行内指标。这里同时验证行高、语义色和选中态不会互相打架。"
        heading="Table and list inline indicators"
      >
        <div className="docs-chart-lab-inline-layout">
          <div className="docs-chart-lab-inline-table">
            <DataTable
              caption="Inline indicators stay compact enough for operational tables while still exposing a readable first signal."
              columns={inlineIndicatorColumns}
              getRowId={(row) => row.id}
              getRowMeta={(row) => ({
                navigated: row.id === activeInlineRow?.id,
                unread: row.statusTone === "warning" || row.statusTone === "error",
              })}
              getRowTone={(row) => getRowTone(row.statusTone)}
              rows={chartLabInlineRows}
              onRowClick={(row) => setActiveInlineRowId(row.id)}
            />
          </div>

          <Card
            description="The list lane keeps only the most actionable signals: object identity, current status, SLA delta and coverage posture."
            eyebrow="Review queue"
            heading="Dense list with inline charts"
          >
            <div className="docs-chart-lab-inline-list">
              {chartLabInlineRows.map((row) => (
                <button
                  key={row.id}
                  className="docs-chart-lab-inline-list__item"
                  data-selected={row.id === activeInlineRow?.id}
                  type="button"
                  onClick={() => setActiveInlineRowId(row.id)}
                >
                  <div className="docs-chart-lab-inline-list__topline">
                    <ObjectIdentifier
                      meta={row.owner}
                      subtitle={row.customer}
                      title={row.id}
                    />
                    <ObjectStatus label={row.status} tone={row.statusTone} />
                  </div>

                  <div className="docs-chart-lab-inline-list__metrics">
                    {renderInlineDelta(row)}
                    {renderInlineCoverage(row)}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {activeInlineRow ? (
          <div className="docs-chart-lab-inline-detail">
            <Card
              description={`${activeInlineRow.customer} · ${activeInlineRow.owner} · ${activeInlineRow.stageLabel}`}
              eyebrow="Selected object"
              heading={`${activeInlineRow.id} drill-in`}
              tone="brand"
            >
              <div className="docs-chart-lab-inline-detail__grid">
                <InteractiveDonutChart
                  heading="Current readiness split"
                  segments={activeInlineRow.readinessSegments}
                  size="sm"
                  supportingText="Pinned from the selected table row"
                  value={activeInlineRow.status}
                />

                <InteractiveLineChart
                  heading="Blocking issue trend"
                  points={activeInlineRow.trendPoints}
                  size="sm"
                  supportingText="Recent checkpoint movement"
                  trend={formatChartValueText(activeInlineRow.slaDelta, {
                    maximumFractionDigits: 1,
                    signDisplay: "exceptZero",
                    suffix: " hrs",
                  })}
                  value={`${activeInlineRow.trendPoints.length} checkpoints`}
                />
              </div>
            </Card>
          </div>
        ) : null}
      </PageSection>
    </>
  );
}
