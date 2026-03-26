import { Fragment, useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../lib/cx";
import {
  sortRows,
  type SortableValue,
  type TableSort,
} from "../../lib/table-sort";

export type { SortDirection, TableSort } from "../../lib/table-sort";

export type TableRowTone =
  | "default"
  | "information"
  | "positive"
  | "warning"
  | "negative";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  align?: "start" | "center" | "end";
  width?: string;
  mobileLabel?: string;
  sortable?: boolean;
  sortAccessor?: keyof T | ((row: T) => SortableValue);
}

export interface TableRowMeta {
  navigated?: boolean;
  unread?: boolean;
}

export interface DataTableGroup<T> {
  key: string;
  label: ReactNode;
  rows: T[];
  description?: ReactNode;
  count?: ReactNode;
}

export interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  columns: Array<DataTableColumn<T>>;
  rows: T[];
  groups?: Array<DataTableGroup<T>>;
  getRowId: (row: T) => string;
  caption?: ReactNode;
  emptyState?: ReactNode;
  selectionMode?: "none" | "single" | "multiple";
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectionChange?: (rowIds: string[]) => void;
  getRowTone?: (row: T) => TableRowTone;
  getRowMeta?: (row: T) => TableRowMeta;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  sort?: TableSort;
  defaultSort?: TableSort;
  onSortChange?: (sort: TableSort | undefined) => void;
  visibleColumnIds?: string[];
  manualSorting?: boolean;
}

function resolveCellValue<T>(
  row: T,
  accessor: DataTableColumn<T>["accessor"],
): ReactNode {
  if (typeof accessor === "function") {
    return accessor(row);
  }

  return row[accessor] as ReactNode;
}

