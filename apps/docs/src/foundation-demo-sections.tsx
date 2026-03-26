import { useState } from "react";

import {
  Button,
  Card,
  ComboBox,
  DatePicker,
  DateRangePicker,
  FormField,
  FormGrid,
  Input,
  MultiComboBox,
  MultiInput,
  PageSection,
  Select,
  Tabs,
  TimePicker,
  type DateRangeValue,
} from "@axiomui/react";

import {
  ownerComboBoxItems,
  releaseChannelSelectItems,
  releaseStatusSelectItems,
} from "./demo-data";
import { formatWorklistDateRangeLabel } from "./worklist-advanced/worklist-utils";

interface FieldAndTabsDemoSectionsProps {
  locale: string;
  selectedRowCount: number;
}

interface FormGridDialogDemoSectionProps {
  onOpenDialog: () => void;
}

export function ThemeAndButtonDemoSections() {
  return (
    <>
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
    </>
  );
}

export function FieldAndTabsDemoSections({
  locale,
  selectedRowCount,
}: FieldAndTabsDemoSectionsProps) {
  const [fieldDemoDate, setFieldDemoDate] = useState("2026-04-18");
  const [fieldDemoDateRange, setFieldDemoDateRange] = useState<DateRangeValue>({
    start: "2026-04-08",
    end: "2026-04-18",
  });
  const [fieldDemoTime, setFieldDemoTime] = useState("13:30");
  const [freeformTimeDemo, setFreeformTimeDemo] = useState("09:20");
  const [scheduledSlotTimeDemo, setScheduledSlotTimeDemo] = useState("18:30:30");
  const [filterThresholdTimeDemo, setFilterThresholdTimeDemo] = useState("08:00");
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
      badge: selectedRowCount,
      iconName: "success",
      tone: "positive" as const,
      content: (
        <div className="docs-inline-stats">
          <div className="docs-inline-stat">
            <span className="docs-inline-stat__label">Selection</span>
            <strong className="docs-inline-stat__value">
              {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
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

  return (
    <>
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
            <DateRangePicker
              description="DateRangePicker now shows a dual-month panel, makes start and end editing explicit, and still keeps typed input and inclusive filtering in sync."
              label="Delivery window"
              maxDate="2026-09-30"
              message={`Current value: ${formatWorklistDateRangeLabel(fieldDemoDateRange, locale)}`}
              minDate="2026-04-01"
              value={fieldDemoDateRange}
              onValueChange={setFieldDemoDateRange}
            />
            <TimePicker
              description="TimePicker keeps a canonical 24-hour value internally while the field and panel follow locale-aware 12h or 24h display."
              format={
                locale === "zh-CN"
                  ? {
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    }
                  : undefined
              }
              label="Deployment time"
              message={`Current value: ${fieldDemoTime || "None"}`}
              value={fieldDemoTime}
              onValueChange={setFieldDemoTime}
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
        heading="Time selection patterns"
        description="The docs app now shows distinct time-entry scenarios instead of treating every TimePicker like the same field."
      >
        <div className="docs-grid docs-grid--three">
          <Card
            eyebrow="Scenario 01"
            heading="Flexible entry"
            description="Use the full minute list when the business flow accepts any exact time."
            tone="brand"
          >
            <div className="docs-time-scenario">
              <TimePicker
                description="No minute or second step. The panel exposes the complete minute range."
                label="Reminder time"
                message={`Current value: ${freeformTimeDemo || "None"}`}
                value={freeformTimeDemo}
                onValueChange={setFreeformTimeDemo}
              />
              <p className="docs-card-copy">
                This is the right fit for reminders, personal planning and other
                inputs where `09:07` and `09:43` are equally valid business values.
              </p>
            </div>
          </Card>

          <Card
            eyebrow="Scenario 02"
            heading="Scheduled execution"
            description="Operational windows often need quarter-hour minutes and coarse second buckets."
          >
            <div className="docs-time-scenario">
              <TimePicker
                description="Minute and second steps trim the panel down to valid slots only."
                format={{
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hourCycle: "h23",
                }}
                label="Batch cutoff"
                message={`Current value: ${scheduledSlotTimeDemo || "None"}`}
                minuteStep={15}
                secondStep={30}
                value={scheduledSlotTimeDemo}
                onValueChange={setScheduledSlotTimeDemo}
              />
              <p className="docs-card-copy">
                This pattern keeps scheduling deterministic and avoids collecting
                values the backend will later round or reject.
              </p>
            </div>
          </Card>

          <Card
            eyebrow="Scenario 03"
            heading="Filter threshold"
            description="Filter bars usually expose a smaller set of meaningful time buckets."
          >
            <div className="docs-time-scenario">
              <TimePicker
                description="A 24-hour filter field with quarter-hour slots keeps comparisons predictable."
                format={
                  locale === "zh-CN"
                    ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
                    : undefined
                }
                label="Earliest start"
                message={`Current value: ${filterThresholdTimeDemo || "None"}`}
                minuteStep={15}
                value={filterThresholdTimeDemo}
                onValueChange={setFilterThresholdTimeDemo}
              />
              <p className="docs-card-copy">
                This mirrors worklist and reporting filters, where every option
                should map cleanly to an allowed query bucket.
              </p>
            </div>
          </Card>
        </div>
      </PageSection>

      <PageSection
        heading="Tabs and secondary navigation"
        description="The tab layer now behaves like a reusable navigation framework instead of a one-off segmented control."
      >
        <Tabs items={tabs} orientation="vertical" />
      </PageSection>
    </>
  );
}

export function FormGridDialogDemoSection({
  onOpenDialog,
}: FormGridDialogDemoSectionProps) {
  return (
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
            description="Time selection uses the same field shell and anchored overlay."
            hint="Minute and second steps keep scheduling filters deterministic."
            htmlFor="form-grid-cutoff"
            label="Cutoff"
          >
            <TimePicker
              id="form-grid-cutoff"
              defaultValue="18:00:00"
              format={{
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23",
              }}
              minuteStep={15}
              secondStep={30}
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
          <Button variant="emphasized" onClick={onOpenDialog}>
            Launch modal flow
          </Button>
        </div>
      </div>
    </PageSection>
  );
}
