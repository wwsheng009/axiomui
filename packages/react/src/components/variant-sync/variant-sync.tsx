import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";
import type { VariantSyncActivity } from "../../hooks/use-variant-sync";
import {
  formatVariantSyncStatus,
  type VariantSyncComparison,
  type VariantSyncSnapshot,
} from "../../lib/variant-sync";
import { Button } from "../button/button";
import { Dialog, type DialogProps } from "../dialog/dialog";
import {
  MessageStrip,
  type MessageTone,
} from "../message-strip/message-strip";
import { NotificationList } from "../notification-list/notification-list";

export interface VariantSyncPanelProps extends HTMLAttributes<HTMLElement> {
  actions?: ReactNode;
  meta?: ReactNode;
  note?: ReactNode;
}

export interface VariantSyncReviewWorkspaceCard {
  key: string;
  actions?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
}

export interface VariantSyncReviewEntry {
  key: string;
  actions?: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  title: ReactNode;
}

export interface VariantSyncReviewSection {
  key: string;
  entries: VariantSyncReviewEntry[];
  title: ReactNode;
}

export interface VariantSyncReviewProps extends HTMLAttributes<HTMLDivElement> {
  localPanelMeta?: ReactNode;
  localPanelTitle?: ReactNode;
  message?: ReactNode;
  messageHeadline?: ReactNode;
  messageTone?: MessageTone;
  meta?: ReactNode;
  remotePanelMeta?: ReactNode;
  remotePanelTitle?: ReactNode;
  sections?: VariantSyncReviewSection[];
  workspaceCards?: VariantSyncReviewWorkspaceCard[];
}

export interface VariantSyncDialogProps
  extends Omit<
    DialogProps,
    "actions" | "children" | "description" | "footerStart" | "size" | "title" | "tone"
  > {
  applyMergeLabel?: ReactNode;
  cancelLabel?: ReactNode;
  description?: ReactNode;
  direction?: "push" | "pull";
  footerNote?: ReactNode;
  onApplyMerge?: () => void;
  onResolve?: () => void;
  resolveLabel?: ReactNode;
  reviewProps: VariantSyncReviewProps;
  size?: DialogProps["size"];
  title?: ReactNode;
}

export interface VariantSyncActivityListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  activities: VariantSyncActivity[];
  emptyState?: ReactNode;
  heading?: ReactNode;
  maxItems?: number;
}

export interface VariantSyncSnapshotListProps<
  TPreset,
  TVariantKey extends string = string,
> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  emptyState?: ReactNode;
  heading?: ReactNode;
  maxItems?: number;
  snapshot: VariantSyncSnapshot<TPreset, TVariantKey> | null;
}

export interface VariantSyncComparisonSummaryProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  comparison?: VariantSyncComparison;
  heading?: ReactNode;
  localLabel?: ReactNode;
  localUpdatedAt?: string;
  remoteLabel?: ReactNode;
  remoteUpdatedAt?: string;
  statusLabel?: ReactNode;
}