export function DataTable<T>({
  caption,
  className,
  columns,
  defaultSort,
  defaultSelectedRowIds = [],
  emptyState = "No rows available.",
  getRowId,
  getRowMeta,
  getRowTone,
  groups,
  manualSorting = false,
  onSortChange,
  onRowClick,
  onSelectionChange,
  rows,
  selectedRowIds,
  selectionMode = "none",
  sort,
  striped = true,
  visibleColumnIds,
  ...props
}: DataTableProps<T>) {
  const [internalSelectedRowIds, setInternalSelectedRowIds] = useState(
    defaultSelectedRowIds,
  );
  const [internalSort, setInternalSort] = useState<TableSort | undefined>(defaultSort);
  const activeSelectedRowIds = selectedRowIds ?? internalSelectedRowIds;
  const activeSort = sort ?? internalSort;
  const activeColumns = visibleColumnIds
    ? columns.filter((column) => visibleColumnIds.includes(column.id))
    : columns;
  const activeRows = manualSorting ? rows : sortRows(rows, columns, activeSort);
  const activeGroups = groups?.filter((group) => group.rows.length > 0);
  const hasGroups = Boolean(activeGroups?.length);

  function updateSelection(rowId: string) {
    const alreadySelected = activeSelectedRowIds.includes(rowId);
    let nextSelectedRowIds = activeSelectedRowIds;

    if (selectionMode === "single") {
      nextSelectedRowIds = alreadySelected ? [] : [rowId];
    } else if (selectionMode === "multiple") {
      nextSelectedRowIds = alreadySelected
        ? activeSelectedRowIds.filter((selectedRowId) => selectedRowId !== rowId)
        : [...activeSelectedRowIds, rowId];
    }

    if (selectedRowIds === undefined) {
      setInternalSelectedRowIds(nextSelectedRowIds);
    }

    onSelectionChange?.(nextSelectedRowIds);
  }

  function updateSort(column: DataTableColumn<T>) {
    if (!column.sortable) {
      return;
    }

    let nextSort: TableSort | undefined;

    if (activeSort?.columnId !== column.id) {
      nextSort = { columnId: column.id, direction: "asc" };
    } else if (activeSort.direction === "asc") {
      nextSort = { columnId: column.id, direction: "desc" };
    }

    if (sort === undefined) {
      setInternalSort(nextSort);
    }

    onSortChange?.(nextSort);
  }

  function renderRow(row: T) {
    const rowId = getRowId(row);
    const meta = getRowMeta?.(row);
    const selected = activeSelectedRowIds.includes(rowId);

    return (
      <tr
        key={rowId}
        data-clickable={Boolean(onRowClick)}
        data-navigated={meta?.navigated}
        data-selected={selected}
        data-tone={getRowTone?.(row) ?? "default"}
        data-unread={meta?.unread}
        onClick={() => onRowClick?.(row)}
      >
        {selectionMode !== "none" ? (
          <td
            className="ax-data-table__selection-column"
            data-label="Select"
          >
            <label className="ax-data-table__selection-control">
              <input
                checked={selected}
                name={selectionMode === "single" ? "ax-table-select" : rowId}
                type={selectionMode === "single" ? "radio" : "checkbox"}
                onChange={() => updateSelection(rowId)}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
          </td>
        ) : null}

        {activeColumns.map((column) => (
          <td
            key={column.id}
            data-label={
              column.mobileLabel ??
              (typeof column.header === "string"
                ? column.header
                : column.id)
            }
            style={{
              textAlign:
                column.align === "center"
                  ? "center"
                  : column.align === "end"
                    ? "right"
                    : "left",
            }}
          >
            <div className="ax-data-table__cell">
              {resolveCellValue(row, column.accessor)}
            </div>
          </td>
        ))}
      </tr>
    );
  }

  return (
    <div
      className={cx("ax-data-table", className)}
      data-grouped={hasGroups}
      data-striped={striped}
      {...props}
    >
      {caption ? <div className="ax-data-table__caption">{caption}</div> : null}

      <div className="ax-data-table__surface">
        <table>
          <thead>
            <tr>
              {selectionMode !== "none" ? (
                <th className="ax-data-table__selection-column" scope="col">
                  Select
                </th>
              ) : null}
              {activeColumns.map((column) => (
                <th
                  key={column.id}
                  aria-sort={
                    activeSort?.columnId === column.id
                      ? activeSort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  scope="col"
                  style={{
                    textAlign:
                      column.align === "center"
                        ? "center"
                        : column.align === "end"
                        ? "right"
                        : "left",
                    width: column.width,
                  }}
                >
                  {column.sortable ? (
                    <button
                      className="ax-data-table__sort-trigger"
                      data-direction={
                        activeSort?.columnId === column.id
                          ? activeSort.direction
                          : "none"
                      }
                      type="button"
                      onClick={() => updateSort(column)}
                    >
                      <span>{column.header}</span>
                      <span className="ax-data-table__sort-indicator" aria-hidden="true">
                        {activeSort?.columnId === column.id
                          ? activeSort.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {activeRows.length > 0 ? (
              hasGroups ? (
                activeGroups?.map((group) => (
                  <Fragment key={group.key}>
                    <tr className="ax-data-table__group-row">
                      <td
                        className="ax-data-table__group-cell"
                        colSpan={activeColumns.length + (selectionMode === "none" ? 0 : 1)}
                      >
                        <div className="ax-data-table__group-content">
                          <div className="ax-data-table__group-main">
                            <strong className="ax-data-table__group-label">
                              {group.label}
                            </strong>
                            {group.description ? (
                              <span className="ax-data-table__group-description">
                                {group.description}
                              </span>
                            ) : null}
                          </div>
                          <span className="ax-data-table__group-count">
                            {group.count ?? `${group.rows.length} rows`}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {group.rows.map((row) => renderRow(row))}
                  </Fragment>
                ))
              ) : (
                activeRows.map((row) => renderRow(row))
              )
            ) : (
              <tr className="ax-data-table__empty-row">
                <td
                  className="ax-data-table__empty-cell"
                  colSpan={activeColumns.length + (selectionMode === "none" ? 0 : 1)}
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
