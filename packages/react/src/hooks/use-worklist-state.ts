import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  sortRows,
  type SortableColumn,
  type TableSort,
} from "../lib/table-sort";

export interface WorklistPreset<TFilters> {
  filters: TFilters;
  sort?: TableSort;
  pageSize?: number;
}

export interface WorklistPersistenceOptions {
  storageKey: string;
  version?: number;
  persistSelectedRowIds?: boolean;
}

export interface UseWorklistStateOptions<
  TItem,
  TFilters,
  TVariantKey extends string,
> {
  items: TItem[];
  columns: Array<SortableColumn<TItem>>;
  variants: Record<TVariantKey, WorklistPreset<TFilters>>;
  initialVariant: TVariantKey;
  cloneFilters: (filters: TFilters) => TFilters;
  normalizeFilters?: (filters: TFilters) => TFilters;
  filterItem: (item: TItem, filters: TFilters) => boolean;
  getVisibleColumnIds?: (filters: TFilters) => string[] | undefined;
  defaultPageSize?: number;
  defaultSelectedRowIds?: string[];
  persistence?: WorklistPersistenceOptions;
}

export interface UseWorklistStateResult<
  TItem,
  TFilters,
  TVariantKey extends string,
> {
  activeVariant: TVariantKey;
  draftFilters: TFilters;
  appliedFilters: TFilters;
  visibleColumnIds?: string[];
  selectedRowIds: string[];
  sort: TableSort | undefined;
  page: number;
  pageSize: number;
  pageCount: number;
  pageStart: number;
  pageEnd: number;
  totalItems: number;
  filteredItems: TItem[];
  paginatedItems: TItem[];
  applyDraftFilters: () => void;
  applyVariant: (variantKey: TVariantKey) => void;
  resetToVariant: (variantKey?: TVariantKey) => void;
  setDraftFilters: Dispatch<SetStateAction<TFilters>>;
  setSelectedRowIds: Dispatch<SetStateAction<string[]>>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (sort: TableSort | undefined) => void;
  updateDraftFilter: <Key extends keyof TFilters>(
    key: Key,
    value: TFilters[Key],
  ) => void;
}

function clampPage(page: number, pageCount: number) {
  return Math.min(Math.max(page, 1), pageCount);
}

