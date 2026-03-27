import { useState } from "react";

import {
  Avatar,
  Button,
  Breadcrumbs,
  Card,
  DynamicPage,
  FlexibleColumnLayout,
  FormField,
  FormGrid,
  Input,
  MessagePage,
  MessageStrip,
  NavigationList,
  NotificationList,
  type BreadcrumbsItem,
  type FlexibleColumnLayoutColumnKey,
  type FlexibleColumnLayoutMode,
  type NavigationListGroup,
  type ObjectPageLayoutSection,
  ObjectIdentifier,
  ObjectPageHeader,
  ObjectPageLayout,
  ObjectStatus,
  PageSection,
  SideNavigation,
  SplitLayout,
  ToolHeader,
  ToolPage,
  Toolbar,
} from "@axiomui/react";

import { inboxItems, workItems } from "./demo-data";
import {
  formatWorklistDateLabel,
  formatWorklistScheduleLabel,
  formatWorklistTimeLabel,
} from "./worklist-advanced/worklist-utils";

type ObjectPageSectionKey = "summary" | "delivery" | "inbox";
type ShellNavigationKey =
  | "workspace-overview"
  | "workspace-operations"
  | "workspace-review"
  | "workspace-approvals"
  | "workspace-inbox"
  | "admin-team"
  | "admin-calendar";
type SplitPaneKey = "primary" | "secondary" | "tertiary";

const objectPageBreadcrumbItems: BreadcrumbsItem[] = [
  { key: "landscape", label: "Global rollout", onClick: () => undefined },
  { key: "program", label: "Order to cash", onClick: () => undefined },
  { key: "workspace", label: "Delivery workspace", onClick: () => undefined },
  { key: "object", label: "Sales order SO-48291", current: true },
];

const longBreadcrumbItems: BreadcrumbsItem[] = [
  { key: "home", label: "Home", onClick: () => undefined },
  { key: "region", label: "North America", onClick: () => undefined },
  { key: "country", label: "Canada", onClick: () => undefined },
  { key: "plant", label: "Toronto DC", onClick: () => undefined },
  { key: "workspace", label: "Delivery workspace", onClick: () => undefined },
  { key: "object", label: "Sales order SO-48291", current: true },
];

function createAvatarIllustration(
  accentStart: string,
  accentEnd: string,
  foreground: string,
) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${accentStart}" />
          <stop offset="100%" stop-color="${accentEnd}" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="28" fill="url(#g)" />
      <circle cx="48" cy="34" r="16" fill="${foreground}" fill-opacity="0.28" />
      <path d="M20 82c3-15 16-24 28-24s25 9 28 24" fill="${foreground}" fill-opacity="0.18" />
      <circle cx="66" cy="25" r="11" fill="${foreground}" fill-opacity="0.12" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const avatarIllustrations = {
  coordinator: createAvatarIllustration("#0d8bff", "#5f4ff9", "#ffffff"),
  customer: createAvatarIllustration("#0f8a56", "#3cbf7a", "#f4fffb"),
};

