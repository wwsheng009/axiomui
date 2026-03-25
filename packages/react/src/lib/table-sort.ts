import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export interface TableSort {
  columnId: string;
  direction: SortDirection;
}

export type SortableValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export interface SortableColumn<T> {
  id: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortAccessor?: keyof T | ((row: T) => SortableValue);
}

export function resolveSortValue<T>(
  row: T,
  column: SortableColumn<T>,
): SortableValue {
  if (column.sortAccessor) {
    if (typeof column.sortAccessor === "function") {
      return column.sortAccessor(row);
    }

    return row[column.sortAccessor] as SortableValue;
  }

  if (typeof column.accessor === "function") {
    return undefined;
  }

  return row[column.accessor] as SortableValue;
}

export function compareSortValues(left: SortableValue, right: SortableValue) {
  if (left == null && right == null) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }

  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "boolean" && typeof right === "boolean") {
    return Number(left) - Number(right);
  }

  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortRows<T>(
  rows: T[],
  columns: Array<SortableColumn<T>>,
  sort?: TableSort,
) {
  if (!sort) {
    return rows;
  }

  const activeColumn = columns.find((column) => column.id === sort.columnId);

  if (!activeColumn) {
    return rows;
  }

  return [...rows].sort((leftRow, rightRow) => {
    const comparison = compareSortValues(
      resolveSortValue(leftRow, activeColumn),
      resolveSortValue(rightRow, activeColumn),
    );

    return sort.direction === "asc" ? comparison : -comparison;
  });
}