function formatVariantSyncActivityMeta(occurredAt: string) {
  const date = new Date(occurredAt);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function formatVariantSyncSnapshotMeta(updatedAt: string) {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Remote snapshot";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function getVariantSyncComparisonTone(comparison: VariantSyncComparison | undefined): MessageTone {
  if (!comparison || comparison.status === "in-sync") {
    return "success";
  }
  if (
    comparison.status === "local-only" ||
    comparison.status === "remote-only"
  ) {
    return "information";
  }

  return "warning";
}

export function VariantSyncPanel({
  actions,
  className,
  meta,
  note,
  ...props
}: VariantSyncPanelProps) {
  return (
    <section
      className={cx("ax-variant-sync-panel", className)}
      {...props}
    >
      {meta ? <div className="ax-variant-sync-panel__meta">{meta}</div> : null}
      {actions ? (
        <div className="ax-variant-sync-panel__actions">{actions}</div>
      ) : null}
      {note ? <div className="ax-variant-sync-panel__note">{note}</div> : null}
    </section>
  );
}

export function VariantSyncComparisonSummary({
  className,
  comparison,
  heading = "Sync summary",
  localLabel = "Local",
  localUpdatedAt,
  remoteLabel = "Remote",
  remoteUpdatedAt,
  statusLabel,
  ...props
}: VariantSyncComparisonSummaryProps) {
  const resolvedStatusLabel = statusLabel ?? formatVariantSyncStatus(comparison);
  const tone = getVariantSyncComparisonTone(comparison);
  const statItems = [
    {
      label: "Changed",
      value: comparison?.changedKeys.length ?? 0,
    },
    {
      label: "Local only",
      value: comparison?.localOnlyKeys.length ?? 0,
    },
    {
      label: "Remote only",
      value: comparison?.remoteOnlyKeys.length ?? 0,
    },
    {
      label: "Startup",
      value: comparison?.startupChanged ? "Changed" : "Aligned",
    },
    {
      label: "Order",
      value: comparison?.orderChanged ? "Changed" : "Aligned",
    },
  ];

  return (
    <section
      className={cx("ax-variant-sync-summary", className)}
      {...props}
    >
      <div className="ax-variant-sync-summary__header">
        <strong className="ax-variant-sync-summary__title">{heading}</strong>
        <span className="ax-variant-sync-summary__status" data-tone={tone}>
          {resolvedStatusLabel}
        </span>
      </div>

      <div className="ax-variant-sync-summary__meta">
        <span className="ax-variant-sync-summary__meta-item">
          <strong>{localLabel}</strong>
          <span>{localUpdatedAt ? formatVariantSyncSnapshotMeta(localUpdatedAt) : "Unavailable"}</span>
        </span>
        <span className="ax-variant-sync-summary__meta-item">
          <strong>{remoteLabel}</strong>
          <span>{remoteUpdatedAt ? formatVariantSyncSnapshotMeta(remoteUpdatedAt) : "Unavailable"}</span>
        </span>
      </div>

      <div className="ax-variant-sync-summary__stats">
        {statItems.map((item) => (
          <article
            key={item.label}
            className="ax-variant-sync-summary__stat"
          >
            <span className="ax-variant-sync-summary__stat-label">{item.label}</span>
            <strong className="ax-variant-sync-summary__stat-value">{item.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export function VariantSyncActivityList({
  activities,
  className,
  emptyState = "No sync activity yet.",
  heading = "Recent sync activity",
  maxItems = 5,
  ...props
}: VariantSyncActivityListProps) {
  const items = activities.slice(0, maxItems).map((activity, index) => ({
    id: activity.id,
    title: activity.title,
    description: activity.description,
    meta: formatVariantSyncActivityMeta(activity.occurredAt),
    tone: activity.tone === "neutral" ? undefined : activity.tone,
    unread: index === 0,
  }));

  return (
    <NotificationList
      className={cx("ax-variant-sync-activity-list", className)}
      emptyState={emptyState}
      heading={heading}
      items={items}
      {...props}
    />
  );
}

export function VariantSyncSnapshotList<
  TPreset,
  TVariantKey extends string = string,
>({
  className,
  emptyState = "No remote snapshot available.",
  heading = "Remote snapshot",
  maxItems = 6,
  snapshot,
  ...props
}: VariantSyncSnapshotListProps<TPreset, TVariantKey>) {
  const items = snapshot
    ? snapshot.variants.slice(0, maxItems).map((variant) => ({
        action: (
          <div className="ax-variant-sync-snapshot-list__badges">
            {variant.key === snapshot.startupVariantKey ? (
              <span className="ax-variant-sync-snapshot-list__badge" data-tone="brand">
                Startup
              </span>
            ) : null}
            <span className="ax-variant-sync-snapshot-list__badge">
              {variant.key}
            </span>
          </div>
        ),
        description:
          variant.description ?? "No description has been saved for this view yet.",
        id: variant.key,
        meta: formatVariantSyncSnapshotMeta(variant.updatedAt),
        title: variant.label,
      }))
    : [];
  const resolvedHeading = (
    <div className="ax-variant-sync-snapshot-list__heading">
      <strong>{heading}</strong>
      {snapshot ? (
        <span className="ax-variant-sync-snapshot-list__summary">
          {formatVariantSyncSnapshotMeta(snapshot.updatedAt)} · {snapshot.variants.length} view
          {snapshot.variants.length === 1 ? "" : "s"}
        </span>
      ) : null}
    </div>
  );

  return (
    <NotificationList
      className={cx("ax-variant-sync-snapshot-list", className)}
      emptyState={emptyState}
      heading={resolvedHeading}
      items={items}
      {...props}
    />
  );
}

export function VariantSyncReview({
  children,
  className,
  localPanelMeta,
  localPanelTitle = "Local workspace",
  message,
  messageHeadline,
  messageTone = "warning",
  meta,
  remotePanelMeta,
  remotePanelTitle = "Remote workspace",
  sections = [],
  workspaceCards = [],
  ...props
}: VariantSyncReviewProps) {
  return (
    <div
      className={cx("ax-variant-sync-review", className)}
      {...props}
    >
      {meta ? <div className="ax-variant-sync-review__meta">{meta}</div> : null}

      {message || messageHeadline ? (
        <MessageStrip
          headline={messageHeadline}
          tone={messageTone}
        >
          {message}
        </MessageStrip>
      ) : null}

      {(localPanelMeta || remotePanelMeta) ? (
        <div className="ax-variant-sync-review__panels">
          <div className="ax-variant-sync-review__panel">
            <strong className="ax-variant-sync-review__panel-title">
              {localPanelTitle}
            </strong>
            {localPanelMeta ? (
              <div className="ax-variant-sync-review__panel-chips">
                {localPanelMeta}
              </div>
            ) : null}
          </div>

          <div className="ax-variant-sync-review__panel">
            <strong className="ax-variant-sync-review__panel-title">
              {remotePanelTitle}
            </strong>
            {remotePanelMeta ? (
              <div className="ax-variant-sync-review__panel-chips">
                {remotePanelMeta}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {workspaceCards.length > 0 ? (
        <section className="ax-variant-sync-review__section">
          <strong className="ax-variant-sync-review__section-title">
            Workspace decisions
          </strong>
          <div className="ax-variant-sync-review__workspace-grid">
            {workspaceCards.map((card) => (
              <div
                key={card.key}
                className="ax-variant-sync-review__workspace-card"
              >
                <strong className="ax-variant-sync-review__workspace-title">
                  {card.title}
                </strong>
                {card.meta ? (
                  <div className="ax-variant-sync-review__entry-meta">
                    {card.meta}
                  </div>
                ) : null}
                {card.actions ? (
                  <div className="ax-variant-sync-review__entry-actions">
                    {card.actions}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {sections.length > 0 ? (
        <div className="ax-variant-sync-review__sections">
          {sections.map((section) => (
            <section
              key={section.key}
              className="ax-variant-sync-review__section"
            >
              <strong className="ax-variant-sync-review__section-title">
                {section.title}
              </strong>
              <div className="ax-variant-sync-review__entry-list">
                {section.entries.map((entry) => (
                  <article
                    key={entry.key}
                    className="ax-variant-sync-review__entry"
                  >
                    <div className="ax-variant-sync-review__entry-header">
                      <strong className="ax-variant-sync-review__entry-title">
                        {entry.title}
                      </strong>
                      {entry.badge}
                    </div>
                    {entry.meta ? (
                      <div className="ax-variant-sync-review__entry-meta">
                        {entry.meta}
                      </div>
                    ) : null}
                    {entry.actions ? (
                      <div className="ax-variant-sync-review__entry-actions">
                        {entry.actions}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}

export function VariantSyncDialog({
  applyMergeLabel = "Apply reviewed merge",
  cancelLabel = "Cancel",
  closeOnOverlayClick = true,
  description,
  direction = "push",
  footerNote = (
    <span>
      Merge keeps your local working copy and adds remote changes on top. Overwrite
      or replace uses one side as the source of truth.
    </span>
  ),
  onApplyMerge,
  onClose,
  onResolve,
  open,
  resolveLabel = direction === "push" ? "Overwrite remote" : "Replace local",
  reviewProps,
  size = "lg",
  title = direction === "push" ? "Review remote overwrite" : "Review local overwrite",
  ...props
}: VariantSyncDialogProps) {
  const resolvedDescription =
    description ??
    (direction === "push"
      ? "Remote saved views changed since the last local snapshot. Review the differences before overwriting remote state."
      : "Local saved views changed since the last remote snapshot. Review the differences before replacing your local workspace.");

  return (
    <Dialog
      actions={
        <>
          <Button
            variant="transparent"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="default"
            onClick={onApplyMerge}
          >
            {applyMergeLabel}
          </Button>
          <Button
            variant="negative"
            onClick={onResolve}
          >
            {resolveLabel}
          </Button>
        </>
      }
      closeOnOverlayClick={closeOnOverlayClick}
      description={resolvedDescription}
      footerStart={footerNote}
      onClose={onClose}
      open={open}
      size={size}
      title={title}
      tone="warning"
      {...props}
    >
      <VariantSyncReview {...reviewProps} />
    </Dialog>
  );
}