const shellNavigationGroups: NavigationListGroup[] = [
  {
    key: "workspace",
    label: "Workspace",
    items: [
      {
        key: "workspace-overview",
        label: "Overview",
        badge: "03",
        description: "Workspace pulse",
        iconName: "information",
      },
      {
        key: "workspace-operations",
        label: "Operations",
        description: "Daily execution",
        iconName: "calendar",
        items: [
          {
            key: "workspace-review",
            label: "Review queue",
            meta: "12 open",
          },
          {
            key: "workspace-approvals",
            label: "Approvals",
            meta: "4 pending",
          },
          {
            key: "workspace-inbox",
            label: "Inbox",
            meta: "3 unread",
          },
        ],
      },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    items: [
      {
        key: "admin-team",
        label: "Team roster",
        description: "On-call coverage",
        iconName: "person",
      },
      {
        key: "admin-calendar",
        label: "Calendar sync",
        description: "Regional cutovers",
        iconName: "calendar",
      },
    ],
  },
];

const shellNavigationContentByKey: Record<
  ShellNavigationKey,
  {
    eyebrow: string;
    heading: string;
    description: string;
    bullets: string[];
  }
> = {
  "workspace-overview": {
    eyebrow: "Workspace pulse",
    heading: "Rollout overview",
    description:
      "The overview stays near the top of the rail so operators can reset context without leaving the shell.",
    bullets: [
      "Pin KPI cards and inline alerts into a stable landing area.",
      "Keep the active branch visible when the rail collapses to icons.",
      "Preserve the same navigation model across cozy and compact density.",
    ],
  },
  "workspace-operations": {
    eyebrow: "Operations branch",
    heading: "Operations hub",
    description:
      "The parent branch carries its own meaning, so selecting it can open a higher-level workspace summary before drilling into child queues.",
    bullets: [
      "Operators can scan the full workstream before selecting a narrow queue.",
      "Expanded state stays stable while detail content changes on the right.",
      "Keyboard users can move between branch summary and child destinations quickly.",
    ],
  },
  "workspace-review": {
    eyebrow: "Operations queue",
    heading: "Review queue",
    description:
      "Nested navigation keeps high-frequency review work inside the same side rail rather than scattering it across ad-hoc tabs.",
    bullets: [
      "Escalations surface in the queue before they become blocking dialogs.",
      "Branch highlighting keeps operators oriented after keyboard moves.",
      "The detail area can switch content without rebuilding the left shell.",
    ],
  },
  "workspace-approvals": {
    eyebrow: "Operations queue",
    heading: "Approvals",
    description:
      "Approval-heavy workspaces need a left rail that can stay dense without becoming visually anonymous.",
    bullets: [
      "Pending counts stay close to the parent branch for rapid scanning.",
      "The selected row remains explicit in both expanded and collapsed modes.",
      "Teams can scope approval work without replacing the page header.",
    ],
  },
  "workspace-inbox": {
    eyebrow: "Operations queue",
    heading: "Inbox and alerts",
    description:
      "Inbox views fit into the same navigation tree, which keeps shell and notification language aligned.",
    bullets: [
      "Unread items can sit beside operational queues in one rail.",
      "Alert-heavy spaces still reuse the same page-level content surface.",
      "The collapsed rail keeps the branch active for quicker recovery.",
    ],
  },
  "admin-team": {
    eyebrow: "Administration",
    heading: "Team roster",
    description:
      "Administrative areas share the same rail, so setup screens do not need a second navigation paradigm.",
    bullets: [
      "Keep shift owners, reviewers and escalation paths nearby.",
      "Footer identity can communicate the current operator or environment.",
      "Header and footer slots remain available without custom shell code.",
    ],
  },
  "admin-calendar": {
    eyebrow: "Administration",
    heading: "Calendar sync",
    description:
      "Calendar and maintenance windows need a quieter shell treatment, but they still belong in the same navigation system.",
    bullets: [
      "Regional cutovers stay one level below the main workspace tree.",
      "Collapse behavior reduces the rail to an icon-first support surface.",
      "Shell composition remains consistent before ToolPage lands.",
    ],
  },
};

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

export function SideNavigationDemoSection() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeNavigationKey, setActiveNavigationKey] =
    useState<ShellNavigationKey>("workspace-overview");
  const activeContent = shellNavigationContentByKey[activeNavigationKey];

  return (
    <PageSection
      heading="Side navigation and workspace rail"
      description="A side navigation shell gives workbench pages a dedicated left rail with collapse behavior, nested navigation and shell-level identity slots."
      actions={
        <div className="docs-toggle-row">
          <Button
            selected={!collapsed}
            variant="transparent"
            onClick={() => setCollapsed(false)}
          >
            Expanded rail
          </Button>
          <Button
            selected={collapsed}
            variant="transparent"
            onClick={() => setCollapsed(true)}
          >
            Collapsed rail
          </Button>
        </div>
      }
    >
      <div className="docs-side-nav-layout">
        <SideNavigation
          collapsed={collapsed}
          footer={
            <div className="docs-side-nav-footer">
              <span className="docs-status" data-tone="positive">
                QA Ready
              </span>
              <div className="docs-side-nav-footer__copy">
                <strong>Mia Chen</strong>
                <span>Release coordinator</span>
              </div>
            </div>
          }
          header={
            <div className="docs-side-nav-brand">
              <span className="docs-side-nav-brand__mark">AX</span>
              <div className="docs-side-nav-brand__copy">
                <strong>AxiomUI Ops</strong>
                <span>Shell lab workspace</span>
              </div>
            </div>
          }
          onCollapsedChange={setCollapsed}
          toggleLabelCollapse="Collapse rail"
          toggleLabelExpand="Expand rail"
          navigation={
            <NavigationList
              aria-label="Workspace navigation"
              defaultExpandedKeys={["workspace-operations"]}
              groups={shellNavigationGroups}
              value={activeNavigationKey}
              onValueChange={(value) =>
                setActiveNavigationKey(value as ShellNavigationKey)
              }
            />
          }
        />

        <div className="docs-side-nav-preview">
          <Toolbar
            end={
              <>
                <Button variant="transparent">Open branch</Button>
                <Button variant="default">Run review</Button>
              </>
            }
            headline={activeContent.heading}
            middle={
              <div className="docs-toolbar-summary">
                <span className="docs-toolbar-pill">{activeContent.eyebrow}</span>
                <span className="docs-toolbar-pill">
                  Rail {collapsed ? "Collapsed" : "Expanded"}
                </span>
                <span className="docs-toolbar-pill">Shell ready</span>
              </div>
            }
            start={<Button variant="transparent">Scope</Button>}
            supportingText="The content area can swap context while the left rail keeps hierarchy and branch state stable."
            variant="toolbar"
          />

          <Card
            eyebrow={activeContent.eyebrow}
            heading={activeContent.heading}
            description={activeContent.description}
            tone="brand"
          >
            <div className="docs-inline-stats">
              <div className="docs-inline-stat">
                <span className="docs-inline-stat__label">Selected branch</span>
                <strong className="docs-inline-stat__value">
                  {activeNavigationKey}
                </strong>
              </div>
              <div className="docs-inline-stat">
                <span className="docs-inline-stat__label">Rail state</span>
                <strong className="docs-inline-stat__value">
                  {collapsed ? "Icon rail" : "Full width"}
                </strong>
              </div>
            </div>
          </Card>

          <MessageStrip
            actions={<Button variant="transparent">Inspect focus flow</Button>}
            headline="Collapse keeps the active branch visible"
            tone="information"
          >
            Side navigation should reduce to an icon-first rail without losing
            the selected workspace branch or forcing a separate mobile-only
            navigation model.
          </MessageStrip>

          <Card
            eyebrow="Composition notes"
            heading="Why this shell primitive matters"
            description="The rail acts as a reusable layout surface rather than a one-off sidebar wrapper."
          >
            <div className="docs-feedback-stack">
              {activeContent.bullets.map((bullet) => (
                <span key={bullet} className="docs-feedback-line">
                  {bullet}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageSection>
  );
}

interface ToolPageDemoSectionProps {
  locale: string;
}

export function ToolPageDemoSection({ locale }: ToolPageDemoSectionProps) {
  const [activeNavigationKey, setActiveNavigationKey] =
    useState<ShellNavigationKey>("workspace-review");
  const [activeWorkItemId, setActiveWorkItemId] = useState(workItems[0]?.id ?? "");
  const activeContent = shellNavigationContentByKey[activeNavigationKey];
  const activeWorkItem =
    workItems.find((workItem) => workItem.id === activeWorkItemId) ?? workItems[0];

  if (!activeWorkItem) {
    return null;
  }

  return (
    <PageSection
      heading="Tool page workspace shell"
      description="ToolPage binds the shell header, left rail and scrollable work area into one reusable enterprise page skeleton."
    >
      <ToolPage
        className="docs-tool-page-shell"
        header={
          <ToolHeader
            actions={
              <>
                <Button variant="transparent">Share view</Button>
                <Button variant="default">Run checks</Button>
              </>
            }
            meta={
              <>
                <span className="docs-tool-meta">3 alerts</span>
                <Button variant="transparent">Profile</Button>
              </>
            }
            navigation={
              <div className="docs-tool-nav">
                <Button selected variant="transparent">
                  Queue
                </Button>
                <Button variant="transparent">Calendar</Button>
                <Button variant="transparent">Capacity</Button>
              </div>
            }
            start={<Button variant="transparent">Menu</Button>}
            title="Operations workbench"
          />
        }
        sideContent={
          <div className="docs-tool-page-side-note">
            <span className="docs-pill">Shift handover</span>
            <p className="docs-card-copy">
              Collapse the rail without losing the active branch, then keep local
              shift context and notes in a secondary side slot.
            </p>
          </div>
        }
        sideNavigation={
          <SideNavigation
            footer={
              <div className="docs-side-nav-footer">
                <span className="docs-status" data-tone="information">
                  Live queue
                </span>
                <div className="docs-side-nav-footer__copy">
                  <strong>North Asia rollout</strong>
                  <span>Window closes 18:30</span>
                </div>
              </div>
            }
            header={
              <div className="docs-side-nav-brand">
                <span className="docs-side-nav-brand__mark">AX</span>
                <div className="docs-side-nav-brand__copy">
                  <strong>Ops shell</strong>
                  <span>ToolPage host</span>
                </div>
              </div>
            }
            navigation={
              <NavigationList
                aria-label="Tool page navigation"
                defaultExpandedKeys={["workspace-operations"]}
                groups={shellNavigationGroups}
                value={activeNavigationKey}
                onValueChange={(value) =>
                  setActiveNavigationKey(value as ShellNavigationKey)
                }
              />
            }
          />
        }
      >
        <div className="docs-tool-page-content">
          <div className="docs-tool-page-main">
            <Toolbar
              end={
                <>
                  <Button variant="transparent">Open detail</Button>
                  <Button variant="default">Assign owner</Button>
                </>
              }
              headline={activeContent.heading}
              middle={
                <div className="docs-toolbar-summary">
                  <span className="docs-toolbar-pill">{activeContent.eyebrow}</span>
                  <span className="docs-toolbar-pill">
                    {formatWorklistScheduleLabel(activeWorkItem, locale)}
                  </span>
                  <span className="docs-toolbar-pill">{activeWorkItem.status}</span>
                </div>
              }
              start={<Button variant="transparent">Scope</Button>}
              supportingText="Header remains above the main work area while the content pane keeps its own scroll behavior."
              variant="toolbar"
            />

            <MessageStrip
              actions={<Button variant="transparent">Inspect shell</Button>}
              headline="ToolPage keeps shell structure explicit"
              tone="information"
            >
              This layout is meant to host a long-running workbench, not just a
              decorative page split. Header, rail and content stay distinct while
              still working as one application surface.
            </MessageStrip>

            <div className="docs-worklist-stack">
              {workItems.slice(0, 4).map((workItem) => {
                const selected = workItem.id === activeWorkItem.id;

                return (
                  <button
                    key={workItem.id}
                    className="docs-worklist-item"
                    data-selected={selected}
                    type="button"
                    onClick={() => setActiveWorkItemId(workItem.id)}
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
          </div>

          <div className="docs-tool-page-secondary">
            <Card
              eyebrow={activeContent.eyebrow}
              heading={activeWorkItem.object}
              description={activeContent.description}
              tone="brand"
            >
              <div className="docs-feedback-stack">
                {activeContent.bullets.map((bullet) => (
                  <span key={bullet} className="docs-feedback-line">
                    {bullet}
                  </span>
                ))}
              </div>
            </Card>

            <NotificationList
              heading="Related notifications"
              items={inboxItems.slice(0, 3).map((item) => ({
                ...item,
                action: <Button variant="transparent">Open</Button>,
              }))}
            />
          </div>
        </div>
      </ToolPage>
    </PageSection>
  );
}

interface FlexibleColumnLayoutDemoSectionProps {
  locale: string;
}

export function FlexibleColumnLayoutDemoSection({
  locale,
}: FlexibleColumnLayoutDemoSectionProps) {
  const [layout, setLayout] =
    useState<FlexibleColumnLayoutMode>("three-columns-mid-expanded");
  const [mobileColumn, setMobileColumn] =
    useState<FlexibleColumnLayoutColumnKey>("mid");
  const [activeWorkItemId, setActiveWorkItemId] = useState(workItems[0]?.id ?? "");
  const activeWorkItem =
    workItems.find((workItem) => workItem.id === activeWorkItemId) ?? workItems[0];

  if (!activeWorkItem) {
    return null;
  }

  return (
    <PageSection
      heading="Flexible column layout and list-detail-detail"
      description="FlexibleColumnLayout adds named layout states and mobile column fallback on top of the lighter SplitLayout, so long-running list-detail-detail work can stay in one structured surface."
      actions={
        <div className="docs-toggle-row">
          <Button
            selected={layout === "one-column"}
            variant="transparent"
            onClick={() => {
              setLayout("one-column");
              setMobileColumn("begin");
            }}
          >
            One
          </Button>
          <Button
            selected={layout === "two-columns-mid-expanded"}
            variant="transparent"
            onClick={() => {
              setLayout("two-columns-mid-expanded");
              setMobileColumn("mid");
            }}
          >
            Two
          </Button>
          <Button
            selected={layout === "three-columns-mid-expanded"}
            variant="transparent"
            onClick={() => {
              setLayout("three-columns-mid-expanded");
              setMobileColumn("mid");
            }}
          >
            Three Mid
          </Button>
          <Button
            selected={layout === "three-columns-end-expanded"}
            variant="transparent"
            onClick={() => {
              setLayout("three-columns-end-expanded");
              setMobileColumn("end");
            }}
          >
            Three End
          </Button>
        </div>
      }
    >
      <MessageStrip
        actions={<Button variant="transparent">Compare layouts</Button>}
        headline="SplitLayout is lighter; FlexibleColumnLayout is state-driven"
        tone="information"
      >
        SplitLayout is still useful for simpler master-detail screens. Flexible
        Column Layout is for explicit layout modes, column visibility rules and
        mobile single-column fallbacks in list-detail-detail workflows.
      </MessageStrip>

      <div className="docs-toggle-row">
        <Button
          selected={mobileColumn === "begin"}
          variant="transparent"
          onClick={() => setMobileColumn("begin")}
        >
          Mobile List
        </Button>
        <Button
          selected={mobileColumn === "mid"}
          variant="transparent"
          onClick={() => setMobileColumn("mid")}
        >
          Mobile Detail
        </Button>
        <Button
          selected={mobileColumn === "end"}
          variant="transparent"
          onClick={() => setMobileColumn("end")}
        >
          Mobile Context
        </Button>
      </div>

      <FlexibleColumnLayout
        className="docs-flexible-layout-demo"
        layout={layout}
        mobileColumn={mobileColumn}
        beginColumn={{
          title: "Worklist",
          description: "List pane for scan and selection.",
          toolbar: (
            <Button variant="transparent" onClick={() => setMobileColumn("begin")}>
              Focus list
            </Button>
          ),
          content: (
            <div className="docs-worklist-stack">
              {workItems.slice(0, 5).map((workItem) => {
                const selected = workItem.id === activeWorkItem.id;

                return (
                  <button
                    key={workItem.id}
                    className="docs-worklist-item"
                    data-selected={selected}
                    type="button"
                    onClick={() => {
                      setActiveWorkItemId(workItem.id);
                      setMobileColumn("mid");
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
        midColumn={{
          title: activeWorkItem.object,
          description: `${activeWorkItem.id} · ${formatWorklistScheduleLabel(activeWorkItem, locale)} · ${activeWorkItem.status}`,
          toolbar: (
            <div className="docs-toggle-row">
              <Button variant="transparent" onClick={() => setMobileColumn("mid")}>
                Focus detail
              </Button>
              <Button variant="default" onClick={() => setMobileColumn("end")}>
                Open context
              </Button>
            </div>
          ),
          content: (
            <div className="docs-split-detail">
              <MessageStrip
                actions={<Button variant="transparent">Track item</Button>}
                headline="The middle column remains the primary detail workspace"
                tone={getPriorityTone(activeWorkItem.priority)}
              >
                Layout states change the surrounding balance, but the detail
                column keeps the main editing and review flow intact.
              </MessageStrip>

              <FormGrid columns={2}>
                <FormField
                  description="Selected object"
                  htmlFor="fcl-object"
                  label="Object"
                >
                  <Input id="fcl-object" defaultValue={activeWorkItem.object} readOnly />
                </FormField>
                <FormField
                  description="Owner stream"
                  htmlFor="fcl-owner"
                  label="Owner"
                >
                  <Input id="fcl-owner" defaultValue={activeWorkItem.owner} />
                </FormField>
                <FormField
                  description="Current delivery status"
                  htmlFor="fcl-status"
                  label="Status"
                >
                  <Input
                    id="fcl-status"
                    defaultValue={activeWorkItem.status}
                    valueState="information"
                    message="The main detail pane should hold the transactional edit path."
                  />
                </FormField>
                <FormField
                  description="Execution date"
                  htmlFor="fcl-date"
                  label="Target date"
                >
                  <Input
                    id="fcl-date"
                    defaultValue={formatWorklistDateLabel(activeWorkItem.targetDate, locale)}
                    readOnly
                  />
                </FormField>
                <FormField
                  description="Execution time"
                  htmlFor="fcl-time"
                  label="Target time"
                >
                  <Input
                    id="fcl-time"
                    defaultValue={formatWorklistTimeLabel(activeWorkItem.targetTime, locale)}
                    readOnly
                  />
                </FormField>
              </FormGrid>
            </div>
          ),
        }}
        endColumn={{
          title: "Context",
          description: "Signals, alerts and follow-up stay beside the main detail.",
          toolbar: (
            <Button variant="transparent" onClick={() => setMobileColumn("end")}>
              Focus context
            </Button>
          ),
          content: (
            <div className="docs-split-context">
              <NotificationList
                heading="Related notifications"
                items={inboxItems.slice(0, 3).map((item) => ({
                  ...item,
                  action: <Button variant="transparent">Open</Button>,
                }))}
              />

              <Card
                eyebrow="Why a third column"
                heading="Keep adjacent context adjacent"
                description="The third pane is for support signals, not a duplicate detail view."
              >
                <div className="docs-feedback-stack">
                  <span className="docs-feedback-line">
                    List stays scannable in the first pane.
                  </span>
                  <span className="docs-feedback-line">
                    Detail work stays centered in the mid pane.
                  </span>
                  <span className="docs-feedback-line">
                    Context shifts to the end pane without hijacking the edit path.
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

export function BreadcrumbsDemoSection() {
  return (
    <PageSection
      heading="Breadcrumbs and object path context"
      description="Breadcrumbs keep long navigation paths readable without letting object-page headers collapse under deep business hierarchies."
    >
      <Card
        eyebrow="Overflow handling"
        heading="Long paths collapse in the middle"
        description="The first node and the most relevant tail stay visible, while the middle of the path can expand on demand."
        tone="brand"
      >
        <Breadcrumbs items={longBreadcrumbItems} maxVisibleItems={4} />
      </Card>

      <Card
        eyebrow="Object page usage"
        heading="Detail pages need context before content"
        description="Breadcrumbs belong above the object header so operators can recover navigation context before reading status, actions or sections."
      >
        <Breadcrumbs items={objectPageBreadcrumbItems} />
      </Card>
    </PageSection>
  );
}

export function ObjectDisplayPrimitivesDemoSection() {
  return (
    <PageSection
      heading="Avatar, object status and identifier primitives"
      description="Avatar, ObjectIdentifier and ObjectStatus give object pages, cards and lists a consistent way to express identity, lifecycle state and supporting metadata without inventing one-off header patterns."
    >
      <div className="docs-grid docs-grid--split">
        <Card
          eyebrow="Header building blocks"
          heading="Primary object identity"
          description="A large avatar, clear identifier and compact status row give future object-page headers a stable first line before actions and sections appear."
          tone="brand"
        >
          <div className="docs-object-primitive-stack">
            <div className="docs-object-identity-row">
              <Avatar
                alt="Mia Chen"
                name="Mia Chen"
                size="lg"
                src={avatarIllustrations.coordinator}
                statusLabel="Coordinator online"
                statusTone="success"
              />

              <ObjectIdentifier
                meta="Sales order · Priority route"
                subtitle="North America downstream fulfillment handover"
                title="SO-48291"
              />
            </div>

            <div className="docs-object-status-row">
              <ObjectStatus label="In process" tone="information" />
              <ObjectStatus label="Committed" tone="success" />
              <ObjectStatus label="Expedite" tone="warning" />
            </div>
          </div>
        </Card>

        <Card
          eyebrow="Card and list usage"
          heading="Scale across shell surfaces"
          description="The same avatar primitive should support photo, initials and icon fallback across lists, cards and operator identity slots."
        >
          <div className="docs-avatar-matrix">
            <div className="docs-avatar-swatch">
              <Avatar
                alt="ACME Retail Group"
                name="ACME Retail Group"
                shape="square"
                size="lg"
                src={avatarIllustrations.customer}
                statusLabel="Customer monitored"
                statusTone="information"
              />
              <span className="docs-avatar-caption">Image + status</span>
            </div>

            <div className="docs-avatar-swatch">
              <Avatar initials="MR" size="md" statusTone="warning" />
              <span className="docs-avatar-caption">Initials fallback</span>
            </div>

            <div className="docs-avatar-swatch">
              <Avatar iconName="person" size="sm" />
              <span className="docs-avatar-caption">Icon fallback</span>
            </div>

            <div className="docs-avatar-swatch">
              <Avatar name="Axiom Operations" shape="square" size="xs" />
              <span className="docs-avatar-caption">XS square</span>
            </div>
          </div>

          <div className="docs-object-identity-row docs-object-identity-row--compact">
            <Avatar
              alt="ACME Retail Group"
              name="ACME Retail Group"
              size="md"
              src={avatarIllustrations.customer}
            />

            <div className="docs-object-primitive-stack">
              <ObjectIdentifier
                meta="Sold-to party"
                subtitle="Global retail account"
                title="ACME Retail Group"
              />

              <div className="docs-object-status-row">
                <ObjectStatus label="Preferred" tone="success" />
                <ObjectStatus label="Credit review" tone="error" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageSection>
  );
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
  const objectPageSections: ObjectPageLayoutSection[] = [
    {
      key: "summary",
      label: "Summary",
      count: "02",
      heading: "Summary",
      description:
        "A summary section can mix KPI cards, local feedback and action strips without losing page rhythm.",
      actions: <Button variant="transparent">Open metrics</Button>,
      content: (
        <>
          <Card
            eyebrow="Header handoff"
            heading="Identity now lives in the page header"
            description="Summary sections no longer need to repeat core object identity just to rebuild context. The object header can hold route, title, lifecycle state and primary actions by itself."
          >
            <div className="docs-feedback-stack">
              <span className="docs-feedback-line">
                Breadcrumbs stay attached to the object context instead of
                floating as a separate strip.
              </span>
              <span className="docs-feedback-line">
                Avatar, title and statuses form one stable orientation block.
              </span>
              <span className="docs-feedback-line">
                Section content can now focus on metrics, forms and follow-up work.
              </span>
            </div>
          </Card>

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
            The object-page layer now holds multiple sections in one scrolling
            surface instead of forcing every business screen into tab-swapped
            panels.
          </MessageStrip>
        </>
      ),
      subsections: [
        {
          key: "commercial",
          eyebrow: "Summary subsection",
          heading: "Commercial overview",
          description:
            "Keep the first supporting subsection close to the header so the operator can connect identity, customer and business scope without context switches.",
          actions: <Button variant="transparent">Inspect commitments</Button>,
          content: (
            <div className="docs-grid docs-grid--split">
              <Card
                eyebrow="Customer context"
                heading="Account alignment"
                description="The object page can carry customer-facing context directly beside the commercial summary."
              >
                <div className="docs-object-identity-row docs-object-identity-row--compact">
                  <Avatar
                    alt="ACME Retail Group"
                    name="ACME Retail Group"
                    size="md"
                    src={avatarIllustrations.customer}
                    statusLabel="Customer monitored"
                    statusTone="information"
                  />
                  <div className="docs-object-primitive-stack">
                    <ObjectIdentifier
                      meta="Sold-to party"
                      subtitle="Global retail account"
                      title="ACME Retail Group"
                    />
                    <div className="docs-object-status-row">
                      <ObjectStatus label="Preferred" tone="success" />
                      <ObjectStatus label="Credit review" tone="error" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                eyebrow="Commercial scope"
                heading="Why subsection structure matters"
                description="Subsections let one object page keep clear local topics without flattening all details into one body column."
                tone="brand"
              >
                <div className="docs-feedback-stack">
                  <span className="docs-feedback-line">
                    Summary subsection for commercial context.
                  </span>
                  <span className="docs-feedback-line">
                    Delivery subsection for execution detail.
                  </span>
                  <span className="docs-feedback-line">
                    Inbox subsection for operational feedback.
                  </span>
                </div>
              </Card>
            </div>
          ),
        },
        {
          key: "risks",
          eyebrow: "Summary subsection",
          heading: "Fulfillment risks",
          description:
            "Anchor sync should stay coherent even when one section grows into multiple follow-up blocks.",
          actions: <Button variant="transparent">Open risk log</Button>,
          content: (
            <div className="docs-feedback-stack">
              <span className="docs-feedback-line">
                Credit hold still blocks partial release.
              </span>
              <span className="docs-feedback-line">
                Expedite route requires manual wave review.
              </span>
              <span className="docs-feedback-line">
                Customer requested same-day recovery update.
              </span>
            </div>
          ),
        },
      ],
    },
    {
      key: "delivery",
      label: "Delivery",
      count: "02",
      heading: "Delivery",
      description:
        "This section mirrors a delivery work area with fields, actions and bounded content groups.",
      actions: <Button variant="default">Sync states</Button>,
      content: (
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
      ),
      subsections: [
        {
          key: "plan",
          eyebrow: "Delivery subsection",
          heading: "Execution plan",
          description:
            "Subsections provide bounded edit areas without forcing the whole object page into independent tabs.",
          actions: <Button variant="transparent">Track schedule</Button>,
          content: (
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
                description="Stable subsection copy"
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
          ),
        },
        {
          key: "dependencies",
          eyebrow: "Delivery subsection",
          heading: "Dependency signals",
          description:
            "Execution subsections can mix operational notes and related blockers without leaving the object-page frame.",
          actions: <Button variant="transparent">Open dependency map</Button>,
          content: (
            <Card
              eyebrow="Execution context"
              heading="Cross-stream dependency check"
              description="The layout can host explanatory cards and execution notes inside the same anchored flow."
            >
              <div className="docs-feedback-stack">
                <span className="docs-feedback-line">
                  Pricing sync depends on the customer credit release.
                </span>
                <span className="docs-feedback-line">
                  Warehouse slot confirmation arrives at 17:30 local time.
                </span>
                <span className="docs-feedback-line">
                  Release owner needs one final schedule acknowledgement.
                </span>
              </div>
            </Card>
          ),
        },
      ],
    },
    {
      key: "inbox",
      label: "Inbox",
      count: "02",
      heading: "Inbox",
      description:
        "Notifications stay in the same design language as lists and message strips instead of becoming detached cards.",
      actions: <Button variant="transparent">Mark all read</Button>,
      content: (
        <MessageStrip
          actions={<Button variant="transparent">Inspect escalation</Button>}
          headline="Anchor sync now survives longer object pages"
          tone="warning"
        >
          Scroll through subsections and the active anchor still tracks the
          broader section instead of getting stuck on the first tab you clicked.
        </MessageStrip>
      ),
      subsections: [
        {
          key: "latest-updates",
          eyebrow: "Inbox subsection",
          heading: "Latest updates",
          description:
            "Operational notifications can live as subsections instead of replacing the entire object view.",
          content: (
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
          ),
        },
        {
          key: "escalation-notes",
          eyebrow: "Inbox subsection",
          heading: "Escalation notes",
          description:
            "A second subsection lets the anchor remain on Inbox while the page still breaks feedback into readable groups.",
          actions: <Button variant="transparent">Open timeline</Button>,
          content: (
            <Card
              eyebrow="Escalation posture"
              heading="Hold communication plan"
              description="Local feedback remains near the notification stream instead of jumping to a separate side workflow."
            >
              <div className="docs-feedback-stack">
                <span className="docs-feedback-line">
                  Customer success lead expects an update before 19:00.
                </span>
                <span className="docs-feedback-line">
                  Finance requested one more confirmation on payment terms.
                </span>
                <span className="docs-feedback-line">
                  Distribution center can release once the hold is cleared.
                </span>
              </div>
            </Card>
          ),
        },
      ],
    },
  ];

  return (
    <PageSection
      heading="Shell context, notifications and object sections"
      description="The next layer connects a second-level shell header, a real object-page header, anchored sections, subsections and side content into one enterprise object-page flow."
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

        <ObjectPageLayout
          header={
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
                  alt="SO-48291 coordinator"
                  name="Mia Chen"
                  size="xl"
                  src={avatarIllustrations.coordinator}
                  statusLabel="Coordinator online"
                  statusTone="success"
                />
              }
              breadcrumbs={<Breadcrumbs items={objectPageBreadcrumbItems} />}
              meta="Sales order · High value · Sold-to party ACME Retail Group"
              statuses={
                <>
                  <ObjectStatus label="In process" tone="information" />
                  <ObjectStatus label="Credit hold" tone="warning" />
                  <ObjectStatus label="Escalated" tone="error" />
                </>
              }
              subtitle="North America downstream fulfillment handover"
              title="SO-48291"
            />
          }
          onValueChange={(value) => setActiveSection(value as ObjectPageSectionKey)}
          sections={objectPageSections}
          sideContent={
            <div className="docs-shell-side">
              <Card
                eyebrow="Anchor sync"
                heading="Current active section"
                description="The anchor bar follows clicks and scroll position, so the page keeps a stable top-level orientation even when subsections get longer."
                tone="brand"
              >
                <div className="docs-feedback-stack">
                  <span className="docs-feedback-line">{activeSection}</span>
                  <span className="docs-feedback-line">3 sections</span>
                  <span className="docs-feedback-line">6 subsections</span>
                </div>
              </Card>

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
                description="App shell, tool header, object page header and anchored sections now form a clearer hierarchy."
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
                    Object page layout keeps sections and subsections in one scrolling frame.
                  </span>
                </div>
              </Card>
            </div>
          }
          value={activeSection}
        />
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
