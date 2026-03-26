import { useRef, useState } from "react";

import {
  Button,
  Input,
  Menu,
  MessagePopover,
  MessageStrip,
  PageSection,
  Popover,
  ResponsivePopover,
  Toolbar,
} from "@axiomui/react";

import { inboxItems } from "./demo-data";

const toolbarMenuItems = [
  {
    id: "open-summary",
    label: "Open summary",
    description: "Move into the current object context",
    iconName: "information",
  },
  {
    id: "assign-owner",
    label: "Assign owner",
    description: "Stage a primary reviewer",
    iconName: "person",
  },
  {
    id: "share",
    label: "Share",
    items: [
      { id: "share-email", label: "Share by email" },
      { id: "share-slack", label: "Share to Slack" },
    ],
  },
  {
    id: "delete-draft",
    label: "Delete draft",
    destructive: true,
    iconName: "warning",
  },
];

export function OverlayDemoSections() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [responsivePopoverOpen, setResponsivePopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLastAction, setMenuLastAction] = useState("None");
  const [messagePopoverOpen, setMessagePopoverOpen] = useState(false);
  const [messagePopoverLastItem, setMessagePopoverLastItem] = useState("None");
  const popoverTriggerRef = useRef<HTMLButtonElement>(null);
  const responsivePopoverTriggerRef = useRef<HTMLButtonElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const messagePopoverTriggerRef = useRef<HTMLButtonElement>(null);
  const messagePopoverItems = inboxItems.map((item) => ({
    id: item.id,
    description: item.description,
    meta: item.meta,
    title: item.title,
    tone: item.tone,
    unread: item.unread,
  }));

  return (
    <>
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
        heading="Responsive popover"
        description="The same overlay can stay anchored on desktop and step up into a stronger small-screen sheet without changing its content model."
      >
        <div className="docs-popover-demo">
          <Button
            ref={responsivePopoverTriggerRef}
            iconName="menu"
            selected={responsivePopoverOpen}
            variant="default"
            onClick={() =>
              setResponsivePopoverOpen((currentValue) => !currentValue)
            }
          >
            Open responsive actions
          </Button>
          <span className="docs-card-copy">
            Shrink below 640px to see the same overlay switch from anchored
            popover to bottom sheet.
          </span>
        </div>

        <ResponsivePopover
          actions={
            <div className="docs-popover-actions">
              <Button
                variant="transparent"
                onClick={() => setResponsivePopoverOpen(false)}
              >
                Dismiss
              </Button>
              <Button
                variant="emphasized"
                onClick={() => setResponsivePopoverOpen(false)}
              >
                Apply
              </Button>
            </div>
          }
          anchorRef={responsivePopoverTriggerRef}
          closable
          description="ResponsivePopover preserves the same title, description, content and footer API while changing its shell per viewport."
          matchTriggerWidth
          onOpenChange={setResponsivePopoverOpen}
          open={responsivePopoverOpen}
          title="Adaptive actions"
        >
          <div className="docs-popover-body">
            <Input
              label="Review scope"
              placeholder="Advanced filters"
              description="On desktop this stays field-bound; on small screens it becomes a stronger focused task surface."
            />
            <MessageStrip headline="Viewport-aware shell" tone="information">
              This is the container layer intended for Menu and MessagePopover next.
            </MessageStrip>
          </div>
        </ResponsivePopover>
      </PageSection>

      <PageSection
        heading="Menu actions"
        description="Menu now reuses ResponsivePopover as its shell, adds drill-in submenus, and can sit directly on a toolbar action without one-off overlay code."
      >
        <Toolbar
          headline="Review workspace"
          supportingText={`Last action: ${menuLastAction}`}
          end={
            <Button
              ref={menuTriggerRef}
              iconName="menu"
              selected={menuOpen}
              variant="transparent"
              onClick={() => setMenuOpen((currentValue) => !currentValue)}
            >
              More actions
            </Button>
          }
        />

        <Menu
          anchorRef={menuTriggerRef}
          closable
          description="This is the same menu container intended for tool headers, row actions and object page overflow actions."
          items={toolbarMenuItems}
          onAction={(itemId, item) =>
            setMenuLastAction(typeof item.label === "string" ? item.label : itemId)
          }
          onOpenChange={setMenuOpen}
          open={menuOpen}
          placement="bottom-end"
          title="Workspace actions"
        />
      </PageSection>

      <PageSection
        heading="Message popover"
        description="MessagePopover now turns the same responsive overlay shell into a grouped feedback inbox that can sit on a toolbar or shell header action."
      >
        <Toolbar
          headline="Operations inbox"
          supportingText={`Last opened: ${messagePopoverLastItem}`}
          end={
            <Button
              ref={messagePopoverTriggerRef}
              selected={messagePopoverOpen}
              variant="default"
              onClick={() =>
                setMessagePopoverOpen((currentValue) => !currentValue)
              }
            >
              Open inbox
            </Button>
          }
        />

        <MessagePopover
          anchorRef={messagePopoverTriggerRef}
          items={messagePopoverItems}
          onItemClick={(item) => {
            setMessagePopoverLastItem(
              typeof item.title === "string" ? item.title : item.id,
            );
            setMessagePopoverOpen(false);
          }}
          onOpenChange={setMessagePopoverOpen}
          open={messagePopoverOpen}
        />
      </PageSection>
    </>
  );
}
