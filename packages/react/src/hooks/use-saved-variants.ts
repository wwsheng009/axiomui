import {
  useEffect,
  useRef,
  useState,
} from "react";

export interface SavedVariant<TPreset> {
  key: string;
  label: string;
  description?: string;
  preset: TPreset;
  createdAt: string;
  updatedAt: string;
}

export interface SavedVariantPersistenceOptions {
  storageKey: string;
  version?: number;
}

export interface SaveVariantInput<TPreset> {
  key?: string;
  label: string;
  description?: string;
  preset: TPreset;
}

export interface UseSavedVariantsOptions<TPreset> {
  clonePreset: (preset: TPreset) => TPreset;
  initialVariants?: Array<SavedVariant<TPreset>>;
  persistence?: SavedVariantPersistenceOptions;
}

export interface UseSavedVariantsResult<TPreset> {
  variants: Array<SavedVariant<TPreset>>;
  getVariant: (key: string) => SavedVariant<TPreset> | undefined;
  removeVariant: (key: string) => void;
  replaceVariants: (variants: Array<SavedVariant<TPreset>>) => void;
  saveVariant: (input: SaveVariantInput<TPreset>) => string;
}

interface PersistedSavedVariants<TPreset> {
  version: number;
  variants: Array<SavedVariant<TPreset>>;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeVariantSlug(value: string) {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedValue || "variant";
}

function cloneSavedVariant<TPreset>(
  variant: SavedVariant<TPreset>,
  clonePreset: (preset: TPreset) => TPreset,
): SavedVariant<TPreset> {
  return {
    ...variant,
    preset: clonePreset(variant.preset),
  };
}

function cloneSavedVariants<TPreset>(
  variants: Array<SavedVariant<TPreset>>,
  clonePreset: (preset: TPreset) => TPreset,
) {
  return variants.map((variant) => cloneSavedVariant(variant, clonePreset));
}

function createVariantKey<TPreset>(
  label: string,
  variants: Array<SavedVariant<TPreset>>,
  currentKey?: string,
) {
  const baseKey = `saved-${sanitizeVariantSlug(label)}`;
  let nextKey = baseKey;
  let suffix = 2;

  while (variants.some((variant) => variant.key === nextKey && variant.key !== currentKey)) {
    nextKey = `${baseKey}-${suffix}`;
    suffix += 1;
  }

  return nextKey;
}

function isSavedVariantRecord(value: unknown): value is {
  key: string;
  label: string;
  description?: string;
  preset: unknown;
  createdAt?: string;
  updatedAt?: string;
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    key?: unknown;
    label?: unknown;
    preset?: unknown;
  };

  return (
    typeof candidate.key === "string" &&
    typeof candidate.label === "string" &&
    candidate.preset !== undefined
  );
}

export function useSavedVariants<TPreset>({
  clonePreset,
  initialVariants = [],
  persistence,
}: UseSavedVariantsOptions<TPreset>): UseSavedVariantsResult<TPreset> {
  const storageKey = persistence?.storageKey;
  const version = persistence?.version ?? 1;
  const initialStateRef = useRef<Array<SavedVariant<TPreset>> | null>(null);

  if (initialStateRef.current === null) {
    const defaultState = cloneSavedVariants(initialVariants, clonePreset);

    if (!storageKey || !canUseStorage()) {
      initialStateRef.current = defaultState;
    } else {
      try {
        const rawState = window.localStorage.getItem(storageKey);

        if (!rawState) {
          initialStateRef.current = defaultState;
        } else {
          const parsedState = JSON.parse(rawState) as Partial<PersistedSavedVariants<TPreset>>;

          if (parsedState.version !== version || !Array.isArray(parsedState.variants)) {
            initialStateRef.current = defaultState;
          } else {
            const now = new Date().toISOString();

            initialStateRef.current = parsedState.variants.flatMap((variant) => {
              if (!isSavedVariantRecord(variant)) {
                return [];
              }

              try {
                return [
                  {
                    key: variant.key,
                    label: variant.label,
                    description:
                      typeof variant.description === "string"
                        ? variant.description
                        : undefined,
                    preset: clonePreset(variant.preset as TPreset),
                    createdAt:
                      typeof variant.createdAt === "string" ? variant.createdAt : now,
                    updatedAt:
                      typeof variant.updatedAt === "string" ? variant.updatedAt : now,
                  },
                ];
              } catch {
                return [];
              }
            });
          }
        }
      } catch {
        initialStateRef.current = defaultState;
      }
    }
  }

  const [variants, setVariants] = useState<Array<SavedVariant<TPreset>>>(
    initialStateRef.current ?? [],
  );

  useEffect(() => {
    if (!storageKey || !canUseStorage()) {
      return;
    }

    try {
      const persistedState: PersistedSavedVariants<TPreset> = {
        version,
        variants,
      };

      window.localStorage.setItem(storageKey, JSON.stringify(persistedState));
    } catch {
      // Ignore localStorage write issues so saved variants stay optional.
    }
  }, [storageKey, variants, version]);

  function getVariant(key: string) {
    return variants.find((variant) => variant.key === key);
  }

  function removeVariant(key: string) {
    setVariants((currentVariants) =>
      currentVariants.filter((variant) => variant.key !== key),
    );
  }

  function replaceVariants(nextVariants: Array<SavedVariant<TPreset>>) {
    setVariants(cloneSavedVariants(nextVariants, clonePreset));
  }

  function saveVariant({
    key,
    label,
    description,
    preset,
  }: SaveVariantInput<TPreset>) {
    const trimmedLabel = label.trim() || "Untitled view";
    const trimmedDescription = description?.trim() || undefined;
    let savedKey = key;

    setVariants((currentVariants) => {
      const existingVariant = key
        ? currentVariants.find((variant) => variant.key === key)
        : undefined;
      const timestamp = new Date().toISOString();
      const nextKey = existingVariant
        ? existingVariant.key
        : createVariantKey(trimmedLabel, currentVariants);
      const nextVariant: SavedVariant<TPreset> = {
        key: nextKey,
        label: trimmedLabel,
        description: trimmedDescription,
        preset: clonePreset(preset),
        createdAt: existingVariant?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      savedKey = nextKey;

      return [
        nextVariant,
        ...currentVariants.filter((variant) => variant.key !== nextKey),
      ];
    });

    return savedKey ?? createVariantKey(trimmedLabel, variants, key);
  }

  return {
    getVariant,
    removeVariant,
    replaceVariants,
    saveVariant,
    variants,
  };
}
