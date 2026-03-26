import {
  Button,
  DataTable,
  Pagination,
  PageSection,
  type DataTableGroup,
  type TableSort,
} from "@axiomui/react";

import { type WorkItem, type WorklistGroupKey } from "../demo-data";
import { getWorklistGroupLabel, worklistColumns } from "./worklist-display";

interface WorklistResultsSectionProps {
  activeGroupBy: WorklistGroupKey | undefined;
  filteredItemsCount: number;
  groups: Array<DataTableGroup<WorkItem>> | undefined;
  onOpenCreateDialog: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectionChange: (rowIds: string[]) => void;
  onSortChange: (sort: TableSort | undefined) => void;
  page: number;
  pageCount: number;
  pageEnd: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageStart: number;
  rows: WorkItem[];
  selectedRowIds: string[];
  sort: TableSort | undefined;
  visibleColumnIds: string[];
}

export function WorklistResultsSection({
  activeGroupBy,
  filteredItemsCount,
  groups,
  onOpenCreateDialog,
  onPageChange,
  onPageSizeChange,
  onSelectionChange,
  onSortChange,
  page,
  pageCount,
  pageEnd,
  pageSize,
  pageSizeOptions,
  pageStart,
  rows,
  selectedRowIds,
  sort,
  visibleColumnIds,
}: WorklistResultsSectionProps) {
  return (
    <PageSection
      heading="Table, row state and pagination"
      description="Sorting, grouping, selection, semantic highlighting and page movement now share the same reusable worklist state model."
      actions={
        <Button variant="transparent" onClick={onOpenCreateDialog}>
          Open create dialog
        </Button>
      }
    >
      <div className="docs-table-stack">
        <DataTable
          caption={
            filteredItemsCount > 0
              ? activeGroupBy
                ? `Showing rows ${pageStart}-${pageEnd} of ${filteredItemsCount} filtered work items. Current page is sectioned by ${getWorklistGroupLabel(activeGroupBy)}.`
                : `Showing rows ${pageStart}-${pageEnd} of ${filteredItemsCount} filtered work items. Click a sortable header to change ordering.`
              : "No work items match the applied filters yet. Adjust the filter bar or switch to another variant."
          }
          columns={worklistColumns}
          emptyState="No work items match the applied filters. Adjust the filter bar or switch to another variant."
          getRowId={(row) => row.id}
          getRowMeta={(row) => ({
            navigated: row.id === "AX-1024",
            unread: row.id === "AX-1050",
          })}
          getRowTone={(row) => {
            if (row.priority === "Positive") {
              return "positive";
            }
            if (row.priority === "Information") {
              return "information";
            }
            if (row.priority === "Attention") {
              return "warning";
            }
            return "negative";
          }}
          manualSorting
          groups={groups}
          rows={rows}
          selectedRowIds={selectedRowIds}
          selectionMode="multiple"
          sort={sort}
          visibleColumnIds={visibleColumnIds}
          onSelectionChange={onSelectionChange}
          onSortChange={onSortChange}
        />

        <Pagination
          label="Worklist paging"
          page={page}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          summary={
            filteredItemsCount > 0
              ? `Showing ${pageStart}-${pageEnd} of ${filteredItemsCount} filtered items across ${pageCount} pages.`
              : "No rows are available for the current filter combination."
          }
          total={filteredItemsCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </PageSection>
  );
}
