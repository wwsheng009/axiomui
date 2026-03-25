import type { SavedVariant } from "../hooks/use-saved-variants";
import {
  createVariantSyncSnapshot,
  getLatestSavedVariantTimestamp,
  type VariantSyncSnapshot,
} from "./variant-sync";

type MaybePromise<T> = T | Promise<T>;

export interface VariantPersistenceAdapter<
  TPreset,
  TVariantKey extends string = string,
> {
  clearSnapshot?: () => MaybePromise<void>;
  readSnapshot: () => MaybePromise<VariantSyncSnapshot<TPreset, TVariantKey> | null>;
  writeSnapshot: (
    snapshot: VariantSyncSnapshot<TPreset, TVariantKey>,
  ) => MaybePromise<void>;
}

export interface ParseVariantSyncSnapshotOptions<
  TPreset,
  TVariantKey extends string = string,
> {
  fallbackStartupVariantKey: TVariantKey;
  parseVariant: (value: unknown) => SavedVariant<TPreset> | null;
  validateStartupVariantKey?: (
    candidate: string,
    variants: Array<SavedVariant<TPreset>>,
  ) => boolean;
  version?: number;
}

export interface LocalStorageVariantPersistenceAdapterOptions<
  TPreset,
  TVariantKey extends string = string,
> extends ParseVariantSyncSnapshotOptions<TPreset, TVariantKey> {
  getStorage?: () => Storage | null;
  storageKey: string;
}

export interface MemoryVariantPersistenceAdapterOptions<
  TPreset,
  TVariantKey extends string = string,
> {
  initialSnapshot?: VariantSyncSnapshot<TPreset, TVariantKey> | null;
}

export interface VariantPersistenceLatencyOptions {
  readDelayMs?: number;
  writeDelayMs?: number;
}

function getWindowStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? window.localStorage
    : null;
}

function getWindowSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
    ? window.sessionStorage
    : null;
}

function wait(delayMs = 0) {
  if (delayMs <= 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, delayMs);
  });
}

export function parseVariantSyncSnapshot<
  TPreset,
  TVariantKey extends string = string,
>(
  value: unknown,
  {
    fallbackStartupVariantKey,
    parseVariant,
    validateStartupVariantKey,
    version = 1,
  }: ParseVariantSyncSnapshotOptions<TPreset, TVariantKey>,
): VariantSyncSnapshot<TPreset, TVariantKey> | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    startupVariantKey?: unknown;
    updatedAt?: unknown;
    variants?: unknown;
    version?: unknown;
  };

  if (!Array.isArray(candidate.variants)) {
    return null;
  }

  const variants = candidate.variants.flatMap((variant) => {
    const parsedVariant = parseVariant(variant);

    return parsedVariant ? [parsedVariant] : [];
  });
  const candidateStartupVariantKey =
    typeof candidate.startupVariantKey === "string"
      ? candidate.startupVariantKey
      : fallbackStartupVariantKey;
  const startupVariantKey =
    !validateStartupVariantKey ||
    validateStartupVariantKey(candidateStartupVariantKey, variants)
      ? (candidateStartupVariantKey as TVariantKey)
      : fallbackStartupVariantKey;

  return createVariantSyncSnapshot({
    startupVariantKey,
    updatedAt:
      typeof candidate.updatedAt === "string"
        ? candidate.updatedAt
        : getLatestSavedVariantTimestamp(variants),
    variants,
    version: typeof candidate.version === "number" ? candidate.version : version,
  });
}

export function createLocalStorageVariantPersistenceAdapter<
  TPreset,
  TVariantKey extends string = string,
>({
  fallbackStartupVariantKey,
  getStorage = getWindowStorage,
  parseVariant,
  storageKey,
  validateStartupVariantKey,
  version,
}: LocalStorageVariantPersistenceAdapterOptions<TPreset, TVariantKey>): VariantPersistenceAdapter<
  TPreset,
  TVariantKey
> {
  return {
    clearSnapshot() {
      const storage = getStorage();

      if (!storage) {
        throw new Error("Storage is unavailable for variant persistence.");
      }

      storage.removeItem(storageKey);
    },
    readSnapshot() {
      const storage = getStorage();

      if (!storage) {
        return null;
      }

      try {
        const rawSnapshot = storage.getItem(storageKey);

        if (!rawSnapshot) {
          return null;
        }

        return parseVariantSyncSnapshot(JSON.parse(rawSnapshot), {
          fallbackStartupVariantKey,
          parseVariant,
          validateStartupVariantKey,
          version,
        });
      } catch {
        return null;
      }
    },
    writeSnapshot(snapshot) {
      const storage = getStorage();

      if (!storage) {
        throw new Error("Storage is unavailable for variant persistence.");
      }

      storage.setItem(storageKey, JSON.stringify(snapshot));
    },
  };
}

export function createSessionStorageVariantPersistenceAdapter<
  TPreset,
  TVariantKey extends string = string,
>(
  options: LocalStorageVariantPersistenceAdapterOptions<TPreset, TVariantKey>,
): VariantPersistenceAdapter<TPreset, TVariantKey> {
  return createLocalStorageVariantPersistenceAdapter({
    ...options,
    getStorage: getWindowSessionStorage,
  });
}

export function createMemoryVariantPersistenceAdapter<
  TPreset,
  TVariantKey extends string = string,
>({
  initialSnapshot = null,
}: MemoryVariantPersistenceAdapterOptions<TPreset, TVariantKey> = {}): VariantPersistenceAdapter<
  TPreset,
  TVariantKey
> {
  let snapshot = initialSnapshot;

  return {
    clearSnapshot() {
      snapshot = null;
    },
    readSnapshot() {
      return snapshot;
    },
    writeSnapshot(nextSnapshot) {
      snapshot = nextSnapshot;
    },
  };
}

export function withLatencyVariantPersistenceAdapter<
  TPreset,
  TVariantKey extends string = string,
>(
  adapter: VariantPersistenceAdapter<TPreset, TVariantKey>,
  {
    readDelayMs = 0,
    writeDelayMs = 0,
  }: VariantPersistenceLatencyOptions = {},
): VariantPersistenceAdapter<TPreset, TVariantKey> {
  return {
    async clearSnapshot() {
      await wait(writeDelayMs);
      await adapter.clearSnapshot?.();
    },
    async readSnapshot() {
      await wait(readDelayMs);

      return await adapter.readSnapshot();
    },
    async writeSnapshot(snapshot) {
      await wait(writeDelayMs);
      await adapter.writeSnapshot(snapshot);
    },
  };
}
