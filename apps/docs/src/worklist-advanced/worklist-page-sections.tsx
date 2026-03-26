import {
  Button,
  ColumnManager,
  DateRangePicker,
  FilterBar,
  FormField,
  FormGrid,
  GroupManager,
  Input,
  MultiComboBox,
  MultiInput,
  PageSection,
  Select,
  SortManager,
  TimePicker,
  Toolbar,
  VariantManager,
  type TableSort,
  type VariantOption,
} from "@axiomui/react";

import {
  ownerComboBoxItems,
  priorityFilterSelectItems,
  type MockRemoteVariantSnapshot,
  type WorklistFilters,
  type WorklistGroupKey,
  type WorklistVariantKey,
  worklistColumnItems,
  worklistGroupItems,
  worklistSortItems,
} from "../demo-data";
import {
  formatRemoteSnapshotLabel,
  formatWorklistOwnersLabel,
  getWorklistGroupLabel,
  getWorklistSortLabel,
} from "./worklist-display";
import {
  formatWorklistDateRangeLabel,
  formatWorklistTimeLabel,
} from "./worklist-utils";

interface WorklistFilterManagementSectionProps {
  activeGroupBy: WorklistGroupKey | undefined;
  activeRemoteAdapterLabel: string;
  activeVariant: WorklistVariantKey;
  activeVariantDirty: boolean;
  activeVariantLabel: string;
  appliedFilters: WorklistFilters;
  applyDraftFilters: () => void;
  densityLabel: string;
  draftFilters: WorklistFilters;
  filteredItemsCount: number;
  locale: string;
  localeLabel: string;
  onActiveGroupByChange: (groupBy: WorklistGroupKey | undefined) => void;
  onApplyVariantSelection: (variantKey: WorklistVariantKey) => void;
  onOpenManageVariants: () => void;
  onOpenSaveVariant: () => void;
  onResetDraftColumnsToVariant: () => void;
  onResetGroupToVariant: () => void;
  onResetSortToVariant: () => void;
  onResetToActiveVariant: () => void;
  onSetActiveVariantAsStartup: () => void;
  onShowAllDraftColumns: () => void;
  onSortChange: (sort: TableSort | undefined) => void;
  onUpdateDraftFilter: <K extends keyof WorklistFilters>(
    key: K,
    value: WorklistFilters[K],
  ) => void;
  onUpdateDraftVisibleColumns: (visibleColumnIds: string[]) => void;
  page: number;
  pageCount: number;
  pageEnd: number;
  pageGroupCount: number;
  pageStart: number;
  remoteSnapshot: MockRemoteVariantSnapshot | null;
  remoteSyncStatusLabel: string;
  savedVariantCount: number;
  startupVariantKey: WorklistVariantKey;
  startupVariantLabel: string;
  tableSort: TableSort | undefined;
  themeLabel: string;
  totalItems: number;
  variants: VariantOption[];
}

