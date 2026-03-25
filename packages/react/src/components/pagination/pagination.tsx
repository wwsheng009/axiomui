import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../lib/cx";

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  page: number;
  pageSize: number;
  total: number;
  label?: ReactNode;
  summary?: ReactNode;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

function clampPage(page: number, pageCount: number) {
  return Math.min(Math.max(page, 1), pageCount);
}

function createPageItems(page: number, pageCount: number) {
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);

  if (page <= 3) {
    pages.add(2);
    pages.add(3);
  }

  if (page >= pageCount - 2) {
    pages.add(pageCount - 1);
    pages.add(pageCount - 2);
  }

  const visiblePages = [...pages].filter((value) => value >= 1 && value <= pageCount);
  visiblePages.sort((left, right) => left - right);

  const items: Array<number | string> = [];
  let previousPage = 0;

  visiblePages.forEach((visiblePage) => {
    if (previousPage > 0 && visiblePage - previousPage > 1) {
      items.push(`ellipsis-${previousPage}-${visiblePage}`);
    }

    items.push(visiblePage);
    previousPage = visiblePage;
  });

  return items;
}

export function Pagination({
  className,
  label = "Pagination",
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  summary,
  total,
  ...props
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));
  const activePage = clampPage(page, pageCount);
  const rangeStart = total === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(total, activePage * pageSize);
  const resolvedSummary =
    summary ?? (total === 0 ? "No items to display." : `Showing ${rangeStart}-${rangeEnd} of ${total} items.`);
  const resolvedPageSizeOptions = [...new Set([...pageSizeOptions, pageSize])].sort(
    (left, right) => left - right,
  );
  const pageItems = createPageItems(activePage, pageCount);

  function goToPage(nextPage: number) {
    const resolvedPage = clampPage(nextPage, pageCount);

    if (resolvedPage !== activePage) {
      onPageChange?.(resolvedPage);
    }
  }

  return (
    <div className={cx("ax-pagination", className)} {...props}>
      <div className="ax-pagination__meta">
        <span className="ax-pagination__label">{label}</span>
        <span className="ax-pagination__summary">{resolvedSummary}</span>
      </div>

      <div className="ax-pagination__controls">
        {onPageSizeChange ? (
          <label className="ax-pagination__size-field">
            <span className="ax-pagination__size-label">Rows</span>
            <span className="ax-pagination__select-wrap">
              <select
                className="ax-pagination__select"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
              >
                {resolvedPageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} / page
                  </option>
                ))}
              </select>
              <span className="ax-pagination__select-icon" aria-hidden="true">
                ▾
              </span>
            </span>
          </label>
        ) : null}

        <nav className="ax-pagination__pages" aria-label="Pagination">
          <button
            className="ax-pagination__button"
            disabled={activePage <= 1}
            type="button"
            onClick={() => goToPage(activePage - 1)}
          >
            Previous
          </button>

          {pageItems.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                className="ax-pagination__button"
                data-current={item === activePage}
                type="button"
                aria-current={item === activePage ? "page" : undefined}
                onClick={() => goToPage(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="ax-pagination__ellipsis" aria-hidden="true">
                ...
              </span>
            ),
          )}

          <button
            className="ax-pagination__button"
            disabled={activePage >= pageCount}
            type="button"
            onClick={() => goToPage(activePage + 1)}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
}
