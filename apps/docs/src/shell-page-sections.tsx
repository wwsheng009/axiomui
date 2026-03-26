import { useState } from "react";

import {
  Button,
  Card,
  DynamicPage,
  FormField,
  FormGrid,
  Input,
  MessagePage,
  MessageStrip,
  NotificationList,
  ObjectPageNav,
  ObjectPageSection,
  PageSection,
  SplitLayout,
  ToolHeader,
  Toolbar,
} from "@axiomui/react";

import { inboxItems, workItems } from "./demo-data";
import {
  formatWorklistDateLabel,
  formatWorklistScheduleLabel,
  formatWorklistTimeLabel,
} from "./worklist-advanced/worklist-utils";

type ObjectPageSectionKey = "summary" | "delivery" | "inbox";
type SplitPaneKey = "primary" | "secondary" | "tertiary";

const objectPageNavItems: Array<{
  key: ObjectPageSectionKey;
  label: string;
  count: string;
}> = [
  { key: "summary", label: "Summary", count: "04" },
  { key: "delivery", label: "Delivery", count: "03" },
  { key: "inbox", label: "Inbox", count: "03" },
];

function getPriorityTone(priority: string) {
  if (priority === "Negative") {
    return "error" as const;
  }

  if (priority === "Attention") {
    return "warning" as const;
  }

  if (priority === "Positive") {
    return "success" as const;
  }

  return "information" as const;
}

export function DynamicPageDemoSection() {
  return (
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
              dense worklist screens do not collapse into a single anonymous flex
              row.
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
              the floating footer reserves space and does not cover the work area
              below it.
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
  );
}

export function ObjectPageDemoSection() {
  const [activeSection, setActiveSection] =
    useState<ObjectPageSectionKey>("summary");

  return (
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
              items={objectPageNavItems}
              onValueChange={(value) =>
                setActiveSection(value as ObjectPageSectionKey)
              }
              value={activeSection}
            />

            {activeSection === "summary" ? (
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

            {activeSection === "delivery" ? (
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

            {activeSection === "inbox" ? (
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
                  Object navigation switches local sections without breaking the
                  page flow.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

interface SplitLayoutDemoSectionProps {
  locale: string;
}

export function SplitLayoutDemoSection({
  locale,
}: SplitLayoutDemoSectionProps) {
  const [activePane, setActivePane] = useState<SplitPaneKey>("primary");
  const [activeWorkItemId, setActiveWorkItemId] = useState("AX-1024");
  const activeWorkItem =
    workItems.find((workItem) => workItem.id === activeWorkItemId) ?? workItems[0];

  if (!activeWorkItem) {
    return null;
  }

  return (
    <PageSection
      heading="Split layout and master-detail"
      description="Split layouts give us a proper workbench shape for list, detail and context panes without forcing symmetric columns."
      actions={
        <div className="docs-toggle-row">
          <Button
            selected={activePane === "primary"}
            variant="transparent"
            onClick={() => setActivePane("primary")}
          >
            List
          </Button>
          <Button
            selected={activePane === "secondary"}
            variant="transparent"
            onClick={() => setActivePane("secondary")}
          >
            Detail
          </Button>
          <Button
            selected={activePane === "tertiary"}
            variant="transparent"
            onClick={() => setActivePane("tertiary")}
          >
            Context
          </Button>
        </div>
      }
    >
      <SplitLayout
        activePane={activePane}
        primary={{
          title: "Worklist",
          description: "A bounded list pane for fast scanning and selection.",
          toolbar: (
            <Button variant="transparent" onClick={() => setActivePane("secondary")}>
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
                      setActivePane("secondary");
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
                      {formatWorklistScheduleLabel(workItem, locale)} · {workItem.status}
                    </span>
                  </button>
                );
              })}
            </div>
          ),
        }}
        secondary={{
          title: activeWorkItem.object,
          description: `${activeWorkItem.id} · ${formatWorklistScheduleLabel(activeWorkItem, locale)} · ${activeWorkItem.status}`,
          toolbar: (
            <div className="docs-toggle-row">
              <Button variant="transparent" onClick={() => setActivePane("primary")}>
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
                tone={getPriorityTone(activeWorkItem.priority)}
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
                  <Input id="split-object" defaultValue={activeWorkItem.object} readOnly />
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
                >
                  <Input
                    id="split-status"
                    defaultValue={activeWorkItem.status}
                    valueState="information"
                    message="Detail forms continue to reuse the same field wrapper and value-state model."
                  />
                </FormField>
                <FormField
                  description="Scheduled milestone date"
                  htmlFor="split-target-date"
                  label="Target date"
                >
                  <Input
                    id="split-target-date"
                    defaultValue={formatWorklistDateLabel(activeWorkItem.targetDate, locale)}
                    readOnly
                  />
                </FormField>
                <FormField
                  description="Scheduled execution time"
                  htmlFor="split-target-time"
                  label="Target time"
                >
                  <Input
                    id="split-target-time"
                    defaultValue={formatWorklistTimeLabel(activeWorkItem.targetTime, locale)}
                    readOnly
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
            <Button variant="transparent" onClick={() => setActivePane("tertiary")}>
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
  );
}