export function WorklistFilterManagementSection({
  activeGroupBy,
  activeRemoteAdapterLabel,
  activeVariant,
  activeVariantDirty,
  activeVariantLabel,
  appliedFilters,
  applyDraftFilters,
  densityLabel,
  draftFilters,
  filteredItemsCount,
  locale,
  localeLabel,
  onActiveGroupByChange,
  onApplyVariantSelection,
  onOpenManageVariants,
  onOpenSaveVariant,
  onResetDraftColumnsToVariant,
  onResetGroupToVariant,
  onResetSortToVariant,
  onResetToActiveVariant,
  onSetActiveVariantAsStartup,
  onShowAllDraftColumns,
  onSortChange,
  onUpdateDraftFilter,
  onUpdateDraftVisibleColumns,
  page,
  pageCount,
  pageEnd,
  pageGroupCount,
  pageStart,
  remoteSnapshot,
  remoteSyncStatusLabel,
  savedVariantCount,
  startupVariantKey,
  startupVariantLabel,
  tableSort,
  themeLabel,
  totalItems,
  variants,
}: WorklistFilterManagementSectionProps) {
  return (
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
            <Button variant="transparent" onClick={onResetToActiveVariant}>
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
            <span className="docs-filter-chip">Search: {appliedFilters.search || "All"}</span>
            <span className="docs-filter-chip">
              Keywords: {appliedFilters.keywords.length || "None"}
            </span>
            <span className="docs-filter-chip">
              Target range: {formatWorklistDateRangeLabel(appliedFilters.targetDateRange, locale)}
            </span>
            <span className="docs-filter-chip">
              Earliest time: {formatWorklistTimeLabel(appliedFilters.targetTimeFrom, locale)}
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
            <span className="docs-filter-chip">Saved views: {savedVariantCount}</span>
            <span className="docs-filter-chip">Startup: {startupVariantLabel}</span>
            <span className="docs-filter-chip">
              Remote: {formatRemoteSnapshotLabel(remoteSnapshot)}
            </span>
            <span className="docs-filter-chip">Adapter: {activeRemoteAdapterLabel}</span>
            <span className="docs-filter-chip">Sync: {remoteSyncStatusLabel}</span>
            <span className="docs-filter-chip">
              {activeVariantDirty ? "Unsaved changes" : "Variant in sync"}
            </span>
            <span className="docs-filter-chip">Density: {densityLabel}</span>
            <span className="docs-filter-chip">Theme: {themeLabel}</span>
            <span className="docs-filter-chip">Locale: {localeLabel}</span>
          </div>
        }
        variant={
          <VariantManager
            actions={
              <>
                <Button variant="transparent" onClick={onOpenSaveVariant}>
                  Save
                </Button>
                <Button
                  selected={startupVariantKey === activeVariant}
                  variant="transparent"
                  onClick={onSetActiveVariantAsStartup}
                >
                  Set startup
                </Button>
                <Button variant="transparent" onClick={onOpenManageVariants}>
                  Manage
                </Button>
              </>
            }
            value={activeVariant}
            variants={variants}
            onValueChange={onApplyVariantSelection}
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
              onChange={(event) => onUpdateDraftFilter("search", event.target.value)}
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
              onValuesChange={(values) => onUpdateDraftFilter("owners", values)}
            />
          </FormField>

          <FormField
            description="Inclusive planning window"
            htmlFor="filter-target-date-range-start"
            label="Target range"
          >
            <DateRangePicker
              id="filter-target-date-range"
              maxDate="2026-09-30"
              message="Filter by an inclusive milestone window with explicit start and end editing."
              minDate="2026-04-01"
              value={draftFilters.targetDateRange}
              onValueChange={(value) => onUpdateDraftFilter("targetDateRange", value)}
            />
          </FormField>

          <FormField
            description="Lower bound for scheduled execution time"
            htmlFor="filter-target-time"
            label="Earliest time"
          >
            <TimePicker
              id="filter-target-time"
              format={
                locale === "zh-CN"
                  ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }
                  : undefined
              }
              message="Filter rows scheduled at or after this time. Quarter-hour increments keep the filter deterministic."
              minuteStep={15}
              value={draftFilters.targetTimeFrom}
              onValueChange={(value) => onUpdateDraftFilter("targetTimeFrom", value)}
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
              onValuesChange={(values) => onUpdateDraftFilter("keywords", values)}
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
              onValueChange={(value) => onUpdateDraftFilter("priority", value)}
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
              onChange={(event) => onUpdateDraftFilter("status", event.target.value)}
            />
          </FormField>

          <FormField description="Release slot" htmlFor="filter-wave" label="Wave">
            <Input
              id="filter-wave"
              value={draftFilters.wave}
              onChange={(event) => onUpdateDraftFilter("wave", event.target.value)}
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
              onChange={(event) => onUpdateDraftFilter("region", event.target.value)}
            />
          </FormField>
        </FormGrid>

        <div className="docs-personalization-grid">
          <ColumnManager
            actions={
              <>
                <Button variant="transparent" onClick={onShowAllDraftColumns}>
                  Show all
                </Button>
                <Button variant="transparent" onClick={onResetDraftColumnsToVariant}>
                  Reset columns
                </Button>
              </>
            }
            description="Column visibility now lives in a dedicated personalization surface instead of a few one-off footer buttons."
            heading="Column personalization"
            items={worklistColumnItems}
            summary={`${draftFilters.visibleColumnIds.length} staged columns for the active variant`}
            value={draftFilters.visibleColumnIds}
            onValueChange={onUpdateDraftVisibleColumns}
          />

          <SortManager
            actions={
              <Button variant="transparent" onClick={onResetSortToVariant}>
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
            onSortChange={onSortChange}
          />

          <GroupManager
            actions={
              <Button variant="transparent" onClick={onResetGroupToVariant}>
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
              onActiveGroupByChange(value as WorklistGroupKey | undefined)
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
            <span className="docs-toolbar-pill">Active view: {activeVariantLabel}</span>
            <span className="docs-toolbar-pill">Startup view: {startupVariantLabel}</span>
            <span className="docs-toolbar-pill">
              Remote: {formatRemoteSnapshotLabel(remoteSnapshot)}
            </span>
            <span className="docs-toolbar-pill">Adapter: {activeRemoteAdapterLabel}</span>
            <span className="docs-toolbar-pill">Sync: {remoteSyncStatusLabel}</span>
            <span className="docs-toolbar-pill">
              {filteredItemsCount} / {totalItems} visible items
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
            <span className="docs-toolbar-pill">Page groups: {pageGroupCount}</span>
            <span className="docs-toolbar-pill">
              Columns: {appliedFilters.visibleColumnIds.join(", ")}
            </span>
            <span className="docs-toolbar-pill">
              Time from: {formatWorklistTimeLabel(appliedFilters.targetTimeFrom, locale)}
            </span>
          </div>
        }
        start={<Button variant="transparent">Results</Button>}
        supportingText="A worklist can sit directly beneath the filter bar without inventing a new layout grammar, and local views can now define the startup workspace after refresh."
        variant="header"
      />
    </PageSection>
  );
}
