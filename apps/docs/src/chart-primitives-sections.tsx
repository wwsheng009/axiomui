import type { CSSProperties } from "react";

import {
  BulletMicroChart,
  ChartLegend,
  ChartSurface,
  DeltaMicroChart,
  HarveyBallMicroChart,
  InteractiveDonutChart,
  InteractiveLineChart,
  KpiCard,
  PageSection,
  RadialMicroChart,
  StackedBarMicroChart,
  buildChartAriaLabel,
  formatChartValueText,
  getChartSeriesToken,
  getChartToneToken,
  type ChartLegendItem,
  type ChartSurfaceSize,
  type ChartTone,
} from "@axiomui/react";

interface TonePreview {
  key: string;
  label: string;
  note: string;
  tone: ChartTone;
  value: string;
  width: string;
}

interface SeriesPreview {
  key: string;
  label: string;
  series: number;
  value: string;
  width: string;
}

interface SizePreview {
  key: string;
  size: ChartSurfaceSize;
  heading: string;
  note: string;
  trend: string;
  value: string;
  bars: Array<{
    key: string;
    color: string;
    width: string;
  }>;
}

const tonePreviews: TonePreview[] = [
  {
    key: "brand",
    label: "Brand",
    note: "Primary KPI, benchmark or target line.",
    tone: "brand",
    value: formatChartValueText(84.2, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "84%",
  },
  {
    key: "information",
    label: "Information",
    note: "Context, comparison group or incoming signal.",
    tone: "information",
    value: formatChartValueText(63.4, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "63%",
  },
  {
    key: "success",
    label: "Success",
    note: "On-plan or above-threshold performance.",
    tone: "success",
    value: formatChartValueText(78.9, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "79%",
  },
  {
    key: "warning",
    label: "Warning",
    note: "Watch area that still has room to recover.",
    tone: "warning",
    value: formatChartValueText(48.1, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "48%",
  },
  {
    key: "error",
    label: "Error",
    note: "Out-of-bounds or failing checkpoint.",
    tone: "error",
    value: formatChartValueText(27.6, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "28%",
  },
  {
    key: "neutral",
    label: "Neutral",
    note: "Baseline, track or non-semantic fallback.",
    tone: "neutral",
    value: formatChartValueText(56.8, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    width: "57%",
  },
];

const seriesPreviews: SeriesPreview[] = [
  {
    key: "series-1",
    label: "North America",
    series: 1,
    value: formatChartValueText(18400, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "84%",
  },
  {
    key: "series-2",
    label: "EMEA",
    series: 2,
    value: formatChartValueText(13900, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "68%",
  },
  {
    key: "series-3",
    label: "APJ",
    series: 3,
    value: formatChartValueText(11200, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "54%",
  },
  {
    key: "series-4",
    label: "LATAM",
    series: 4,
    value: formatChartValueText(8600, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "42%",
  },
  {
    key: "series-5",
    label: "MEA",
    series: 5,
    value: formatChartValueText(5100, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "31%",
  },
  {
    key: "series-6",
    label: "Partner",
    series: 6,
    value: formatChartValueText(3900, {
      locale: "en-US",
      maximumFractionDigits: 1,
      notation: "compact",
    }),
    width: "24%",
  },
];

const sizePreviews: SizePreview[] = [
  {
    key: "sm",
    size: "sm",
    heading: "Compact KPI tile",
    note: "Dense tables, side panels and inline summary rows.",
    trend: "+1.2 pts",
    value: formatChartValueText(62.4, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    bars: [
      {
        key: "brand",
        color: getChartToneToken("brand"),
        width: "62%",
      },
      {
        key: "information",
        color: getChartToneToken("information"),
        width: "41%",
      },
    ],
  },
  {
    key: "md",
    size: "md",
    heading: "Default KPI card",
    note: "The baseline surface for most object-page summary areas.",
    trend: "+3.8 pts",
    value: formatChartValueText(74.1, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    bars: [
      {
        key: "brand",
        color: getChartToneToken("brand"),
        width: "74%",
      },
      {
        key: "success",
        color: getChartToneToken("success"),
        width: "58%",
      },
      {
        key: "neutral",
        color: getChartToneToken("neutral"),
        width: "36%",
      },
    ],
  },
  {
    key: "lg",
    size: "lg",
    heading: "Expanded summary block",
    note: "Object-page hero areas or wide business overview panels.",
    trend: "+6.4 pts",
    value: formatChartValueText(88.6, {
      locale: "en-US",
      maximumFractionDigits: 1,
      suffix: "%",
    }),
    bars: [
      {
        key: "brand",
        color: getChartToneToken("brand"),
        width: "89%",
      },
      {
        key: "information",
        color: getChartToneToken("information"),
        width: "64%",
      },
      {
        key: "success",
        color: getChartToneToken("success"),
        width: "47%",
      },
    ],
  },
];

const toneLegendItems: ChartLegendItem[] = tonePreviews.map((preview) => ({
  key: preview.key,
  label: preview.label,
  description: preview.note,
  tone: preview.tone,
  value: preview.value,
}));

const seriesLegendItems: ChartLegendItem[] = seriesPreviews.map((preview) => ({
  key: preview.key,
  label: preview.label,
  description: `Series ${preview.series.toString().padStart(2, "0")} token`,
  series: preview.series,
  value: preview.value,
}));

const a11yValueText = formatChartValueText(72.5, {
  locale: "en-US",
  maximumFractionDigits: 1,
  suffix: "%",
});
const a11yTrendText = formatChartValueText(4.2, {
  locale: "en-US",
  maximumFractionDigits: 1,
  prefix: "+",
  suffix: " pts",
});
const generatedAriaLabel = buildChartAriaLabel({
  title: "Delivery health",
  description: "North Asia fulfillment window",
  valueText: a11yValueText,
  trendText: a11yTrendText,
  footerText: "Target 75%, refreshed every 15 minutes",
});

function createBarStyle(width: string, color: string) {
  return {
    "--docs-chart-bar-color": color,
    "--docs-chart-bar-width": width,
  } as CSSProperties;
}

function renderBars(bars: SizePreview["bars"]) {
  return (
    <div className="docs-chart-bars">
      {bars.map((bar) => (
        <span key={bar.key} className="docs-chart-bar-track">
          <span
            className="docs-chart-bar"
            style={createBarStyle(bar.width, bar.color)}
          />
        </span>
      ))}
    </div>
  );
}

export function ChartPrimitivesDemoSection() {
  return (
    <PageSection
      heading="Chart primitives and tokens"
      description="Sprint 5 先把图形共享底座落下：统一 surface、legend、semantic tones、series palette 和 a11y helper，再在这之上逐步接 Bullet、Line、Donut 和 KPI Card。"
    >
      <div className="docs-chart-grid">
        <ChartSurface
          className="docs-chart-grid__span-two"
          eyebrow="S5-01 Foundation"
          heading="Semantic tone matrix"
          supportingText="图形语义色不再由每个 microchart 各自硬编码。tone token 会和主设计系统一起切 theme，同时保留 chart 专用的 soft surface、track 和 marker 语言。"
          trend={a11yTrendText}
          value={a11yValueText}
          footer={
            <ChartLegend
              aria-label="Semantic chart tones"
              items={toneLegendItems}
              layout="grid"
            />
          }
        >
          <div className="docs-chart-tone-grid">
            {tonePreviews.map((preview) => (
              <div
                key={preview.key}
                className="docs-chart-swatch"
                data-tone={preview.tone}
              >
                {renderBars([
                  {
                    key: `${preview.key}-main`,
                    color: getChartToneToken(preview.tone),
                    width: preview.width,
                  },
                  {
                    key: `${preview.key}-soft`,
                    color: getChartToneToken(preview.tone, true),
                    width: "38%",
                  },
                ])}
                <strong className="docs-chart-swatch__label">{preview.label}</strong>
                <span className="docs-chart-swatch__note">{preview.note}</span>
              </div>
            ))}
          </div>
        </ChartSurface>

        <ChartSurface
          eyebrow="Series palette"
          heading="Shared six-series ramp"
          supportingText="多序列图表先统一调色板，再让具体组件决定几何形态。第七个系列会重新循环到 `series-1`，保证 palette 稳定可预期。"
          trend="1..6 then repeat"
          value="6-step palette"
          footer={
            <ChartLegend
              aria-label="Shared chart series palette"
              items={seriesLegendItems}
              layout="grid"
            />
          }
        >
          <div className="docs-chart-series-grid">
            {seriesPreviews.map((preview) => (
              <div key={preview.key} className="docs-chart-series-row">
                <span className="docs-chart-series-label">{preview.label}</span>
                <span className="docs-chart-bar-track">
                  <span
                    className="docs-chart-bar"
                    style={createBarStyle(
                      preview.width,
                      getChartSeriesToken(preview.series),
                    )}
                  />
                </span>
                <span className="docs-chart-series-value">{preview.value}</span>
              </div>
            ))}
          </div>
        </ChartSurface>

        <ChartSurface
          eyebrow="A11y helper"
          heading="Readable labels before SVG arrives"
          supportingText="具体图表落地前，先把 value text 和 aria label helper 固定下来，避免每个图表自己拼一套读屏文案。"
          footer={<span className="docs-chart-a11y-copy">{generatedAriaLabel}</span>}
        >
          <div className="docs-chart-a11y-list">
            <span className="docs-chart-a11y-line">
              Value helper: {a11yValueText}
            </span>
            <span className="docs-chart-a11y-line">
              Trend helper: {a11yTrendText}
            </span>
            <span className="docs-chart-a11y-line">
              Footer copy: Target 75%, refreshed every 15 minutes
            </span>
          </div>
        </ChartSurface>
      </div>

      <div className="docs-chart-size-grid">
        {sizePreviews.map((preview) => (
          <ChartSurface
            key={preview.key}
            eyebrow={`Size ${preview.size.toUpperCase()}`}
            heading={preview.heading}
            size={preview.size}
            supportingText={preview.note}
            trend={preview.trend}
            value={preview.value}
          >
            {renderBars(preview.bars)}
          </ChartSurface>
        ))}
      </div>
    </PageSection>
  );
}

export function BulletMicroChartDemoSection() {
  return (
    <PageSection
      heading="Bullet microchart"
      description="BulletMicroChart 先覆盖对象页摘要和 KPI target-vs-actual 这类高价值场景。当前支持 actual、target、forecast、qualitative ranges、可选 labels，以及极值 clamp。"
    >
      <div className="docs-bullet-grid">
        <BulletMicroChart
          actual={74}
          className="docs-bullet-grid__span-two"
          footer={
            <span className="docs-chart-note">
              Forecast is expected to clear the quarter target if the current
              release cadence holds.
            </span>
          }
          forecast={86}
          heading="Quarterly revenue attainment"
          ranges={[
            {
              key: "under-plan",
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
          supportingText="KPI card baseline: actual against target and forecast"
          target={80}
          trend="+12 pts forecast runway"
          value={formatChartValueText(74, {
            suffix: "%",
          })}
        />

        <BulletMicroChart
          actual={58}
          actualLabel="Current fulfillment"
          forecast={64}
          forecastLabel="Weekend projection"
          heading="Object page summary"
          ranges={[
            {
              key: "risk",
              tone: "error",
              value: 35,
            },
            {
              key: "recoverable",
              tone: "warning",
              value: 60,
            },
            {
              key: "committed",
              tone: "success",
              value: 90,
            },
          ]}
          size="sm"
          supportingText="Compact object-header metric with short summary"
          target={70}
          trend="+6 pts"
        />

        <BulletMicroChart
          actual={42}
          actualLabel="Actual contribution margin after expedited recovery allocation"
          actualTone="warning"
          footer={
            <span className="docs-chart-note">
              Long labels truncate visually but keep the full text on the title
              attribute for hover inspection.
            </span>
          }
          forecast={47}
          forecastLabel="Latest blended forecast for customer recovery path"
          heading="Margin guardrail"
          max={60}
          ranges={[
            {
              key: "loss",
              tone: "error",
              value: 20,
            },
            {
              key: "watch",
              tone: "warning",
              value: 40,
            },
            {
              key: "good",
              tone: "success",
              value: 60,
            },
          ]}
          size="lg"
          supportingText="Wider KPI tile with long labels and custom scale"
          target={50}
          trend="+5 pts upside"
        />
      </div>
    </PageSection>
  );
}

export function RadialMicroChartDemoSection() {
  return (
    <PageSection
      heading="Radial microchart"
      description="RadialMicroChart 用于紧凑表达完成度、百分比和健康度。当前支持 `value/total`、语义 `status`、中心标签和 `sm/md/lg` 尺寸，用来覆盖对象页头部和小卡片的环形 KPI。"
    >
      <div className="docs-radial-grid">
        <RadialMicroChart
          centerLabel="Healthy"
          className="docs-radial-grid__span-two"
          footer={
            <span className="docs-chart-note">
              A wide KPI tile can keep the ring compact while still showing
              supporting copy and an action-oriented trend line.
            </span>
          }
          heading="Order orchestration health"
          size="lg"
          status="success"
          supportingText="KPI card baseline with healthy completion posture"
          total={128}
          trend="+9 pts week over week"
          value={103}
          valueDisplay="80.5%"
        />

        <RadialMicroChart
          centerLabel="Watch"
          heading="Object header compact health"
          size="sm"
          status="warning"
          supportingText="Small object-page summary ring"
          total={24}
          trend="+2 pts"
          value={16}
          valueDisplay="66.7%"
        />

        <RadialMicroChart
          centerLabel="Hot path"
          centerValue="6 / 18"
          footer={
            <span className="docs-chart-note">
              Center value can be replaced with a raw fraction when the absolute
              count matters more than the computed percentage.
            </span>
          }
          heading="Escalation readiness"
          status="error"
          supportingText="Explicit fraction override for recovery work"
          total={18}
          trend="Needs intervention"
          value={6}
          valueDisplay="33.3%"
        />
      </div>

      <div className="docs-radial-status-grid">
        <RadialMicroChart
          centerLabel="Brand"
          heading="Primary progress"
          size="sm"
          status="brand"
          total={100}
          value={72}
        />
        <RadialMicroChart
          centerLabel="Info"
          heading="Incoming signal"
          size="sm"
          status="information"
          total={100}
          value={54}
        />
        <RadialMicroChart
          centerLabel="Success"
          heading="Goal hit"
          size="sm"
          status="success"
          total={100}
          value={100}
        />
        <RadialMicroChart
          centerLabel="Zero"
          heading="Not started"
          size="sm"
          status="neutral"
          total={100}
          value={0}
        />
      </div>
    </PageSection>
  );
}

export function DeltaMicroChartDemoSection() {
  return (
    <PageSection
      heading="Delta microchart"
      description="DeltaMicroChart 用于把增减变化压缩成一眼可辨的趋势指示，优先覆盖对象页摘要、KPI tile 和列表行内状态变化。当前支持自动方向判断、语义状态、幅度归一化和紧凑尺寸。"
    >
      <div className="docs-chart-grid">
        <DeltaMicroChart
          className="docs-chart-grid__span-two"
          footer={
            <span className="docs-chart-note">
              A wide KPI tile can keep the delta prominent while still carrying
              supporting copy for the business context.
            </span>
          }
          formatValue={(value) =>
            formatChartValueText(value, {
              maximumFractionDigits: 1,
              signDisplay: "exceptZero",
              suffix: " pts",
            })
          }
          heading="Backlog burn stabilization"
          scaleMax={12}
          supportingText="KPI card baseline with automatic direction and normalized magnitude"
          trend="vs previous sprint"
          value={8.4}
        />

        <DeltaMicroChart
          formatValue={(value) =>
            formatChartValueText(value, {
              maximumFractionDigits: 1,
              signDisplay: "exceptZero",
              suffix: " pts",
            })
          }
          heading="Object page summary"
          scaleMax={10}
          size="sm"
          status="warning"
          supportingText="Compact negative delta with a softer watch-state tone"
          trend="vs release baseline"
          value={-3.1}
        />

        <DeltaMicroChart
          direction="flat"
          footer={
            <span className="docs-chart-note">
              Stable mode keeps the component usable for neutral or no-change
              snapshots instead of forcing an up/down semantic.
            </span>
          }
          formatValue={(value) =>
            formatChartValueText(value, {
              maximumFractionDigits: 0,
              signDisplay: "exceptZero",
              suffix: " pts",
            })
          }
          heading="Escalation drift"
          size="lg"
          supportingText="Neutral summary state for the current checkpoint"
          trend="Holding steady"
          value={0}
          valueDisplay="Stable"
        />
      </div>
    </PageSection>
  );
}

export function HarveyBallMicroChartDemoSection() {
  return (
    <PageSection
      heading="Harvey ball microchart"
      description="HarveyBallMicroChart 用于表达一组占比型检查点，让对象页摘要和业务卡片可以同时展示多个紧凑比例信号。当前支持多 segment、语义 tone、可选 legend 和小尺寸布局。"
    >
      <div className="docs-chart-grid">
        <HarveyBallMicroChart
          className="docs-chart-grid__span-two"
          footer={
            <span className="docs-chart-note">
              The legend stays optional. For denser headers, the inline labels
              are enough; for wider cards, the legend helps compare segments at
              a glance.
            </span>
          }
          heading="Service readiness mix"
          legendLayout="grid"
          segments={[
            {
              key: "capacity",
              label: "Capacity",
              description: "Regional staffing readiness",
              fraction: 0.82,
              tone: "success",
            },
            {
              key: "quality",
              label: "Quality",
              description: "Spec adherence before release cut",
              fraction: 0.64,
              tone: "information",
            },
            {
              key: "recovery",
              label: "Recovery",
              description: "Escalation path coverage",
              fraction: 0.41,
              tone: "warning",
            },
          ]}
          showLegend
          supportingText="KPI card baseline with three compact coverage signals"
          value="3 monitored ratios"
        />

        <HarveyBallMicroChart
          heading="Object header coverage"
          segments={[
            {
              key: "api",
              label: "API",
              fraction: 0.75,
              tone: "brand",
            },
            {
              key: "ops",
              label: "Ops",
              fraction: 0.5,
              tone: "warning",
            },
          ]}
          size="sm"
          supportingText="Compact two-signal summary for the object page header"
        />

        <HarveyBallMicroChart
          footer={
            <span className="docs-chart-note">
              Long labels stay visible in full through the title attribute while
              preserving compact cards in the default flow.
            </span>
          }
          heading="Recovery allocation"
          segments={[
            {
              key: "weekend",
              label: "Weekend freight override",
              description: "Fallback logistics coverage",
              fraction: 0.625,
              tone: "information",
              valueDisplay: "5 / 8 lots",
            },
            {
              key: "manual",
              label: "Manual specialist escalation",
              description: "Operator backup coverage",
              fraction: 0.375,
              tone: "error",
              valueDisplay: "3 / 8 lots",
            },
          ]}
          size="lg"
          supportingText="Long labels and custom displays for object-page drill-in"
        />
      </div>
    </PageSection>
  );
}

export function StackedBarMicroChartDemoSection() {
  return (
    <PageSection
      heading="Stacked bar microchart"
      description="StackedBarMicroChart 用于把构成型 KPI 压缩进单条比例条中，适合对象页摘要、列表汇总和 KPI card 的组合场景。当前支持多 segment、可选 legend、compact/full 标签模式，以及剩余容量尾段。"
    >
      <div className="docs-chart-grid">
        <StackedBarMicroChart
          className="docs-chart-grid__span-two"
          footer={
            <span className="docs-chart-note">
              The remainder tail makes it easy to keep explicit total capacity
              visible without forcing every business case to add another named
              segment.
            </span>
          }
          heading="Quarter close pipeline mix"
          legendLayout="grid"
          segments={[
            {
              key: "committed",
              label: "Committed",
              description: "Already secured in signed opportunities",
              tone: "success",
              value: 48,
            },
            {
              key: "projected",
              label: "Projected",
              description: "Forecasted conversion before quarter end",
              tone: "information",
              value: 26,
            },
            {
              key: "watch",
              label: "Watch",
              description: "Needs approval or recovery action",
              tone: "warning",
              value: 14,
            },
          ]}
          showLegend
          supportingText="KPI card baseline with explicit remainder capacity"
          total={100}
          trend="+6 pts forecast confidence"
          value="88% planned coverage"
        />

        <StackedBarMicroChart
          heading="Object page summary"
          labelMode="compact"
          segments={[
            {
              key: "api",
              label: "API",
              tone: "brand",
              value: 22,
            },
            {
              key: "ops",
              label: "Ops",
              tone: "warning",
              value: 10,
            },
            {
              key: "manual",
              label: "Manual",
              tone: "neutral",
              value: 4,
            },
          ]}
          size="sm"
          supportingText="Compact stacked summary for the object header"
          total={40}
          value="3 active lanes"
        />

        <StackedBarMicroChart
          footer={
            <span className="docs-chart-note">
              Full label mode works well when the supporting copy matters more
              than a separate legend block.
            </span>
          }
          heading="Recovery allocation"
          labelMode="full"
          segments={[
            {
              key: "expedite",
              label: "Weekend freight override",
              description: "Premium logistics capacity reserved for escalations",
              series: 1,
              value: 12,
              valueDisplay: "12 lots",
            },
            {
              key: "manual",
              label: "Manual specialist cover",
              description: "Fallback operator bandwidth for unresolved cases",
              series: 2,
              value: 8,
              valueDisplay: "8 lots",
            },
            {
              key: "vendor",
              label: "Vendor reroute buffer",
              description: "External contingency pool",
              tone: "information",
              value: 5,
              valueDisplay: "5 lots",
            },
          ]}
          size="lg"
          supportingText="Long-label composition for an expanded summary tile"
          total={30}
          trend="Buffers refreshed hourly"
          value="25 / 30 lots"
        />
      </div>
    </PageSection>
  );
}

export function InteractiveDonutChartDemoSection() {
  return (
    <PageSection
      heading="Interactive donut chart"
      description="InteractiveDonutChart 用于表达一组可探索的占比关系。当前实现支持 hover / focus / click 高亮、受控 activeKey、中心内容切换，以及对象页和 KPI card 场景下清晰的键盘路径。"
    >
      <div className="docs-chart-grid">
        <InteractiveDonutChart
          className="docs-chart-grid__span-two"
          footer={
            <span className="docs-chart-note">
              The segment list stays visible as the keyboard path while the SVG
              ring reacts to hover and click, which keeps interaction explicit
              without hiding it behind canvas-only behavior.
            </span>
          }
          heading="Fulfillment readiness split"
          segments={[
            {
              key: "ready",
              label: "Ready",
              description: "Fully staffed and quality checked",
              tone: "success",
              value: 52,
            },
            {
              key: "watch",
              label: "Watch",
              description: "Recoverable with active owner follow-up",
              tone: "warning",
              value: 28,
            },
            {
              key: "blocked",
              label: "Blocked",
              description: "Needs escalation before release cut",
              tone: "error",
              value: 20,
            },
          ]}
          supportingText="KPI card baseline with active segment exploration"
          trend="+4 pts ready vs last checkpoint"
          value="3 active states"
        />

        <InteractiveDonutChart
          centerLabel="Focus"
          centerValue="36%"
          heading="Object header summary"
          segments={[
            {
              key: "direct",
              label: "Direct",
              tone: "brand",
              value: 42,
            },
            {
              key: "partner",
              label: "Partner",
              tone: "information",
              value: 36,
            },
            {
              key: "services",
              label: "Services",
              tone: "neutral",
              value: 22,
            },
          ]}
          size="sm"
          supportingText="Compact donut for a small object-page summary lane"
        />

        <InteractiveDonutChart
          footer={
            <span className="docs-chart-note">
              Controlled mode lets a higher-level KPI card or dashboard tile
              keep one segment pinned as the active comparison.
            </span>
          }
          activeKey="partner"
          centerLabel="Pinned"
          heading="Pinned comparison"
          segments={[
            {
              key: "direct",
              label: "Direct sales",
              description: "Owned pipeline execution",
              tone: "brand",
              value: 31,
            },
            {
              key: "partner",
              label: "Partner-led",
              description: "Channel and reseller contribution",
              tone: "information",
              value: 44,
            },
            {
              key: "services",
              label: "Services attach",
              description: "Expansion from implementation support",
              tone: "success",
              value: 25,
            },
          ]}
          size="lg"
          supportingText="Controlled activeKey for a dashboard tile"
          trend="Partner-led mix keeps expanding"
          value="44% partner-led"
        />
      </div>
    </PageSection>
  );
}

export function InteractiveLineChartDemoSection() {
  return (
    <PageSection
      heading="Interactive line chart"
      description="InteractiveLineChart 用于表达紧凑趋势，并把 hover / focus 的点位详情暴露给键盘路径。当前实现支持 active point、min/max marker、可选轴标签，以及对象页和 KPI card 场景下的趋势摘要。"
    >
      <div className="docs-chart-grid">
        <InteractiveLineChart
          className="docs-chart-grid__span-two"
          footer={
            <span className="docs-chart-note">
              The detail panel below the line becomes the shared hover and focus
              target, so the chart stays readable even when the sparkline itself
              is visually compact.
            </span>
          }
          heading="Backlog reduction trend"
          points={[
            {
              key: "week-1",
              label: "Week 1",
              description: "Initial stabilization before sprint close",
              value: 12,
            },
            {
              key: "week-2",
              label: "Week 2",
              description: "Recovery work gains traction",
              tone: "information",
              value: 17,
            },
            {
              key: "week-3",
              label: "Week 3",
              description: "Fastest decline after dependency cleanup",
              tone: "success",
              value: 24,
            },
            {
              key: "week-4",
              label: "Week 4",
              description: "Pace normalizes near the target line",
              tone: "brand",
              value: 20,
            },
          ]}
          supportingText="KPI card baseline for a four-checkpoint trend summary"
          trend="+8 closed vs start"
          value="4-week sparkline"
        />

        <InteractiveLineChart
          heading="Object header trend"
          lineTone="information"
          points={[
            {
              key: "jan",
              label: "Jan",
              value: 9,
            },
            {
              key: "feb",
              label: "Feb",
              value: 13,
            },
            {
              key: "mar",
              label: "Mar",
              value: 15,
            },
          ]}
          size="sm"
          supportingText="Compact three-point trend for the object page summary"
          value="+6 pts"
        />

        <InteractiveLineChart
          activeKey="p3"
          footer={
            <span className="docs-chart-note">
              Controlled mode lets a dashboard tile pin one reference point
              while still exposing the surrounding trend history.
            </span>
          }
          heading="Pinned dashboard comparison"
          points={[
            {
              key: "p1",
              label: "Checkpoint 1",
              description: "Baseline before handoff",
              value: 41,
              valueDisplay: "41 hrs",
            },
            {
              key: "p2",
              label: "Checkpoint 2",
              description: "Throughput improves after tooling reset",
              tone: "warning",
              value: 36,
              valueDisplay: "36 hrs",
            },
            {
              key: "p3",
              label: "Checkpoint 3",
              description: "Pinned detail for the currently reviewed point",
              tone: "information",
              value: 29,
              valueDisplay: "29 hrs",
            },
            {
              key: "p4",
              label: "Checkpoint 4",
              description: "Target state after final buffer removal",
              tone: "success",
              value: 24,
              valueDisplay: "24 hrs",
            },
          ]}
          size="lg"
          supportingText="Controlled active point for a dashboard tile"
          trend="-12 hrs total"
          value="29 hrs pinned"
        />
      </div>
    </PageSection>
  );
}

export function KpiCardDemoSection() {
  return (
    <PageSection
      heading="KPI card composition"
      description="KpiCard 把主指标、趋势/状态、嵌入图表和侧指标组合成可直接落地的业务卡片。当前示例覆盖 Bullet、Radial、Delta 和 StackedBar 四类图形，作为 Sprint 5 进入真实页面的第一层组合 contract。"
    >
      <div className="docs-kpi-card-wall">
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
          className="docs-kpi-card-wall__span-two"
          footer={
            <span className="docs-chart-note">
              Revenue execution remains on plan as forecast clears the quarter
              target. This is the baseline KPI card shape for object-page and
              dashboard summary tiles.
            </span>
          }
          heading="Revenue attainment"
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
          heading="Deployment readiness"
          indicators={[
            {
              key: "teams",
              label: "Teams",
              tone: "brand",
              value: "18 squads",
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
          trend="+9 pts WoW"
        />

        <KpiCard
          chart={
            <DeltaMicroChart
              scaleMax={12}
              size="sm"
              value={8.4}
            />
          }
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
          footer={
            <span className="docs-chart-note">
              Composition-heavy KPI cards work well when the chart gives a quick
              visual split while the side indicators carry explicit values.
            </span>
          }
          heading="Pipeline composition"
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
  );
}