function createPageCount(totalItems: number, pageSize: number) {
  return Math.max(1, Math.ceil(totalItems / Math.max(pageSize, 1)));
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isValidVariantKey<TVariantKey extends string>(
  variants: Record<TVariantKey, WorklistPreset<unknown>>,
  value: string,
): value is TVariantKey {
  return Object.prototype.hasOwnProperty.call(variants, value);
}

function isValidSort<TItem>(
  sort: TableSort | undefined,
  columns: Array<SortableColumn<TItem>>,
) {
  return Boolean(sort && columns.some((column) => column.id === sort.columnId));
}

interface InitialWorklistState<TFilters, TVariantKey extends string> {
  activeVariant: TVariantKey;
  draftFilters: TFilters;
  appliedFilters: TFilters;
  sort: TableSort | undefined;
  pageSize: number;
  selectedRowIds: string[];
}

interface PersistedWorklistState<TFilters, TVariantKey extends string> {
  version: number;
  activeVariant: TVariantKey;
  draftFilters: TFilters;
  appliedFilters: TFilters;
  sort?: TableSort;
  pageSize: number;
  selectedRowIds?: string[];
}

export function useWorklistState<TItem, TFilters, TVariantKey extends string>({
  cloneFilters,
  columns,
  defaultPageSize = 5,
  defaultSelectedRowIds = [],
  filterItem,
  getVisibleColumnIds,
  initialVariant,
  items,
  normalizeFilters,
  persistence,
  variants,
}: UseWorklistStateOptions<TItem, TFilters, TVariantKey>): UseWorklistStateResult<
  TItem,
  TFilters,
  TVariantKey
> {
  const persistenceStorageKey = persistence?.storageKey;
  const persistSelectedRowIds = persistence?.persistSelectedRowIds ?? false;
  const persistenceVersion = persistence?.version ?? 1;

  function prepareFilters(filters: TFilters) {
    const clonedFilters = cloneFilters(filters);

    return normalizeFilters ? normalizeFilters(clonedFilters) : clonedFilters;
  }

  function createVariantState(variantKey: TVariantKey) {
    const preset = variants[variantKey];

    return {
      filters: prepareFilters(preset.filters),
      sort: preset.sort ? { ...preset.sort } : undefined,
      pageSize: preset.pageSize ?? defaultPageSize,
    };
  }

  const initialStateRef = useRef<InitialWorklistState<TFilters, TVariantKey> | null>(null);

  if (initialStateRef.current === null) {
    const defaultVariantState = createVariantState(initialVariant);
    const defaultState: InitialWorklistState<TFilters, TVariantKey> = {
      activeVariant: initialVariant,
      draftFilters: defaultVariantState.filters,
      appliedFilters: defaultVariantState.filters,
      sort: defaultVariantState.sort,
      pageSize: defaultVariantState.pageSize,
      selectedRowIds: defaultSelectedRowIds,
    };

    if (!persistence || !canUseStorage()) {
      initialStateRef.current = defaultState;
    } else {
      try {
        const rawState = window.localStorage.getItem(persistence.storageKey);

        if (!rawState) {
          initialStateRef.current = defaultState;
        } else {
          const persistedState = JSON.parse(
            rawState,
          ) as Partial<PersistedWorklistState<TFilters, TVariantKey>>;
          const persistedVariant = persistedState.activeVariant;
          const resolvedVariant =
            typeof persistedVariant === "string" &&
            isValidVariantKey(variants as Record<TVariantKey, WorklistPreset<unknown>>, persistedVariant)
              ? persistedVariant
              : initialVariant;
          const variantState = createVariantState(resolvedVariant);
          const resolvedPageSize =
            typeof persistedState.pageSize === "number" && persistedState.pageSize > 0
              ? Math.trunc(persistedState.pageSize)
              : variantState.pageSize;
          const resolvedSelectedRowIds =
            persistence.persistSelectedRowIds &&
            Array.isArray(persistedState.selectedRowIds)
              ? persistedState.selectedRowIds.filter(
                  (value): value is string => typeof value === "string",
                )
              : defaultSelectedRowIds;

          initialStateRef.current =
            persistedState.version === persistenceVersion
              ? {
                  activeVariant: resolvedVariant,
                  draftFilters:
                    persistedState.draftFilters !== undefined
                      ? prepareFilters(persistedState.draftFilters)
                      : variantState.filters,
                  appliedFilters:
                    persistedState.appliedFilters !== undefined
                      ? prepareFilters(persistedState.appliedFilters)
                      : variantState.filters,
                  sort: isValidSort(persistedState.sort, columns)
                    ? persistedState.sort
                    : variantState.sort,
                  pageSize: resolvedPageSize,
                  selectedRowIds: resolvedSelectedRowIds,
                }
              : defaultState;
        }
      } catch {
        initialStateRef.current = defaultState;
      }
    }
  }

  const initialState = initialStateRef.current;
  const [activeVariant, setActiveVariant] = useState(initialState.activeVariant);
  const [draftFilters, setDraftFilters] = useState<TFilters>(initialState.draftFilters);
  const [appliedFilters, setAppliedFilters] = useState<TFilters>(initialState.appliedFilters);
  const [selectedRowIds, setSelectedRowIds] = useState(initialState.selectedRowIds);
  const [sort, setSortState] = useState<TableSort | undefined>(initialState.sort);
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialState.pageSize);
  const visibleColumnIds = getVisibleColumnIds?.(appliedFilters);
  const filteredItems = useMemo(() => {
    const nextItems = items.filter((item) => filterItem(item, appliedFilters));

    return sortRows(nextItems, columns, sort);
  }, [appliedFilters, columns, filterItem, items, sort]);
  const pageCount = createPageCount(filteredItems.length, pageSize);
  const activePage = clampPage(page, pageCount);
  const paginatedItems = useMemo(() => {
    const startIndex = (activePage - 1) * pageSize;

    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [activePage, filteredItems, pageSize]);
  const pageStart = filteredItems.length === 0 ? 0 : (activePage - 1) * pageSize + 1;
  const pageEnd =
    filteredItems.length === 0 ? 0 : Math.min(filteredItems.length, activePage * pageSize);

  useEffect(() => {
    if (page !== activePage) {
      setPageState(activePage);
    }
  }, [activePage, page]);

  function applyVariantState(variantKey: TVariantKey) {
    const nextVariantState = createVariantState(variantKey);

    setActiveVariant(variantKey);
    setDraftFilters(nextVariantState.filters);
    startTransition(() => {
      setAppliedFilters(nextVariantState.filters);
      setSortState(nextVariantState.sort);
      setPageSizeState(nextVariantState.pageSize);
      setPageState(1);
    });
  }

  function updateDraftFilter<Key extends keyof TFilters>(
    key: Key,
    value: TFilters[Key],
  ) {
    setDraftFilters((currentFilters) =>
      prepareFilters({
        ...currentFilters,
        [key]: value,
      }),
    );
  }

  function applyDraftFilters() {
    startTransition(() => {
      setAppliedFilters(prepareFilters(draftFilters));
      setPageState(1);
    });
  }

  function setPage(nextPage: number) {
    setPageState(clampPage(nextPage, pageCount));
  }

  function setPageSize(nextPageSize: number) {
    const safePageSize = Math.max(1, Math.trunc(nextPageSize) || defaultPageSize);
    const nextPageCount = createPageCount(filteredItems.length, safePageSize);

    setPageSizeState(safePageSize);
    setPageState((currentPage) => clampPage(currentPage, nextPageCount));
  }

  function setSort(nextSort: TableSort | undefined) {
    setSortState(nextSort);
    setPageState(1);
  }

  useEffect(() => {
    if (!persistenceStorageKey || !canUseStorage()) {
      return;
    }

    try {
      const persistedState: PersistedWorklistState<TFilters, TVariantKey> = {
        version: persistenceVersion,
        activeVariant,
        draftFilters: prepareFilters(draftFilters),
        appliedFilters: prepareFilters(appliedFilters),
        sort,
        pageSize,
      };

      if (persistSelectedRowIds) {
        persistedState.selectedRowIds = selectedRowIds;
      }

      window.localStorage.setItem(
        persistenceStorageKey,
        JSON.stringify(persistedState),
      );
    } catch {
      // Ignore localStorage write issues so the hook remains usable in constrained environments.
    }
  }, [
    activeVariant,
    appliedFilters,
    draftFilters,
    pageSize,
    persistSelectedRowIds,
    persistenceVersion,
    persistenceStorageKey,
    selectedRowIds,
    sort,
  ]);

  return {
    activeVariant,
    applyDraftFilters,
    applyVariant: applyVariantState,
    appliedFilters,
    draftFilters,
    filteredItems,
    page: activePage,
    pageCount,
    pageEnd,
    pageSize,
    pageStart,
    paginatedItems,
    resetToVariant: (variantKey = activeVariant) => applyVariantState(variantKey),
    selectedRowIds,
    setDraftFilters,
    setPage,
    setPageSize,
    setSelectedRowIds,
    setSort,
    sort,
    totalItems: items.length,
    updateDraftFilter,
    visibleColumnIds,
  };
}
